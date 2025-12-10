
import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import colors from "@/constants/colors";

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: "Oops!" }} />
            <View style={styles.container}>
                <Text style={styles.title}>This screen doesn&apos;t exist.</Text>

                <Link href="/" style={styles.link}>
                    <Text style={styles.linkText}>Go to home screen!</Text>
                </Link>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backgroundColor: colors.dark.background,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold" as const,
        fontFamily: "Manrope_600SemiBold",
        color: colors.dark.text,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        fontSize: 14,
        fontFamily: "Manrope_500Medium",
        color: colors.dark.primary,
    },
});
