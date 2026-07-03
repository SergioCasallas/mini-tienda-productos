import React, { useCallback } from 'react';
import { View, FlatList, ListRenderItem } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useFavoritesStore } from '../store/favoritesStore';
import { ProductListItem } from '../components/ProductListItem';
import { EmptyState } from '../components/EmptyState';
import { Product } from '../types';
import { BottomTabParamList } from '../navigation/types';

type NavigationProp = BottomTabNavigationProp<BottomTabParamList, 'FavoritesTab'>;

export const FavoritesScreen: React.FC = () => {
  const favorites = useFavoritesStore((state) => state.favorites);
  const navigation = useNavigation<NavigationProp>();

  const handlePress = useCallback((id: number) => {
    console.log('handlePress', id);
    navigation.navigate('ProductsTab', {
      screen: 'ProductDetail',
      params: { id },
    });

  }, [navigation]);

  const renderItem: ListRenderItem<Product> = useCallback(({ item }) => {
    return <ProductListItem product={item} onPress={handlePress} />;
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
    </View>
  );
};
