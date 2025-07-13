import { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { Image } from "expo-image";
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
    <View className="bg-secondary-700">
      <Stack.Screen options={{
        headerShown: false,
        animation: "none"
      }}/>
      <ScrollView>
        <View className="justify-center items-center px-4">
          {image &&
            <View>
              <Text className="text-white text-2xl font-pbold mb-2 mt-4">Image Details</Text>
              <Text className="text-slate-400 mb-4 mt-4">{ formatDate(image.timestamp) }</Text>
              <Image 
                source={{ uri: image.url }} 
                style={{ width: '100%', aspectRatio: 1, borderRadius: 8 }} 
                contentFit="cover"
              />
              <View className="my-5">
                <Text className="text-white font-pbold mb-1">Prompt</Text>
                <Text  
                  className="text-gray-500"  
                  selectable={true}>
                  {image.prompt}
                </Text>
              </View>

              {image.negative_prompt && 
                <View className="mb-5">
                  <Text className="text-white font-pbold mb-1">Negative Prompt </Text>
                  <Text  
                    className="text-gray-500" 
                    selectable={true}>
                    {image.negative_prompt}
                  </Text>
                </View>
              }

              <View className="mb-5">
                <Text className="text-white font-pbold mb-1">Seed </Text>
                <Text className="text-gray-500">
                  {image.seed}
                </Text>
              </View>

              <View className="mb-5">
                <Text className="text-white font-pbold mb-1">Steps </Text>
                <Text className="text-gray-500">
                  {image.steps}
                </Text>
              </View>

              <View className="mb-5">
                <Text className="text-white font-pbold mb-1">Dimensions</Text>
                <Text className="text-gray-500">
                  {image.dimensions}
                </Text>
              </View>

              <View className="mb-5">
                <Text className="text-white font-pbold mb-1">CFG Scale </Text>
                <Text className="text-gray-500">
                  {image.cfg_scale}
                </Text>
              </View>

              <View className="mb-5">
                <Text className="text-white font-pbold mb-1">Model </Text>
                <Text className="text-gray-500">
                  {image.model}
                </Text>
              </View>
            </View>
          }
        </View>
      </ScrollView>
    </View>
  )
}