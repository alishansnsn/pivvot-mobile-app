import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

export interface ConfettiRef {
    fire: (options?: any) => void;
}

interface ConfettiProps {
    className?: string; // Kept for API compatibility, though unused in RN styles directly
    style?: ViewStyle;
    onMouseEnter?: () => void; // Kept for API compatibility
}

export const Confetti = forwardRef<ConfettiRef, ConfettiProps>((props, ref) => {
    const cannonRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
        fire: (options = {}) => {
            // Trigger the confetti animation
            // ConfettiCannon's start() resumes the animation. 
            // If we want to restart it on every fire, we might need a key or similar approach,
            // but usually .start() works if autoStart=false.
            cannonRef.current?.start();
        },
    }));

    return (
        <View style={[styles.container, props.style]} pointerEvents="none">
            <ConfettiCannon
                ref={cannonRef}
                count={200}
                origin={{ x: -10, y: 0 }} // Default top-leftish
                autoStart={false}
                fadeOut={true}
                {...props}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100, // Ensure it sits on top
    },
});
