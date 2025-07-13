import { Stack } from "expo-router";

export default function GalleryLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="gallery"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
