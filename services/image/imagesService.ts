import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { set, ref as RealTimeRef, runTransaction } from "firebase/database";
import { storage, realTimeDB } from "@/firebaseConfig";
import type { NewImageData } from "@/types";

interface GenerateImageParams {
  prompt: string | null,
  steps: number,
}

export async function saveImage(userId: string, image: NewImageData) {
  // Compress and resize the image
  const { uri } = await ImageManipulator.manipulateAsync(
    `data:image/png;base64,${image.base64}`,
    [{ resize: { width: 512, height: 512 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.WEBP }
  );

  // Convert the image to a blob
  const response = await fetch(uri);
  const blob = await response.blob();

  // Upload the image to Firebase Storage
  const imageId = `ìmage-${image.params.timestamp}`;
  const imageName = `${imageId}.webp`;
  const storageRef = ref(storage, `users/${userId}/${imageName}`);
  await uploadBytes(storageRef, blob);
  const fireStoreImageUrl = await getDownloadURL(storageRef);

  // Delete the image from the device storage of the app
  await FileSystem.deleteAsync(uri, { idempotent: true });

  // Save the image data to Firebase Realtime Database
  const userRef = RealTimeRef(realTimeDB, `users/${userId}/images/${imageId}`);
  await set(userRef, { 
    url: fireStoreImageUrl, 
    name: imageName, 
    seed: image.seed, 
    id: imageId,
    ...image.params 
  });

  // Update the user's image count
  const countRef = RealTimeRef(realTimeDB, `users/${userId}/count`);
  await runTransaction(countRef, (count) => {
    count++;
    return count;
  });
};

export async function generateImage(params: GenerateImageParams) {

  if (!params.prompt )  throw new Error("Prompt is required to generate an image");

  const apiEngine = "stable-diffusion-xl-1024-v1-0";
  const apiHost = "https://api.stability.ai";
  const apiKey = process.env.EXPO_PUBLIC_STABILITY_API_KEY;

  const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
  };

  const body = {
    steps: params.steps,
    width: 1024,
    height: 1024,
    seed: 0,
    samples: 1,
    cfg_scale: 7,
    text_prompts: [
      { text: params.prompt, weight: 0.5 },
      { text: "ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, open mouth", weight: -1}
    ],
    style_presets: "default"
  } 

  try {
    const res = await fetch(`${apiHost}/v1/generation/${apiEngine}/text-to-image`, {
      headers: headers,
      method: "POST",
      body: JSON.stringify(body)
    })
  
    const data = await res.json();
  
    if (!res.ok) {
      const msg = data?.name === "content_moderation" ?
        "The prompt contains inappropriate content, please try again." :
        "An error occurred, please try again.";
      throw new Error(msg);
    }
  
    return { 
      base64: data.artifacts[0].base64 as string, 
      seed: data.artifacts[0].seed as number,
      params: {
        prompt: params.prompt,
        negative_prompt: body.text_prompts[1].text,
        cfg_scale: body.cfg_scale,
        model: apiEngine,
        dimensions: `${body.width}x${body.height}`,
        steps: body.steps,
        samples: body.samples,
        timestamp: Date.now()
      }
    }
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};
