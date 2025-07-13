import { useState, useEffect } from "react";
import { View, Text, SafeAreaView, Image, ScrollView, Alert } from "react-native";
import { Stack, router } from "expo-router";
import { useLocalSearchParams } from "expo-router";

import secondary from "@/constants/colors/secondary";
import formatDate from "@/utils/formatDate";

import { getImageById } from "@/services/image/imagesService";
import { useAuthStore } from "@/store/useAuthStore";
import type {ImageData} from "@/types/index";

export default function ImageProfileScreen() {
  const user = useAuthStore((state) => state.user);

  // Get the image id from the URL
  const { id } = useLocalSearchParams();
  const [image, setImage] = useState<ImageData | null>(null);

  useEffect(() => {
    async function handleGetImage() {
      if (!user || !id) {
        Alert.alert("Error", "Invalid user or image ID.");
        router.replace("/gallery");
        return;
      }

      try {
        const imageData = await getImageById(user.id, id as string);
        setImage(imageData);
      } catch (error) {
        Alert.alert("Error", error instanceof Error ? error.message : "An unexpected error occurred.");
      }
    }

    handleGetImage();
  }, []);

  return (
    <>
      <Stack.Screen options={{
        headerTitle: "",
        headerTitleAlign: "left",
        headerStyle: { backgroundColor: secondary[600]},
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "medium" },
        animation: "slide_from_right"
      }}/>
      <SafeAreaView className="bg-secondary-700 h-full py-4">
        <ScrollView>
          <View className="justify-center items-center px-4">
            {image &&
              <View>
                <Text className="text-slate-400 mb-4">{ formatDate(image.timestamp) }</Text>
                <Image 
                  source={{ uri: image.url }} 
                  className="w-full aspect-square rounded-lg" 
                  resizeMode="cover"
                />
                <View className="my-5">
                  <Text className="text-white font-pbold mb-1">Prompt</Text>
                  <Text  
                    className="text-white border bg-secondary-500 border-secondary-800 p-3 rounded-md"  
                    selectable={true}>
                    {image.prompt}
                  </Text>
                </View>

                <View className="mb-5">
                  <Text className="text-white font-pbold mb-1">Negative Prompt </Text>
                  <Text  
                    className="text-white border bg-secondary-500 border-secondary-800 p-3 rounded-md" 
                    selectable={true}>
                    {image.negative_prompt}
                  </Text>
                </View>

                <View className="mb-5">
                  <Text className="text-white font-pbold mb-1">Seed </Text>
                  <Text className="text-white border bg-secondary-500 border-secondary-800 p-3 rounded-md">
                    {image.seed}
                  </Text>
                </View>

                <View className="mb-5">
                  <Text className="text-white font-pbold mb-1">Steps </Text>
                  <Text className="text-white border bg-secondary-500 border-secondary-800 p-3 rounded-md">
                    {image.steps}
                  </Text>
                </View>

                <View className="mb-5">
                  <Text className="text-white font-pbold mb-1">Dimensions</Text>
                  <Text className="text-white border bg-secondary-500 border-secondary-800 p-3 rounded-md">
                    {image.dimensions}
                  </Text>
                </View>

                <View className="mb-5">
                  <Text className="text-white font-pbold mb-1">CFG Scale </Text>
                  <Text className="text-white border bg-secondary-500 border-secondary-800 p-3 rounded-md">
                    {image.cfg_scale}
                  </Text>
                </View>

                <View className="mb-5">
                  <Text className="text-white font-pbold mb-1">Model </Text>
                  <Text className="text-white border bg-secondary-500 border-secondary-800 p-3 rounded-md">
                    {image.model}
                  </Text>
                </View>
              </View>
            }
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}