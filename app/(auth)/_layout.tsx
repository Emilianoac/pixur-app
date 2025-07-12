import { Redirect, Stack } from "expo-router";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "@/context/GlobalProvider";
import Loader  from "@/components/Loader";
import { SafeAreaView } from "react-native-safe-area-context";

const AuthLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  if (isLogged) return <Redirect href="/(tabs)/create"/>;

  return (
    <SafeAreaView className="bg-black" edges={["bottom", "top"]}>
      <View className="bg-secondary-700 w-full h-full">
        <Stack>
          <Stack.Screen
            name="sign-in"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="sign-up"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
        <Loader isLoading={loading} />
        <StatusBar style="light" />
      </View>
    </SafeAreaView>
  );
};

export default AuthLayout;