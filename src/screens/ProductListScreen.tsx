import React, { useCallback } from 'react';
import { View, FlatList, ListRenderItem } from 'react-native';
import { ProductListScreenProps } from '../navigation/types';
import { useProducts } from '../hooks/useProducts';
import { ProductListItem } from '../components/ProductListItem';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { Product } from '../types';

export const ProductListScreen: React.FC<ProductListScreenProps> = ({ navigation }) => {
  const { products, isLoading, error, refetch } = useProducts();

  const handlePress = useCallback((id: number) => {
    navigation.navigate('ProductDetail', { id });
  }, [navigation]);

  const renderItem: ListRenderItem<Product> = useCallback(({ item }) => {
    return <ProductListItem product={item} onPress={handlePress} />;
  }, [handlePress]);

  const renderSkeleton = () => (
    <View className="flex-row p-4 bg-white rounded-lg shadow-sm mb-3 mx-4 items-center">
      <SkeletonLoader width={80} height={80} borderRadius={8} />
      <View className="ml-4 flex-1">
        <SkeletonLoader width="80%" height={20} className="mb-2" />
        <SkeletonLoader width="40%" height={16} />
      </View>
    </View>
  );

  if (isLoading && products.length === 0) {
    return (
      <View className="flex-1 bg-gray-50 pt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <React.Fragment key={i}>{renderSkeleton()}</React.Fragment>
        ))}
      </View>
    );
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 16 }}
        ListEmptyComponent={<EmptyState message="No hay productos disponibles" />}
        getItemLayout={(data, index) => (
          { length: 112, offset: 112 * index, index } // Approximate item height 112
        )}
        initialNumToRender={10}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </View>
  );
};
