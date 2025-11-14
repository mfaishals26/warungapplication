// hooks/use-color-scheme.js
import { useColorScheme as rnUseColorScheme } from 'react-native';
export default function useColorScheme() {
  const s = rnUseColorScheme();
  return s || 'dark';
}
