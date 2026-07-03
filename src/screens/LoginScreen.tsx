import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

export const LoginScreen: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(() => {
    if (!username.trim() || !password.trim()) {
      setError('Por favor, ingresa tu usuario y contraseña.');
      return;
    }
    setError('');
    setLoading(true);

    //Buscamos simular un delay de red para que se sienta real
    setTimeout(() => {
      login(username.trim());
      setLoading(false);
    }, 800);
  }, [username, password, login]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center px-6 md:px-12">
            <View className="items-center mb-8">
              <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="lock-closed" size={32} color="#2563eb" />
              </View>
              <Text className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                Mini Tienda
              </Text>
              <Text className="text-sm text-gray-500 text-center">
                Ingresa tus datos para continuar
              </Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Usuario
                </Text>
                <View className="flex-row items-center border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus-within:border-blue-500">
                  <Ionicons name="person-outline" size={20} color="#9ca3af" className="mr-2" />
                  <TextInput
                    placeholder="ej. sergio_casallas"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="flex-1 text-gray-900 text-base"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              <View className="mt-4">
                <Text className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Contraseña
                </Text>
                <View className="flex-row items-center border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus-within:border-blue-500">
                  <Ionicons name="key-outline" size={20} color="#9ca3af" className="mr-2" />
                  <TextInput
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="flex-1 text-gray-900 text-base"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              {error ? (
                <View className="flex-row items-center bg-red-50 p-3 rounded-xl mt-4">
                  <Ionicons name="alert-circle-outline" size={20} color="#ef4444" className="mr-2" />
                  <Text className="text-sm text-red-600 flex-1">{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                className="w-full bg-blue-600 py-3.5 rounded-xl shadow-md shadow-blue-500/20 active:bg-blue-700 mt-6 items-center justify-center"
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-base">Iniciar Sesión</Text>
                )}
              </TouchableOpacity>

              <View className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <Text className="text-xs text-gray-500 text-center leading-relaxed">
                  💡 <Text className="font-semibold text-gray-700">Acceso Demo:</Text> Puedes ingresar cualquier usuario y contraseña para probar la aplicación.
                </Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
