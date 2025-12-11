import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, SafeAreaView } from 'react-native';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react-native';
import colors from '@/constants/colors';

interface ToastProps {
    visible: boolean;
    message: string;
    onHide: () => void;
    duration?: number;
    icon?: React.ReactNode;
}

export const Toast = ({ visible, message, onHide, duration = 2000, icon }: ToastProps) => {
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Animate In
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 8,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto Hide
            const timer = setTimeout(() => {
                hideToast();
            }, duration);

            return () => clearTimeout(timer);
        } else {
            hideToast();
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -100,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (visible) onHide();
        });
    };

    if (!visible) return null;

    return (
        <SafeAreaView style={styles.container} pointerEvents="none">
            <Animated.View
                style={[
                    styles.toast,
                    {
                        transform: [{ translateY }],
                        opacity,
                    },
                ]}
            >
                {icon ? (
                    icon
                ) : (
                    <CheckCircle2 size={20} color="#4ADE80" strokeWidth={2.5} />
                )}
                <Text style={styles.message}>{message}</Text>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 9999,
        paddingTop: 10,
    },
    toast: {
        backgroundColor: '#2A2A2A',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        gap: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    message: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Manrope_600SemiBold',
    },
});
