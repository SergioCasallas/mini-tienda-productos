import { useAuthStore } from '../src/store/authStore';

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

describe('authStore', () => {
  beforeEach(() => {
    // Clear the store before each test
    useAuthStore.setState({ isLoggedIn: false, username: null });
  });

  it('should initialize with default logged out state', () => {
    const { isLoggedIn, username } = useAuthStore.getState();
    expect(isLoggedIn).toBe(false);
    expect(username).toBeNull();
  });

  it('should login correctly and store username', () => {
    useAuthStore.getState().login('sergio_casallas');
    const { isLoggedIn, username } = useAuthStore.getState();
    expect(isLoggedIn).toBe(true);
    expect(username).toBe('sergio_casallas');
  });

  it('should logout correctly and clear username', () => {
    useAuthStore.getState().login('sergio_casallas');
    useAuthStore.getState().logout();
    const { isLoggedIn, username } = useAuthStore.getState();
    expect(isLoggedIn).toBe(false);
    expect(username).toBeNull();
  });
});
