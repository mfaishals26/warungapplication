// components/themed-view.tsx
import React from 'react';
import { View, ViewProps } from 'react-native';
import { Colors } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';

export default function ThemedView(props: ViewProps) {
  const scheme = useColorScheme?.() ?? 'dark';
  const backgroundColor = Colors?.[scheme]?.background ?? '#2F2A2A';

  return <View {...props} style={[{ backgroundColor }, props.style]} />;
}
