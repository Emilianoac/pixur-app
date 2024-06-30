import { View, SafeAreaView, ScrollView, Image, Pressable, Text} from "react-native"
import { Link } from "expo-router";
import type { ImageData } from "@/types";

import { useGlobalContext } from "@/context/GlobalProvider";

export default  function ProfileScreen() {
  const { userData } = useGlobalContext();

  // Sort images by timestamp
  const sortedImages = userData && userData.images 
    ? Object.values(userData.images).sort((a, b) =>  b.timestamp - a.timestamp)
    : [];

  return (
    <SafeAreaView className="bg-secondary-700 h-full">
        <View>
          <ScrollView>
            { userData  && !userData.images  &&
              <View className="items-center mt-10">
                <Text className="font-pbold text-white/40 text-sm">
                  You have not images yet
                </Text>
              </View>
            }
            <View className="items-center py-4">
              <View className="flex justify-start flex-row gap-1 flex-wrap w-full">
                { userData && userData.images && Object.values(sortedImages).map((image: ImageData, index: number) => (
                  <Link 
                    className="w-[32%] aspect-square" 
                    href={{
                      pathname: "/images/[id]",
                      params: {id : image.name}
                    }}
                    key={index} 
                    asChild>
                    <Pressable>
                      <View className="w-full h-full">
                        <Image 
                          source={{ uri: image.url }} 
                          className="w-full aspect-square"
                        />
                      </View>
                    </Pressable>
                  </Link>
                ))}
              </View>     
            </View>
          </ScrollView>
        </View>
    </SafeAreaView>
  )
}