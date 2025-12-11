import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
    useFonts,
    Fraunces_400Regular,
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
} from "@expo-google-fonts/fraunces";
import {
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
} from "@expo-google-fonts/manrope";
import {
    PlayfairDisplay_400Regular_Italic,
    PlayfairDisplay_600SemiBold_Italic,
    PlayfairDisplay_700Bold_Italic,
} from "@expo-google-fonts/playfair-display";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
    return (
        <Stack screenOptions={{ headerBackTitle: "Back" }} initialRouteName="onboarding">
            <Stack.Screen
                name="onboarding"
                options={{
                    headerShown: false,
                    animation: "none",
                }}
            />
            <Stack.Screen
                name="login"
                options={{
                    headerShown: false,
                    animation: "fade",
                }}
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
                name="new-invoice"
                options={{
                    headerShown: false,
                    presentation: "modal",
                    animation: "slide_from_bottom",
                }}
            />
            <Stack.Screen
                name="settings"
                options={{
                    headerShown: false,
                    presentation: "modal",
                    animation: "slide_from_right",
                }}
            />
            <Stack.Screen
                name="clients"
                options={{
                    headerShown: false,
                    animation: "slide_from_right",
                }}
            />
            <Stack.Screen
                name="chat"
                options={{
                    headerShown: false,
                    animation: "slide_from_right",
                }}
            />
            <Stack.Screen
                name="account"
                options={{
                    headerShown: false,
                    animation: "slide_from_right",
                }}
            />
        </Stack>
    );
}

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Fraunces_400Regular,
        Fraunces_500Medium,
        Fraunces_600SemiBold,
        Fraunces_700Bold,
        Manrope_400Regular,
        Manrope_500Medium,
        Manrope_600SemiBold,
        Manrope_700Bold,
        PlayfairDisplay_400Regular_Italic,
        PlayfairDisplay_600SemiBold_Italic,
        PlayfairDisplay_700Bold_Italic,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync().catch(() => {
                // Ignore error if splash screen is already hidden
            });
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView>
                <RootLayoutNav />
            </GestureHandlerRootView>
        </QueryClientProvider>
    );
}
