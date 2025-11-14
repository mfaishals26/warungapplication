// components/ui/collapsible.js
import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
export default function Collapsible({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ marginBottom: 8, borderRadius: 8, borderWidth: 1, borderColor: '#4A4242', backgroundColor: '#3B3535' }}>
      <Pressable onPress={() => setOpen(!open)} style={{ padding: 12, flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
        <Text style={{ color: '#F4EEE6', fontWeight: '600' }}>{title}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color="#E2D3B7" />
      </Pressable>
      {open && <View style={{ padding: 12 }}>{children}</View>}
    </View>
  );
}
