import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
    ChevronLeft,
    Star,
    Zap,
    HelpCircle,
    User,
    FileText,
    Lightbulb,
    Bell,
    Lock,
    CreditCard,
    LogOut,
} from "lucide-react-native";
import colors from "@/constants/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_GAP = 12;
const PADDING_HORIZONTAL = 20;
const CARD_WIDTH = (SCREEN_WIDTH - PADDING_HORIZONTAL * 2 - CARD_GAP) / 2;

// Reusable Settings Row Component
function SettingRow({
    icon: Icon,
    label,
    isLast = false,
    onPress,
}: {
    icon: React.ComponentType<any>;
    label: string;
    isLast?: boolean;
    onPress?: () => void;
}) {
    return (
        <TouchableOpacity
            style={styles.rowContainer}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.rowContent}>
                <View style={styles.iconContainer}>
                    <Icon color={colors.dark.textSecondary} size={20} strokeWidth={1.5} />
                </View>
                <Text style={styles.rowLabel}>{label}</Text>
            </View>
            {!isLast && <View style={styles.divider} />}
        </TouchableOpacity>
    );
}

// Settings Group Container
function SettingsGroup({ children }: { children: React.ReactNode }) {
    return <View style={styles.groupContainer}>{children}</View>;
}

import * as ImagePicker from "expo-image-picker";
import { useUserStore } from "@/store/userStore";

