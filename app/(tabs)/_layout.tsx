import { View, Text, Image} from "react-native"
import { Tabs, Redirect} from "expo-router"
import { StatusBar } from "expo-status-bar";

import { icons } from "@/constants/"
import primary from "@/constants/colors/primary";
import secondary from "@/constants/colors/secondary";
import { useGlobalContext } from "@/context/GlobalProvider";
import type { TabIconProps } from "@/types";

import Loader from "@/components/Loader"

const TabIcon = ({
  icon, 
  color, 
  name, 
  focused
}: TabIconProps) => {
  return (
    <View 
    className="items-center gap-1">
      <Image 
        source={icon} 
        resizeMode="contain"
        tintColor={color}
        className="w-4 h-4"
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
  const { loading, isLogged } = useGlobalContext();

  if (!loading && !isLogged) return <Redirect href="/sign-in" />;

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,  
          tabBarActiveTintColor: primary.default,
          tabBarInactiveTintColor: secondary[300],
          tabBarStyle: {
            backgroundColor: secondary[600],
            paddingBottom: 10,
            height: 55,
            paddingTop: 10,
            display: "flex",
            borderTopColor: secondary[400],
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
      <StatusBar backgroundColor={secondary[700]} style="light"/>
    </>
  )
}