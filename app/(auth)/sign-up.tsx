import { View, Text, SafeAreaView, ScrollView, Image, Alert} from "react-native"
import {useState} from "react"
import FormField from "@/components/FormField"
import CustomButton from "@/components/CustomButton"
import {images } from "@/constants"
import { Link } from "expo-router"
import { signUp } from "@/utils/firebaseAuth"
import AppBrand from "@/components/AppBrand"

export default function SignUP() {
  const [form, setForm] = useState({ email: "", password: ""});

  async function handleSignUp() {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "You must complete all fields");
      return;
    }

    try {
      await signUp(form.email, form.password);
    } catch (error) {
      Alert.alert("Error", "An error occurred while signing up, try again"); 
      console.error(error);
    }
  };

  return (
    <SafeAreaView className="bg-secondary-700 h-full">
      <ScrollView>
        <View className="w-full h-[85vh] justify-center items-center px-4">
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
    </SafeAreaView>
  )
}