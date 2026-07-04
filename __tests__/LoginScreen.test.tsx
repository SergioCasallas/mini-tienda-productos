import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Platform } from 'react-native';
import { LoginScreen } from '../src/screens/LoginScreen';
import { useAuthStore } from '../src/store/authStore';

describe('LoginScreen', () => {
  beforeEach(() => {
    useAuthStore.setState({ isLoggedIn: false, username: null });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    expect(getByText('Mini Tienda')).toBeTruthy();
    expect(getByPlaceholderText('ej. sergio_casallas')).toBeTruthy();
  });

  it('shows error message if submitting empty form', () => {
    const { getByText } = render(<LoginScreen />);
    const button = getByText('Iniciar Sesión');

    fireEvent.press(button);

    expect(getByText('Por favor, ingresa tu usuario y contraseña.')).toBeTruthy();
  });

  it('successfully logs in with mock delay', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    const usernameInput = getByPlaceholderText('ej. sergio_casallas');
    const passwordInput = getByPlaceholderText('••••••••');
    const button = getByText('Iniciar Sesión');

    fireEvent.changeText(usernameInput, 'sergio_user');
    fireEvent.changeText(passwordInput, 'password123');

    fireEvent.press(button);

    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(800);
    });

    const { isLoggedIn, username } = useAuthStore.getState();
    expect(isLoggedIn).toBe(true);
    expect(username).toBe('sergio_user');
  });

  it('renders correctly on Android', () => {
    const originalOS = Platform.OS;
    // We cast to any because OS is read-only in typical TS definitions but mutable in JS/mock environments
    (Platform as any).OS = 'android';
    
    try {
      const { getByText } = render(<LoginScreen />);
      expect(getByText('Mini Tienda')).toBeTruthy();
    } finally {
      (Platform as any).OS = originalOS;
    }
  });
});
