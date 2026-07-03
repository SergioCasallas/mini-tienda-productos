import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';

interface EmptyStateProps {
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <View className="flex-1 justify-center items-center p-6">
      <Ionicons name="basket-outline" size={48} color="#9ca3af" style={{ marginBottom: 12 }} />
      <Text className="text-gray-500 text-lg text-center">{message}</Text>
    </View>
  );
};

