const colors = {
    dark: {
        background: "#050505",       // Deep black/charcoal background
        surface: "#161618",          // Dark gray for the "Recent Transfers" list items
        surfaceElevated: "#1C1C1E",  // Slightly lighter for the "Total Balance" card
        border: "#2A2A2A",           // Subtle borders

        primary: "#D2F865",          // The distinct Lime Green (Floating button, Top up, +Balance)
        primaryLight: "#E4FAC3",     // Lighter variation of lime
        primaryDark: "#A8C94B",      // Darker variation of lime

        text: "#FFFFFF",             // Pure white for amounts and main names
        textSecondary: "#9CA3AF",    // Light gray for "Total Balance" label, dates, and times
        textTertiary: "#4B5563",     // Darker gray for less important icons

        accent: "#4ECDC4",           // Mint green (Similar to the Bolt Food logo)
        accentLight: "#7EE2DB",

        warning: "#FFB84D",          // Kept as standard warning orange
        error: "#FF453A",            // Standard clean red for errors (though not visible in screenshot)
        success: "#D2F865",          // Positive money matches the Primary Lime Green
    },
};

export default colors;