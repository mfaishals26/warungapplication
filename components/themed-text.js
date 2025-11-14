// components/themed-text.js
import React from 'react';
import { Text } from 'react-native';
import useColorScheme from '../hooks/use-color-scheme';
import { Colors } from '../constants/theme';
export default function ThemedText(props) {
  const scheme = useColorScheme();
  const color = (Colors[scheme] && Colors[scheme].text) || Colors.dark.text;
  return <Text {...props} style={[{ color }, props.style]}>{props.children}</Text>;
}
