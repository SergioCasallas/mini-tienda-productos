import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ConfirmationModal } from '../src/components/ConfirmationModal';

describe('ConfirmationModal', () => {
  it('does not render when visible is false', () => {
    const { queryByText } = render(
      <ConfirmationModal
        visible={false}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        title="Test Title"
        message="Test Message"
      />
    );
    expect(queryByText('Test Title')).toBeNull();
  });

  it('renders correctly when visible is true and calls callbacks', () => {
    const onCloseMock = jest.fn();
    const onConfirmMock = jest.fn();

    const { getByText } = render(
      <ConfirmationModal
        visible={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        title="Test Title"
        message="Test Message"
        confirmText="Aceptar"
        cancelText="Rechazar"
      />
    );

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Message')).toBeTruthy();

    // Confirm button
    fireEvent.press(getByText('Aceptar'));
    expect(onConfirmMock).toHaveBeenCalledTimes(1);

    // Cancel button
    fireEvent.press(getByText('Rechazar'));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is pressed', () => {
    const onCloseMock = jest.fn();
    const { getByTestId } = render(
      <ConfirmationModal
        visible={true}
        onClose={onCloseMock}
        onConfirm={jest.fn()}
        title="Test Title"
        message="Test Message"
      />
    );

    // Click backdrop
    fireEvent.press(getByTestId('modal-backdrop'));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('stops event propagation on inner content press', () => {
    const { getByTestId } = render(
      <ConfirmationModal
        visible={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        title="Test Title"
        message="Test Message"
      />
    );

    const innerContent = getByTestId('modal-content');
    const stopPropagationMock = jest.fn();
    fireEvent(innerContent, 'press', { stopPropagation: stopPropagationMock });
    expect(stopPropagationMock).toHaveBeenCalledTimes(1);
  });
});
