// components/external-link.js
import React from 'react';
import { Pressable, Text, Linking } from 'react-native';
export default function ExternalLink({ href, children, style }) {
  const open = async () => { try { const ok = await Linking.canOpenURL(href); if (ok) Linking.openURL(href); } catch (e) { console.warn(e); } };
  return <Pressable onPress={open} style={style}><Text>{children || href}</Text></Pressable>;
}
