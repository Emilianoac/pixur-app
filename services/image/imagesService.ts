import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { set, ref as RealTimeRef, runTransaction } from "firebase/database";
import { storage, realTimeDB } from "@/firebaseConfig";

interface ImageData {
  base64: string;
  seed: number;
  params: {
    prompt: string;
    negative_prompt: string;
    cfg_scale: number;
    model: string;
    dimensions: string;
    steps: number;
    samples: number;
    timestamp: number;
  };
}


export async function saveImage(userId: string, image: ImageData) {
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
  const imageName = `image-${image.params.timestamp}`;
  const storageRef = ref(storage, `users/${userId}/${imageName}`);
  await uploadBytes(storageRef, blob);
  const fireStoreImageUrl = await getDownloadURL(storageRef);

  // Delete the image from the device storage of the app
  await FileSystem.deleteAsync(uri, { idempotent: true });

  // Save the image data to Firebase Realtime Database
  const userRef = RealTimeRef(realTimeDB, `users/${userId}/images/${imageName}`);
  await set(userRef, { url: fireStoreImageUrl, name: imageName, seed: image.seed, ...image.params });

  // Update the user's image count
  const countRef = RealTimeRef(realTimeDB, `users/${userId}/count`);
  await runTransaction(countRef, (count) => {
    count++;
    return count;
  });
}