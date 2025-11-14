// components/Price.js
import React from 'react';
import { Text } from 'react-native';
export default function Price({ value, style }) {
  const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
  return <Text style={style}>{rupiah}</Text>;
}
