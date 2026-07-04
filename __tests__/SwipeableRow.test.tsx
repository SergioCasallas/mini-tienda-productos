import React from 'react';
import { View, Text, PanResponder, Animated } from 'react-native';
import { render, act } from '@testing-library/react-native';
import { SwipeableRow } from '../src/components/SwipeableRow';

describe('SwipeableRow', () => {
  let capturedConfig: any = null;

  beforeAll(() => {
    jest.spyOn(PanResponder, 'create').mockImplementation((config) => {
      capturedConfig = config;
      return {
        panHandlers: {
          onStartShouldSetResponder: () => true,
          onMoveShouldSetResponder: () => true,
          onResponderGrant: () => {},
          onResponderReject: () => {},
          onResponderMove: () => {},
          onResponderRelease: () => {},
          onResponderTerminate: () => {},
          onResponderTerminationRequest: () => true,
        },
      } as any;
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    capturedConfig = null;
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <SwipeableRow onSwipeRight={() => {}}>
        <View>
          <Text>Item Content</Text>
        </View>
      </SwipeableRow>
    );

    expect(getByText('Item Content')).toBeTruthy();
    expect(capturedConfig).toBeTruthy();
  });

  it('tests move should set pan responder conditions', () => {
    render(
      <SwipeableRow onSwipeRight={() => {}}>
        <View>
          <Text>Item Content</Text>
        </View>
      </SwipeableRow>
    );

    const shouldSet = capturedConfig.onMoveShouldSetPanResponder(
      {},
      { dx: 20, dy: 5 }
    );
    expect(shouldSet).toBe(true);

    const shouldNotSet = capturedConfig.onMoveShouldSetPanResponder(
      {},
      { dx: 5, dy: 10 }
    );
    expect(shouldNotSet).toBe(false);
  });

  it('tests pan responder move', () => {
    render(
      <SwipeableRow onSwipeRight={() => {}}>
        <View>
          <Text>Item Content</Text>
        </View>
      </SwipeableRow>
    );

    // Should set value of pan.x
    capturedConfig.onPanResponderMove({}, { dx: 50 });
  });

  it('tests release past threshold', () => {
    jest.useFakeTimers();
    const onSwipeRightMock = jest.fn();
    render(
      <SwipeableRow onSwipeRight={onSwipeRightMock} swipeThreshold={100}>
        <View>
          <Text>Item Content</Text>
        </View>
      </SwipeableRow>
    );

    // dx > swipeThreshold (100)
    act(() => {
      capturedConfig.onPanResponderRelease({}, { dx: 150, vx: 0.1 });
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(onSwipeRightMock).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('tests release flick gesture', () => {
    jest.useFakeTimers();
    const onSwipeRightMock = jest.fn();
    render(
      <SwipeableRow onSwipeRight={onSwipeRightMock} swipeThreshold={100}>
        <View>
          <Text>Item Content</Text>
        </View>
      </SwipeableRow>
    );

    // dx > 40 and vx > 0.5 (flick)
    act(() => {
      capturedConfig.onPanResponderRelease({}, { dx: 45, vx: 0.6 });
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(onSwipeRightMock).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('tests release below threshold', () => {
    jest.useFakeTimers();
    const onSwipeRightMock = jest.fn();
    render(
      <SwipeableRow onSwipeRight={onSwipeRightMock} swipeThreshold={100}>
        <View>
          <Text>Item Content</Text>
        </View>
      </SwipeableRow>
    );

    // Below threshold and not a flick
    act(() => {
      capturedConfig.onPanResponderRelease({}, { dx: 50, vx: 0.1 });
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(onSwipeRightMock).not.toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('tests termination callbacks', () => {
    render(
      <SwipeableRow onSwipeRight={jest.fn()}>
        <View>
          <Text>Item Content</Text>
        </View>
      </SwipeableRow>
    );

    const shouldTerminate = capturedConfig.onPanResponderTerminationRequest();
    expect(shouldTerminate).toBe(false);

    capturedConfig.onPanResponderTerminate();
  });
});
