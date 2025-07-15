import { View, SafeAreaView, ScrollView, Image, Text, Button } from "react-native";
import { useState} from "react";
import Slider from "@react-native-community/slider";

import { icons } from "@/constants/index";
import primaryColors from "@/constants/colors/primary";
import { useAuthStore } from "@/store/useAuthStore";
import { useLoaderStore } from "@/store/useLoaderStore";
import { saveImage, generateImage } from "@/services/image/imagesService";
import { showBaseToast } from "@/services/toast/toastService";

import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import type { NewImageData } from "@/types";

interface FormData {
  prompt: string | null
  steps: number
}

export default function CreateScreen() {
  const user = useAuthStore((state) => state.user);
  const showLoader = useLoaderStore((state) => state.showLoader);
  const hideLoader = useLoaderStore((state) => state.hideLoader);
  const [savedImage, setSavedImage] = useState(false);
  const [image, setImage] = useState<NewImageData | null>(null);
  const [formData, setFormData] = useState<FormData>({ prompt: null, steps: 15 });

  async function handleCreate() {
    if (!formData.prompt ) {
      showBaseToast({
        type: "error",
        text1: "Error generating image",
        text2: "You must enter a prompt to generate an image.",
      });
      return;
    }

    setImage(null);
    showLoader("Generating image...");

    try {
      const image = await generateImage(formData);
      setImage(image);
      setSavedImage(false);
      showBaseToast({
        type: "success",
        text1: "Image generated successfully",
        text2: "You can now save or generate a new image.",
      });
    } catch (error) {
      showBaseToast({
        type: "error",
        text1: "Error generating image",
        text2: error instanceof Error ? error.message : "An unexpected error occurred, please try again.",
      });
    } finally {
      hideLoader();
    }
  }

  async function handleSave(image: NewImageData) {
    if (!user?.id) {
      showBaseToast({
        type: "error",
        text1: "Error saving image",
        text2: "You must be logged in to save images.",
      });
      return;
    }

    showLoader("Saving image...");

    try {
      await saveImage(user.id, image);
      setSavedImage(true);

      showBaseToast({
        type: "success",
        text1: "Image saved successfully",
        text2: "You can view it in your gallery.",
      });

    } catch (error) {
      showBaseToast({
        type: "error",
        text1: "Error saving image",
        text2: error instanceof Error ? error.message : "An unexpected error occurred, please try again.",
      });
    } finally {
      hideLoader();
    }
  }

  return (
    <SafeAreaView className="bg-secondary-700 h-full">
      <ScrollView>
        <View className="p-4 items-center">
          <Image
            source={ image ? { uri: `data:image/png;base64,${image.base64}`} : icons.thumbPreview}
            className={`rounded-md mt-4 ${image ? 'w-full aspect-square' : 'w-[200px] h-[200px] opacity-10'}`}
            resizeMode={image ? "cover" : "contain"}
          />
          <View className="w-full">
            <FormField
              title="Prompt"
              value={formData.prompt}
              placeholder="Enter a prompt to generate an image"
              keyboardType="default"
              handleChangeText={(text: string) => setFormData({ prompt: text, steps: formData.steps }) }>
            </FormField>
            <View className="w-full">
              <View className="flex-row w-full">
                <Text className="text-white font-psemibold text-sm">Steps:</Text>
                <Text className="font-psemibold text-sm ml-1 text-primary-default">{ formData.steps }</Text>
              </View>

              <Slider
                style={{width: "100%", marginVertical: 20}}
                minimumValue={10}
                maximumValue={20}
                step={1}
                value={formData.steps}
                onValueChange={(value: number) => setFormData({ prompt: formData.prompt, steps: value })}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                thumbTintColor={primaryColors["default"]}
              />
            </View>
            <CustomButton
              containerStyle="mt-4"
              title={image ? "Generate new image" : "Generate image"}
              disabled={!formData.prompt}
              handlePress={handleCreate}
            />
          </View>

          {image && 
            <CustomButton
              title={savedImage ? "Image saved" : "Save Image"}
              containerStyle="mt-4 bg-white"
              disabled={savedImage}
              handlePress={() => handleSave(image)}
            />
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}