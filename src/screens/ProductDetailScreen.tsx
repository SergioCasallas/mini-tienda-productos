import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ProductDetailScreenProps } from '../navigation/types';
import { useProductDetail } from '../hooks/useProductDetail';
import { useFavoritesStore } from '../store/favoritesStore';
import { ImageCarousel } from '../components/ImageCarousel';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { ErrorState } from '../components/ErrorState';
import { FavoriteButton } from '../components/FavoriteButton';

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ route }) => {
  const { id } = route.params;
  const { product, isLoading, error, refetch } = useProductDetail(id);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white">
        <SkeletonLoader width="100%" height={300} borderRadius={0} />
        <View className="p-4">
          <SkeletonLoader width="60%" height={28} className="mb-4" />
          <SkeletonLoader width="30%" height={24} className="mb-6" />
          <SkeletonLoader width="100%" height={16} className="mb-2" />
          <SkeletonLoader width="100%" height={16} className="mb-2" />
          <SkeletonLoader width="80%" height={16} />
        </View>
      </View>
    );
  }

  if (error || !product) {
    return <ErrorState message={error?.message || 'Error al cargar'} onRetry={refetch} />;
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <ImageCarousel images={product.images || [product.thumbnail]} />
      
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-2xl font-bold text-gray-900 flex-1 mr-4">
            {product.title}
          </Text>
          <FavoriteButton
            isFavorite={isFavorite}
            onPress={() => toggleFavorite(product)}
          />
        </View>

        <Text className="text-green-600 text-xl font-bold mb-4">
          ${product.price.toFixed(2)}
        </Text>

        <View className="flex-row items-center mb-6">
          <Text className="text-yellow-500 text-lg mr-1">★</Text>
          <Text className="text-gray-600 text-base">{product.rating} / 5</Text>
        </View>

        <Text className="text-lg font-semibold text-gray-800 mb-2">Descripción</Text>
        <Text className="text-gray-600 text-base leading-6">
          {product.description}
        </Text>
      </View>
    </ScrollView>
  );
};
