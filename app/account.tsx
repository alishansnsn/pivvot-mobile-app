import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { ChevronLeft, Camera, Check } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import colors from "@/constants/colors";
import { useUserStore } from "@/store/userStore";

export default function AccountScreen() {
    const router = useRouter();
    const {
        name,
        handle,
        businessName,
        businessAddress,
        businessLogo,
        updateProfile,
        updateBusinessInfo
    } = useUserStore();

    const [localName, setLocalName] = useState(name);
    const [localHandle, setLocalHandle] = useState(handle);
    const [localBusinessName, setLocalBusinessName] = useState(businessName);
    const [localBusinessAddress, setLocalBusinessAddress] = useState(businessAddress);
    const [localBusinessLogo, setLocalBusinessLogo] = useState(businessLogo);

    const pickLogo = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setLocalBusinessLogo(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        updateProfile(localName, localHandle);
        updateBusinessInfo({
            businessName: localBusinessName,
            businessAddress: localBusinessAddress,
            businessLogo: localBusinessLogo,
        });
        router.back();
    };

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <ChevronLeft color={colors.dark.text} size={28} strokeWidth={2} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Account</Text>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    activeOpacity={0.7}
                >
                    <Check color={colors.dark.primary} size={24} strokeWidth={2.5} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Profile Info</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                value={localName}
                                onChangeText={setLocalName}
                                placeholder="Enter your name"
                                placeholderTextColor={colors.dark.textTertiary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Handle (Username)</Text>
                            <TextInput
                                style={styles.input}
                                value={localHandle}
                                onChangeText={setLocalHandle}
                                placeholder="@handle"
                                placeholderTextColor={colors.dark.textTertiary}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Business Info</Text>

                        <View style={styles.logoContainer}>
                            <TouchableOpacity
                                style={styles.logoUpload}
                                onPress={pickLogo}
                                activeOpacity={0.7}
                            >
                                {localBusinessLogo ? (
                                    <Image
                                        source={{ uri: localBusinessLogo }}
                                        style={styles.logoImage}
                                        contentFit="cover"
                                    />
                                ) : (
                                    <View style={styles.logoPlaceholder}>
                                        <Camera color={colors.dark.textSecondary} size={24} />
                                        <Text style={styles.logoText}>Upload Logo</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Company Name</Text>
                            <TextInput
                                style={styles.input}
                                value={localBusinessName}
                                onChangeText={setLocalBusinessName}
                                placeholder="Enter company name"
                                placeholderTextColor={colors.dark.textTertiary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Business Address</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={localBusinessAddress}
                                onChangeText={setLocalBusinessAddress}
                                placeholder="Enter business address"
                                placeholderTextColor={colors.dark.textTertiary}
                                multiline
                                textAlignVertical="top"
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        borderBottomWidth: 1,
        borderBottomColor: colors.dark.border,
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
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: "Fraunces_600SemiBold",
        color: colors.dark.text,
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontFamily: "Manrope_500Medium",
        color: colors.dark.textSecondary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: colors.dark.surface,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: colors.dark.text,
        fontSize: 16,
        fontFamily: "Manrope_400Regular",
        borderWidth: 1,
        borderColor: colors.dark.border,
    },
    textArea: {
        height: 100,
        paddingTop: 14,
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 24,
    },
    logoUpload: {
        width: 100,
        height: 100,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: colors.dark.surface,
        borderWidth: 1,
        borderColor: colors.dark.border,
        borderStyle: "dashed",
    },
    logoPlaceholder: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    logoText: {
        fontSize: 12,
        fontFamily: "Manrope_500Medium",
        color: colors.dark.textSecondary,
    },
    logoImage: {
        width: "100%",
        height: "100%",
    },
});
