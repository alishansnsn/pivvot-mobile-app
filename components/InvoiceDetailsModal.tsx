import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
} from 'react-native';
import { X, Calendar, DollarSign, CheckCircle2, AlertCircle, Bell } from 'lucide-react-native';
import colors from '@/constants/colors';
import { Invoice } from '@/store/invoiceStore';

interface InvoiceDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    invoice: Invoice | null;
    showReminder?: boolean;
    onSendReminder?: () => void;
    onMarkAsPaid?: () => void;
}

export default function InvoiceDetailsModal({
    visible,
    onClose,
    invoice,
    showReminder = false,
    onSendReminder,
    onMarkAsPaid,
}: InvoiceDetailsModalProps) {
    if (!invoice) return null;

    const isPaid = invoice.status === "Paid";
    const isOverdue = invoice.status === "Overdue";

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Invoice Details</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={colors.dark.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        {/* Status Icon */}
                        <View style={[
                            styles.iconContainer,
                            { backgroundColor: isPaid ? 'rgba(74, 222, 128, 0.1)' : isOverdue ? 'rgba(248, 113, 113, 0.1)' : 'rgba(255, 184, 77, 0.1)' }
                        ]}>
                            {isPaid ? (
                                <CheckCircle2 size={32} color="#4ADE80" />
                            ) : isOverdue ? (
                                <AlertCircle size={32} color="#F87171" />
                            ) : (
                                <DollarSign size={32} color="#FFB84D" />
                            )}
                        </View>

                        {/* Company */}
                        <Text style={styles.companyName}>{invoice.companyName}</Text>
                        <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>

                        {/* Details Grid */}
                        <View style={styles.detailsGrid}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Amount</Text>
                                <Text style={styles.detailValue}>
                                    ${invoice.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Invoice Date</Text>
                                <Text style={styles.detailValue}>{invoice.date}</Text>
                            </View>
                            {isPaid && invoice.datePaid && (
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Date Paid</Text>
                                    <Text style={[styles.detailValue, { color: '#4ADE80' }]}>
                                        {invoice.datePaid}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Status</Text>
                                <View style={[
                                    styles.statusBadge,
                                    {
                                        backgroundColor: isPaid ? '#1E3E2B' : isOverdue ? '#3E1E1E' : '#3E341E'
                                    }
                                ]}>
                                    <Text style={[
                                        styles.statusText,
                                        { color: isPaid ? '#4ADE80' : isOverdue ? '#F87171' : '#FFB84D' }
                                    ]}>
                                        {invoice.status}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        {showReminder && onSendReminder ? (
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={styles.markPaidButtonSmall}
                                    onPress={onMarkAsPaid}
                                >
                                    <CheckCircle2 color={colors.dark.background} size={18} />
                                    <Text style={styles.markPaidButtonText}>Paid</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.reminderButton}
                                    onPress={onSendReminder}
                                >
                                    <Bell color={colors.dark.background} size={18} />
                                    <Text style={styles.reminderButtonText}>Send Reminder</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.closeButtonFull} onPress={onClose}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Manrope_700Bold',
        color: colors.dark.text,
    },
    closeButton: {
        padding: 4,
    },
    content: {
        alignItems: 'center',
        marginBottom: 24,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    companyName: {
        fontSize: 20,
        fontFamily: 'Manrope_700Bold',
        color: colors.dark.text,
        marginBottom: 4,
    },
    invoiceNumber: {
        fontSize: 14,
        fontFamily: 'Manrope_500Medium',
        color: colors.dark.textSecondary,
        marginBottom: 20,
    },
    detailsGrid: {
        width: '100%',
        gap: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.dark.border,
    },
    detailLabel: {
        fontSize: 14,
        fontFamily: 'Manrope_500Medium',
        color: colors.dark.textSecondary,
    },
    detailValue: {
        fontSize: 14,
        fontFamily: 'Manrope_600SemiBold',
        color: colors.dark.text,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontFamily: 'Manrope_600SemiBold',
    },
    footer: {
        marginTop: 8,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
    },
    markPaidButtonSmall: {
        flex: 1,
        backgroundColor: '#4ADE80',
        paddingVertical: 14,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    markPaidButtonText: {
        color: colors.dark.background,
        fontFamily: 'Manrope_700Bold',
        fontSize: 14,
    },
    reminderButton: {
        flex: 2,
        backgroundColor: '#FFB84D',
        paddingVertical: 14,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    reminderButtonText: {
        color: colors.dark.background,
        fontFamily: 'Manrope_700Bold',
        fontSize: 14,
    },
    closeButtonFull: {
        backgroundColor: colors.dark.border,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    closeButtonText: {
        color: colors.dark.text,
        fontFamily: 'Manrope_600SemiBold',
        fontSize: 16,
    },
});
