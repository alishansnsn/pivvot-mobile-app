import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/constants/colors";

export default function MoodScreen() {
    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={styles.content}>
                <Text style={styles.title}>Mood Tracker</Text>
                <Text style={styles.subtitle}>Coming soon</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark.background,
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontFamily: "Fraunces_700Bold",
        color: colors.dark.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: "Manrope_400Regular",
        color: colors.dark.textSecondary,
    },
});
