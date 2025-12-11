import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    ScrollView,
    Animated,
    RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { SlidersHorizontal, Calendar, CheckCircle2, Trash2, DollarSign } from "lucide-react-native";
import { useRef, useState, useMemo, useEffect } from "react";
import { Image } from "expo-image";
import { Swipeable } from "react-native-gesture-handler";
import { Confetti, ConfettiRef } from "@/components/ui/confetti";
import colors from "@/constants/colors";
import PaymentModal from "@/components/PaymentModal";
import InvoiceDetailsModal from "@/components/InvoiceDetailsModal";
import { useInvoiceStore, Invoice, InvoiceStatus } from "@/store/invoiceStore";

// Filter options
const filters = ["All", "Paid", "Unpaid", "Overdue", "Drafts"] as const;
type FilterOption = (typeof filters)[number];

// Status badge styling helper
const getStatusStyle = (status: InvoiceStatus) => {
    switch (status) {
        case "Paid":
            return {
                bg: "#1E3E2B",
                text: "#4ADE80",
                showIcon: true,
            };
        case "Unpaid":
            return {
                bg: "#3E341E",
                text: "#FFB84D",
                showIcon: false,
            };
        case "Overdue":
            return {
                bg: "#3E1E1E",
                text: "#F87171",
                showIcon: false,
            };
        case "Draft":
            return {
                bg: "#2A2A2A",
                text: "#9CA3AF",
                showIcon: false,
            };
    }
};

// Filter chip component
function FilterChip({
    label,
    isActive,
    onPress,
}: {
    label: string;
    isActive: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            style={[styles.filterChip, isActive && styles.filterChipActive]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text
                style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

// Shimmer loading component
function ShimmerPlaceholder() {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            })
        ).start();
    }, [shimmerAnim]);

    const translateX = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-32, 32],
    });

    return (
        <View style={styles.shimmerContainer}>
            <Animated.View
                style={[
                    styles.shimmerGradient,
                    { transform: [{ translateX }] },
                ]}
            />
        </View>
    );
}

