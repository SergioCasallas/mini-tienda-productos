import React, { useEffect } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onPress: () => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ isFavorite, onPress }) => {
  const scale = useSharedValue(1);

  // Trigger animation when isFavorite changes
  useEffect(() => {
    if (isFavorite) {
      scale.value = withSequence(
        withSpring(1.5, { damping: 2, stiffness: 80 }),
        withSpring(1, { damping: 4, stiffness: 40 })
      );
    } else {
      scale.value = withSpring(1);
    }
  }, [isFavorite, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <TouchableOpacity onPress={onPress} className="p-2" activeOpacity={0.7}>
      <Animated.View style={animatedStyle}>
        <Text className={`text-2xl ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}>
          {isFavorite ? '♥' : '♡'}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};
