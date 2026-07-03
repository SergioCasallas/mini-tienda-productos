import React, { useRef, useEffect } from 'react';
import { Animated, PanResponder, View, StyleSheet } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';

interface SwipeableRowProps {
  children: React.ReactNode;
  onSwipeRight: () => void;
  swipeThreshold?: number;
  isFavorite?: boolean;
}

export const SwipeableRow: React.FC<SwipeableRowProps> = ({
  children,
  onSwipeRight,
  swipeThreshold = 100,
  isFavorite = false,
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const onSwipeRightRef = useRef(onSwipeRight);
  onSwipeRightRef.current = onSwipeRight;

  useEffect(() => {
    Animated.spring(pan.x, {
      toValue: 0,
      useNativeDriver: true,
      tension: 60,
      friction: 9,
    }).start();
  }, [isFavorite, pan.x]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const isMostlyHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5;
        return Math.abs(gestureState.dx) > 10 && isMostlyHorizontal && gestureState.dx > 0;
      },
      onPanResponderMove: (evt, gestureState) => {
        const newX = Math.max(0, gestureState.dx);
        pan.x.setValue(newX);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const isFlick = gestureState.vx > 0.5 && gestureState.dx > 40;
        const isPastThreshold = gestureState.dx > swipeThreshold;

        if (isPastThreshold || isFlick) {
          Animated.timing(pan.x, {
            toValue: 400,
            duration: 150,
            useNativeDriver: true,
          }).start(() => {
            onSwipeRightRef.current();
          });
        } else {
          Animated.spring(pan.x, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
          }).start();
        }
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderTerminate: () => {
        Animated.spring(pan.x, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }).start();
      },
    })
  ).current;

  const iconScale = pan.x.interpolate({
    inputRange: [0, swipeThreshold],
    outputRange: [0.6, 1.2],
    extrapolate: 'clamp',
  });

  const iconOpacity = pan.x.interpolate({
    inputRange: [0, 40],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const bgOpacity = pan.x.interpolate({
    inputRange: [0, 5],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.background,
          {
            backgroundColor: isFavorite ? '#ef4444' : '#2563eb',
            opacity: bgOpacity,
          },
        ]}
      >
      </Animated.View>

      <Animated.View
        style={{
          transform: [{ translateX: pan.x }],
        }}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 24,
  },
  actionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
