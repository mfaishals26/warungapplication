// components/themed-text.tsx
import React from 'react';
import { Text, TextProps } from 'react-native';
import { Colors } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';

export default function ThemedText(props: TextProps) {
  const scheme = useColorScheme?.() ?? 'dark';
  const color = Colors?.[scheme]?.text ?? '#F4EEE6';

  return <Text {...props} style={[{ color }, props.style]} />;
}
