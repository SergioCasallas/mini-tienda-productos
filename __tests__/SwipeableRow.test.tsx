import React from 'react';
import { View, Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { SwipeableRow } from '../src/components/SwipeableRow';

describe('SwipeableRow', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <SwipeableRow onSwipeRight={() => {}}>
        <View>
          <Text>Item Content</Text>
        </View>
      </SwipeableRow>
    );

    expect(getByText('Item Content')).toBeTruthy();
  });
});
