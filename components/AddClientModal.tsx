import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import colors from '@/constants/colors';
import { Client, useClientStore } from '@/store/clientStore';

interface AddClientModalProps {
    visible: boolean;
    onClose: () => void;
    onSave?: (newClient: Client) => void;
}

export default function AddClientModal({ visible, onClose, onSave }: AddClientModalProps) {
    const addClient = useClientStore((state) => state.addClient);

    const [fullName, setFullName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');

    const handleSave = () => {
        if (!fullName || !companyName) return; // Basic validation

        const newClient: Client = {
            id: Date.now().toString(),
            name: fullName,
            companyName: companyName,
            email: email,
            mobile: mobile,
            logoColor: colors.dark.primary, // Default color for new clients
            totalBilled: 0,
            activeInvoices: 0,
            domain: companyName.toLowerCase().replace(/\s+/g, '') + '.com', // Mock domain generation
        };

        addClient(newClient);
        if (onSave) onSave(newClient);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setFullName('');
        setCompanyName('');
        setEmail('');
        setMobile('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Pressable style={styles.overlay} onPress={handleClose}>
                    <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Add New Client</Text>
                            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                                <X size={24} color={colors.dark.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                            {/* Full Name */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Full Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. John Doe"
                                    placeholderTextColor={colors.dark.textTertiary}
                                    value={fullName}
                                    onChangeText={setFullName}
                                />
                            </View>

                            {/* Company Name */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Company Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Acme Corp"
                                    placeholderTextColor={colors.dark.textTertiary}
                                    value={companyName}
                                    onChangeText={setCompanyName}
                                />
                            </View>

                            {/* Email */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email Address</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. john@acme.com"
                                    placeholderTextColor={colors.dark.textTertiary}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* Mobile */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Mobile Number</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. +1 555 0123"
                                    placeholderTextColor={colors.dark.textTertiary}
                                    value={mobile}
                                    onChangeText={setMobile}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </ScrollView>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>Save Client</Text>
                            </TouchableOpacity>
                        </View>

                    </Pressable>
                </Pressable>
            </KeyboardAvoidingView>
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
        maxHeight: '80%',
        width: '100%',
        maxWidth: 500,
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
    formContainer: {
        flexGrow: 0,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Manrope_600SemiBold',
        color: colors.dark.textSecondary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: colors.dark.background,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12, // Increased padding
        color: colors.dark.text,
        fontFamily: 'Manrope_500Medium',
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.dark.border,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 24,
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.dark.border,
    },
    cancelButtonText: {
        color: colors.dark.textSecondary,
        fontFamily: 'Manrope_600SemiBold',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: colors.dark.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: colors.dark.background, // Contrast color on primary (assuming primary is bright like lime)
        fontFamily: 'Manrope_700Bold',
        fontSize: 16,
    },
});
