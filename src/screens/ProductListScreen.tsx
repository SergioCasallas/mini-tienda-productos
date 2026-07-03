import React, { useCallback, useState, useEffect } from 'react';
import { View, FlatList, ListRenderItem, TouchableOpacity, Text } from 'react-native';
import { ProductListScreenProps } from '../navigation/types';
import { useProducts } from '../hooks/useProducts';
import { ProductListItem } from '../components/ProductListItem';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { SwipeableRow } from '../components/SwipeableRow';
import { Toast } from '../components/Toast';
import { Product } from '../types';
import { useAuthStore } from '../store/authStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { Ionicons } from '@react-native-vector-icons/ionicons';

export const ProductListScreen: React.FC<ProductListScreenProps> = ({ navigation }) => {
  const { products, isLoading, error, refetch } = useProducts();
  const logout = useAuthStore((state) => state.logout);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const favorites = useFavoritesStore((state) => state.favorites);

  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const handleSwipeFavorite = useCallback((product: Product) => {
    const wasFavorite = favorites.some((p) => p.id === product.id);
    toggleFavorite(product);
    setToastMessage(
      wasFavorite
        ? `"${product.title}" eliminado de favoritos`
        : `"${product.title}" agregado a favoritos`
    );
    setIsToastVisible(true);
  }, [toggleFavorite, favorites]);

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
    const isFav = favorites.some((p) => p.id === item.id);
    return (
      <SwipeableRow
        onSwipeRight={() => handleSwipeFavorite(item)}
        isFavorite={isFav}
      >
        <ProductListItem product={item} onPress={handlePress} isFavorite={isFav} />
      </SwipeableRow>
    );
  }, [handlePress, handleSwipeFavorite, favorites]);

  const renderSkeleton = () => (
    <View className="flex-row p-4 bg-white rounded-lg shadow-sm mb-3 mx-4 items-center">
      <SkeletonLoader width={80} height={80} borderRadius={8} />
      <View className="ml-4 flex-1">
        <SkeletonLoader width="80%" height={20} className="mb-2" />
        <SkeletonLoader width="40%" height={16} />
      </View>
    </View>
  );

  const renderHeader = useCallback(() => (
    <View className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 mb-2 mx-4 mt-2 flex-row items-center">
      <Ionicons name="information-circle-outline" size={24} color="#2563eb" style={{ marginRight: 12 }} />
      <Text className="text-xs text-blue-800 flex-1 leading-relaxed">
        <Text className="font-bold">Gesto rápido:</Text> Desliza cualquier producto hacia la derecha para agregarlo o eliminarlo de tus favoritos de forma instantánea.
      </Text>
    </View>
  ), []);

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
        extraData={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
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

      <Toast
        visible={isToastVisible}
        message={toastMessage}
        onHide={() => setIsToastVisible(false)}
        iconName={isToastVisible && toastMessage.includes('eliminado') ? 'heart-dislike-outline' : 'heart-outline'}
        iconColor={isToastVisible && toastMessage.includes('eliminado') ? '#ef4444' : '#ec4899'}
      />
    </View>
  );
};
