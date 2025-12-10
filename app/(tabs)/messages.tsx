import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    Image,
    TouchableOpacity,
    Modal,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Edit, X, Send, ChevronDown } from 'lucide-react-native';
import colors from '@/constants/colors';

// Dummy Data
const INITIAL_MESSAGES = [
    {
        id: '1',
        name: 'Marie',
        message: 'Hey, just checking in on the project...',
        time: '10:30 AM',
        unread: 2,
        avatar: 'https://i.pravatar.cc/150?u=marie',
    },
    {
        id: '2',
        name: 'James',
        message: 'The new design looks great! Let\'s proceed...',
        time: 'Yesterday',
        unread: 0,
        avatar: 'https://i.pravatar.cc/150?u=james',
    },
    {
        id: '3',
        name: 'Acme Corp',
        message: 'Invoice #1001 has been paid.',
        time: '24 Oct',
        unread: 0,
        avatar: 'https://ui-avatars.com/api/?name=Acme+Corp&background=0D8ABC&color=fff',
        isCompany: true,
    },
    {
        id: '4',
        name: 'John Doe',
        message: 'Can we schedule a call for tomorrow?',
        time: '20 Oct',
        unread: 0,
        avatar: '',
    },
];

// Contacts for composing new message
const CONTACTS = [
    { id: 'c1', name: 'Sarah Wilson', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    { id: 'c2', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?u=mike' },
    { id: 'c3', name: 'Emily Chen', avatar: 'https://i.pravatar.cc/150?u=emily' },
    { id: 'c4', name: 'David Brown', avatar: 'https://i.pravatar.cc/150?u=david' },
    { id: 'c5', name: 'Lisa Anderson', avatar: 'https://i.pravatar.cc/150?u=lisa' },
];

type MessageItem = {
    id: string;
    name: string;
    message: string;
    time: string;
    unread: number;
    avatar: string;
    isCompany?: boolean;
};

type Contact = {
    id: string;
    name: string;
    avatar: string;
};

export default function MessagesScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [isComposeModalVisible, setIsComposeModalVisible] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [contactSearch, setContactSearch] = useState('');
    const [showContactDropdown, setShowContactDropdown] = useState(false);
    const searchInputRef = useRef<TextInput>(null);

    // Filter messages based on search query
    const filteredMessages = messages.filter(
        (msg) =>
            msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter contacts based on search
    const filteredContacts = CONTACTS.filter((contact) =>
        contact.name.toLowerCase().includes(contactSearch.toLowerCase())
    );

    // Handle search button press - focuses the search input
    const handleSearchPress = () => {
        searchInputRef.current?.focus();
    };

    // Handle compose new message
    const handleComposePress = () => {
        setIsComposeModalVisible(true);
        setSelectedContact(null);
        setNewMessage('');
        setContactSearch('');
    };

    // Handle sending the new message
    const handleSendMessage = () => {
        if (!selectedContact || !newMessage.trim()) return;

        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });

        const newConversation: MessageItem = {
            id: Date.now().toString(),
            name: selectedContact.name,
            message: newMessage.trim(),
            time: timeString,
            unread: 0,
            avatar: selectedContact.avatar,
        };

        // Add new conversation to the top of the list
        setMessages([newConversation, ...messages]);

        // Close modal and reset state
        setIsComposeModalVisible(false);
        setSelectedContact(null);
        setNewMessage('');
        setContactSearch('');
        Keyboard.dismiss();
    };

    // Handle contact selection
    const handleSelectContact = (contact: Contact) => {
        setSelectedContact(contact);
        setContactSearch(contact.name);
        setShowContactDropdown(false);
    };

    // Handle conversation press - navigate to chat
    const handleConversationPress = (item: MessageItem) => {
        // Clear unread count when opening chat
        setMessages((prev) =>
            prev.map((msg) =>
                msg.id === item.id ? { ...msg, unread: 0 } : msg
            )
        );
        router.push({
            pathname: '/chat',
            params: {
                id: item.id,
                name: item.name,
                avatar: item.avatar,
            },
        });
    };

    // Render Item Component
    const renderItem = ({ item }: { item: MessageItem }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => handleConversationPress(item)}
        >
            {/* 1. Avatar */}
            <View style={styles.avatarContainer}>
                {item.avatar ? (
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                ) : (
                    // Fallback Initials Avatar
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <Text style={styles.avatarInitials}>
                            {item.name.substring(0, 2).toUpperCase()}
                        </Text>
                    </View>
                )}
            </View>

            {/* 2. Main Content */}
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>

                <View style={styles.messageRow}>
                    <Text style={styles.messagePreview} numberOfLines={1}>
                        {item.message}
                    </Text>

                    {/* 3. Unread Badge (Conditional) */}
                    {item.unread > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{item.unread}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    // Render contact item for dropdown
    const renderContactItem = ({ item }: { item: Contact }) => (
        <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleSelectContact(item)}
            activeOpacity={0.7}
        >
            <Image source={{ uri: item.avatar }} style={styles.contactAvatar} />
            <Text style={styles.contactName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Messages</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.iconBtn} onPress={handleSearchPress}>
                        <Search size={24} color={colors.dark.primary} strokeWidth={2} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn} onPress={handleComposePress}>
                        <Edit size={24} color={colors.dark.primary} strokeWidth={2} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Search size={20} color={colors.dark.textSecondary} style={styles.searchIcon} />
                <TextInput
                    ref={searchInputRef}
                    style={styles.searchInput}
                    placeholder="Search messages..."
                    placeholderTextColor={colors.dark.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <X size={20} color={colors.dark.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* List */}
            <FlatList
                data={filteredMessages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No messages found</Text>
                    </View>
                }
            />

            {/* Compose Message Modal */}
            <Modal
                visible={isComposeModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setIsComposeModalVisible(false)}
            >
                <KeyboardAvoidingView
                    style={styles.modalContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setIsComposeModalVisible(false)}>
                            <X size={24} color={colors.dark.text} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>New Message</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    {/* To: Field with Contact Selector */}
                    <View style={styles.toFieldContainer}>
                        <Text style={styles.toLabel}>To:</Text>
                        <View style={styles.contactInputContainer}>
                            <TextInput
                                style={styles.contactInput}
                                placeholder="Search contacts..."
                                placeholderTextColor={colors.dark.textSecondary}
                                value={contactSearch}
                                onChangeText={(text) => {
                                    setContactSearch(text);
                                    setShowContactDropdown(text.length > 0);
                                    if (selectedContact && text !== selectedContact.name) {
                                        setSelectedContact(null);
                                    }
                                }}
                                onFocus={() => setShowContactDropdown(true)}
                            />
                            <ChevronDown size={20} color={colors.dark.textSecondary} />
                        </View>
                    </View>

                    {/* Contact Dropdown */}
                    {showContactDropdown && filteredContacts.length > 0 && (
                        <View style={styles.contactDropdown}>
                            <FlatList
                                data={filteredContacts}
                                renderItem={renderContactItem}
                                keyExtractor={(item) => item.id}
                                style={styles.contactList}
                                keyboardShouldPersistTaps="handled"
                            />
                        </View>
                    )}

                    {/* Message Input */}
                    <View style={styles.messageInputContainer}>
                        <TextInput
                            style={styles.messageInput}
                            placeholder="Type your message..."
                            placeholderTextColor={colors.dark.textSecondary}
                            value={newMessage}
                            onChangeText={setNewMessage}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Send Button */}
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            (!selectedContact || !newMessage.trim()) && styles.sendButtonDisabled,
                        ]}
                        onPress={handleSendMessage}
                        disabled={!selectedContact || !newMessage.trim()}
                        activeOpacity={0.8}
                    >
                        <Send size={20} color={colors.dark.background} />
                        <Text style={styles.sendButtonText}>Send Message</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark.background,
        paddingHorizontal: 20,
    },
    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingTop: 8,
    },
    title: {
        fontSize: 32,
        fontFamily: 'Manrope_700Bold',
        color: colors.dark.text,
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 16,
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.dark.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Search Bar
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.dark.surface,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 50,
        marginBottom: 24,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        color: colors.dark.text,
        fontSize: 16,
        fontFamily: 'Manrope_500Medium',
    },
    // List Item
    listContent: {
        paddingBottom: 40,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: colors.dark.surface,
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: 16,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.dark.surfaceElevated,
    },
    avatarPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitials: {
        color: colors.dark.text,
        fontSize: 18,
        fontFamily: 'Manrope_600SemiBold',
    },
    contentContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    name: {
        color: colors.dark.text,
        fontSize: 16,
        fontFamily: 'Manrope_700Bold',
    },
    time: {
        color: colors.dark.textSecondary,
        fontSize: 12,
        fontFamily: 'Manrope_500Medium',
    },
    messageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    messagePreview: {
        color: colors.dark.textSecondary,
        fontSize: 14,
        fontFamily: 'Manrope_500Medium',
        flex: 1,
        marginRight: 8,
    },
    badge: {
        backgroundColor: colors.dark.primary,
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    badgeText: {
        color: colors.dark.background,
        fontSize: 12,
        fontFamily: 'Manrope_700Bold',
    },
    // Empty State
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyText: {
        color: colors.dark.textSecondary,
        fontSize: 16,
        fontFamily: 'Manrope_500Medium',
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: colors.dark.background,
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.dark.border,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Manrope_700Bold',
        color: colors.dark.text,
    },
    // To Field
    toFieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.dark.border,
    },
    toLabel: {
        fontSize: 16,
        fontFamily: 'Manrope_600SemiBold',
        color: colors.dark.textSecondary,
        marginRight: 12,
    },
    contactInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.dark.surface,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
    },
    contactInput: {
        flex: 1,
        color: colors.dark.text,
        fontSize: 16,
        fontFamily: 'Manrope_500Medium',
    },
    // Contact Dropdown
    contactDropdown: {
        backgroundColor: colors.dark.surface,
        borderRadius: 12,
        maxHeight: 200,
        marginTop: 8,
    },
    contactList: {
        padding: 8,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    contactAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
    },
    contactName: {
        fontSize: 15,
        fontFamily: 'Manrope_600SemiBold',
        color: colors.dark.text,
    },
    // Message Input
    messageInputContainer: {
        flex: 1,
        marginTop: 16,
    },
    messageInput: {
        flex: 1,
        backgroundColor: colors.dark.surface,
        borderRadius: 16,
        padding: 16,
        color: colors.dark.text,
        fontSize: 16,
        fontFamily: 'Manrope_500Medium',
        minHeight: 150,
    },
    // Send Button
    sendButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.dark.primary,
        borderRadius: 16,
        paddingVertical: 16,
        marginVertical: 20,
        gap: 8,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    sendButtonText: {
        fontSize: 16,
        fontFamily: 'Manrope_700Bold',
        color: colors.dark.background,
    },
});
