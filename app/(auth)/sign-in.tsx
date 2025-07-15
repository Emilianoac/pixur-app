import { View, Text, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import {useState } from "react"
import { router } from "expo-router"
import { Link } from "expo-router"

import { signIn } from "@/services/auth/authService";
import { showBaseToast } from "@/services/toast/toastService";
import { useLoaderStore } from "@/store/useLoaderStore";

import FormField from "@/components/FormField"
import CustomButton from "@/components/CustomButton"
import AppBrand from "@/components/AppBrand"

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const showLoader = useLoaderStore((state) => state.showLoader);
  const hideLoader = useLoaderStore((state) => state.hideLoader);

  async function handleSignIn() {
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
      await signIn(form.email, form.password);
      router.replace("/create");

    } catch (error: any) {
      showBaseToast({
        type: "error",
        text1: "Authentication Error",
        text2: error.message || "An unexpected error occurred",
      });
    } finally {
      hideLoader();
    }
  }

  return (
    <SafeAreaView className="bg-secondary-700 h-full">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView>
          <View className="w-full flex-1 justify-center items-center px-4 py-10">
            <View className="w-full mt-4 items-center">
              <AppBrand width="120"/>
              <Text className="text-white font-plight mt-1">AI Image generator</Text>
            </View>
              
            <View className="mt-10 w-full">
              <Text className="text-white text-lg text-center font-psemibold">Login</Text>
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
                handleChangeText={ (text: string) => setForm({...form, password: text}) }
                keyboardType="default"
              />
              <CustomButton
                title="Login"
                handlePress={handleSignIn}
                containerStyle="mt-5"
              />
            </View>

            <Text className="text-white mt-5 font-pregular">
              Don't have an account? <Link href={"/sign-up"} className="text-primary-default font-pbold">Register</Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}