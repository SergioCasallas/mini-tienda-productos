import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@react-native-vector-icons/ionicons';

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
        withTiming(1.4, { duration: 150 }),
        withSpring(1, { damping: 15, stiffness: 150 })
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
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={28}
          color={isFavorite ? '#ef4444' : '#9ca3af'}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

