import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FavoritesScreen } from '../src/screens/FavoritesScreen';
import { useFavoritesStore } from '../src/store/favoritesStore';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    setOptions: jest.fn(),
  }),
}));

describe('FavoritesScreen', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favorites: [] });
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
});
