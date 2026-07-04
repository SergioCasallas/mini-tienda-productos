import React from 'react';
import { Modal, Pressable, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  iconName?: string;
  iconColor?: string;
  iconBgColor?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  iconName = 'help-circle-outline',
  iconColor = '#3b82f6',
  iconBgColor = 'bg-blue-50',
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable 
        testID="modal-backdrop"
        className="flex-1 bg-black/40 justify-center items-center p-6"
        onPress={onClose}
      >
        <Pressable 
          testID="modal-content"
          className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl items-center"
          onPress={(e) => e?.stopPropagation()}
        >
          <View className={`${iconBgColor} p-4 rounded-full mb-4`}>
            <Ionicons name={iconName as any} size={32} color={iconColor} />
          </View>
          
          <Text className="text-xl font-bold text-gray-900 text-center mb-2">
            {title}
          </Text>
          
          <Text className="text-gray-500 text-center mb-6 leading-5">
            {message}
          </Text>
          
          <View className="flex-row w-full gap-3">
            <TouchableOpacity
              className="flex-1 bg-gray-100 py-3 rounded-xl items-center border border-gray-200"
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text className="text-gray-700 font-semibold text-base">{cancelText}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 bg-red-500 py-3 rounded-xl items-center"
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-base">{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
