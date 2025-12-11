import React, { useState, useMemo } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { X, Mail, Phone, Calendar, ArrowUpRight, DollarSign, MessageSquare } from 'lucide-react-native';
import colors from '@/constants/colors';
import { Client } from '@/store/clientStore';
import { useInvoiceStore, Invoice } from '@/store/invoiceStore';

// Dummy messages since we don't have a full message store yet
// in a real app, this would come from useMessageStore
const MOCK_MESSAGES = [
    { id: '1', text: 'Invoice #1023 has been paid', date: '2 days ago', isCompany: true },
    { id: '2', text: 'Thanks for the quick turnaround!', date: '5 days ago', isCompany: false },
    { id: '3', text: 'Can we schedule a call?', date: '1 week ago', isCompany: false },
];

interface ClientDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    client: Client | null;
}

export default function ClientDetailsModal({ visible, onClose, client }: ClientDetailsModalProps) {
    const [activeTab, setActiveTab] = useState<'timeline' | 'invoices' | 'info'>('timeline');
    const { invoices } = useInvoiceStore();

    const clientInvoices = useMemo(() => {
        if (!client) return [];
        return invoices.filter(inv =>
            inv.clientName === client.name ||
            inv.clientId === client.id ||
            inv.companyName === client.companyName
        );
    }, [client, invoices]);

    if (!client) return null;

    const logoUrl = client.domain
        ? `https://img.logo.dev/${client.domain}?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ`
        : null;

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: client.logoColor || colors.dark.primary }]}>
                {logoUrl ? (
                    <Image
                        source={{ uri: logoUrl }}
                        style={styles.logoImage}
                        contentFit="contain"
                    />
                ) : (
                    <Text style={styles.logoFallback}>{client.companyName?.charAt(0)}</Text>
                )}
            </View>
            <Text style={styles.companyName}>{client.companyName}</Text>
            <Text style={styles.contactName}>{client.name}</Text>

            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Total Billed</Text>
                    <Text style={styles.statValue}>${(client.totalBilled || 0).toLocaleString()}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Active Invoices</Text>
                    <Text style={styles.statValue}>{client.activeInvoices || 0}</Text>
                </View>
            </View>

            <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.actionButton}>
                    <Mail size={20} color={colors.dark.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Phone size={20} color={colors.dark.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Calendar size={20} color={colors.dark.text} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderTimeline = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>

            {/* Combine invoices and mock messages for a timeline view */}
            {clientInvoices.slice(0, 3).map((inv) => (
                <View key={inv.id} style={styles.timelineItem}>
                    <View style={[styles.timelineIcon, { backgroundColor: 'rgba(74, 222, 128, 0.1)' }]}>
                        <DollarSign size={16} color="#4ADE80" />
                    </View>
                    <View style={styles.timelineContent}>
                        <Text style={styles.timelineTitle}>Invoice {inv.invoiceNumber} {inv.status}</Text>
                        <Text style={styles.timelineDate}>{inv.date}</Text>
                    </View>
                    <ArrowUpRight size={16} color={colors.dark.textSecondary} />
                </View>
            ))}

            {MOCK_MESSAGES.map((msg) => (
                <View key={msg.id} style={styles.timelineItem}>
                    <View style={[styles.timelineIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                        <MessageSquare size={16} color="#3B82F6" />
                    </View>
                    <View style={styles.timelineContent}>
                        <Text style={styles.timelineTitle}>{msg.text}</Text>
                        <Text style={styles.timelineDate}>{msg.date}</Text>
                    </View>
                </View>
            ))}
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={24} color={colors.dark.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {renderHeader()}
                    {renderTimeline()}
                </ScrollView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark.background,
    },
    modalHeader: {
        padding: 16,
        alignItems: 'flex-end',
    },
    closeButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: colors.dark.surface,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        overflow: 'hidden',
    },
    logoImage: {
        width: 56,
        height: 56,
    },
    logoFallback: {
        fontSize: 32,
        fontFamily: 'Manrope_700Bold',
        color: '#FFFFFF',
    },
    companyName: {
        fontSize: 24,
        fontFamily: 'Manrope_700Bold',
        color: colors.dark.text,
        marginBottom: 4,
        textAlign: 'center',
    },
    contactName: {
        fontSize: 16,
        fontFamily: 'Manrope_500Medium',
        color: colors.dark.textSecondary,
        marginBottom: 24,
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: colors.dark.surface,
        borderRadius: 16,
        padding: 16,
        width: '100%',
        marginBottom: 24,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        fontFamily: 'Manrope_500Medium',
        color: colors.dark.textSecondary,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontFamily: 'Manrope_700Bold',
        color: colors.dark.text,
    },
    statDivider: {
        width: 1,
        backgroundColor: colors.dark.border,
        marginHorizontal: 16,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 16,
    },
    actionButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.dark.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.dark.border,
    },
    section: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Manrope_700Bold',
        color: colors.dark.text,
        marginBottom: 16,
    },
    timelineItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.dark.surface,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    timelineIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    timelineContent: {
        flex: 1,
    },
    timelineTitle: {
        fontSize: 14,
        fontFamily: 'Manrope_600SemiBold',
        color: colors.dark.text,
        marginBottom: 4,
    },
    timelineDate: {
        fontSize: 12,
        fontFamily: 'Manrope_500Medium',
        color: colors.dark.textSecondary,
    },
});
