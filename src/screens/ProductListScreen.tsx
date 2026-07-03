import React, { useCallback, useState, useEffect } from 'react';
import { View, FlatList, ListRenderItem, TouchableOpacity } from 'react-native';
import { ProductListScreenProps } from '../navigation/types';
import { useProducts } from '../hooks/useProducts';
import { ProductListItem } from '../components/ProductListItem';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Product } from '../types';
import { useAuthStore } from '../store/authStore';
import { Ionicons } from '@react-native-vector-icons/ionicons';

export const ProductListScreen: React.FC<ProductListScreenProps> = ({ navigation }) => {
  const { products, isLoading, error, refetch } = useProducts();
  const logout = useAuthStore((state) => state.logout);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions?.({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setIsLogoutModalVisible(true)}
          style={{ marginRight: 15 }}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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

      <ConfirmationModal
        visible={isLogoutModalVisible}
        onClose={() => setIsLogoutModalVisible(false)}
        onConfirm={logout}
        title="¿Cerrar Sesión?"
        message="¿Estás seguro de que deseas cerrar sesión de tu cuenta?"
        confirmText="Salir"
        cancelText="Cancelar"
        iconName="log-out-outline"
        iconColor="#ef4444"
        iconBgColor="bg-red-50"
      />
    </View>
  );
};
