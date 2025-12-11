import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated, Modal, Pressable, RefreshControl } from "react-native";
import { Image } from 'expo-image';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Bell, X, Calendar, DollarSign } from "lucide-react-native";
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
        date: "24 Oct, 2023",
        domain: "acme.com",
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
        date: "23 Oct, 2023",
        domain: "pylon.com", // Example for Tech Startup
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
        date: "22 Oct, 2023",
        domain: "dribbble.com", // Example for Design Studio
    },
];

type InvoiceType = typeof invoices[0];

export default function HomeScreen() {
    const router = useRouter();
    const [isCardRevealed, setIsCardRevealed] = useState(false);
    const slideAnim = useState(new Animated.Value(0))[0];
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceType | null>(null);
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        // Simulate refresh
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };

    const handleInvoicePress = (invoice: InvoiceType) => {
        setSelectedInvoice(invoice);
        setDetailsVisible(true);
    };

    const handleViewAll = () => {
        router.push("/(tabs)/profile");
    };

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
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dark.text} />
                }
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
                        <TouchableOpacity onPress={handleViewAll}>
                            <Text style={styles.viewAllButton}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.invoiceList}>
                        {invoices.map((invoice) => (
                            <TouchableOpacity
                                key={invoice.id}
                                style={styles.invoiceCard}
                                activeOpacity={0.7}
                                onPress={() => handleInvoicePress(invoice)}
                            >
                                {/* 1. LEFT: Icon / Logo Container */}
                                <View
                                    style={[
                                        styles.invoiceIcon,
                                        { backgroundColor: invoice.bgColor, overflow: 'hidden' },
                                    ]}
                                >
                                    {invoice.domain ? (
                                        <Image
                                            source={{ uri: `https://img.logo.dev/${invoice.domain}?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ` }}
                                            style={{ width: 32, height: 32 }}
                                            contentFit="contain"
                                        />
                                    ) : (
                                        <>
                                            <Text style={styles.logoTextBold}>{invoice.logoText1}</Text>
                                            <Text style={styles.logoText}>{invoice.logoText2}</Text>
                                        </>
                                    )}
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

            {/* Invoice Details Modal */}
            <Modal
                visible={detailsVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setDetailsVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setDetailsVisible(false)}>
                    <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Invoice Details</Text>
                            <TouchableOpacity onPress={() => setDetailsVisible(false)} style={styles.closeButton}>
                                <X size={24} color={colors.dark.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Content */}
                        {selectedInvoice && (
                            <View style={styles.modalBody}>
                                {/* Icon */}
                                <View style={[styles.modalIcon, { backgroundColor: selectedInvoice.bgColor }]}>
                                    <DollarSign size={28} color="#FFF" />
                                </View>

                                <Text style={styles.modalClientName}>{selectedInvoice.clientName}</Text>

                                {/* Details Grid */}
                                <View style={styles.modalDetailsGrid}>
                                    <View style={styles.modalDetailRow}>
                                        <Text style={styles.modalDetailLabel}>Amount</Text>
                                        <Text style={styles.modalDetailValue}>
                                            {selectedInvoice.amount.toFixed(2)} $
                                        </Text>
                                    </View>
                                    <View style={styles.modalDetailRow}>
                                        <Text style={styles.modalDetailLabel}>Date</Text>
                                        <Text style={styles.modalDetailValue}>{selectedInvoice.date}</Text>
                                    </View>
                                    <View style={styles.modalDetailRow}>
                                        <Text style={styles.modalDetailLabel}>Time</Text>
                                        <Text style={styles.modalDetailValue}>{selectedInvoice.time}</Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Footer */}
                        <TouchableOpacity style={styles.modalCloseButton} onPress={() => setDetailsVisible(false)}>
                            <Text style={styles.modalCloseButtonText}>Close</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>
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
        fontSize: 28,
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
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: colors.dark.surface,
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'Manrope_700Bold',
        color: colors.dark.text,
    },
    closeButton: {
        padding: 4,
    },
    modalBody: {
        alignItems: 'center',
        marginBottom: 24,
    },
    modalIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    modalClientName: {
        fontSize: 20,
        fontFamily: 'Manrope_700Bold',
        color: colors.dark.text,
        marginBottom: 20,
    },
    modalDetailsGrid: {
        width: '100%',
        gap: 12,
    },
    modalDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.dark.border,
    },
    modalDetailLabel: {
        fontSize: 14,
        fontFamily: 'Manrope_500Medium',
        color: colors.dark.textSecondary,
    },
    modalDetailValue: {
        fontSize: 14,
        fontFamily: 'Manrope_600SemiBold',
        color: colors.dark.text,
    },
    modalCloseButton: {
        backgroundColor: colors.dark.border,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalCloseButtonText: {
        color: colors.dark.text,
        fontFamily: 'Manrope_600SemiBold',
        fontSize: 16,
    },
});
