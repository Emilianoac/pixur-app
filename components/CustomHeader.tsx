// components/CustomHeader.js
import { View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {images} from "@/constants/index"

const CustomHeader = () => {
  return (
    <SafeAreaView className="bg-secondary-600">
      <View className="w-full p-1 items-center justify-center">
        <Image
          source={images.logo}
          className="w-[80px] rounded-md"
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;
