import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    Platform
} from 'react-native';
import { X, CheckCircle2, DollarSign } from 'lucide-react-native';
import colors from '@/constants/colors';

interface PaymentModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    invoice: {
        companyName: string;
        amount: number;
        invoiceNumber: string;
    } | null;
}

export default function PaymentModal({ visible, onClose, onConfirm, invoice }: PaymentModalProps) {
    if (!invoice) return null;

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
                        <Text style={styles.title}>Confirm Payment</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={colors.dark.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <View style={styles.iconContainer}>
                            <DollarSign size={32} color={colors.dark.primary} />
                        </View>
                        <Text style={styles.description}>
                            Mark invoice <Text style={styles.highlight}>{invoice.invoiceNumber}</Text> from <Text style={styles.highlight}>{invoice.companyName}</Text> as paid?
                        </Text>
                        <Text style={styles.amount}>
                            ${invoice.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </Text>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                            <CheckCircle2 color={colors.dark.background} size={20} />
                            <Text style={styles.confirmButtonText}>Mark as Paid</Text>
                        </TouchableOpacity>
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
        marginBottom: 32,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(210, 248, 101, 0.1)', // Primary with opacity
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        fontFamily: 'Manrope_500Medium',
        color: colors.dark.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 8,
    },
    highlight: {
        color: colors.dark.text,
        fontFamily: 'Manrope_700Bold',
    },
    amount: {
        fontSize: 32,
        fontFamily: 'Manrope_700Bold',
        color: colors.dark.text,
        marginTop: 8,
    },
    footer: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.dark.border,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: colors.dark.textSecondary,
        fontFamily: 'Manrope_600SemiBold',
        fontSize: 16,
    },
    confirmButton: {
        flex: 2,
        backgroundColor: colors.dark.primary,
        paddingVertical: 14,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    confirmButtonText: {
        color: colors.dark.background,
        fontFamily: 'Manrope_700Bold',
        fontSize: 16,
    },
});
