import React from 'react';
import { View, Text } from 'react-native';

interface EmptyStateProps {
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-gray-500 text-lg text-center">{message}</Text>
    </View>
  );
};
