import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, ListRenderItem, TouchableOpacity, Text } from 'react-native';
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
  const removeMultipleFavorites = useFavoritesStore((state) => state.removeMultipleFavorites);
  const navigation = useNavigation<NavigationProp>();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const isSelectionMode = selectedIds.length > 0;

  const handleToggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  const handlePress = useCallback((id: number) => {
    if (selectedIds.length > 0) {
      handleToggleSelect(id);
    } else {
      navigation.navigate('ProductDetail', { id });
    }
  }, [selectedIds.length, handleToggleSelect, navigation]);

  const handleLongPress = useCallback((id: number) => {
    handleToggleSelect(id);
  }, [handleToggleSelect]);

  const handleDeleteRequest = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (isSelectionMode) {
      removeMultipleFavorites(selectedIds);
      setSelectedIds([]);
    } else {
      clearFavorites();
    }
    setIsModalVisible(false);
  }, [isSelectionMode, selectedIds, removeMultipleFavorites, clearFavorites]);

  useEffect(() => {
    if (isSelectionMode) {
      navigation.setOptions?.({
        title: `${selectedIds.length} seleccionados`,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => setSelectedIds([])}
            style={{ marginLeft: 15 }}
            activeOpacity={0.7}
          >
            <Ionicons name="close-outline" size={24} color="#374151" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={handleDeleteRequest}
            style={{ marginRight: 15 }}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={24} color="#ef4444" />
          </TouchableOpacity>
        ),
      });
    } else {
      navigation.setOptions?.({
        title: 'Favoritos',
        headerLeft: undefined,
        headerRight: () => favorites.length > 0 ? (
          <TouchableOpacity
            onPress={handleDeleteRequest}
            style={{ marginRight: 15 }}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={24} color="#ef4444" />
          </TouchableOpacity>
        ) : null,
      });
    }
  }, [navigation, favorites.length, selectedIds.length, isSelectionMode, handleDeleteRequest]);

  const renderItem: ListRenderItem<Product> = useCallback(({ item }) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <View className="mx-4 mb-3">
        <ProductListItem
          product={item}
          onPress={handlePress}
          onLongPress={handleLongPress}
          isFavorite={false}
          isSelected={isSelected}
        />
      </View>
    );
  }, [handlePress, handleLongPress, selectedIds]);

  const renderHeader = useCallback(() => {
    if (favorites.length === 0) return null;
    return (
      <View className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 mb-2 mx-4 flex-row items-center">
        <Ionicons name="information-circle-outline" size={24} color="#2563eb" style={{ marginRight: 12 }} />
        <Text className="text-xs text-blue-800 flex-1 leading-relaxed">
          <Text className="font-bold">Cómo eliminar:</Text> Mantén presionado un producto para seleccionarlo, marca los que desees y toca el ícono del basurero arriba a la derecha. Para eliminar todos a la vez, toca el ícono del basurero directamente sin seleccionar ninguno.
        </Text>
      </View>
    );
  }, [favorites.length]);

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={favorites}
        extraData={selectedIds}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingVertical: 16 }}
        ListEmptyComponent={<EmptyState message="No tienes productos favoritos aún" />}
      />

      <ConfirmationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleConfirmDelete}
        title={isSelectionMode ? '¿Eliminar seleccionados?' : '¿Eliminar todos los favoritos?'}
        message={
          isSelectionMode
            ? `Esta acción eliminará los ${selectedIds.length} productos seleccionados de tu lista de favoritos.`
            : 'Esta acción eliminará todos los productos guardados en tu lista de favoritos.'
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        iconName="trash-outline"
        iconColor="#ef4444"
        iconBgColor="bg-red-50"
      />
    </View>
  );
};
