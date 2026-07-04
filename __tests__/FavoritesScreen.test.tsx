import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { FavoritesScreen } from '../src/screens/FavoritesScreen';
import { useFavoritesStore } from '../src/store/favoritesStore';

// Mock navigation
const mockNavigate = jest.fn();
const mockSetOptions = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    setOptions: mockSetOptions,
  }),
}));

describe('FavoritesScreen', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favorites: [] });
    mockNavigate.mockClear();
    mockSetOptions.mockClear();
  });

  it('renders empty state when no favorites exist', () => {
    const { getByText } = render(<FavoritesScreen />);
    expect(getByText('No tienes productos favoritos aún')).toBeTruthy();
  });

  it('renders favorites when they exist', () => {
    useFavoritesStore.setState({
      favorites: [
        {
          id: 1,
          title: 'Favorite Product',
          description: 'Desc',
          price: 10,
          discountPercentage: 0,
          rating: 5,
          stock: 10,
          brand: 'Brand',
          category: 'Cat',
          thumbnail: 'thumb.jpg',
          images: [],
        },
      ],
    });

    const { getByText } = render(<FavoritesScreen />);
    expect(getByText('Favorite Product')).toBeTruthy();
  });

  it('selects item on long press and deselects on second press', () => {
    const mockProduct = {
      id: 1,
      title: 'Favorite Product',
      description: 'Desc',
      price: 10,
      discountPercentage: 0,
      rating: 5,
      stock: 10,
      brand: 'Brand',
      category: 'Cat',
      thumbnail: 'thumb.jpg',
      images: [],
    };
    useFavoritesStore.setState({ favorites: [mockProduct] });

    const { getByText, queryByTestId, getByTestId } = render(<FavoritesScreen />);
    const item = getByText('Favorite Product');

    // Initially not selected
    expect(queryByTestId('select-indicator')).toBeNull();

    // Long press to enter selection mode
    fireEvent(item, 'longPress');

    // Should show checkmark select-indicator
    expect(getByTestId('select-indicator')).toBeTruthy();

    // Press again to deselect
    fireEvent.press(item);
    expect(queryByTestId('select-indicator')).toBeNull();
  });

  it('navigates to ProductDetail on press of item', () => {
    const mockProduct = {
      id: 1,
      title: 'Favorite Product',
      description: 'Desc',
      price: 10,
      discountPercentage: 0,
      rating: 5,
      stock: 10,
      brand: 'Brand',
      category: 'Cat',
      thumbnail: 'thumb.jpg',
      images: [],
    };
    useFavoritesStore.setState({ favorites: [mockProduct] });

    const { getByText } = render(<FavoritesScreen />);
    fireEvent.press(getByText('Favorite Product'));

    expect(mockNavigate).toHaveBeenCalledWith('ProductDetail', { id: 1 });
  });

  it('shows and hides confirmation modal when clicking trash icon (when not in selection mode)', () => {
    const mockProduct = {
      id: 1,
      title: 'Favorite Product',
      description: 'Desc',
      price: 10,
      discountPercentage: 0,
      rating: 5,
      stock: 10,
      brand: 'Brand',
      category: 'Cat',
      thumbnail: 'thumb.jpg',
      images: [],
    };
    useFavoritesStore.setState({ favorites: [mockProduct] });

    const { queryByText, getByText } = render(<FavoritesScreen />);

    // Get headerRight function from setOptions
    expect(mockSetOptions).toHaveBeenCalled();
    const lastCall = mockSetOptions.mock.calls[mockSetOptions.mock.calls.length - 1][0];
    const HeaderRight = lastCall.headerRight;
    expect(HeaderRight).toBeTruthy();

    const headerRightElement = HeaderRight();
    
    // Call the onPress callback directly
    act(() => {
      headerRightElement.props.onPress();
    });

    // Confirmation modal should be visible now
    expect(getByText('¿Eliminar todos los favoritos?')).toBeTruthy();

    // Test cancel option (onClose)
    fireEvent.press(getByText('Cancelar'));
    expect(queryByText('¿Eliminar todos los favoritos?')).toBeNull();
  });

  it('clears all favorites when confirm is clicked', () => {
    const mockProduct = {
      id: 1,
      title: 'Favorite Product',
      description: 'Desc',
      price: 10,
      discountPercentage: 0,
      rating: 5,
      stock: 10,
      brand: 'Brand',
      category: 'Cat',
      thumbnail: 'thumb.jpg',
      images: [],
    };
    useFavoritesStore.setState({ favorites: [mockProduct] });

    const { getByText } = render(<FavoritesScreen />);

    // Trigger delete request
    const lastCall = mockSetOptions.mock.calls[mockSetOptions.mock.calls.length - 1][0];
    act(() => {
      lastCall.headerRight().props.onPress();
    });

    // Confirm deletion
    act(() => {
      fireEvent.press(getByText('Eliminar'));
    });

    expect(useFavoritesStore.getState().favorites).toHaveLength(0);
  });

  it('deletes only selected items in selection mode', () => {
    const mockProduct1 = {
      id: 1,
      title: 'Product 1',
      description: 'Desc',
      price: 10,
      discountPercentage: 0,
      rating: 5,
      stock: 10,
      brand: 'Brand',
      category: 'Cat',
      thumbnail: 'thumb.jpg',
      images: [],
    };
    const mockProduct2 = {
      id: 2,
      title: 'Product 2',
      description: 'Desc',
      price: 10,
      discountPercentage: 0,
      rating: 5,
      stock: 10,
      brand: 'Brand',
      category: 'Cat',
      thumbnail: 'thumb.jpg',
      images: [],
    };
    useFavoritesStore.setState({ favorites: [mockProduct1, mockProduct2] });

    const { getByText } = render(<FavoritesScreen />);

    // Long press Product 1 to enter selection mode
    fireEvent(getByText('Product 1'), 'longPress');

    // Get mockSetOptions call for selection mode
    expect(mockSetOptions).toHaveBeenCalled();
    const lastCall = mockSetOptions.mock.calls[mockSetOptions.mock.calls.length - 1][0];
    
    // Check that title shows "1 seleccionados"
    expect(lastCall.title).toBe('1 seleccionados');

    // Test clear selection using HeaderLeft
    const HeaderLeft = lastCall.headerLeft;
    act(() => {
      HeaderLeft().props.onPress();
    });

    // Title should be "Favoritos" again
    const clearedCall = mockSetOptions.mock.calls[mockSetOptions.mock.calls.length - 1][0];
    expect(clearedCall.title).toBe('Favoritos');

    // Enter selection mode again
    fireEvent(getByText('Product 1'), 'longPress');
    
    // Now trigger deletion of selected
    const activeSelectionCall = mockSetOptions.mock.calls[mockSetOptions.mock.calls.length - 1][0];
    act(() => {
      activeSelectionCall.headerRight().props.onPress();
    });

    // Confirm modal should ask for delete selected
    expect(getByText('¿Eliminar seleccionados?')).toBeTruthy();

    // Confirm deletion
    act(() => {
      fireEvent.press(getByText('Eliminar'));
    });

    // Product 1 should be gone, Product 2 should remain
    const remaining = useFavoritesStore.getState().favorites;
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe(2);
  });
});
