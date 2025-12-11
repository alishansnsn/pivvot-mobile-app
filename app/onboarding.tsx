import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import MaskedBackground from "@/components/MaskedBackground";
import colors from "@/constants/colors";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
    const router = useRouter();

    const handleGetStarted = () => {
        // Navigate to the login screen
        router.push("/login");
    };

    return (
        <MaskedBackground source={require("../Images/bg_image.png")}>
            <StatusBar style="light" />

            {/* Content Container */}
            <View style={styles.content}>
                {/* Image Section */}
                <View style={styles.cardSection}>
                    <Image
                        source={require("../Images/logopivvot.png")}
                        style={styles.mascotImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Text Section */}
                <View style={styles.textSection}>
                    <Text style={styles.title}>
                        Master Your{"\n"}Freelance Finances
                    </Text>
                    <Text style={styles.subtitle}>
                        All your earnings, invoices, and budgeting{"\n"}in one powerful dashboard
                    </Text>
                </View>

                {/* Pagination Dots */}
                <View style={styles.pagination}>
                    <View style={styles.dot} />
                    <View style={[styles.dot, styles.dotActive]} />
                    <View style={styles.dot} />
                </View>

                {/* Get Started Button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleGetStarted}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>GET STARTED</Text>
                </TouchableOpacity>
            </View>
        </MaskedBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: height * 0.08,
        paddingBottom: 40,
    },
    cardSection: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: height * 0.05,
    },
    mascotImage: {
        transform: [{ scale: 0.25 }],
    },
    textSection: {
        alignItems: "center",
        marginBottom: 32,
    },
    title: {
        fontSize: 36,
        fontFamily: "Manrope_700Bold",
        color: colors.dark.text,
        textAlign: "center",
        lineHeight: 44,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: "Manrope_400Regular",
        color: "white",
        textAlign: "center",
        lineHeight: 24,
    },
    pagination: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginBottom: 32,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.dark.textTertiary,
    },
    dotActive: {
        backgroundColor: colors.dark.primary,
    },
    button: {
        backgroundColor: colors.dark.primary,
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 8,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: "Manrope_700Bold",
        color: colors.dark.background,
        letterSpacing: 1,
    },
    starContainer: {
        position: "absolute",
        bottom: 50,
        right: 24,
    },
    star: {
        fontSize: 20,
        color: colors.dark.primary,
    },
});
