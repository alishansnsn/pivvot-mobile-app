import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell } from 'lucide-react-native';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop, Circle } from 'react-native-svg';
import colors from '@/constants/colors';

const { width } = Dimensions.get('window');

// Extended colors for this screen
const COLORS = {
    bg: colors.dark.background,
    card: colors.dark.surface,
    primary: colors.dark.primary,
    accent: '#FF5757',
    textMain: colors.dark.text,
    textMuted: colors.dark.textSecondary,
    tabActive: '#2C2D3A',
};

// Dynamic data for different time periods
const CHART_DATA = {
    Monthly: {
        labels: ['3', '8', '13', '18', '23', '28', '2', '6'],
        points: [65, 55, 70, 45, 60, 75, 40, 55, 70, 50, 65, 45, 70, 55, 50],
        total: '$6,324',
        change: '+$4,560.50',
        outstanding: '$1,764',
        overdueAmount: '$100.00',
        paid: '$4,560',
        paidPercent: 72,
        dotPosition: 0.65,
    },
    Weekly: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        points: [40, 55, 65, 50, 75, 60, 45, 70, 55, 80, 65, 50],
        total: '$2,140',
        change: '+$890.25',
        outstanding: '$520',
        overdueAmount: '$45.00',
        paid: '$1,620',
        paidPercent: 76,
        dotPosition: 0.55,
    },
    Daily: {
        labels: ['6am', '9am', '12pm', '3pm', '6pm', '9pm'],
        points: [30, 45, 60, 55, 70, 65, 80, 75, 60, 50],
        total: '$485',
        change: '+$125.00',
        outstanding: '$85',
        overdueAmount: '$0.00',
        paid: '$400',
        paidPercent: 82,
        dotPosition: 0.45,
    },
};

type PeriodType = 'Monthly' | 'Weekly' | 'Daily';

export default function AnalyticsScreen() {
    const [period, setPeriod] = useState<PeriodType>('Monthly');

    const data = useMemo(() => CHART_DATA[period], [period]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                {/* 1. HEADER */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Analytics</Text>
                    <TouchableOpacity style={styles.iconButton}>
                        <Bell size={24} color={COLORS.textMuted} strokeWidth={1.5} />
                    </TouchableOpacity>
                </View>

                {/* 2. TIME TABS */}
                <View style={styles.tabContainer}>
                    {(['Monthly', 'Weekly', 'Daily'] as PeriodType[]).map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, period === tab && styles.tabActive]}
                            onPress={() => setPeriod(tab)}
                        >
                            <Text style={[styles.tabText, period === tab && styles.tabTextActive]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* 3. TOTAL BALANCE CHART CARD */}
                <View style={styles.largeCard}>
                    <Text style={styles.cardLabel}>Total Balance</Text>

                    {/* Balance Amount Row */}
                    <View style={styles.balanceRow}>
                        <Text style={styles.bigNumber}>{data.total}</Text>
                        <View style={styles.changeContainer}>
                            <Text style={styles.changeArrow}>▲</Text>
                            <Text style={styles.changeAmount}>{data.change}</Text>
                        </View>
                    </View>

                    {/* Area Chart with X-Axis Labels */}
                    <View style={styles.chartWrapper}>
                        <RevenueAreaChart points={data.points} dotPosition={data.dotPosition} />

                        {/* X-Axis Labels */}
                        <View style={styles.xAxisContainer}>
                            {data.labels.map((label, index) => (
                                <Text key={index} style={styles.xAxisLabel}>{label}</Text>
                            ))}
                        </View>
                    </View>
                </View>

                {/* 4. GRID STATS (2 Columns) */}
                <View style={styles.gridContainer}>

                    {/* Left: Outstanding Invoices */}
                    <View style={[styles.gridCard, { marginRight: 8 }]}>
                        <Text style={styles.cardLabel}>Outstanding Invoices</Text>

                        {/* Bar Chart */}
                        <View style={styles.barChartRow}>
                            {[40, 60, 100, 50, 80, 45].map((h, i) => (
                                <Bar key={i} height={h * 0.5} index={i} isAccent={i === 2} />
                            ))}
                        </View>

                        <Text style={styles.midNumber}>{data.outstanding}</Text>
                        <Text style={styles.alertText}>▼ {data.overdueAmount} Overdue</Text>
                    </View>

                    {/* Right: Paid Invoices */}
                    <View style={[styles.gridCard, { marginLeft: 8 }]}>
                        <Text style={styles.cardLabel}>Paid Invoices</Text>

                        {/* Progress Bar */}
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBarFill, { width: `${data.paidPercent}%` }]} />
                        </View>

                        <Text style={styles.midNumber}>{data.paid}</Text>
                        <Text style={styles.successText}>▲ On Track</Text>
                    </View>
                </View>

                {/* 5. TOP CLIENT */}
                <View style={styles.largeCard}>
                    <Text style={styles.cardLabel}>Top Client</Text>
                    <View style={styles.clientRow}>
                        <View>
                            <Text style={styles.clientName}>Acme Corp</Text>
                            <Text style={styles.clientSub}>$2,500 billed</Text>
                        </View>
                        <Text style={styles.clientMeta}>3 open invoices</Text>
                    </View>
                </View>

                {/* Spacer for Bottom Nav */}
                <View style={{ height: 40 }} />

            </ScrollView>
        </SafeAreaView>
    );

}

