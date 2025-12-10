import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { ChevronRight } from "lucide-react-native";
import { useState } from "react";
import colors from "@/constants/colors";

interface Client {
    id: string;
    companyName: string;
    domain?: string;
    logoColor: string;
    totalBilled: number;
    activeInvoices: number;
}

interface ClientCardProps {
    client: Client;
    onPress: () => void;
}

export default function ClientCard({ client, onPress }: ClientCardProps) {
    const [imageError, setImageError] = useState(false);
    const logoUrl = client.domain
        ? `https://logo.clearbit.com/${client.domain}`
        : null;

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={onPress}
        >
            {/* Logo */}
            <View style={[styles.logoContainer, { backgroundColor: client.logoColor }]}>
                {logoUrl && !imageError ? (
                    <Image
                        source={{ uri: logoUrl }}
                        style={styles.logoImage}
                        contentFit="contain"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <Text style={styles.logoFallback}>
                        {client.companyName.charAt(0)}
                    </Text>
                )}
            </View>

            {/* Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.companyName}>{client.companyName}</Text>
                <Text style={styles.statsText}>
                    {client.activeInvoices} Active • ${client.totalBilled.toLocaleString()} Billed
                </Text>
            </View>

            {/* Action */}
            <ChevronRight color={colors.dark.textTertiary} size={20} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.dark.surface,
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
    },
    logoContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
        overflow: "hidden",
    },
    logoImage: {
        width: 32,
        height: 32,
    },
    logoFallback: {
        fontSize: 20,
        fontFamily: "Manrope_700Bold",
        color: "#FFFFFF",
    },
    infoContainer: {
        flex: 1,
        justifyContent: "center",
    },
    companyName: {
        fontSize: 16,
        fontFamily: "Manrope_600SemiBold",
        color: colors.dark.text,
        marginBottom: 4,
    },
    statsText: {
        fontSize: 13,
        fontFamily: "Manrope_500Medium",
        color: colors.dark.textSecondary,
    },
});