// Invoice card component with swipe actions
function InvoiceCard({
    invoice,
    onPress,
    onDelete,
    onMarkAsPaid,
}: {
    invoice: Invoice;
    onPress: (invoice: Invoice) => void;
    onDelete: (invoice: Invoice) => void;
    onMarkAsPaid: (invoice: Invoice) => void;
}) {
    const statusStyle = getStatusStyle(invoice.status);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const swipeableRef = useRef<Swipeable>(null);

    // Use logo.dev API instead of Clearbit
    const logoUrl = invoice.domain
        ? `https://img.logo.dev/${invoice.domain}?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ`
        : null;

    const renderLeftActions = () => (
        <TouchableOpacity
            style={styles.swipeActionLeft}
            onPress={() => {
                swipeableRef.current?.close();
                onMarkAsPaid(invoice);
            }}
        >
            <DollarSign color="#FFFFFF" size={24} strokeWidth={2} />
            <Text style={styles.swipeActionText}>Mark Paid</Text>
        </TouchableOpacity>
    );

    const renderRightActions = () => (
        <TouchableOpacity
            style={styles.swipeActionRight}
            onPress={() => {
                swipeableRef.current?.close();
                onDelete(invoice);
            }}
        >
            <Trash2 color="#FFFFFF" size={24} strokeWidth={2} />
            <Text style={styles.swipeActionText}>Delete</Text>
        </TouchableOpacity>
    );

    return (
        <Swipeable
            ref={swipeableRef}
            renderLeftActions={invoice.status !== "Paid" ? renderLeftActions : undefined}
            renderRightActions={renderRightActions}
            overshootLeft={false}
            overshootRight={false}
            friction={2}
        >
            <TouchableOpacity
                style={styles.invoiceCard}
                activeOpacity={0.7}
                onPress={() => onPress(invoice)}
            >
                {/* Left Pane: Logo with shimmer */}
                <View
                    style={[styles.logoContainer, { backgroundColor: invoice.logoColor }]}
                >
                    {logoUrl && !imageError ? (
                        <>
                            {imageLoading && <ShimmerPlaceholder />}
                            <Image
                                source={{ uri: logoUrl }}
                                style={[styles.logoImage, imageLoading && { opacity: 0 }]}
                                contentFit="contain"
                                onLoad={() => setImageLoading(false)}
                                onError={() => {
                                    setImageError(true);
                                    setImageLoading(false);
                                }}
                            />
                        </>
                    ) : (
                        <Text style={styles.logoFallback}>
                            {invoice.companyName.charAt(0)}
                        </Text>
                    )}
                </View>

                {/* Center Pane: Details */}
                <View style={styles.detailsContainer}>
                    <Text style={styles.companyName}>{invoice.companyName}</Text>
                    <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
                    <View style={styles.dateRow}>
                        <Calendar
                            color={colors.dark.textSecondary}
                            size={14}
                            strokeWidth={1.5}
                        />
                        <Text style={styles.dateText}>{invoice.date}</Text>
                    </View>
                </View>

                {/* Right Pane: Status & Amount */}
                <View style={styles.rightPane}>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        {statusStyle.showIcon && (
                            <CheckCircle2
                                color={statusStyle.text}
                                size={14}
                                strokeWidth={2}
                                style={{ marginRight: 4 }}
                            />
                        )}
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>
                            {invoice.status}
                        </Text>
                    </View>
                    <Text style={styles.amount}>
                        ${invoice.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </Text>
                </View>
            </TouchableOpacity>
        </Swipeable>
    );
}

export default function InvoicesScreen() {
    const router = useRouter();
    const { invoices, markAsPaid, deleteInvoice } = useInvoiceStore();
    const [activeFilter, setActiveFilter] = useState<FilterOption>("All");

    // Payment Modal State
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    // Details Modal State
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [showReminder, setShowReminder] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };

    // Confetti Ref
    const confettiRef = useRef<ConfettiRef>(null);

    // Filter invoices based on active filter
    const filteredInvoices = useMemo(() => {
        if (activeFilter === "All") return invoices;
        if (activeFilter === "Drafts") {
            return invoices.filter((inv) => inv.status === "Draft");
        }
        return invoices.filter((inv) => inv.status === activeFilter);
    }, [activeFilter, invoices]);

    const handleInvoicePress = (invoice: Invoice) => {
        setSelectedInvoice(invoice);

        switch (invoice.status) {
            case "Paid":
                setShowReminder(false);
                setDetailsModalVisible(true);
                break;
            case "Overdue":
                setShowReminder(true);
                setDetailsModalVisible(true);
                break;
            case "Draft":
                // Navigate to edit draft
                router.push(`/new-invoice?invoiceId=${invoice.id}`);
                break;
            case "Unpaid":
                setPaymentModalVisible(true);
                break;
        }
    };

    const handleConfirmPayment = () => {
        if (selectedInvoice) {
            // Update invoice status via store
            markAsPaid(selectedInvoice.id);

            setPaymentModalVisible(false);
            setSelectedInvoice(null);

            // Fire confetti
            setTimeout(() => {
                confettiRef.current?.fire();
            }, 500);
        }
    };

    const handleSendReminder = () => {
        console.log("Sending reminder for:", selectedInvoice?.invoiceNumber);
        setDetailsModalVisible(false);
        setSelectedInvoice(null);
    };

    const handleDelete = (invoice: Invoice) => {
        deleteInvoice(invoice.id);
    };

    const handleSwipeMarkAsPaid = (invoice: Invoice) => {
        markAsPaid(invoice.id);
        // Fire confetti
        setTimeout(() => {
            confettiRef.current?.fire();
        }, 300);
    };

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Invoices</Text>
                <TouchableOpacity style={styles.settingsButton}>
                    <SlidersHorizontal
                        color={colors.dark.text}
                        size={24}
                        strokeWidth={1.5}
                    />
                </TouchableOpacity>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScrollContent}
                >
                    {filters.map((filter) => (
                        <FilterChip
                            key={filter}
                            label={filter}
                            isActive={activeFilter === filter}
                            onPress={() => setActiveFilter(filter)}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* Invoice List */}
            <FlatList
                data={filteredInvoices}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <InvoiceCard
                        invoice={item}
                        onPress={handleInvoicePress}
                        onDelete={handleDelete}
                        onMarkAsPaid={handleSwipeMarkAsPaid}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={onRefresh}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dark.text} />
                }
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>No invoices found</Text>
                    </View>
                }
            />

            {/* Payment Modal */}
            <PaymentModal
                visible={paymentModalVisible}
                onClose={() => setPaymentModalVisible(false)}
                onConfirm={handleConfirmPayment}
                invoice={selectedInvoice}
            />

            {/* Details Modal (Paid/Overdue) */}
            <InvoiceDetailsModal
                visible={detailsModalVisible}
                onClose={() => setDetailsModalVisible(false)}
                invoice={selectedInvoice}
                showReminder={showReminder}
                onSendReminder={handleSendReminder}
                onMarkAsPaid={() => {
                    if (selectedInvoice) {
                        markAsPaid(selectedInvoice.id);
                        setDetailsModalVisible(false);
                        setSelectedInvoice(null);
                        // Fire confetti
                        setTimeout(() => {
                            confettiRef.current?.fire();
                        }, 300);
                    }
                }}
            />

            <Confetti ref={confettiRef} />
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
    headerTitle: {
        fontSize: 28,
        fontFamily: "Manrope_700Bold",
        color: colors.dark.text,
    },
    settingsButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.dark.surface,
        alignItems: "center",
        justifyContent: "center",
    },
    filterContainer: {
        marginBottom: 16,
    },
    filterScrollContent: {
        paddingHorizontal: 20,
        gap: 10,
    },
    filterChip: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: colors.dark.surface,
    },
    filterChipActive: {
        backgroundColor: colors.dark.primary,
    },
    filterChipText: {
        fontSize: 14,
        fontFamily: "Manrope_600SemiBold",
        color: colors.dark.text,
    },
    filterChipTextActive: {
        color: colors.dark.background,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    separator: {
        height: 12,
    },
    invoiceCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.dark.surface,
        borderRadius: 20,
        padding: 16,
    },
    logoContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
        overflow: "hidden",
    },
    logoImage: {
        width: 32,
        height: 32,
    },
    logoFallback: {
        fontSize: 20,
        fontFamily: "Manrope_700Bold",
        color: "#FFFFFF",
    },
    detailsContainer: {
        flex: 1,
        justifyContent: "center",
    },
    companyName: {
        fontSize: 16,
        fontFamily: "Manrope_600SemiBold",
        color: colors.dark.text,
        marginBottom: 2,
    },
    invoiceNumber: {
        fontSize: 13,
        fontFamily: "Manrope_500Medium",
        color: colors.dark.textSecondary,
        marginBottom: 6,
    },
    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    dateText: {
        fontSize: 13,
        fontFamily: "Manrope_500Medium",
        color: colors.dark.textSecondary,
    },
    rightPane: {
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 8,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontFamily: "Manrope_600SemiBold",
    },
    amount: {
        fontSize: 17,
        fontFamily: "Manrope_700Bold",
        color: colors.dark.text,
    },
    emptyState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: 16,
        fontFamily: "Manrope_500Medium",
        color: colors.dark.textSecondary,
    },
    // Shimmer styles
    shimmerContainer: {
        position: "absolute",
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.1)",
        overflow: "hidden",
    },
    shimmerGradient: {
        width: 64,
        height: 32,
        backgroundColor: "rgba(255,255,255,0.2)",
    },
    // Swipe action styles
    swipeActionLeft: {
        backgroundColor: "#4ADE80",
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        borderRadius: 20,
        marginRight: 12,
    },
    swipeActionRight: {
        backgroundColor: "#F87171",
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        borderRadius: 20,
        marginLeft: 12,
    },
    swipeActionText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontFamily: "Manrope_600SemiBold",
        marginTop: 4,
    },
});