// --- ANIMATED COMPONENTS ---
const AnimatedPath = Animated.createAnimatedComponent(Path);

const Bar = ({ height, index, isAccent }: { height: number; index: number; isAccent: boolean }) => {
    const animatedHeight = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedHeight, {
            toValue: height,
            duration: 600,
            delay: index * 100, // Stagger effect
            useNativeDriver: false, // Height layout animation
            easing: Easing.out(Easing.cubic),
        }).start();
    }, [height]);

    return (
        <Animated.View
            style={[
                styles.bar,
                {
                    height: animatedHeight,
                    backgroundColor: isAccent ? COLORS.accent : '#2C2D3E'
                }
            ]}
        />
    );
};

// --- REVENUE AREA CHART COMPONENT ---
interface ChartProps {
    points: number[];
    dotPosition: number;
}

const RevenueAreaChart = ({ points, dotPosition }: ChartProps) => {
    const chartWidth = 340;
    const chartHeight = 120;
    const padding = 10;

    // Animation constants
    const pathLength = 1000; // Approximate length
    const drawAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Reset animation when points change (e.g. tab switch)
        drawAnim.setValue(0);

        Animated.timing(drawAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.bezier(0.25, 1, 0.5, 1),
            useNativeDriver: true, // strokeDashoffset supports native driver with AnimatedPath
        }).start();
    }, [points]);

    const strokeDashoffset = drawAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [pathLength, 0]
    });

    // Generate smooth curve path from points
    const generatePath = () => {
        const maxPoint = Math.max(...points);
        const minPoint = Math.min(...points);
        const range = maxPoint - minPoint || 1;

        const xStep = (chartWidth - padding * 2) / (points.length - 1);

        // Normalize points to chart height (leaving space at top and bottom)
        const normalizedPoints = points.map((p, i) => ({
            x: padding + i * xStep,
            y: chartHeight - 30 - ((p - minPoint) / range) * (chartHeight - 50),
        }));

        // Create smooth bezier curve
        let path = `M ${normalizedPoints[0].x} ${normalizedPoints[0].y}`;

        for (let i = 0; i < normalizedPoints.length - 1; i++) {
            const current = normalizedPoints[i];
            const next = normalizedPoints[i + 1];
            const cp1x = current.x + (next.x - current.x) / 3;
            const cp2x = current.x + (2 * (next.x - current.x)) / 3;

            path += ` C ${cp1x} ${current.y}, ${cp2x} ${next.y}, ${next.x} ${next.y}`;
        }

        return {
            linePath: path,
            fillPath: `${path} L ${chartWidth - padding} ${chartHeight} L ${padding} ${chartHeight} Z`,
            dotX: padding + (points.length - 1) * xStep * dotPosition,
            dotY: normalizedPoints[Math.floor((points.length - 1) * dotPosition)]?.y || 50,
        };
    };

    const { linePath, fillPath, dotX, dotY } = generatePath();

    return (
        <Svg
            height={chartHeight}
            width="100%"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="xMidYMid meet"
        >
            <Defs>
                <SvgGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={COLORS.primary} stopOpacity="0.7" />
                    <Stop offset="0.5" stopColor={COLORS.primary} stopOpacity="0.3" />
                    <Stop offset="1" stopColor={COLORS.primary} stopOpacity="0.05" />
                </SvgGradient>
            </Defs>

            {/* The gradient fill area */}
            <Path
                d={fillPath}
                fill="url(#areaGradient)"
            />

            {/* The line stroke on top */}
            <AnimatedPath
                d={linePath}
                fill="none"
                stroke={COLORS.primary}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={[pathLength, pathLength]}
                strokeDashoffset={strokeDashoffset}
            />

            {/* Outer glow circle */}
            <Circle
                cx={dotX}
                cy={dotY}
                r="12"
                fill="rgba(255,255,255,0.15)"
            />

            {/* Inner dot */}
            <Circle
                cx={dotX}
                cy={dotY}
                r="6"
                fill="#FFFFFF"
            />
        </Svg>
    );
};

