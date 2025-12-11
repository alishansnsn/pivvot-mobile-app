import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Send, Paperclip, Smile } from 'lucide-react-native';
import colors from '@/constants/colors';

type ChatMessage = {
    id: string;
    text: string;
    time: string;
    isMe: boolean;
};

// Generate dummy chat history based on contact
const generateChatHistory = (contactName: string): ChatMessage[] => {
    const baseMessages: Record<string, ChatMessage[]> = {
        'Marie': [
            { id: '1', text: 'Hi! How are you doing?', time: '10:15 AM', isMe: false },
            { id: '2', text: 'Hey Marie! Doing great, thanks! How about you?', time: '10:18 AM', isMe: true },
            { id: '3', text: 'Pretty good! Just wanted to check on the project status.', time: '10:22 AM', isMe: false },
            { id: '4', text: 'The designs are almost done, I\'ll send them over tomorrow.', time: '10:25 AM', isMe: true },
            { id: '5', text: 'Hey, just checking in on the project...', time: '10:30 AM', isMe: false },
        ],
        'James': [
            { id: '1', text: 'Just reviewed the new mockups!', time: '3:00 PM', isMe: false },
            { id: '2', text: 'What do you think?', time: '3:05 PM', isMe: true },
            { id: '3', text: 'The new design looks great! Let\'s proceed...', time: '3:10 PM', isMe: false },
        ],
        'Acme Corp': [
            { id: '1', text: 'Hello! We\'ve processed your invoice.', time: '2:00 PM', isMe: false },
            { id: '2', text: 'Thank you for the update!', time: '2:15 PM', isMe: true },
            { id: '3', text: 'Invoice #1001 has been paid.', time: '2:30 PM', isMe: false },
        ],
        'John Doe': [
            { id: '1', text: 'Hi there!', time: '11:00 AM', isMe: false },
            { id: '2', text: 'Hey John! What\'s up?', time: '11:30 AM', isMe: true },
            { id: '3', text: 'Can we schedule a call for tomorrow?', time: '12:00 PM', isMe: false },
        ],
    };

    return baseMessages[contactName] || [
        { id: '1', text: 'Hello!', time: '12:00 PM', isMe: false },
        { id: '2', text: 'Hi! How can I help you?', time: '12:05 PM', isMe: true },
    ];
};

export default function ChatScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        id: string;
        name: string;
        avatar: string;
    }>();

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };

    useEffect(() => {
        // Load chat history when screen mounts
        const history = generateChatHistory(params.name || '');
        setMessages(history);
    }, [params.name]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });

        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            text: inputText.trim(),
            time: timeString,
            isMe: true,
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputText('');

        // Scroll to bottom after sending
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const renderMessage = ({ item }: { item: ChatMessage }) => (
        <View
            style={[
                styles.messageBubbleContainer,
                item.isMe ? styles.myMessageContainer : styles.theirMessageContainer,
            ]}
        >
            <View
                style={[
                    styles.messageBubble,
                    item.isMe ? styles.myMessage : styles.theirMessage,
                ]}
            >
                <Text style={[styles.messageText, item.isMe && styles.myMessageText]}>
                    {item.text}
                </Text>
            </View>
            <Text style={[styles.messageTime, item.isMe && styles.myMessageTime]}>
                {item.time}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={24} color={colors.dark.text} />
                </TouchableOpacity>

                <View style={styles.headerProfile}>
                    {params.avatar ? (
                        <Image
                            source={{ uri: params.avatar }}
                            style={styles.headerAvatar}
                        />
                    ) : (
                        <View style={[styles.headerAvatar, styles.avatarPlaceholder]}>
                            <Text style={styles.avatarInitials}>
                                {(params.name || '').substring(0, 2).toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerName}>{params.name}</Text>
                        <Text style={styles.headerStatus}>Online</Text>
                    </View>
                </View>

                <View style={{ width: 44 }} />
            </View>

            {/* Messages List */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messagesList}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={onRefresh}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dark.text} />
                }
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            />

            {/* Input Bar */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.inputIconBtn}>
                        <Paperclip size={22} color={colors.dark.textSecondary} />
                    </TouchableOpacity>

                    <View style={styles.textInputWrapper}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Type a message..."
                            placeholderTextColor={colors.dark.textSecondary}
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            maxLength={1000}
                        />
                        <TouchableOpacity style={styles.emojiBtn}>
                            <Smile size={22} color={colors.dark.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            !inputText.trim() && styles.sendButtonDisabled,
                        ]}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                    >
                        <Send size={20} color={colors.dark.background} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark.background,
    },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.dark.border,
    },
    backButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerProfile: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.dark.surfaceElevated,
        marginRight: 12,
    },
    avatarPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitials: {
        color: colors.dark.text,
        fontSize: 14,
        fontFamily: 'Manrope_600SemiBold',
    },
    headerInfo: {
        flex: 1,
    },
    headerName: {
        fontSize: 16,
        fontFamily: 'Manrope_700Bold',
        color: colors.dark.text,
    },
    headerStatus: {
        fontSize: 12,
        fontFamily: 'Manrope_500Medium',
        color: colors.dark.primary,
    },
    // Messages
    messagesList: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    messageBubbleContainer: {
        marginBottom: 12,
        maxWidth: '80%',
    },
    myMessageContainer: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    theirMessageContainer: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    messageBubble: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
    },
    myMessage: {
        backgroundColor: colors.dark.primary,
        borderBottomRightRadius: 4,
    },
    theirMessage: {
        backgroundColor: colors.dark.surface,
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        fontFamily: 'Manrope_500Medium',
        color: colors.dark.text,
        lineHeight: 22,
    },
    myMessageText: {
        color: colors.dark.background,
    },
    messageTime: {
        fontSize: 11,
        fontFamily: 'Manrope_500Medium',
        color: colors.dark.textSecondary,
        marginTop: 4,
    },
    myMessageTime: {
        color: colors.dark.textSecondary,
    },
    // Input Bar
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
        borderTopWidth: 1,
        borderTopColor: colors.dark.border,
        backgroundColor: colors.dark.background,
    },
    inputIconBtn: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: colors.dark.surface,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 8,
        minHeight: 44,
        maxHeight: 120,
    },
    textInput: {
        flex: 1,
        color: colors.dark.text,
        fontSize: 15,
        fontFamily: 'Manrope_500Medium',
        paddingVertical: 4,
    },
    emojiBtn: {
        padding: 4,
        marginLeft: 8,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.dark.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
});
