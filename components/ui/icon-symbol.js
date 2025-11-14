// components/ui/icon-symbol.js
import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useColorScheme from '../../hooks/use-color-scheme';
import { Colors } from '../../constants/theme';
export default function IconSymbol({ name='ellipse', size=20, color, style }) {
  const scheme = useColorScheme();
  const iconColor = color || (Colors[scheme] && Colors[scheme].icon) || Colors.dark.icon;
  return <View style={style}><Ionicons name={name} size={size} color={iconColor} /></View>;
}
