import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  ProductList: undefined;
  Favorites: undefined;
  ProductDetail: { id: number };
};

export type BottomTabParamList = {
  ProductsTab: NavigatorScreenParams<RootStackParamList>;
  FavoritesTab: NavigatorScreenParams<RootStackParamList>;
};

export type ProductListScreenProps = NativeStackScreenProps<RootStackParamList, 'ProductList'>;
export type ProductDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;
export type FavoritesScreenProps = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

