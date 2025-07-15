import { View, Text, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform} from "react-native"
import {useState} from "react"
import FormField from "@/components/FormField"
import CustomButton from "@/components/CustomButton"
import { Link } from "expo-router"

import { signUp } from "@/services/auth/authService"
import { showBaseToast } from "@/services/toast/toastService";
import { useLoaderStore } from "@/store/useLoaderStore";

import AppBrand from "@/components/AppBrand"

export default function SignUP() {
  const [form, setForm] = useState({ email: "", password: ""});
  const showLoader = useLoaderStore((state) => state.showLoader);
  const hideLoader = useLoaderStore((state) => state.hideLoader);

  async function handleSignUp() {
    if (form.email === "" || form.password === "") {
      showBaseToast({
        type: "error",
        text1: "Authentication Error",
        text2: "You must complete all fields",
      });
      return;
    }

    showLoader();

    try {
      await signUp(form.email, form.password);
    } catch (error) {
      showBaseToast({
        type: "error",
        text1: "Authentication Error",
        text2: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      hideLoader();
    }
  };

  return (
    <SafeAreaView className="bg-secondary-700 h-full">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView>
          <View className="w-full justify-center items-center px-4 py-10">
            <View className="w-full mt-4 items-center">
              <AppBrand width="120"/>
              <Text className="text-white font-plight mt-1">AI Image generator</Text>
            </View>

            <View className="mt-10 w-full">
              <Text className="text-white text-lg text-center font-psemibold">
                Register
              </Text>
              <FormField
                title="Email"
                placeholder="Your email"
                value={form.email}
                handleChangeText={(text: string) => setForm({...form, email: text})}
                keyboardType="email-address"
              />
              <FormField
                title="Password"
                placeholder="Your password"
                value={form.password}
                handleChangeText={(text: string) => setForm({...form, password: text})}
                keyboardType="default"
              />
              <CustomButton
                title="Sign up"
                handlePress={handleSignUp}
                containerStyle="mt-5"
              />
            </View>

            <Text className="text-white font-pregular mt-5">
              Already have an account? <Link href={"/sign-in"} className="text-primary-default font-pbold"> Login </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}