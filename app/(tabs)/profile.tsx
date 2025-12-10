import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { SlidersHorizontal, Calendar, CheckCircle2 } from "lucide-react-native";
import { useState, useMemo } from "react";
import { Image } from "expo-image";
import colors from "@/constants/colors";

// Type definitions
type InvoiceStatus = "Paid" | "Unpaid" | "Overdue" | "Draft";

interface Invoice {
    id: string;
    companyName: string;
    invoiceNumber: string;
    date: string;
    amount: number;
    status: InvoiceStatus;
    domain?: string;
    logoColor: string;
}

// Mock invoice data
const invoices: Invoice[] = [
    {
        id: "1",
        companyName: "Acme Corp",
        invoiceNumber: "#INV-1001",
        date: "24 Oct, 2023",
        amount: 1200.0,
        status: "Paid",
        domain: "acme.com",
        logoColor: "#6EE798",
    },
    {
        id: "2",
        companyName: "Globex Inc.",
        invoiceNumber: "#INV-1002",
        date: "01 Nov, 2023",
        amount: 850.0,
        status: "Unpaid",
        domain: "globex.com",
        logoColor: "#FFD700",
    },
    {
        id: "3",
        companyName: "Soylent Corp",
        invoiceNumber: "#INV-1003",
        date: "15 Oct, 2023",
        amount: 2500.0,
        status: "Overdue",
        domain: "soylent.com",
        logoColor: "#FF6B6B",
    },
    {
        id: "4",
        companyName: "Initech",
        invoiceNumber: "#INV-1004",
        date: "05 Nov, 2023",
        amount: 0.0,
        status: "Draft",
        domain: "initech.com",
        logoColor: "#9CA3AF",
    },
    {
        id: "5",
        companyName: "Umbrella Corp",
        invoiceNumber: "#INV-1005",
        date: "10 Nov, 2023",
        amount: 3400.0,
        status: "Paid",
        domain: "umbrellacorp.com",
        logoColor: "#E74C3C",
    },
    {
        id: "6",
        companyName: "Wonka Industries",
        invoiceNumber: "#INV-1006",
        date: "18 Nov, 2023",
        amount: 1750.0,
        status: "Unpaid",
        domain: "wonka.com",
        logoColor: "#9B59B6",
    },
];

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

// Invoice card component
function InvoiceCard({ invoice }: { invoice: Invoice }) {
    const statusStyle = getStatusStyle(invoice.status);
    const [imageError, setImageError] = useState(false);
    const logoUrl = invoice.domain
        ? `https://logo.clearbit.com/${invoice.domain}`
        : null;

    return (
        <TouchableOpacity style={styles.invoiceCard} activeOpacity={0.7}>
            {/* Left Pane: Logo */}
            <View
                style={[styles.logoContainer, { backgroundColor: invoice.logoColor }]}
            >
                {logoUrl && !imageError ? (
                    <Image
                        source={{ uri: logoUrl }}
                        style={styles.logoImage}
                        contentFit="contain"
                        onError={() => setImageError(true)}
                    />
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
    );
}

export default function InvoicesScreen() {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState<FilterOption>("All");

    // Filter invoices based on active filter
    const filteredInvoices = useMemo(() => {
        if (activeFilter === "All") return invoices;
        if (activeFilter === "Drafts") {
            return invoices.filter((inv) => inv.status === "Draft");
        }
        return invoices.filter((inv) => inv.status === activeFilter);
    }, [activeFilter]);

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
                renderItem={({ item }) => <InvoiceCard invoice={item} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>No invoices found</Text>
                    </View>
                }
            />
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
});
