// components/CardButton.js
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
export default function CardButton({ title, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.btn}>
      <Text style={styles.txt}>{title}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  btn: { backgroundColor: '#3B3535', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#4A4242' },
  txt: { color: '#F4EEE6', fontSize: 16 },
});
