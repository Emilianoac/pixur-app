import { View, ActivityIndicator, Dimensions, Platform, Text } from "react-native";

const Loader = ({ isLoading, message } : {isLoading: boolean, message?: string}) => {
  const osName = Platform.OS;
  const screenHeight = Dimensions.get("screen").height;

  if (!isLoading) return null;

  return (
    <View
      className="absolute flex justify-center items-center w-full h-full bg-secondary-900/90 z-10"
      style={{
        height: screenHeight,
      }}
    >
      <ActivityIndicator
        animating={isLoading}
        color="#fff"
        size={osName === "ios" ? "large" : 50}
      />
      {message && <Text className="text-white font-psemibold mt-4">{ message }</Text>}
    </View>
  );
};

export default Loader;