import { View, SafeAreaView, ScrollView, Image, Alert, Text } from "react-native";
import { useState} from "react";
import Slider from "@react-native-community/slider";

import { useAuthStore } from "@/store/useAuthStore";
import { saveImage, generateImage } from "@/services/image/imagesService";
import { icons } from "@/constants/index";
import primaryColors from "@/constants/colors/primary";

import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import Loader from "@/components/Loader";
import type { NewImageData } from "@/types";

interface FormData {
  prompt: string | null
  steps: number
}

export default function CreateScreen() {
  const user = useAuthStore((state) => state.user);
  const [savedImage, setSavedImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<NewImageData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    prompt: null,
    steps: 15
  });

  async function handleCreate() {
    if (!formData.prompt ) return Alert.alert("Error", "You must add a prompt to generate an image");

    setImage(null);
    setLoading(true);

    try {
      const image = await generateImage(formData);
      setImage(image);
      setSavedImage(false);
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "An unexpected error occurred, please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(image: NewImageData) {
    if (!user?.id) return Alert.alert("Error", "You must be logged in to save an image");

    setLoading(true);

    try {
      await saveImage(user.id, image);
      setSavedImage(true);

      Alert.alert("Success", "Image saved successfully");

    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "An unexpected error occurred, please try again.");
    } finally {
      setLoading(false);
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
              disabled={loading || !formData.prompt}
              handlePress={handleCreate}
            />
          </View>

          {image && 
            <CustomButton
              title={savedImage ? "Image saved" : "Save Image"}
              containerStyle="mt-4 bg-white"
              disabled={loading || savedImage}
              handlePress={() => handleSave(image)}
            />
          }
        </View>
      </ScrollView>
      <Loader 
        isLoading={loading} 
        message={loading && !image ? "Generating image..." : "Saving image..."} 
      />
    </SafeAreaView>
  )
}