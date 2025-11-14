// components/haptic-tab.js
import React from 'react';
import { Pressable, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
export default function HapticTab({ children, onPress, style }) {
  const handle = (...args) => { try { Haptics.selectionAsync(); } catch(e){} if (onPress) onPress(...args); };
  return <Pressable onPress={handle} style={style}><Text>{children}</Text></Pressable>;
}
