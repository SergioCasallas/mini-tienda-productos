import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, ListRenderItem, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFavoritesStore } from '../store/favoritesStore';
import { ProductListItem } from '../components/ProductListItem';
import { EmptyState } from '../components/EmptyState';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Product } from '../types';
import { RootStackParamList } from '../navigation/types';
import { Ionicons } from '@react-native-vector-icons/ionicons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Favorites'>;

export const FavoritesScreen: React.FC = () => {
  const favorites = useFavoritesStore((state) => state.favorites);
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);
  const navigation = useNavigation<NavigationProp>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleClearRequest = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleConfirmClear = useCallback(() => {
    clearFavorites();
    setIsModalVisible(false);
  }, [clearFavorites]);

  useEffect(() => {
    navigation.setOptions?.({
      headerRight: () => favorites.length > 0 ? (
        <TouchableOpacity 
          onPress={handleClearRequest} 
          style={{ marginRight: 15 }}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={24} color="#ef4444" />
        </TouchableOpacity>
      ) : null,
    });
  }, [navigation, favorites.length, handleClearRequest]);

  const handlePress = useCallback((id: number) => {
    console.log('handlePress', id);
    navigation.navigate('ProductDetail', { id });
  }, [navigation]);

  const renderItem: ListRenderItem<Product> = useCallback(({ item }) => {
    return (
      <View className="mx-4 mb-3">
        <ProductListItem product={item} onPress={handlePress} isFavorite={false} />
      </View>
    );
  }, [handlePress]);

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 16 }}
        ListEmptyComponent={<EmptyState message="No tienes productos favoritos aún" />}
      />

      <ConfirmationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleConfirmClear}
        title="¿Eliminar todos los favoritos?"
        message="Esta acción eliminará todos los productos guardados en tu lista de favoritos."
        confirmText="Eliminar"
        cancelText="Cancelar"
        iconName="trash-outline"
        iconColor="#ef4444"
        iconBgColor="bg-red-50"
      />
    </View>
  );
};

