import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Toast } from '../src/components/Toast';

describe('Toast Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not render when visible is false', () => {
    const { queryByText } = render(
      <Toast visible={false} message="Test Toast" onHide={() => {}} />
    );
    expect(queryByText('Test Toast')).toBeNull();
  });

  it('renders when visible is true', () => {
    const { getByText } = render(
      <Toast visible={true} message="Test Toast" onHide={() => {}} />
    );
    expect(getByText('Test Toast')).toBeTruthy();
  });

  it('calls onHide after duration', () => {
    const mockOnHide = jest.fn();
    render(
      <Toast visible={true} message="Test Toast" duration={1000} onHide={mockOnHide} />
    );

    act(() => {
      jest.advanceTimersByTime(1300);
    });

    expect(mockOnHide).toHaveBeenCalled();
  });
});
