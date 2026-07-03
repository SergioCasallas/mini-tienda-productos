import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <View className="flex-1 justify-center items-center p-6">
      <Ionicons name="alert-circle-outline" size={48} color="#ef4444" style={{ marginBottom: 12 }} />
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

