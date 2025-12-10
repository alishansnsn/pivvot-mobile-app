import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, Search, Plus } from "lucide-react-native";
import { useState } from "react";
import colors from "@/constants/colors";
import ClientCard from "@/components/ClientCard";

// Mock Data
const clients = [
    {
        id: "1",
        companyName: "Acme Corp",
        domain: "acme.com",
        logoColor: "#6EE798",
        totalBilled: 12500,
        activeInvoices: 3,
    },
    {
        id: "2",
        companyName: "Globex Inc.",
        domain: "globex.com",
        logoColor: "#FFD700",
        totalBilled: 8500,
        activeInvoices: 1,
    },
    {
        id: "3",
        companyName: "Soylent Corp",
        domain: "soylent.com",
        logoColor: "#FF6B6B",
        totalBilled: 25000,
        activeInvoices: 0,
    },
    {
        id: "4",
        companyName: "Initech",
        domain: "initech.com",
        logoColor: "#9CA3AF",
        totalBilled: 0,
        activeInvoices: 0,
    },
    {
        id: "5",
        companyName: "Umbrella Corp",
        domain: "umbrellacorp.com",
        logoColor: "#E74C3C",
        totalBilled: 50000,
        activeInvoices: 2,
    },
];

export default function ClientsScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredClients = clients.filter((client) =>
        client.companyName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => router.back()}
                >
                    <ChevronLeft color={colors.dark.text} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Clients</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Plus color={colors.dark.text} size={24} />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Search color={colors.dark.textSecondary} size={20} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search clients..."
                    placeholderTextColor={colors.dark.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Client List */}
            <FlatList
                data={filteredClients}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ClientCard client={item} onPress={() => { }} />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>No clients found</Text>
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
        fontSize: 20,
        fontFamily: "Manrope_700Bold",
        color: colors.dark.text,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.dark.surface,
        alignItems: "center",
        justifyContent: "center",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.dark.surface,
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 50,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        color: colors.dark.text,
        fontFamily: "Manrope_500Medium",
        fontSize: 16,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    emptyState: {
        paddingTop: 40,
        alignItems: "center",
    },
    emptyStateText: {
        color: colors.dark.textSecondary,
        fontFamily: "Manrope_500Medium",
        fontSize: 16,
    },
});
