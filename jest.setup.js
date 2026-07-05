import '@testing-library/jest-native/extend-expect';

jest.mock('react-native-mmkv', () => {
  return {
    createMMKV: jest.fn().mockImplementation(() => ({
      set: jest.fn(),
      getString: jest.fn().mockReturnValue(null),
      remove: jest.fn(),
    })),
  };
});

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: {
      View: View,
    },
    Animated: {
      View: View,
    },
    useSharedValue: (val) => ({ value: val }),
    useAnimatedStyle: (cb) => cb(),
    withTiming: (toValue) => toValue,
    withSpring: (toValue) => toValue,
    withRepeat: (anim) => anim,
    withSequence: (...anims) => anims[anims.length - 1],
  };
});
