import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import SignUpScreen from '../signup';
import { useAuth } from '../../../context/AuthContext';

// Mock router and useAuth
jest.mock('expo-router', () => ({
  router: { replace: jest.fn(), push: jest.fn(), back: jest.fn() },
}));
jest.mock('../../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

describe('SignUpScreen', () => {
  const mockSignup = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ signup: mockSignup });
  });

  it('renders all inputs and buttons', () => {
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
    expect(getByText('Already have an account?')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('shows error if any field is empty', async () => {
    const { getByText } = render(<SignUpScreen />);
    fireEvent.press(getByText('Sign Up'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields');
    });
  });

  it('shows error for invalid email', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid');
    fireEvent.changeText(getByPlaceholderText('Password'), '123456');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), '123456');
    fireEvent.press(getByText('Sign Up'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter a valid email address');
    });
  });

  it('shows error if passwords do not match', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), '123456');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), '654321');
    fireEvent.press(getByText('Sign Up'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Passwords do not match');
    });
  });

  it('shows error if password is too short', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), '123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), '123');
    fireEvent.press(getByText('Sign Up'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        'Password must be at least 6 characters long'
      );
    });
  });

  it('calls signup and navigates on success', async () => {
    mockSignup.mockResolvedValueOnce({});
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), '123456');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), '123456');
    fireEvent.press(getByText('Sign Up'));
    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith('test@example.com', '123456');
      expect(router.replace).toHaveBeenCalledWith('/(tabs)/(home)');
    });
  });

  it('shows error on signup failure', async () => {
    mockSignup.mockRejectedValueOnce(new Error('Signup failed'));
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), '123456');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), '123456');
    fireEvent.press(getByText('Sign Up'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Signup failed');
    });
  });

  it('navigates back to login on Sign In press', () => {
    const { getByText } = render(<SignUpScreen />);
    fireEvent.press(getByText('Sign In'));
    expect(router.back).toHaveBeenCalled();
  });

  it('navigates back to home on ← Back press', () => {
    const { getByText } = render(<SignUpScreen />);
    fireEvent.press(getByText('← Back'));
    expect(router.push).toHaveBeenCalledWith('/');
  });
});
