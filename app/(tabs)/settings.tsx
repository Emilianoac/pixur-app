import { View, ScrollView, Image } from "react-native";

import {images} from "@/constants/index";
import {signOutUser} from "@/services/auth/authService";
import { showBaseToast } from "@/services/toast/toastService";
import { useAuthStore } from "@/store/useAuthStore";
import { useLoaderStore } from "@/store/useLoaderStore";

import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";

export default function SettingsScreen() {
  const userData = useAuthStore((state) => state.userData);
  const showLoader = useLoaderStore((state) => state.showLoader);
  const hideLoader = useLoaderStore((state) => state.hideLoader);

  // Sign out user
  async function handleSignOut() {
    showLoader("Signing out...");

    try {
      await signOutUser();
    } catch (error) {
      showBaseToast({
        type: "error",
        text1: "Error signing out",
        text2: error instanceof Error ? error.message : "An unexpected error occurred, please try again.",
      });
    } finally {
      hideLoader();
    }
  }

  return (
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
  )
}