export default function SettingsScreen() {
    const router = useRouter();
    const { profileImage, name, handle, setProfileImage } = useUserStore();

    const handleLogout = () => {
        // Dismiss any modals (like Settings) and replace the root with Onboarding
        router.dismissAll();
        router.replace("/onboarding");
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <ChevronLeft color={colors.dark.text} size={28} strokeWidth={2} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <TouchableOpacity
                        style={styles.avatarContainer}
                        onPress={pickImage}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={{ uri: profileImage }}
                            style={styles.avatar}
                            contentFit="cover"
                        />
                        <View style={styles.editBadge}>
                            <User color={colors.dark.background} size={12} strokeWidth={3} />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.profileName}>{name}</Text>
                    <Text style={styles.profileHandle}>{handle}</Text>
                </View>

                {/* Plan & Referrals Grid */}
                <View style={styles.gridContainer}>
                    {/* Standard Plan Card */}
                    <TouchableOpacity style={styles.gridCard} activeOpacity={0.7}>
                        <View style={styles.starBadge}>
                            <Star
                                color={colors.dark.background}
                                size={18}
                                strokeWidth={2}
                                fill={colors.dark.background}
                            />
                        </View>
                        <View style={styles.gridCardContent}>
                            <Text style={styles.gridCardTitle}>Standard</Text>
                            <Text style={styles.gridCardSubtitle}>Your plan</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Referrals Card */}
                    <TouchableOpacity style={styles.referralsCard} activeOpacity={0.7}>
                        <ImageBackground
                            source={require("../Images/referralbg.png")}
                            style={styles.referralsBackground}
                            imageStyle={styles.referralsImage}
                            resizeMode="cover"
                        >
                            {/* Dark gradient overlay from bottom-right */}
                            <LinearGradient
                                colors={[
                                    "rgba(5, 5, 5, 0.1)",
                                    "rgba(5, 5, 5, 0.6)",
                                    "rgba(5, 5, 5, 0.95)",
                                ]}
                                locations={[0, 0.5, 1]}
                                start={{ x: 1, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                style={styles.referralsGradient}
                            >
                                <Zap
                                    color={"white"}
                                    size={24}
                                    strokeWidth={1.5}
                                    style={styles.referralsIcon}
                                />
                                <View style={styles.gridCardContent}>
                                    <Text style={styles.gridCardTitle}>Referrals</Text>
                                    <Text style={styles.gridCardSubtitle}>
                                        Invite & earn rewards
                                    </Text>
                                </View>
                            </LinearGradient>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>

                {/* Main Menu Group */}
                <SettingsGroup>
                    <SettingRow icon={HelpCircle} label="Help" />
                    <SettingRow icon={User} label="Account" onPress={() => router.push("/account")} />
                    <SettingRow icon={FileText} label="Documents & statements" />
                    <SettingRow icon={Lightbulb} label="Learn" isLast />
                </SettingsGroup>

                {/* Security Group */}
                <SettingsGroup>
                    <SettingRow icon={Bell} label="Notifications" />
                    <SettingRow icon={Lock} label="Privacy & Security" />
                    <SettingRow icon={CreditCard} label="Payment Methods" isLast />
                </SettingsGroup>

                {/* Logout */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    activeOpacity={0.7}
                    onPress={handleLogout}
                >
                    <LogOut color="#F87171" size={20} strokeWidth={1.5} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                {/* App Version */}
                <Text style={styles.versionText}>Version 1.0.0</Text>
            </ScrollView>
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
        fontSize: 20,
        fontFamily: "Manrope_600SemiBold",
        color: colors.dark.text,
    },
    headerSpacer: {
        width: 44,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },

    // Profile Section
    profileSection: {
        alignItems: "center",
        marginBottom: 28,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: colors.dark.accent,
        padding: 3,
        marginBottom: 16,
    },
    avatar: {
        width: "100%",
        height: "100%",
        borderRadius: 50,
    },
    editBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: colors.dark.primary,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: colors.dark.background,
    },
    profileName: {
        fontSize: 26,
        fontFamily: "Manrope_500Medium",
        color: colors.dark.text,
        marginBottom: 2,
    },
    profileHandle: {
        fontSize: 16,
        fontFamily: "Manrope_500Medium",
        color: colors.dark.textSecondary,
    },

    // Grid Cards
    gridContainer: {
        flexDirection: "row",
        gap: CARD_GAP,
        marginBottom: 24,
    },
    gridCard: {
        width: CARD_WIDTH,
        backgroundColor: colors.dark.surface,
        borderRadius: 20,
        padding: 16,
        minHeight: 120,
    },
    starBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.dark.primary,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    gridCardContent: {
        marginTop: "auto",
    },
    gridCardTitle: {
        fontSize: 18,
        fontFamily: "Manrope_600SemiBold",
        color: colors.dark.text,
        marginBottom: 2,
    },
    gridCardSubtitle: {
        fontSize: 13,
        fontFamily: "Manrope_500Medium",
        color: colors.dark.textSecondary,
    },
    referralsCard: {
        width: CARD_WIDTH,
        borderRadius: 20,
        overflow: "hidden",
        minHeight: 120,
    },
    referralsBackground: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    referralsImage: {
        borderRadius: 20,
        transform: [{ scale: 5.5 }, { rotate: "25deg" }], // Zoom in on the image
    },
    referralsGradient: {
        flex: 1,
        padding: 16,
    },
    referralsIcon: {
        marginBottom: 12,
    },

    // Settings Groups
    groupContainer: {
        backgroundColor: colors.dark.surface,
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 24,
    },
    rowContainer: {
        height: 56,
        justifyContent: "center",
    },
    rowContent: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        height: "100%",
    },
    iconContainer: {
        width: 24,
        marginRight: 16,
        alignItems: "center",
    },
    rowLabel: {
        fontSize: 16,
        fontFamily: "Manrope_500Medium",
        color: colors.dark.text,
    },
    divider: {
        position: "absolute",
        bottom: 0,
        left: 60,
        right: 0,
        height: 1,
        backgroundColor: colors.dark.border,
    },

    // Logout Button
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.dark.surface,
        borderRadius: 20,
        paddingVertical: 16,
        marginBottom: 24,
        gap: 10,
    },
    logoutText: {
        fontSize: 16,
        fontFamily: "Manrope_600SemiBold",
        color: "#F87171",
    },

    // Version
    versionText: {
        textAlign: "center",
        fontSize: 13,
        fontFamily: "Manrope_500Medium",
        color: colors.dark.textTertiary,
    },
});
