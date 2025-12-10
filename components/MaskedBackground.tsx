import React from 'react';
import { View, StyleSheet, Dimensions, ImageSourcePropType, Image } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import colors from '@/constants/colors';

const { width, height } = Dimensions.get('window');

interface MaskedBackgroundProps {
    source: ImageSourcePropType;
    children: React.ReactNode;
}

export default function MaskedBackground({ source, children }: MaskedBackgroundProps) {
    return (
        <View style={styles.container}>
            {/* Background Image */}
            <Image
                source={source}
                style={styles.image}
                resizeMode="cover"
            />

            {/* Radial Gradient Overlay (Mask) */}
            <View style={styles.overlay}>
                <Svg height="100%" width="100%">
                    <Defs>
                        <RadialGradient
                            id="grad"
                            cx="50%"
                            cy="50%"
                            rx="80%"
                            ry="50%"
                            fx="50%"
                            fy="50%"
                            gradientUnits="userSpaceOnUse"
                        >
                            <Stop offset="0" stopColor={colors.dark.background} stopOpacity="0" />
                            <Stop offset="0.6" stopColor={colors.dark.background} stopOpacity="0.4" />
                            <Stop offset="1" stopColor={colors.dark.background} stopOpacity="1" />
                        </RadialGradient>
                    </Defs>
                    <Rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill="url(#grad)"
                    />
                </Svg>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark.background,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        width: width,
        height: height,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        flex: 1,
    }
});
