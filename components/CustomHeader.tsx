import { View} from "react-native";
import AppBrand from "@/components/AppBrand";

const CustomHeader = () => {
  return (
    <View className="w-full bg-secondary-600 items-center justify-center" style={{height: 50}}>
      <AppBrand  width="80" />
    </View>
  );
};

export default CustomHeader;
