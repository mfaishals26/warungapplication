// screens/PaymentQrScreen.js
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function PaymentQrScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId, total = 0, customerName = '' } = route.params || {};

  // encode name supaya aman di URL
  const encodedName = encodeURIComponent(customerName || '');

  // URL QR Dummy (nama juga dikirim agar halaman web menampilkan nama pembeli)
  const paymentUrl = `https://warungtestipay.vercel.app/?order=${orderId || ''}&amount=${total}&name=${encodedName}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan untuk Membayar ☕</Text>
      <Text style={styles.desc}>Gunakan aplikasi kamera / QR scanner</Text>

      <View style={{ marginVertical: 30 }}>
        <QRCode value={paymentUrl} size={240} />
      </View>

      {/* Tampilkan Nama Pembeli (jika tersedia) */}
      <Text style={styles.textInfo}>Nama Pembeli: {customerName || '-'}</Text>
      <Text style={styles.textInfo}>Total: Rp{Number(total).toLocaleString()}</Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Laporan')}
      >
        <Text style={styles.buttonText}>Selesai (Bayar Manual)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F2A2A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: { color: '#E2D3B7', fontSize: 22, fontWeight: '700' },
  desc: { color: '#AAA', marginTop: 4, marginBottom: 20 },
  textInfo: { color: '#E2D3B7', fontSize: 16, marginBottom: 6 },
  button: {
    marginTop: 24,
    backgroundColor: '#E2D3B7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: { color: '#2F2A2A', fontWeight: '700' },
});
