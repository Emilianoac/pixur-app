import { View, Image, Text } from "react-native";
import {images} from "@/constants/index"

const CustomHeader = () => {
  return (
    <View className="w-full selection:bg-secondary-600 items-center justify-center" style={{height: 50}}>
      <Image
        source={images.logo}
        className="w-20 h-10"
        resizeMode="contain"
      />
    </View>
  );
};

export default CustomHeader;
