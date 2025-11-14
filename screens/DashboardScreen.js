// screens/DashboardScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';

export default function DashboardScreen({ navigation }) {
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [table, setTable] = useState('');

  const openNewOrder = () => {
    setCustomerName('');
    setTable('');
    setShowNewOrderModal(true);
  };

  const handleStartOrder = () => {
    if (!customerName || !customerName.trim()) {
      return Alert.alert('Nama harus diisi');
    }
    setShowNewOrderModal(false);
    // navigasi ke Pesan dan kirim data sebagai params
    navigation.navigate('Pesan', { customerName: customerName.trim(), table: table.trim() || null });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WarungKU{"\n"}</Text>

      <Pressable
        style={styles.button}
        onPress={openNewOrder}
      >
        <Text style={styles.buttonText}>Pesan Baru</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Bayar')}
      >
        <Text style={styles.buttonText}>Daftar Pesanan</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Laporan')}
      >
        <Text style={styles.buttonText}>Laporan Pesanan</Text>
      </Pressable>

      {/* Modal: input Nama + Kursi */}
      <Modal
        visible={showNewOrderModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNewOrderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Data Pembeli</Text>

            <TextInput
              placeholder="Nama (wajib)"
              placeholderTextColor="#AAA"
              value={customerName}
              onChangeText={setCustomerName}
              style={styles.input}
            />

            <View style={{ height: 8 }} />

            <TextInput
              placeholder="Nomor Kursi / Meja (opsional)"
              placeholderTextColor="#AAA"
              value={table}
              onChangeText={setTable}
              style={styles.input}
            />

            <View style={{ flexDirection: 'row', marginTop: 12 }}>
              <Pressable
                onPress={() => setShowNewOrderModal(false)}
                style={[styles.modalBtn, { marginRight: 8 }]}
              >
                <Text style={{ color: '#F4EEE6' }}>Batal</Text>
              </Pressable>

              <Pressable
                onPress={handleStartOrder}
                style={[styles.modalBtn, styles.modalConfirm]}
              >
                <Text style={{ color: '#2F2A2A', fontWeight: '700' }}>Mulai Pesan</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#E2D3B7',
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#3B3535',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4A4242',
  },
  buttonText: {
    color: '#E2D3B7',
    fontSize: 16,
    textAlign: 'center',
  },

  // modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#2F2A2A', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#4A4242' },
  modalTitle: { color: '#E2D3B7', fontWeight: '700', marginBottom: 8, fontSize: 16 },
  input: { backgroundColor: '#3B3535', color: '#F4EEE6', padding: 10, borderRadius: 8, minWidth: 260 },
  modalBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', backgroundColor: '#3B3535' },
  modalConfirm: { backgroundColor: '#E2D3B7' },
});
