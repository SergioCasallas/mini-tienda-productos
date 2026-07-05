import React, { memo, useCallback, useMemo, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { Product } from '../types';
import { useProducts } from '../hooks/useProducts';
import { useFavoritesStore } from '../store/favoritesStore';
import { SkeletonLoader } from './SkeletonLoader';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface SuggestedProductCardProps {
  product: Product; 
  isFavorite: boolean;
  onPress: (id: number) => void;
  onToggleFavorite: (product: Product) => void;
}

const SuggestedProductCardComponent: React.FC<SuggestedProductCardProps> = ({
  product,
  isFavorite,
  onPress,
  onToggleFavorite,
}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isFavorite) {
      scale.value = withSequence(
        withTiming(1.3, { duration: 150 }),
        withSpring(1, { damping: 12, stiffness: 150 })
      );
    } else {
      scale.value = withSpring(1);
    }
  }, [isFavorite, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleFavoritePress = useCallback(() => {
    onToggleFavorite(product);
  }, [product, onToggleFavorite]);

  const handleCardPress = useCallback(() => {
    onPress(product.id);
  }, [product.id, onPress]);

  return (
    <TouchableOpacity
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mr-4 flex-col pb-3 w-[140px] relative"
      onPress={handleCardPress}
      activeOpacity={0.8}
    >
      <View className="w-[140px] h-[110px] bg-gray-50 relative justify-center items-center">
        <Image
          source={{ uri: product.thumbnail }}
          className="w-full h-full bg-gray-100"
          resizeMode="cover"
        />
        <TouchableOpacity
          onPress={handleFavoritePress}
          className="absolute top-2 right-2 bg-white/95 rounded-full p-1.5 shadow-md items-center justify-center border border-gray-100"
          activeOpacity={0.7}
          testID={`suggested-fav-${product.id}`}
        >
          <Animated.View style={animatedStyle}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={18}
              color={isFavorite ? '#ef4444' : '#9ca3af'}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <View className="px-2 pt-2">
        <Text className="text-[10px] text-blue-600 font-bold uppercase tracking-wider" numberOfLines={1}>
          {product.brand || product.category}
        </Text>
        <Text className="text-xs font-semibold text-gray-800 mt-0.5 h-[32px]" numberOfLines={2}>
          {product.title}
        </Text>

        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-green-600 font-extrabold text-sm">
            ${product.price.toFixed(2)}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="star" size={12} color="#eab308" />
            <Text className="text-gray-500 text-[10px] ml-0.5 font-medium">{product.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SuggestedProductCard = memo(
  SuggestedProductCardComponent,
  (prev, next) =>
    prev.product.id === next.product.id &&
    prev.isFavorite === next.isFavorite &&
    prev.onPress === next.onPress &&
    prev.onToggleFavorite === next.onToggleFavorite
);

interface SuggestedProductsProps {
  currentProductId: number;
  onPressProduct: (id: number) => void;
}

export const SuggestedProducts: React.FC<SuggestedProductsProps> = ({
  currentProductId,
  onPressProduct,
}) => {
  const { products, isLoading, error } = useProducts();
  const favorites = useFavoritesStore((state) => state.favorites);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const suggestedItems = useMemo(() => {
    if (!products || products.length === 0) return [];

    const filtered = products.filter((p) => p.id !== currentProductId);

    const shuffled = [...filtered].sort(() => 0.5 - Math.random());

    return shuffled.slice(0, 10);
  }, [products, currentProductId]);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => {
      const isFav = favorites.some((fav) => fav.id === item.id);
      return (
        <SuggestedProductCard
          product={item}
          isFavorite={isFav}
          onPress={onPressProduct}
          onToggleFavorite={toggleFavorite}
        />
      );
    },
    [favorites, onPressProduct, toggleFavorite]
  );

  const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

  if (error) {
    return null;
  }

  if (isLoading) {
    return (
      <View className="mt-8 px-4 mb-6">
        <Text className="text-lg font-bold text-gray-800 mb-4">Te podría interesar</Text>
        <View className="flex-row">
          {Array.from({ length: 3 }).map((_, i) => (
            <View key={i} className="mr-4 w-[140px]">
              <SkeletonLoader width={140} height={110} borderRadius={12} className="mb-2" />
              <SkeletonLoader width="80%" height={14} className="mb-1" borderRadius={4} />
              <SkeletonLoader width="60%" height={14} borderRadius={4} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (suggestedItems.length === 0) {
    return null;
  }

  return (
    <View className="mt-8 mb-6">
      <Text className="text-lg font-bold text-gray-800 mb-4 px-4">Te podría interesar</Text>
      <FlatList
        data={suggestedItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={3}
        removeClippedSubviews={true}
      />
    </View>
  );
};
