import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { NativeBaseProvider } from "native-base";
import Navigator from "./src/Navigator";

export default function App() {
  const [fontsLoaded] = useFonts({
    shelter: require("./assets/fonts/shelter.otf"),
    Billabong: require("./assets/fonts/Billabong.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NativeBaseProvider>
      <Navigator />
    </NativeBaseProvider>
  );
}
