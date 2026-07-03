import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Product } from '../types';
import { Ionicons } from '@react-native-vector-icons/ionicons';

interface ProductListItemProps {
  product: Product;
  onPress: (id: number) => void;
  isFavorite?: boolean;
}

const ProductListItemComponent: React.FC<ProductListItemProps> = ({
  product,
  onPress,
  isFavorite = false,
}) => {
  return (
    <TouchableOpacity
      className="flex-row p-4 bg-white rounded-lg shadow-sm items-center relative"
      onPress={() => onPress(product.id)}
      activeOpacity={0.7}
    >
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
  return prev.product.id === next.product.id && prev.isFavorite === next.isFavorite;
});
