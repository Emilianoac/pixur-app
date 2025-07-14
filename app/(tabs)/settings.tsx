import { View, SafeAreaView, ScrollView, Image } from "react-native";
import {useState } from "react";
import {signOut} from "firebase/auth";
import {auth} from "@/firebaseConfig";
import {images} from "@/constants/index";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import Loader from "@/components/Loader";
import { useAuthStore } from "@/store/useAuthStore";

export default function SettingsScreen() {
  const userData = useAuthStore((state) => state.userData);
  const [loading, setLoading] = useState(false);

  // Sign out user
  async function handleSignOut() {
    setLoading(true);
    await signOut(auth);
    setLoading(false);
  }

  return (
    <>
      <ScrollView className="bg-secondary-700"  keyboardShouldPersistTaps="handled">
        <View className="w-full flex-1 justify-center items-center px-4 py-10">
          <View className="flex justify-center w-[150px] h-[150px] items-center border-2 border-slate-700 rounded-full mx-auto">
            <Image
              source={images.profileImage}
              className="w-[140px] h-[140px] rounded-full opacity-60"
              resizeMode="cover"
            />
          </View>

          <View className="mt-4 w-full">
            <FormField 
              title="Email"
              readOnly={true}
              placeholder="Email"
              value={userData?.email || ""}
              handleChangeText={(text) => {}}
            />
            <CustomButton
              title="Sign Out"
              containerStyle="mt-4 bg-slate-300"
              handlePress={handleSignOut}
            />
          </View>
        </View>
      </ScrollView>
      <Loader isLoading={loading} message="Sign out.." />
    </>
  )
}