import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated } from "react-native";
import Svg, { Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { FileText, Users, Repeat, ChevronUp } from "lucide-react-native";
import { useRouter } from "expo-router";
import colors from "@/constants/colors";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = 280;
const NOTCH_WIDTH = 160;
const NOTCH_DEPTH = 25;
const RADIUS = 24;
const PAYMENT_CARD_WIDTH = CARD_WIDTH - 18; // Slightly narrower than balance card
const PAYMENT_CARD_HEIGHT = 200;
const SLIDE_DISTANCE = 210;

interface BalanceCardProps {
    isRevealed?: boolean;
    onToggleReveal?: () => void;
}

export default function BalanceCard({ isRevealed = false, onToggleReveal }: BalanceCardProps) {
    const router = useRouter();
    const slideAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    const handleNewInvoice = () => {
        router.push("/new-invoice");
    };

    useEffect(() => {
        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: isRevealed ? SLIDE_DISTANCE : 0,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.spring(rotateAnim, {
                toValue: isRevealed ? 1 : 0,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, [isRevealed]);

    // Interpolate rotation
    const chevronRotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const pathData = `
    M 0,${RADIUS}
    Q 0,0 ${RADIUS},0
    L ${CARD_WIDTH / 2 - NOTCH_WIDTH / 2},0
    C ${CARD_WIDTH / 2 - NOTCH_WIDTH / 4},0 ${CARD_WIDTH / 2 - NOTCH_WIDTH / 4},${NOTCH_DEPTH} ${CARD_WIDTH / 2},${NOTCH_DEPTH}
    C ${CARD_WIDTH / 2 + NOTCH_WIDTH / 4},${NOTCH_DEPTH} ${CARD_WIDTH / 2 + NOTCH_WIDTH / 4},0 ${CARD_WIDTH / 2 + NOTCH_WIDTH / 2},0
    L ${CARD_WIDTH - RADIUS},0
    Q ${CARD_WIDTH},0 ${CARD_WIDTH},${RADIUS}
    L ${CARD_WIDTH},${CARD_HEIGHT - RADIUS}
    Q ${CARD_WIDTH},${CARD_HEIGHT} ${CARD_WIDTH - RADIUS},${CARD_HEIGHT}
    L ${RADIUS},${CARD_HEIGHT}
    Q 0,${CARD_HEIGHT} 0,${CARD_HEIGHT - RADIUS}
    Z
  `;

    return (
        <View style={styles.container}>
            {/* 1. PAYMENT CARD (Background Layer - Fixed) */}
            <View style={styles.paymentCardContainer}>
                <LinearGradient
                    colors={["#E8F5A8", "#C8E66A", "#A8D84F"]}
                    locations={[0, 0.5, 1]}
                    style={styles.paymentCardGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.paymentCardContent}>
                        <Text style={styles.cardLabel}>Card number</Text>
                        <View style={styles.cardNumberRow}>
                            <Text style={styles.cardNumberFull}>3456 5667 3211 3377</Text>
                            <Svg width={20} height={20} viewBox="0 0 24 24">
                                <Path fill="#1a1a1a" fillOpacity={0.6} d="M15.24 2h-3.894c-1.764 0-3.162 0-4.255.148c-1.126.152-2.037.472-2.755 1.193c-.719.721-1.038 1.636-1.189 2.766C3 7.205 3 8.608 3 10.379v5.838c0 1.508.92 2.8 2.227 3.342c-.067-.91-.067-2.185-.067-3.247v-5.01c0-1.281 0-2.386.118-3.27c.127-.948.413-1.856 1.147-2.593s1.639-1.024 2.583-1.152c.88-.118 1.98-.118 3.257-.118h3.07c1.276 0 2.374 0 3.255.118A3.6 3.6 0 0 0 15.24 2" />
                                <Path fill="#1a1a1a" fillOpacity={0.6} d="M6.6 11.397c0-2.726 0-4.089.844-4.936c.843-.847 2.2-.847 4.916-.847h2.88c2.715 0 4.073 0 4.917.847S21 8.671 21 11.397v4.82c0 2.726 0 4.089-.843 4.936c-.844.847-2.202.847-4.917.847h-2.88c-2.715 0-4.073 0-4.916-.847c-.844-.847-.844-2.21-.844-4.936z" />
                            </Svg>
                        </View>
                        <View style={styles.cardDetailsRow}>
                            <View>
                                <Text style={styles.cardLabel}>Expiry date</Text>
                                <View style={styles.expiryRow}>
                                    <Text style={styles.cardDetailText}>01/29</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.cardLabel}>CVV</Text>
                                <View style={styles.cvvRow}>
                                    <Text style={styles.cardDetailText}>277</Text>
                                    <Svg width={20} height={20} viewBox="0 0 24 24">
                                        <Path fill="#1a1a1a" fillOpacity={0.6} d="M15.24 2h-3.894c-1.764 0-3.162 0-4.255.148c-1.126.152-2.037.472-2.755 1.193c-.719.721-1.038 1.636-1.189 2.766C3 7.205 3 8.608 3 10.379v5.838c0 1.508.92 2.8 2.227 3.342c-.067-.91-.067-2.185-.067-3.247v-5.01c0-1.281 0-2.386.118-3.27c.127-.948.413-1.856 1.147-2.593s1.639-1.024 2.583-1.152c.88-.118 1.98-.118 3.257-.118h3.07c1.276 0 2.374 0 3.255.118A3.6 3.6 0 0 0 15.24 2" />
                                        <Path fill="#1a1a1a" fillOpacity={0.6} d="M6.6 11.397c0-2.726 0-4.089.844-4.936c.843-.847 2.2-.847 4.916-.847h2.88c2.715 0 4.073 0 4.917.847S21 8.671 21 11.397v4.82c0 2.726 0 4.089-.843 4.936c-.844.847-2.202.847-4.917.847h-2.88c-2.715 0-4.073 0-4.916-.847c-.844-.847-.844-2.21-.844-4.936z" />
                                    </Svg>
                                </View>
                            </View>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            {/* 2. BALANCE CARD (Animated - Slides Down) */}
            <Animated.View
                style={[
                    styles.balanceCardWrapper,
                    {
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                <TouchableOpacity activeOpacity={1} onPress={onToggleReveal}>
                    {/* Notch arrow indicator with rotation */}
                    <Animated.View style={[styles.notchArrow, { transform: [{ rotate: chevronRotation }] }]}>
                        <ChevronUp size={16} color={colors.dark.textSecondary} strokeWidth={2.5} />
                    </Animated.View>

                    {/* The SVG shape */}
                    <View style={styles.svgContainer}>
                        <Svg width={CARD_WIDTH} height={CARD_HEIGHT}>
                            <Path d={pathData} fill={colors.dark.surfaceElevated} />
                        </Svg>
                    </View>

                    {/* The content */}
                    <View style={styles.contentContainer}>
                        <Text style={styles.label}>Total Balance</Text>
                        <Text style={styles.balance}>$6,324.49</Text>
                        <Text style={styles.growth}>+$4,660.50</Text>

                        {/* Action Buttons Row */}
                        <View style={styles.actionsRow}>
                            <ActionButton
                                icon="clients"
                                label="Clients"
                                onPress={() => router.push("/clients")}
                            />
                            <ActionButton icon="invoice" label="New Invoice" onPress={handleNewInvoice} />
                            <ActionButton icon="exchange" label="Exchange" />
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

// Sub-component for the round buttons
const ActionButton = ({ icon, label, onPress }: { icon: string; label: string; onPress?: () => void }) => {
    const getIcon = () => {
        switch (icon) {
            case "clients":
                return <Users size={22} color={colors.dark.background} strokeWidth={2.5} />;
            case "invoice":
                return <FileText size={22} color={colors.dark.background} strokeWidth={2.5} />;
            case "exchange":
                return <Repeat size={22} color={colors.dark.background} strokeWidth={2.5} />;
            default:
                return null;
        }
    };

    return (
        <View style={styles.actionItem}>
            <TouchableOpacity style={styles.circleButton} activeOpacity={0.7} onPress={onPress}>
                {getIcon()}
            </TouchableOpacity>
            <Text style={styles.actionLabel}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 32,
        position: "relative",
    },
    // Payment Card Styles (Background)
    paymentCardContainer: {
        position: "absolute",
        top: -20,
        width: PAYMENT_CARD_WIDTH,
        height: PAYMENT_CARD_HEIGHT,
        zIndex: 0,
    },
    paymentCardGradient: {
        width: "100%",
        height: "100%",
        borderRadius: 24,
        padding: 20,
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    paymentCardContent: {
        flex: 1,
        justifyContent: "space-between",
    },
    cardLabel: {
        fontSize: 12,
        fontFamily: "Manrope_500Medium",
        color: "#1a1a1a",
        opacity: 0.6,
        marginBottom: 4,
    },
    cardNumberRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    cardNumberFull: {
        fontSize: 20,
        fontFamily: "Manrope_700Bold",
        color: "#1a1a1a",
        letterSpacing: 1,
    },
    copyIcon: {
        fontSize: 18,
        color: "#1a1a1a",
        opacity: 0.6,
    },
    cardDetailsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    expiryRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    cvvRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    cardDetailText: {
        fontSize: 18,
        fontFamily: "Manrope_700Bold",
        color: "#1a1a1a",
    },
    // Balance Card Styles (Animated)
    balanceCardWrapper: {
        zIndex: 1,
    },
    notchArrow: {
        position: "absolute",
        top: 8,
        left: CARD_WIDTH / 2 - 8,
        zIndex: 10,
    },
    svgContainer: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    contentContainer: {
        position: "absolute",
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        padding: 24,
        paddingTop: 40,
        justifyContent: "space-between", // Ensure space distribution
    },
    label: {
        color: colors.dark.textSecondary,
        fontSize: 14,
        fontFamily: "Manrope_500Medium",
        marginBottom: 8,
    },
    balance: {
        color: colors.dark.text,
        fontSize: 42,
        fontFamily: "Manrope_700Bold",
        marginBottom: 8,
        letterSpacing: -1,
    },
    growth: {
        color: colors.dark.primary,
        fontSize: 16,
        fontFamily: "Manrope_600SemiBold",
        marginBottom: 26,
    },
    actionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        marginBottom: 20, // Add bottom padding/margin as requested
        marginTop: "auto", // Push to bottom but respecter padding
    },
    actionItem: {
        alignItems: "center",
        gap: 8,
        // Move slightly upwards if needed, but marginTop: auto handles positioning
        transform: [{ translateY: -10 }], // Explicit request to move slightly upwards
    },
    circleButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.dark.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    actionLabel: {
        color: colors.dark.text,
        fontSize: 13,
        fontFamily: "Manrope_600SemiBold",
    },
});
