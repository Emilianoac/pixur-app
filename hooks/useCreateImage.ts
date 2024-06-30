
import { Alert } from "react-native"

interface Params {
  prompt: string | null,
  steps: number,
}

async function useCreateImage(params: Params) {

  if (!params.prompt ) {
    Alert.alert("Error", "You must add a prompt to generate an image")
    return null;
  }

  const apiEngine = "stable-diffusion-xl-1024-v1-0"
  const apiHost = "https://api.stability.ai"
  const apiKey = process.env.EXPO_PUBLIC_STABILITY_API_KEY

  const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
  }

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

  const res = await fetch(`${apiHost}/v1/generation/${apiEngine}/text-to-image`, {
    headers: headers,
    method: "POST",
    body: JSON.stringify(body)
  })

  const data = await res.json()

  if (!res.ok) {
    if (data.name === "content_moderation") {
      Alert.alert("Error", "The prompt contains inappropriate content, please try again.")
    } else {
      Alert.alert("Error", "An error occurred, please try again.")
    }
    return null;
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
}

export default useCreateImage