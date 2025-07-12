import { Redirect, Stack } from "expo-router";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Loader  from "@/components/Loader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/useAuthStore";

const AuthLayout = () => {
  const loading = useAuthStore((state) => state.loading);
  const isLogged = useAuthStore((state) => state.isLogged);

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