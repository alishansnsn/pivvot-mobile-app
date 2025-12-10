import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "@/constants/colors";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;
const CARD_HEIGHT = 180;

export default function OnboardingCard() {
    return (
        <View style={styles.cardWrapper}>
            {/* Glow Effect */}
            <View style={styles.glowOuter} />
            <View style={styles.glowInner} />

            {/* Card */}
            <LinearGradient
                colors={["#E8F5A8", "#C8E66A", "#A8D84F"]}
                locations={[0, 0.5, 1]}
                style={styles.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Card Label */}
                <Text style={styles.cardLabel}>Standard</Text>

                {/* Card Number */}
                <View style={styles.cardNumberContainer}>
                    <Text style={styles.cardNumber}>**** 4521</Text>
                </View>

                {/* VISA Logo */}
                <View style={styles.visaContainer}>
                    <Text style={styles.visaText}>VISA</Text>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    cardWrapper: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    glowOuter: {
        position: "absolute",
        width: CARD_WIDTH + 60,
        height: CARD_HEIGHT + 60,
        borderRadius: 40,
        backgroundColor: "rgba(210, 248, 101, 0.15)",
    },
    glowInner: {
        position: "absolute",
        width: CARD_WIDTH + 30,
        height: CARD_HEIGHT + 30,
        borderRadius: 30,
        backgroundColor: "rgba(210, 248, 101, 0.25)",
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 20,
        padding: 20,
        justifyContent: "space-between",
        shadowColor: colors.dark.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 24,
        elevation: 12,
    },
    cardLabel: {
        fontSize: 18,
        fontFamily: "Manrope_500Medium",
        color: "#1a1a1a",
    },
    cardNumberContainer: {
        marginTop: 20,
    },
    cardNumber: {
        fontSize: 20,
        fontFamily: "Manrope_700Bold",
        color: "#1a1a1a",
        letterSpacing: 2,
    },
    visaContainer: {
        alignSelf: "flex-end",
    },
    visaText: {
        fontSize: 24,
        fontFamily: "Manrope_700Bold",
        fontStyle: "italic",
        color: "#1a1a1a",
        letterSpacing: 2,
    },
});
