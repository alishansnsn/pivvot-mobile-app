import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Bell } from "lucide-react-native";
import { useState, useEffect } from "react";
import colors from "@/constants/colors";
import BalanceCard from "@/components/BalanceCard";

// Mock invoice data
const invoices = [
    {
        id: "1",
        clientName: "Acme Corp",
        amount: -1250.0,
        amountSecondary: "-5750.00 lei",
        time: "12:15",
        logoText1: "Acme",
        logoText2: "Corp",
        bgColor: "#6EE798",
    },
    {
        id: "2",
        clientName: "Tech Startup Inc",
        amount: -890.5,
        amountSecondary: "-4100.30 lei",
        time: "14:30",
        logoText1: "Tech",
        logoText2: "Start",
        bgColor: colors.dark.accent,
    },
    {
        id: "3",
        clientName: "Design Studio",
        amount: -2100.0,
        amountSecondary: "-9660.00 lei",
        time: "09:45",
        logoText1: "Design",
        logoText2: "Studio",
        bgColor: "#FF6B9D",
    },
];

export default function HomeScreen() {
    const router = useRouter();
    const [isCardRevealed, setIsCardRevealed] = useState(false);
    const slideAnim = useState(new Animated.Value(0))[0];

    // Sync animation with card reveal state
    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: isCardRevealed ? 210 : 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
        }).start();
    }, [isCardRevealed, slideAnim]);

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerGreeting}>Hello, </Text>
                    <Text style={styles.headerName}>Ali</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Bell color={colors.dark.text} size={24} strokeWidth={1.5} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.avatarButton} onPress={() => router.push("/settings")}>
                        <Text style={styles.avatarText}>A</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Balance Card with Payment Card Behind */}
                <BalanceCard
                    isRevealed={isCardRevealed}
                    onToggleReveal={() => setIsCardRevealed(!isCardRevealed)}
                />

                {/* Recent Invoices */}
                <Animated.View
                    style={[
                        styles.section,
                        {
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Invoices</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAllButton}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.invoiceList}>
                        {invoices.map((invoice) => (
                            <TouchableOpacity
                                key={invoice.id}
                                style={styles.invoiceCard}
                                activeOpacity={0.7}
                            >
                                {/* 1. LEFT: Icon / Logo Container */}
                                <View
                                    style={[
                                        styles.invoiceIcon,
                                        { backgroundColor: invoice.bgColor },
                                    ]}
                                >
                                    <Text style={styles.logoTextBold}>{invoice.logoText1}</Text>
                                    <Text style={styles.logoText}>{invoice.logoText2}</Text>
                                </View>

                                {/* 2. CENTER: Title & Time */}
                                <View style={styles.invoiceInfo}>
                                    <Text style={styles.invoiceClientName}>
                                        {invoice.clientName}
                                    </Text>
                                    <Text style={styles.invoiceTime}>{invoice.time}</Text>
                                </View>

                                {/* 3. RIGHT: Amount & Conversion */}
                                <View style={styles.invoiceAmountContainer}>
                                    <Text style={styles.invoicePrimaryAmount}>
                                        {invoice.amount.toFixed(2)} $
                                    </Text>
                                    <Text style={styles.invoiceSecondaryAmount}>
                                        {invoice.amountSecondary}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark.background,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerTextContainer: {
        flexDirection: "row",
        alignItems: "baseline",
    },
    headerGreeting: {
        fontSize: 20,
        fontFamily: "Manrope_400Regular",
        color: colors.dark.textSecondary,
    },
    headerName: {
        fontSize: 28,
        fontFamily: "PlayfairDisplay_600SemiBold_Italic",
        fontStyle: "italic",
        color: colors.dark.text,
        letterSpacing: 0.5,
    },
    notificationButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },
    headerActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    avatarButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.dark.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        fontSize: 16,
        fontFamily: "Manrope_700Bold",
        color: colors.dark.background,
        textTransform: "uppercase",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: "Manrope_700Bold",
        color: colors.dark.text,
    },
    viewAllButton: {
        fontSize: 14,
        fontFamily: "Manrope_600SemiBold",
        color: colors.dark.textSecondary,
    },
    invoiceList: {
        gap: 12,
    },
    invoiceCard: {
        backgroundColor: colors.dark.surface,
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 24,
    },
    invoiceIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    logoTextBold: {
        color: "#FFF",
        fontSize: 10,
        fontFamily: "Manrope_700Bold",
        lineHeight: 10,
    },
    logoText: {
        color: "#FFF",
        fontSize: 10,
        fontFamily: "Manrope_600SemiBold",
        lineHeight: 10,
    },
    invoiceInfo: {
        flex: 1,
        justifyContent: "center",
    },
    invoiceClientName: {
        color: colors.dark.text,
        fontSize: 16,
        fontFamily: "Manrope_600SemiBold",
        marginBottom: 4,
    },
    invoiceTime: {
        color: colors.dark.textSecondary,
        fontSize: 14,
        fontFamily: "Manrope_500Medium",
    },
    invoiceAmountContainer: {
        alignItems: "flex-end",
    },
    invoicePrimaryAmount: {
        color: colors.dark.text,
        fontSize: 16,
        fontFamily: "Manrope_600SemiBold",
        marginBottom: 4,
    },
    invoiceSecondaryAmount: {
        color: colors.dark.textSecondary,
        fontSize: 14,
        fontFamily: "Manrope_500Medium",
    },
});
