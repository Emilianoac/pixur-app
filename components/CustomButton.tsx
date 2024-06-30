import { View, Text, TouchableOpacity } from "react-native"
import React from "react"

interface CustomButtonProps {
  title: string;
  handlePress: () => void;
  containerStyle?: string;
  disabled?: boolean;
}

export default function CustomButton(
  { 
    title, 
    handlePress, 
    containerStyle,
    disabled
  }: CustomButtonProps ) {
  return (
    <TouchableOpacity 
      onPress={handlePress}
      disabled={disabled}
      style={{opacity: disabled ? 0.5 : 1}} 
      className={`bg-primary-default w-full rounded p-3 ${containerStyle}`}>
      <Text 
        className="text-secondary-default text-[16px] text-center font-psemibold">
        {title}
      </Text>
    </TouchableOpacity>
  )
}