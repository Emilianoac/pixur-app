import type { ImageSourcePropType } from "react-native"

export interface TabIconProps {
  icon: ImageSourcePropType;
  color: string;
  name: string;
  focused: boolean;
}

export interface ImageData {
  url: string;
  name: string;
  prompt: string;
  steps: number;
  negative_prompt: string;
  seed: number;
  dimensions: string;
  cfg_scale: number;
  model: string;
  timestamp: number;
}

export interface userData {
  uid: string;
  email: string;
  images: ImageData[];
}

export interface NewImageData {
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
