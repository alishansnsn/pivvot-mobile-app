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

    const handleNewInvoice = () => {
        router.push("/new-invoice");
    };

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: isRevealed ? SLIDE_DISTANCE : 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
        }).start();
    }, [isRevealed]);

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
                            <Text style={styles.copyIcon}>⎘</Text>
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
                                    <Text style={styles.copyIcon}>⎘</Text>
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
                    {/* Notch arrow indicator */}
                    <View style={styles.notchArrow}>
                        <ChevronUp size={16} color={colors.dark.textSecondary} strokeWidth={2.5} />
                    </View>

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
        marginBottom: 40,
    },
    actionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },
    actionItem: {
        alignItems: "center",
        gap: 8,
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
