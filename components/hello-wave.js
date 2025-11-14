// components/hello-wave.js
import React from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';
import useColorScheme from '../hooks/use-color-scheme';
import { Colors } from '../constants/theme';
export default function HelloWave({ name = 'Hai', style }) {
  const scheme = useColorScheme();
  const color = (Colors[scheme] && Colors[scheme].text) || Colors.dark.text;
  const anim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ])).start();
  }, []);
  const translateY = anim.interpolate({ inputRange: [0,1], outputRange: [0,-6] });
  return (
    <View style={[styles.row, style]}>
      <Text style={{ color, fontSize: 18, fontWeight: '600' }}>Hello, {name}</Text>
      <Animated.View style={[styles.dot, { transform: [{ translateY }], backgroundColor: Colors.dark.tint }]} />
    </View>
  );
}
const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: 8 }, dot: { width: 10, height: 10, borderRadius: 10, marginLeft: 8 } });
