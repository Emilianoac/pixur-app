import { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, BackHandler} from "react-native";
import { Image } from "expo-image";
import { Stack, router } from "expo-router";
import { useLocalSearchParams,useFocusEffect } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import formatDate from "@/utils/formatDate";
import { getImageById, downloadImage } from "@/services/image/imagesService";
import { showBaseToast } from "@/services/toast/toastService";
import { useAuthStore } from "@/store/useAuthStore";
import { useLoaderStore } from "@/store/useLoaderStore";
import type {ImageData} from "@/types/index";

export default function ImageProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const showLoader = useLoaderStore((state) => state.showLoader);
  const hideLoader = useLoaderStore((state) => state.hideLoader);
  const isLoading = useLoaderStore((state) => state.isLoading);

  // Get the image id from the URL
  const { id } = useLocalSearchParams();
  
  const [image, setImage] = useState<ImageData | null>(null);

  async function handleDownloadImage() {
    if (!image || !image.url) {
      showBaseToast({
        type: "error",
        text1: "Error downloading image",
        text2: "Image URL is not available.",
      });
      return;
    }
    showLoader("Downloading image...");
    try {
      await downloadImage(image.url);
      showBaseToast({
        type: "success",
        text1: "Image downloaded successfully",
        text2: "You can find it in your device's gallery.",
      });
    } catch (error) {
      showBaseToast({
        type: "error",
        text1: "Error downloading image",
        text2: error instanceof Error ? error.message : "An unexpected error occurred.",
      });
    } finally {
      hideLoader();
    }
  }

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isLoading) {
         return true; 
        }
        return false; 
      }
      
      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [isLoading])
  )

  useEffect(() => {
    async function handleGetImage() {
      if (!user || !id) {
        showBaseToast({
          type: "error",  
          text1: "Error fetching image",
          text2: "User or image ID is not valid.",
        });
        router.replace("/gallery");
        return;
      }

      try {
        const imageData = await getImageById(user.id, id as string);
        setImage(imageData);
      } catch (error) {
        showBaseToast({
          type: "error",
          text1: "Error fetching image",
          text2: error instanceof Error ? error.message : "An unexpected error occurred, please try again.",
        });
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
              <Text className="text-white text-2xl font-pbold mb-4 mt-4">Image Details</Text>
              <TouchableOpacity 
                onPress={handleDownloadImage}
                className="flex-row items-center gap-2 bg-primary-500 w-[150px] justify-center rounded-lg p-2">
                  <Text className="text-white text-sm">
                    Download Image
                  </Text>
                  <FontAwesome5 name="download" size={15} color="white" />
              </TouchableOpacity>
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