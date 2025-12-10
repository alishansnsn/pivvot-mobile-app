import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft } from "lucide-react-native";
import Svg, { Path, G } from "react-native-svg";
import colors from "@/constants/colors";

import MaskedBackground from "@/components/MaskedBackground";

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleBack = () => {
        router.back();
    };

    const handleLogin = () => {
        // Navigate to the main app (tabs)
        router.replace("/(tabs)");
    };

    return (
        <MaskedBackground source={require("../Images/bg_image.png")}>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleBack}
                            activeOpacity={0.7}
                        >
                            <ChevronLeft size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Title Section */}
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>Hi There!</Text>
                        <Text style={styles.subtitle}>Please enter required details</Text>
                    </View>

                    {/* Social Buttons */}
                    <View style={styles.socialButtonsContainer}>
                        <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                            {/* Google Icon - Simple SVG */}
                            <Svg width={24} height={24} viewBox="0 0 24 24">
                                <Path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <Path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <Path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21.81-.63z"
                                    fill="#FBBC05"
                                />
                                <Path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </Svg>
                            <Text style={styles.socialButtonText}>Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                            {/* Apple Icon - Simple SVG */}
                            <Svg width={24} height={24} viewBox="0 0 128 128" fill="#FFF">
                                <Path d="M97.905 67.885c.174 18.8 16.494 25.057 16.674 25.137-.138.44-2.607 8.916-8.597 17.669-5.178 7.568-10.553 15.108-19.018 15.266-8.318.152-10.993-4.934-20.504-4.934-9.508 0-12.479 4.776-20.354 5.086-8.172.31-14.395-8.185-19.616-15.724C15.822 94.961 7.669 66.8 18.616 47.791c5.438-9.44 15.158-15.417 25.707-15.571 8.024-.153 15.598 5.398 20.503 5.398 4.902 0 14.106-6.676 23.782-5.696 4.051.169 15.421 1.636 22.722 12.324-.587.365-13.566 7.921-13.425 23.639M82.272 21.719c4.338-5.251 7.258-12.563 6.462-19.836-6.254.251-13.816 4.167-18.301 9.416-4.02 4.647-7.54 12.087-6.591 19.216 6.971.54 14.091-3.542 18.43-8.796" />
                            </Svg>
                            <Text style={styles.socialButtonText}>Apple</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Input Fields */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email address"
                            placeholderTextColor="#6B7280"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#6B7280"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity style={styles.forgotPasswordContainer} activeOpacity={0.7}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {/* Log In Button */}
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.loginButtonText}>Log In</Text>
                    </TouchableOpacity>

                    {/* Sign Up Link */}
                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>Create an account? </Text>
                        <TouchableOpacity activeOpacity={0.7}>
                            <Text style={styles.signUpText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Links */}
                    <View style={styles.bottomLinksContainer}>
                        <TouchableOpacity activeOpacity={0.7}>
                            <Text style={styles.bottomLinkText}>Terms of Service</Text>
                        </TouchableOpacity>
                        <View style={styles.bottomLinkDivider} />
                        <TouchableOpacity activeOpacity={0.7}>
                            <Text style={styles.bottomLinkText}>Privacy Policy</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </MaskedBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark.background,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 40,
        alignItems: "flex-start",
    },
    backButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        alignItems: "center",
        justifyContent: "center",
    },
    titleSection: {
        alignItems: "center",
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontFamily: "Manrope_700Bold",
        color: "#FFFFFF",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: "Manrope_400Regular",
        color: "#9CA3AF",
    },
    socialButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 16,
        marginBottom: 32,
    },
    socialButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(30, 30, 32, 0.8)",
        borderRadius: 20,
        paddingVertical: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.05)",
    },
    socialButtonText: {
        fontSize: 16,
        fontFamily: "Manrope_600SemiBold",
        color: "#FFFFFF",
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 32,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    dividerText: {
        marginHorizontal: 16,
        color: "#9CA3AF",
        fontFamily: "Manrope_500Medium",
        fontSize: 14,
    },
    inputContainer: {
        gap: 16,
        marginBottom: 16,
    },
    input: {
        backgroundColor: "rgba(30, 30, 32, 0.8)",
        borderRadius: 20,
        paddingVertical: 18,
        paddingHorizontal: 20,
        fontSize: 16,
        fontFamily: "Manrope_400Regular",
        color: "#FFFFFF",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.05)",
    },
    forgotPasswordContainer: {
        alignSelf: "flex-end",
        marginBottom: 32,
    },
    forgotPasswordText: {
        color: "#FFFFFF",
        fontFamily: "Manrope_500Medium",
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: colors.dark.primary,
        borderRadius: 24,
        paddingVertical: 18,
        alignItems: "center",
        marginBottom: 24,
    },
    loginButtonText: {
        color: colors.dark.background,
        fontSize: 18,
        fontFamily: "Manrope_700Bold",
        letterSpacing: 0.5,
    },
    footerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 60,
    },
    footerText: {
        color: "#9CA3AF",
        fontSize: 15,
        fontFamily: "Manrope_400Regular",
    },
    signUpText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontFamily: "Manrope_600SemiBold",
    },
    bottomLinksContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "auto",
        gap: 16,
    },
    bottomLinkText: {
        color: "#9CA3AF",
        fontSize: 13,
        fontFamily: "Manrope_400Regular",
        textDecorationLine: "underline",
    },
    bottomLinkDivider: {
        width: 1,
        height: 12,
        backgroundColor: "#4B5563",
    },
});
