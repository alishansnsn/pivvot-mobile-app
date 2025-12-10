import { Tabs, useRouter } from "expo-router";
import { Home, ChartBar, MessageCircle, FileText, Plus } from "lucide-react-native";
import React from "react";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import colors from "@/constants/colors";

// Custom center tab button component
function CenterTabButton({ onPress }: { onPress?: (e: any) => void }) {
    const router = useRouter();

    const handlePress = () => {
        router.push("/new-invoice");
    };

    return (
        <TouchableOpacity
            style={styles.centerButton}
            onPress={handlePress}
            activeOpacity={0.8}
        >
            <View style={styles.centerButtonInner}>
                <Plus color={colors.dark.background} size={28} strokeWidth={2.5} />
            </View>
        </TouchableOpacity>
    );
}

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.dark.primary,
                tabBarInactiveTintColor: colors.dark.textTertiary,
                tabBarStyle: {
                    backgroundColor: colors.dark.surface,
                    borderTopColor: colors.dark.border,
                    borderTopWidth: 1,
                    height: Platform.OS === "ios" ? 88 : 68,
                    paddingBottom: Platform.OS === "ios" ? 24 : 12,
                    paddingTop: 12,
                },
                headerShown: false,
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontFamily: "Manrope_600SemiBold",
                    fontSize: 11,
                    marginTop: 4,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => <Home color={color} size={24} strokeWidth={2} />,
                }}
            />
            <Tabs.Screen
                name="insights"
                options={{
                    title: "Analytics",
                    tabBarIcon: ({ color }) => <ChartBar color={color} size={24} strokeWidth={2} />,
                }}
            />
            {/* Center FAB placeholder - takes up space but renders custom button */}
            <Tabs.Screen
                name="mood"
                options={{
                    title: "",
                    tabBarIcon: () => null,
                    tabBarButton: (props) => <CenterTabButton onPress={props.onPress} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Invoices",
                    tabBarIcon: ({ color }) => (
                        <FileText color={color} size={24} strokeWidth={2} />
                    ),
                }}
            />
            <Tabs.Screen
                name="messages"
                options={{
                    title: "Messages",
                    tabBarIcon: ({ color }) => <MessageCircle color={color} size={24} strokeWidth={2} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    centerButton: {
        top: -20,
        justifyContent: "center",
        alignItems: "center",
        width: 70,
        height: 70,
    },
    centerButtonInner: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.dark.primary,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: colors.dark.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});
