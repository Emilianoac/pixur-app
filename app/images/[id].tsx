import { useState, useEffect } from "react";
import { View, Text, SafeAreaView, Image, ScrollView, Alert } from "react-native"
import { Stack, router } from "expo-router";
import { useLocalSearchParams } from "expo-router";

import { ref, child, get } from "firebase/database";
import { realTimeDB } from "@/firebaseConfig";

import secondary from "@/constants/colors/secondary";
import formatDate from "@/utils/formatDate";

import type {ImageData} from "@/types/index";
import { useAuthStore } from "@/store/useAuthStore";

export default function ImageProfileScreen() {
  const user = useAuthStore((state) => state.user);

  // Get the image id from the URL
  const { id } = useLocalSearchParams();
  const [image, setImage] = useState<ImageData | null>(null);

  useEffect(() => {
    // Si no hay usuario, redirigir a la pantalla de inicio
    if (user === null) {
      Alert.alert("Error", "You must be signed in to view this page.");
      router.replace("/sign-in");
      return;
    }

    // Get the image from the database
    const dbRef = ref(realTimeDB);
    get(child(dbRef, `users/${user?.uid}/images/${id}`)).then((snapshot) => {
      // If the image exists, set the image state
      if (snapshot.exists()) {
        setImage(snapshot.val());
      } else {
        console.log("No data available");
        router.replace("/gallery")
      }
    }).catch((error) => {
      console.error(error);
    });

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