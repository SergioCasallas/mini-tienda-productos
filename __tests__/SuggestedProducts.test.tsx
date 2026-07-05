import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SuggestedProducts } from '../src/components/SuggestedProducts';
import { useProducts } from '../src/hooks/useProducts';
import { useFavoritesStore } from '../src/store/favoritesStore';

jest.mock('../src/hooks/useProducts', () => ({
  useProducts: jest.fn(),
}));

describe('SuggestedProducts', () => {
  const mockProducts = [
    {
      id: 1,
      title: 'Product 1',
      description: 'Desc 1',
      price: 10,
      discountPercentage: 0,
      rating: 4.5,
      stock: 10,
      brand: 'Brand 1',
      category: 'Cat 1',
      thumbnail: 'thumb1.jpg',
      images: [],
    },
    {
      id: 2,
      title: 'Product 2',
      description: 'Desc 2',
      price: 20,
      discountPercentage: 0,
      rating: 4.8,
      stock: 5,
      brand: 'Brand 2',
      category: 'Cat 2',
      thumbnail: 'thumb2.jpg',
      images: [],
    },
    {
      id: 3,
      title: 'Product 3',
      description: 'Desc 3',
      price: 30,
      discountPercentage: 0,
      rating: 4.0,
      stock: 8,
      brand: 'Brand 3',
      category: 'Cat 3',
      thumbnail: 'thumb3.jpg',
      images: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useFavoritesStore.setState({ favorites: [] });
  });

  it('renders skeleton loader when loading', () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      isLoading: true,
      error: null,
    });

    const { getByText } = render(
      <SuggestedProducts currentProductId={1} onPressProduct={jest.fn()} />
    );

    expect(getByText('Te podría interesar')).toBeTruthy();
  });

  it('renders suggestions excluding the current product', () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: mockProducts,
      isLoading: false,
      error: null,
    });

    const { getByText, queryByText } = render(
      <SuggestedProducts currentProductId={1} onPressProduct={jest.fn()} />
    );

    expect(getByText('Product 2')).toBeTruthy();
    expect(getByText('Product 3')).toBeTruthy();
    expect(queryByText('Product 1')).toBeNull();
  });

  it('triggers onPressProduct when a card is clicked', () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: mockProducts,
      isLoading: false,
      error: null,
    });

    const mockPress = jest.fn();
    const { getByText } = render(
      <SuggestedProducts currentProductId={1} onPressProduct={mockPress} />
    );

    fireEvent.press(getByText('Product 2'));
    expect(mockPress).toHaveBeenCalledWith(2);
  });

  it('adds item to favorites when heart icon is pressed', () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: mockProducts,
      isLoading: false,
      error: null,
    });

    const { getByTestId } = render(
      <SuggestedProducts currentProductId={1} onPressProduct={jest.fn()} />
    );

    const heartBtn = getByTestId('suggested-fav-2');
    fireEvent.press(heartBtn);

    const favs = useFavoritesStore.getState().favorites;
    expect(favs.some((p) => p.id === 2)).toBe(true);
  });

  it('removes item from favorites when heart icon is pressed and it was favorite', () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: mockProducts,
      isLoading: false,
      error: null,
    });

    useFavoritesStore.setState({ favorites: [mockProducts[1]] });

    const { getByTestId } = render(
      <SuggestedProducts currentProductId={1} onPressProduct={jest.fn()} />
    );

    const heartBtn = getByTestId('suggested-fav-2');
    fireEvent.press(heartBtn);

    const favs = useFavoritesStore.getState().favorites;
    expect(favs.some((p) => p.id === 2)).toBe(false);
  });
});
