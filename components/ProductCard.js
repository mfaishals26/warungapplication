// components/ProductCard.js
import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import Price from './Price';

export default function ProductCard({ item, onAdd }) {
  return (
    <View style={styles.card}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={{ color: '#999', fontSize: 12 }}>No Image</Text>
        </View>
      )}

      <Text style={styles.name}>{item.name}</Text>
      <Price value={item.price} style={styles.price} />

      <Pressable onPress={() => onAdd(item)} style={styles.addBtn}>
        <Text style={styles.addBtnText}>+ Tambah</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#3B3535',
    margin: 6,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },
  imagePlaceholder: {
    backgroundColor: '#4A4242',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: { color: '#F4EEE6', fontWeight: '700', textAlign: 'center' },
  price: { color: '#E2D3B7', fontSize: 14, marginVertical: 4 },
  addBtn: {
    marginTop: 8,
    backgroundColor: '#E2D3B7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addBtnText: { color: '#2F2A2A', fontWeight: '700' },
});
