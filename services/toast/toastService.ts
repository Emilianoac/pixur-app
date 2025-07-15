import Toast from "react-native-toast-message";

interface ToastOptions {
  type?: "success" | "error" | "info";
  text1: string;
  text2?: string;
  position?: "top" | "bottom";
  visibilityTime?: number;
  topOffset?: number;
  [key: string]: any;
}

export const showBaseToast = ({
  type = "success",
  text1,
  text2,
  position = "top",
  visibilityTime = 2500,
  topOffset = 90,
  ...rest
}: ToastOptions) => {
  Toast.show({
    type,
    position,
    visibilityTime,
    autoHide: true,
    topOffset,
    text1Style: { fontFamily: "Poppins-SemiBold" },
    text2Style: { fontFamily: "Poppins-Regular", fontSize: 12 },
    onPress: () => Toast.hide(),
    text1,
    text2,
    ...rest, 
  });
};
