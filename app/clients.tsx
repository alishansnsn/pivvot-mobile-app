import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TextInput,
    TouchableOpacity,
    RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, Search, Plus } from "lucide-react-native";
import { useState } from "react";
import colors from "@/constants/colors";
import ClientCard from "@/components/ClientCard";
import { useClientStore, Client } from "@/store/clientStore";
import AddClientModal from "@/components/AddClientModal";
import ClientDetailsModal from "@/components/ClientDetailsModal";
import { Toast } from '@/components/ui/Toast';

export default function ClientsScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const clients = useClientStore((state) => state.clients);
    const [refreshing, setRefreshing] = useState(false);
    const [showAddClient, setShowAddClient] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };

    const handleSaveNewClient = (newClient: Client) => {
        setShowAddClient(false);
        setToastMessage("Client added successfully");
        setToastVisible(true);
    };

    const handleClientPress = (client: Client) => {
        setSelectedClient(client);
    };

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
                <TouchableOpacity style={styles.iconButton} onPress={() => setShowAddClient(true)}>
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
                    <ClientCard client={item} onPress={() => handleClientPress(item)} />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={onRefresh}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dark.text} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>No clients found</Text>
                    </View>
                }
            />
            <AddClientModal
                visible={showAddClient}
                onClose={() => setShowAddClient(false)}
                onSave={handleSaveNewClient}
            />

            <ClientDetailsModal
                visible={!!selectedClient}
                client={selectedClient}
                onClose={() => setSelectedClient(null)}
            />

            <Toast
                visible={toastVisible}
                message={toastMessage}
                onHide={() => setToastVisible(false)}
            />
        </SafeAreaView >
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
