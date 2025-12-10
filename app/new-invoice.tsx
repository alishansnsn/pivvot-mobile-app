import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Platform,
    Modal,
    Pressable,
    KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, ChevronDown, Plus, Pencil, Check, X } from "lucide-react-native";
import colors from "@/constants/colors";

// Types
interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unit: string;
    rate: number;
}

interface Client {
    id: string;
    name: string;
}

// Mock clients data
const CLIENTS: Client[] = [
    { id: "1", name: "Acme Corp" },
    { id: "2", name: "Tech Startup Inc" },
    { id: "3", name: "Design Studio" },
    { id: "4", name: "Marketing Agency" },
    { id: "5", name: "Consulting Group" },
];

// Date options for picker
const DATE_OPTIONS = [
    "01 Mar, 2024",
    "05 Mar, 2024",
    "10 Mar, 2024",
    "15 Mar, 2024",
    "20 Mar, 2024",
    "26 Mar, 2024",
    "01 Apr, 2024",
    "05 Apr, 2024",
    "09 Apr, 2024",
    "15 Apr, 2024",
    "20 Apr, 2024",
    "30 Apr, 2024",
];

export default function NewInvoiceScreen() {
    const router = useRouter();

    // State
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [issuedDate, setIssuedDate] = useState("26 Mar, 2024");
    const [dueDate, setDueDate] = useState("09 Apr, 2024");
    const [notes, setNotes] = useState("");
    const [isNotesSaved, setIsNotesSaved] = useState(true);
    const [items, setItems] = useState<InvoiceItem[]>([
        { id: "1", description: "Web Design Project", quantity: 10, unit: "hrs", rate: 100 },
        { id: "2", description: "Hosting Setup", quantity: 1, unit: "unit", rate: 150 },
    ]);

    // Modal states
    const [showClientPicker, setShowClientPicker] = useState(false);
    const [showIssuedDatePicker, setShowIssuedDatePicker] = useState(false);
    const [showDueDatePicker, setShowDueDatePicker] = useState(false);
    const [editingItem, setEditingItem] = useState<InvoiceItem | null>(null);
    const [isAddingNewItem, setIsAddingNewItem] = useState(false);

    // Temp state for editing item
    const [tempDescription, setTempDescription] = useState("");
    const [tempQuantity, setTempQuantity] = useState("");
    const [tempRate, setTempRate] = useState("");

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const taxRate = 0.10;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    const handleAddItem = () => {
        setTempDescription("");
        setTempQuantity("1");
        setTempRate("");
        setIsAddingNewItem(true);
    };

    const handleSaveNewItem = () => {
        if (tempDescription.trim() && parseFloat(tempRate) > 0) {
            const newItem: InvoiceItem = {
                id: Date.now().toString(),
                description: tempDescription.trim(),
                quantity: parseFloat(tempQuantity) || 1,
                unit: "hrs",
                rate: parseFloat(tempRate) || 0,
            };
            setItems([...items, newItem]);
        }
        setIsAddingNewItem(false);
    };

    const handleEditItem = (item: InvoiceItem) => {
        setEditingItem(item);
        setTempDescription(item.description);
        setTempQuantity(item.quantity.toString());
        setTempRate(item.rate.toString());
    };

    const handleSaveEditItem = () => {
        if (editingItem && tempDescription.trim()) {
            setItems(items.map(item =>
                item.id === editingItem.id
                    ? {
                        ...item,
                        description: tempDescription.trim(),
                        quantity: parseFloat(tempQuantity) || 1,
                        rate: parseFloat(tempRate) || 0,
                    }
                    : item
            ));
        }
        setEditingItem(null);
    };

    const handleDeleteItem = () => {
        if (editingItem) {
            setItems(items.filter(item => item.id !== editingItem.id));
        }
        setEditingItem(null);
    };

    const handleNotesChange = (text: string) => {
        setNotes(text);
        setIsNotesSaved(false);
    };

    const handleSaveNotes = () => {
        setIsNotesSaved(true);
        // Could save to backend here
    };

    const handleSave = () => {
        console.log("Saving invoice...");
        router.back();
    };

    const handleSendInvoice = () => {
        console.log("Sending invoice...");
    };

    // Dropdown Picker Modal Component
    const PickerModal = ({
        visible,
        onClose,
        title,
        options,
        onSelect,
        selectedValue
    }: {
        visible: boolean;
        onClose: () => void;
        title: string;
        options: string[];
        onSelect: (value: string) => void;
        selectedValue?: string;
    }) => (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X color={colors.dark.textSecondary} size={24} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalScroll}>
                        {options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.modalOption,
                                    selectedValue === option && styles.modalOptionSelected
                                ]}
                                onPress={() => {
                                    onSelect(option);
                                    onClose();
                                }}
                            >
                                <Text style={[
                                    styles.modalOptionText,
                                    selectedValue === option && styles.modalOptionTextSelected
                                ]}>
                                    {option}
                                </Text>
                                {selectedValue === option && (
                                    <Check color={colors.dark.primary} size={20} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </Pressable>
        </Modal>
    );

    // Client Picker Modal
    const ClientPickerModal = () => (
        <Modal
            visible={showClientPicker}
            transparent
            animationType="fade"
            onRequestClose={() => setShowClientPicker(false)}
        >
            <Pressable style={styles.modalOverlay} onPress={() => setShowClientPicker(false)}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Client</Text>
                        <TouchableOpacity onPress={() => setShowClientPicker(false)}>
                            <X color={colors.dark.textSecondary} size={24} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalScroll}>
                        {CLIENTS.map((client) => (
                            <TouchableOpacity
                                key={client.id}
                                style={[
                                    styles.modalOption,
                                    selectedClient?.id === client.id && styles.modalOptionSelected
                                ]}
                                onPress={() => {
                                    setSelectedClient(client);
                                    setShowClientPicker(false);
                                }}
                            >
                                <Text style={[
                                    styles.modalOptionText,
                                    selectedClient?.id === client.id && styles.modalOptionTextSelected
                                ]}>
                                    {client.name}
                                </Text>
                                {selectedClient?.id === client.id && (
                                    <Check color={colors.dark.primary} size={20} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </Pressable>
        </Modal>
    );

    // Item Editor Component (Expanded View)
    const ItemEditor = ({
        isNew = false,
        onSave,
        onCancel,
        onDelete
    }: {
        isNew?: boolean;
        onSave: () => void;
        onCancel: () => void;
        onDelete?: () => void;
    }) => (
        <View style={styles.itemEditorContainer}>
            <View style={styles.itemEditorHeader}>
                <Text style={styles.itemEditorTitle}>
                    {isNew ? "Add New Item" : "Edit Item"}
                </Text>
                <View style={styles.itemEditorActions}>
                    {!isNew && onDelete && (
                        <TouchableOpacity
                            style={styles.itemDeleteButton}
                            onPress={onDelete}
                        >
                            <Text style={styles.itemDeleteText}>Delete</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.itemEditorField}>
                <Text style={styles.itemEditorLabel}>Description</Text>
                <TextInput
                    style={styles.itemEditorInput}
                    value={tempDescription}
                    onChangeText={setTempDescription}
                    placeholder="Enter item description"
                    placeholderTextColor={colors.dark.textTertiary}
                />
            </View>

            <View style={styles.itemEditorRow}>
                <View style={[styles.itemEditorField, { flex: 1 }]}>
                    <Text style={styles.itemEditorLabel}>Quantity</Text>
                    <TextInput
                        style={styles.itemEditorInput}
                        value={tempQuantity}
                        onChangeText={setTempQuantity}
                        placeholder="1"
                        placeholderTextColor={colors.dark.textTertiary}
                        keyboardType="numeric"
                    />
                </View>
                <View style={[styles.itemEditorField, { flex: 1, marginLeft: 12 }]}>
                    <Text style={styles.itemEditorLabel}>Rate ($)</Text>
                    <TextInput
                        style={styles.itemEditorInput}
                        value={tempRate}
                        onChangeText={setTempRate}
                        placeholder="0.00"
                        placeholderTextColor={colors.dark.textTertiary}
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <View style={styles.itemEditorButtons}>
                <TouchableOpacity
                    style={styles.itemCancelButton}
                    onPress={onCancel}
                >
                    <Text style={styles.itemCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.itemSaveButton}
                    onPress={onSave}
                >
                    <Check color={colors.dark.background} size={20} />
                    <Text style={styles.itemSaveText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <ChevronLeft color={colors.dark.text} size={28} strokeWidth={2} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Invoice</Text>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    activeOpacity={0.7}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Client Details Section */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Client Details</Text>
                            <TouchableOpacity activeOpacity={0.7}>
                                <Text style={styles.addNewClient}>Add New Client</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={styles.dropdown}
                            activeOpacity={0.7}
                            onPress={() => setShowClientPicker(true)}
                        >
                            <Text style={selectedClient ? styles.dropdownText : styles.dropdownPlaceholder}>
                                {selectedClient?.name || "Select Client"}
                            </Text>
                            <ChevronDown color={colors.dark.textSecondary} size={20} strokeWidth={2} />
                        </TouchableOpacity>
                    </View>

                    {/* Date Section */}
                    <View style={styles.dateRow}>
                        <View style={styles.dateCard}>
                            <Text style={styles.dateLabel}>Issued Date:</Text>
                            <TouchableOpacity
                                style={styles.dateDropdown}
                                activeOpacity={0.7}
                                onPress={() => setShowIssuedDatePicker(true)}
                            >
                                <Text style={styles.dateText}>{issuedDate}</Text>
                                <ChevronDown color={colors.dark.textSecondary} size={18} strokeWidth={2} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.dateCard}>
                            <Text style={styles.dateLabel}>Due Date:</Text>
                            <TouchableOpacity
                                style={styles.dateDropdown}
                                activeOpacity={0.7}
                                onPress={() => setShowDueDatePicker(true)}
                            >
                                <Text style={styles.dateText}>{dueDate}</Text>
                                <ChevronDown color={colors.dark.textSecondary} size={18} strokeWidth={2} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Items Section */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Items</Text>

                        {items.map((item) => (
                            editingItem?.id === item.id ? (
                                <ItemEditor
                                    key={item.id}
                                    onSave={handleSaveEditItem}
                                    onCancel={() => setEditingItem(null)}
                                    onDelete={handleDeleteItem}
                                />
                            ) : (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.itemRow}
                                    activeOpacity={0.7}
                                    onPress={() => handleEditItem(item)}
                                >
                                    <Text style={styles.itemText}>
                                        {item.description} - {item.quantity} {item.unit} - ${(item.quantity * item.rate).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                    </Text>
                                    <Pencil color={colors.dark.textSecondary} size={18} strokeWidth={2} />
                                </TouchableOpacity>
                            )
                        ))}

                        {isAddingNewItem ? (
                            <ItemEditor
                                isNew
                                onSave={handleSaveNewItem}
                                onCancel={() => setIsAddingNewItem(false)}
                            />
                        ) : (
                            <TouchableOpacity
                                style={styles.addItemButton}
                                onPress={handleAddItem}
                                activeOpacity={0.7}
                            >
                                <View style={styles.addItemIcon}>
                                    <Plus color={colors.dark.background} size={18} strokeWidth={3} />
                                </View>
                                <Text style={styles.addItemText}>Add Item</Text>
                            </TouchableOpacity>
                        )}

                        {/* Summary */}
                        <View style={styles.summarySection}>
                            <Text style={styles.summaryTitle}>Summary</Text>

                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Subtotal:</Text>
                                <Text style={styles.summaryValue}>
                                    ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </Text>
                            </View>

                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Tax (10%):</Text>
                                <Text style={styles.summaryValue}>
                                    ${tax.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </Text>
                            </View>

                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Total:</Text>
                                <Text style={styles.totalValue}>
                                    ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Notes Section */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Notes</Text>
                        <View style={styles.notesContainer}>
                            <TextInput
                                style={styles.notesInput}
                                placeholder="Add notes or terms..."
                                placeholderTextColor={colors.dark.textSecondary}
                                value={notes}
                                onChangeText={handleNotesChange}
                                multiline
                                textAlignVertical="top"
                            />
                            <TouchableOpacity
                                style={[
                                    styles.notesSaveButton,
                                    isNotesSaved && styles.notesSaveButtonDisabled
                                ]}
                                onPress={handleSaveNotes}
                                disabled={isNotesSaved}
                            >
                                <Check
                                    color={isNotesSaved ? colors.dark.textTertiary : colors.dark.primary}
                                    size={22}
                                    strokeWidth={2.5}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Send Invoice Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendInvoice}
                    activeOpacity={0.8}
                >
                    <Text style={styles.sendButtonText}>Send Invoice</Text>
                </TouchableOpacity>
            </View>

            {/* Modals */}
            <ClientPickerModal />

            <PickerModal
                visible={showIssuedDatePicker}
                onClose={() => setShowIssuedDatePicker(false)}
                title="Select Issued Date"
                options={DATE_OPTIONS}
                onSelect={setIssuedDate}
                selectedValue={issuedDate}
            />

            <PickerModal
                visible={showDueDatePicker}
                onClose={() => setShowDueDatePicker(false)}
                title="Select Due Date"
                options={DATE_OPTIONS}
                onSelect={setDueDate}
                selectedValue={dueDate}
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
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: "Manrope_600SemiBold",
        color: colors.dark.text,
    },
    saveButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    saveButtonText: {
        fontSize: 16,
        fontFamily: "Manrope_600SemiBold",
        color: colors.dark.primary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 24,
        gap: 16,
    },
    card: {
        backgroundColor: colors.dark.surface,
        borderRadius: 16,
        padding: 16,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: "Manrope_600SemiBold",
        color: colors.dark.text,
    },
    addNewClient: {
        fontSize: 14,
        fontFamily: "Manrope_600SemiBold",
        color: colors.dark.primary,
    },
    dropdown: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.dark.surfaceElevated,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: colors.dark.border,
    },
    dropdownPlaceholder: {
        fontSize: 15,
        fontFamily: "Manrope_400Regular",
        color: colors.dark.textSecondary,
    },
    dropdownText: {
        fontSize: 15,
        fontFamily: "Manrope_500Medium",
        color: colors.dark.text,
    },
    dateRow: {
        flexDirection: "row",
        gap: 12,
    },
    dateCard: {
        flex: 1,
        backgroundColor: colors.dark.surface,
        borderRadius: 16,
        padding: 16,
    },
    dateLabel: {
        fontSize: 14,
        fontFamily: "Manrope_400Regular",
        color: colors.dark.textSecondary,
        marginBottom: 8,
    },
    dateDropdown: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.dark.surfaceElevated,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: colors.dark.border,
    },
    dateText: {
        fontSize: 14,
        fontFamily: "Manrope_500Medium",
        color: colors.dark.text,
    },
    itemRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.dark.surfaceElevated,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginTop: 12,
        borderWidth: 1,
        borderColor: colors.dark.border,
    },
    itemText: {
        fontSize: 14,
        fontFamily: "Manrope_500Medium",
        color: colors.dark.text,
        flex: 1,
        marginRight: 12,
    },
    addItemButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 16,
        gap: 10,
    },
    addItemIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.dark.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    addItemText: {
        fontSize: 15,
        fontFamily: "Manrope_600SemiBold",
        color: colors.dark.primary,
    },
    // Item Editor Styles
    itemEditorContainer: {
        backgroundColor: colors.dark.surfaceElevated,
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
        borderWidth: 1,
        borderColor: colors.dark.primary,
    },
    itemEditorHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    itemEditorTitle: {
        fontSize: 14,
        fontFamily: "Manrope_600SemiBold",
        color: colors.dark.primary,
    },
    itemEditorActions: {
        flexDirection: "row",
        gap: 12,
    },
    itemDeleteButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    itemDeleteText: {
        fontSize: 14,
        fontFamily: "Manrope_500Medium",
        color: colors.dark.error,
    },
    itemEditorField: {
        marginBottom: 12,
    },
    itemEditorLabel: {
        fontSize: 12,
        fontFamily: "Manrope_500Medium",
        color: colors.dark.textSecondary,
        marginBottom: 6,
    },
    itemEditorInput: {
        backgroundColor: colors.dark.surface,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        fontFamily: "Manrope_500Medium",
        color: colors.dark.text,
        borderWidth: 1,
        borderColor: colors.dark.border,
    },
    itemEditorRow: {
        flexDirection: "row",
    },
    itemEditorButtons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 12,
        marginTop: 8,
    },
    itemCancelButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: colors.dark.surface,
    },
    itemCancelText: {
        fontSize: 14,
        fontFamily: "Manrope_600SemiBold",
        color: colors.dark.textSecondary,
    },
    itemSaveButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: colors.dark.primary,
    },
    itemSaveText: {
        fontSize: 14,
        fontFamily: "Manrope_600SemiBold",
        color: colors.dark.background,
    },
    summarySection: {
        marginTop: 24,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: colors.dark.border,
    },
    summaryTitle: {
        fontSize: 16,
        fontFamily: "Manrope_600SemiBold",
        color: colors.dark.text,
        marginBottom: 12,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        fontFamily: "Manrope_400Regular",
        color: colors.dark.textSecondary,
    },
    summaryValue: {
        fontSize: 14,
        fontFamily: "Manrope_600SemiBold",
        color: colors.dark.text,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 18,
        fontFamily: "Manrope_700Bold",
        color: colors.dark.primary,
    },
    totalValue: {
        fontSize: 22,
        fontFamily: "Manrope_700Bold",
        color: colors.dark.primary,
    },
    // Notes Styles
    notesContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: 12,
    },
    notesInput: {
        flex: 1,
        backgroundColor: colors.dark.surfaceElevated,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 14,
        fontFamily: "Manrope_400Regular",
        color: colors.dark.text,
        minHeight: 48,
        borderWidth: 1,
        borderColor: colors.dark.border,
    },
    notesSaveButton: {
        width: 44,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
        backgroundColor: colors.dark.surfaceElevated,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.dark.border,
    },
    notesSaveButtonDisabled: {
        opacity: 0.5,
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: Platform.OS === "ios" ? 8 : 16,
    },
    sendButton: {
        backgroundColor: colors.dark.primary,
        borderRadius: 28,
        paddingVertical: 18,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: colors.dark.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    sendButtonText: {
        fontSize: 16,
        fontFamily: "Manrope_700Bold",
        color: colors.dark.background,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContent: {
        backgroundColor: colors.dark.surface,
        borderRadius: 20,
        width: "100%",
        maxHeight: "70%",
        overflow: "hidden",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.dark.border,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: "Manrope_600SemiBold",
        color: colors.dark.text,
    },
    modalScroll: {
        maxHeight: 400,
    },
    modalOption: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.dark.border,
    },
    modalOptionSelected: {
        backgroundColor: colors.dark.surfaceElevated,
    },
    modalOptionText: {
        fontSize: 16,
        fontFamily: "Manrope_500Medium",
        color: colors.dark.text,
    },
    modalOptionTextSelected: {
        color: colors.dark.primary,
        fontFamily: "Manrope_600SemiBold",
    },
});
