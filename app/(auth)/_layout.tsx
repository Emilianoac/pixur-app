import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "@/context/GlobalProvider";
import Loader  from "@/components/Loader";
import secondary from "@/constants/colors/secondary";
import { View } from "react-native";

const AuthLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  if (isLogged) return <Redirect href="/create" />;

  return (
    <>
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
      <StatusBar backgroundColor={secondary[700]} style="light" />
    </View>
    </>
  );
};

export default AuthLayout;