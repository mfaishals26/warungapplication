// components/themed-view.js
import React from 'react';
import { View } from 'react-native';
import useColorScheme from '../hooks/use-color-scheme';
import { Colors } from '../constants/theme';
export default function ThemedView(props) {
  const scheme = useColorScheme();
  const bg = (Colors[scheme] && Colors[scheme].background) || Colors.dark.background;
  return <View {...props} style={[{ backgroundColor: bg }, props.style]}>{props.children}</View>;
}
