import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-red-500 text-lg text-center mb-4 font-semibold">
        {message}
      </Text>
      <TouchableOpacity
        className="bg-blue-600 px-6 py-3 rounded-lg"
        onPress={onRetry}
      >
        <Text className="text-white font-bold">Reintentar</Text>
      </TouchableOpacity>
    </View>
  );
};