// --- STYLES ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 8,
    },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: 'Manrope_700Bold',
        color: COLORS.textMain,
    },
    iconButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.card,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Tabs
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 4,
        marginBottom: 24,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 12,
    },
    tabActive: {
        backgroundColor: '#2C2D3A',
    },
    tabText: {
        color: COLORS.textMuted,
        fontFamily: 'Manrope_600SemiBold',
        fontSize: 14,
    },
    tabTextActive: {
        color: COLORS.textMain,
    },

    // Cards
    largeCard: {
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        overflow: 'hidden',
    },
    cardLabel: {
        color: COLORS.textMuted,
        fontSize: 14,
        fontFamily: 'Manrope_500Medium',
        marginBottom: 8,
    },

    // Balance Row
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 12,
        marginBottom: 16,
    },
    bigNumber: {
        color: COLORS.textMain,
        fontSize: 36,
        fontFamily: 'Manrope_700Bold',
    },
    changeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    changeArrow: {
        color: COLORS.primary,
        fontSize: 12,
    },
    changeAmount: {
        color: COLORS.primary,
        fontSize: 16,
        fontFamily: 'Manrope_600SemiBold',
    },

    // Chart
    chartWrapper: {
        marginHorizontal: -10,
    },
    xAxisContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: 4,
    },
    xAxisLabel: {
        color: COLORS.textMuted,
        fontSize: 12,
        fontFamily: 'Manrope_500Medium',
    },

    // Grid
    gridContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    gridCard: {
        flex: 1,
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 16,
        minHeight: 180,
        justifyContent: 'space-between',
    },
    barChartRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 60,
        gap: 8,
        marginVertical: 16,
    },
    bar: {
        flex: 1,
        borderRadius: 4,
        minHeight: 20,
    },
    midNumber: {
        color: COLORS.textMain,
        fontSize: 26,
        fontFamily: 'Manrope_700Bold',
        marginTop: 8,
    },
    alertText: {
        color: COLORS.accent,
        fontSize: 12,
        fontFamily: 'Manrope_600SemiBold',
        marginTop: 4,
    },
    successText: {
        color: COLORS.primary,
        fontSize: 12,
        fontFamily: 'Manrope_600SemiBold',
        marginTop: 4,
    },

    // Progress Bar
    progressBarContainer: {
        height: 14,
        backgroundColor: '#2C2D3E',
        borderRadius: 7,
        marginVertical: 24,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 7,
    },

    // Client Row
    clientRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    clientName: {
        color: COLORS.textMain,
        fontSize: 18,
        fontFamily: 'Manrope_600SemiBold',
    },
    clientSub: {
        color: COLORS.textMuted,
        fontFamily: 'Manrope_500Medium',
        marginTop: 4,
        fontSize: 14,
    },
    clientMeta: {
        color: COLORS.textMuted,
        fontSize: 13,
        fontFamily: 'Manrope_500Medium',
    },
});
