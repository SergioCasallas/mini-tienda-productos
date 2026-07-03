import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Product } from '../types';

interface ProductListItemProps {
  product: Product;
  onPress: (id: number) => void;
}

const ProductListItemComponent: React.FC<ProductListItemProps> = ({ product, onPress }) => {
  return (
    <TouchableOpacity
      className="flex-row p-4 bg-white rounded-lg shadow-sm mb-3 mx-4 items-center"
      onPress={() => onPress(product.id)}
    >
      <Image
        source={{ uri: product.thumbnail }}
        className="w-20 h-20 rounded-md bg-gray-100"
        resizeMode="cover"
      />
      <View className="ml-4 flex-1">
        <Text className="text-lg font-bold text-gray-800" numberOfLines={2}>
          {product.title}
        </Text>
        <Text className="text-green-600 font-bold mt-2 text-base">
          ${product.price.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const ProductListItem = memo(ProductListItemComponent, (prev, next) => {
  return prev.product.id === next.product.id;
});
