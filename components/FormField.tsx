import { View, Text, TextInput } from "react-native"
import React from "react"
import type { KeyboardTypeOptions } from "react-native"

interface FormFieldProps {
  title: string;
  placeholder: string;
  value: string | null;
  handleChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  additionalStyles?: string;
  readOnly?: boolean;
}

export default function FormField({
  title, 
  value, 
  placeholder, 
  handleChangeText, 
  keyboardType, 
  additionalStyles,
  readOnly
} : FormFieldProps) {
  return (
    <View className="my-4 w-full">
      <Text className="text-white font-psemibold text-sm">
        {title}
      </Text>
      <TextInput 
        value={value ? value : ""}
        keyboardType={keyboardType ? keyboardType : "default"}
        onChangeText={handleChangeText}
        readOnly={readOnly ? readOnly : false}
        multiline = {true}
        placeholder={placeholder}
        placeholderTextColor="#BDBDBD"
        className={`
          ${additionalStyles} 
          bg-secondary-600
          border 
          border-secondary-400
          text-white p-3 
          rounded-md 
          w-full 
          mt-2 
          focus:border-primary-default
          ${readOnly ? "opacity-40" : ""}
        `}
      />
    </View>
  )
}