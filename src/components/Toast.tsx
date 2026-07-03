import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';

interface ToastProps {
  visible: boolean;
  message: string;
  duration?: number;
  onHide: () => void;
  iconName?: string;
  iconColor?: string;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  duration = 2000,
  onHide,
  iconName = 'checkmark-circle-outline',
  iconColor = '#10b981',
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 20,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onHide();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, fadeAnim, slideAnim, onHide]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
      className="bg-gray-900/90 rounded-2xl flex-row items-center px-4 py-3.5 shadow-lg border border-gray-800"
    >
      <Ionicons name={iconName as any} size={22} color={iconColor} style={{ marginRight: 8 }} />
      <Text className="text-white text-sm font-semibold tracking-wide flex-1">{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    zIndex: 9999,
  },
});
