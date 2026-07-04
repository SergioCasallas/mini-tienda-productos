import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Product } from '../types';
import { Ionicons } from '@react-native-vector-icons/ionicons';

interface ProductListItemProps {
  product: Product;
  onPress: (id: number) => void;
  onLongPress?: (id: number) => void;
  isFavorite?: boolean;
  isSelected?: boolean;
}

const ProductListItemComponent: React.FC<ProductListItemProps> = ({
  product,
  onPress,
  onLongPress,
  isFavorite = false,
  isSelected = false,
}) => {
  return (
    <TouchableOpacity
      className={`flex-row p-4 rounded-lg shadow-sm items-center relative ${
        isSelected ? 'bg-blue-50/70 border border-blue-200' : 'bg-white'
      }`}
      onPress={() => onPress(product.id)}
      onLongPress={onLongPress ? () => onLongPress(product.id) : undefined}
      activeOpacity={0.7}
      delayLongPress={300} // A bit faster long-press response for premium feel
    >
      {isSelected && (
        <View className="mr-3 bg-blue-600 rounded-full p-1 items-center justify-center" testID="select-indicator">
          <Ionicons name="checkmark" size={14} color="#ffffff" />
        </View>
      )}
      <Image
        source={{ uri: product.thumbnail }}
        className="w-20 h-20 rounded-md bg-gray-100"
        resizeMode="cover"
      />
      <View className="ml-4 flex-1 pr-6">
        <Text className="text-lg font-bold text-gray-800" numberOfLines={2}>
          {product.title}
        </Text>
        <Text className="text-green-600 font-bold mt-2 text-base">
          ${product.price.toFixed(2)}
        </Text>
      </View>
      {isFavorite && (
        <View className="absolute right-4 top-4" testID="favorite-icon">
          <Ionicons name="heart" size={20} color="#9ca3af" />
        </View>
      )}
    </TouchableOpacity>
  );
};

export const ProductListItem = memo(ProductListItemComponent, (prev, next) => {
  return (
    prev.product.id === next.product.id &&
    prev.isFavorite === next.isFavorite &&
    prev.isSelected === next.isSelected &&
    prev.onPress === next.onPress &&
    prev.onLongPress === next.onLongPress
  );
});
