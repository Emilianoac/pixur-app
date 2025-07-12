import { View, Text, Image} from "react-native"
import { Tabs, Redirect} from "expo-router"
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants/"
import primary from "@/constants/colors/primary";
import secondary from "@/constants/colors/secondary";
import type { TabIconProps } from "@/types";
import Loader from "@/components/Loader"
import CustomHeader from "@/components/CustomHeader";
import { useAuthStore } from "@/store/useAuthStore";

const TabIcon = ({
  icon, 
  color, 
  name, 
  focused
}: TabIconProps) => {
  return (
    <View className="flex min-w-20 items-center justify-center min-h-full gap-1">
      <Image 
        source={icon} 
        resizeMode="contain"
        tintColor={color}
        className="w-5 h-5"
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: primary[100]}}>
        {name}
      </Text>
    </View>
  )
}

export default function TabsLayout() {
  const loading = useAuthStore((state) => state.loading);
  const isLogged = useAuthStore((state) => state.isLogged);

  if (!loading && !isLogged) return <Redirect href="/(auth)/sign-in"/>;

  return (
    <SafeAreaView className="flex-1 bg-black " edges={["bottom","top"]}>
      <CustomHeader />
      <Tabs
        screenOptions={{
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,  
          tabBarActiveTintColor: primary.default,
          tabBarInactiveTintColor: secondary[300],
          tabBarStyle: {
            height: 60,
            paddingTop: 10,
            backgroundColor: secondary[600],
            borderTopWidth: 1,
            borderColor: secondary[500],
            position: "absolute",
            bottom: 0,
            left: 0,
          }
        }}>
        <Tabs.Screen 
          name="create"
          options={
            {
              title: "Create",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon 
                  icon={icons.plus} 
                  color={color} 
                  name="Create" 
                  focused={focused}
                />
              )
            }
          }
        />
        <Tabs.Screen 
          name="gallery"
          options={
            {
              title: "Gallery",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon 
                  icon={icons.gallery} 
                  color={color} 
                  name="Gallery" 
                  focused={focused}
                />
              )
            }
          }
        />
        <Tabs.Screen 
          name="settings"
          options={
            {
              title: "Settings",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon 
                  icon={icons.settings} 
                  color={color} 
                  name="Settings" 
                  focused={focused}
                />
              ),
            }
          }
        />
      </Tabs>
      <Loader isLoading={loading} />
      <StatusBar style="light" />
    </ SafeAreaView>
  )
}