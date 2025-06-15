import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedText } from '../ThemedText';

jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn(() => '#000000'),
}));

jest.mock('@/hooks/useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

describe('ThemedText', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<ThemedText>Test text</ThemedText>);
    expect(getByText('Test text')).toBeTruthy();
  });

  it('renders correctly with title type', () => {
    const { getByText } = render(<ThemedText type="title">Title text</ThemedText>);
    expect(getByText('Title text')).toBeTruthy();
  });

  it('renders correctly with subtitle type', () => {
    const { getByText } = render(<ThemedText type="subtitle">Subtitle text</ThemedText>);
    expect(getByText('Subtitle text')).toBeTruthy();
  });

  it('renders correctly with link type', () => {
    const { getByText } = render(<ThemedText type="link">Link text</ThemedText>);
    expect(getByText('Link text')).toBeTruthy();
  });

  it('renders correctly with custom colors', () => {
    const { getByText } = render(
      <ThemedText lightColor="#ff0000" darkColor="#00ff00">
        Colored text
      </ThemedText>
    );
    expect(getByText('Colored text')).toBeTruthy();
  });
});
