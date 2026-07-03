import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList, BottomTabParamList } from './types';
import { ProductListScreen } from '../screens/ProductListScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { Ionicons } from '@react-native-vector-icons/ionicons';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

const ProductsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{ title: 'Productos' }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Detalle' }}
      />
    </Stack.Navigator>
  );
};

const FavoritesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{ title: 'Favoritos' }} 
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen} 
        options={{ title: 'Detalle' }} 
      />
    </Stack.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#2563eb',
          tabBarInactiveTintColor: '#6b7280',
          popToTopOnBlur: true,
        }}
      >
        <Tab.Screen
          name="ProductsTab"
          component={ProductsStack}
          options={{
            headerShown: false,
            title: 'Inicio',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="FavoritesTab"
          component={FavoritesStack}
          options={{
            headerShown: false,
            title: 'Favoritos',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

