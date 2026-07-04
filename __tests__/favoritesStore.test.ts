import { useFavoritesStore } from '../src/store/favoritesStore';
import { Product } from '../src/types';

// Mock MMKV to prevent native dependency issues in tests
jest.mock('react-native-mmkv', () => {
  return {
    createMMKV: jest.fn().mockImplementation(() => ({
      set: jest.fn(),
      getString: jest.fn().mockReturnValue(null),
      remove: jest.fn(),
    })),
  };
});

describe('favoritesStore', () => {
  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'Test Description',
    price: 10,
    discountPercentage: 0,
    rating: 5,
    stock: 10,
    brand: 'Test Brand',
    category: 'Test Category',
    thumbnail: 'test.jpg',
    images: ['test.jpg'],
  };

  beforeEach(() => {
    // Clear the store before each test
    useFavoritesStore.setState({ favorites: [] });
  });

  it('should add a product to favorites', () => {
    useFavoritesStore.getState().addFavorite(mockProduct);
    const { favorites } = useFavoritesStore.getState();
    expect(favorites).toHaveLength(1);
    expect(favorites[0].id).toBe(1);
  });

  it('should remove a product from favorites', () => {
    useFavoritesStore.getState().addFavorite(mockProduct);
    useFavoritesStore.getState().removeFavorite(1);
    const { favorites } = useFavoritesStore.getState();
    expect(favorites).toHaveLength(0);
  });

  it('should toggle a product correctly', () => {
    const store = useFavoritesStore.getState();
    store.toggleFavorite(mockProduct); // Adds it
    expect(useFavoritesStore.getState().favorites).toHaveLength(1);
    
    useFavoritesStore.getState().toggleFavorite(mockProduct); // Removes it
    expect(useFavoritesStore.getState().favorites).toHaveLength(0);
  });

  it('should clear all favorites', () => {
    useFavoritesStore.getState().addFavorite(mockProduct);
    useFavoritesStore.getState().addFavorite({ ...mockProduct, id: 2, title: 'Product 2' });
    expect(useFavoritesStore.getState().favorites).toHaveLength(2);
    
    useFavoritesStore.getState().clearFavorites();
    expect(useFavoritesStore.getState().favorites).toHaveLength(0);
  });

  it('should remove multiple products from favorites', () => {
    useFavoritesStore.getState().addFavorite(mockProduct);
    useFavoritesStore.getState().addFavorite({ ...mockProduct, id: 2, title: 'Product 2' });
    useFavoritesStore.getState().addFavorite({ ...mockProduct, id: 3, title: 'Product 3' });
    expect(useFavoritesStore.getState().favorites).toHaveLength(3);

    useFavoritesStore.getState().removeMultipleFavorites([1, 3]);
    const { favorites } = useFavoritesStore.getState();
    expect(favorites).toHaveLength(1);
    expect(favorites[0].id).toBe(2);
  });
});
