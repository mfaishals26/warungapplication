// api/menuService.js
const BASE = 'https://69152d4284e8bd126af8f393.mockapi.io'; 

export async function fetchMenu() {
  const res = await fetch(`${BASE}/menu`);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Menu fetch failed: ${res.status} ${txt}`);
  }
  const json = await res.json();
  // ensure price is number and id exists
  return json.map(item => ({ 
    id: String(item.id), 
    name: item.name, 
    price: Number(item.price || 0), 
    image: item.image || null, 
    description: item.description || '' 
  }));
}
