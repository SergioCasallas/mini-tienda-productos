import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProductListItem } from '../src/components/ProductListItem';
import { Product } from '../src/types';

describe('ProductListItem', () => {
  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'Test Description',
    price: 19.99,
    discountPercentage: 0,
    rating: 5,
    stock: 10,
    brand: 'Test Brand',
    category: 'Test Category',
    thumbnail: 'test.jpg',
    images: ['test.jpg'],
  };

  it('renders correctly and responds to press', () => {
    const onPressMock = jest.fn();
    const { getByText, queryByTestId } = render(
      <ProductListItem product={mockProduct} onPress={onPressMock} />
    );

    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('$19.99')).toBeTruthy();
    expect(queryByTestId('favorite-icon')).toBeNull();

    fireEvent.press(getByText('Test Product'));
    expect(onPressMock).toHaveBeenCalledWith(1);
  });

  it('renders heart icon when isFavorite is true', () => {
    const { getByTestId } = render(
      <ProductListItem product={mockProduct} onPress={jest.fn()} isFavorite={true} />
    );
    expect(getByTestId('favorite-icon')).toBeTruthy();
  });
});
