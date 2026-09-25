// API base URL — Bulut ortamı ve yerel ağ (localhost / IP) uyumluluğu
let API_BASE;

const hostname = window.location.hostname;
const isLocalNetwork = 
    hostname === 'localhost' || 
    hostname === '127.0.0.1' || 
    hostname.startsWith('192.168.') || 
    hostname.startsWith('10.') || 
    hostname.startsWith('172.') ||
    hostname.endsWith('.local');

if (isLocalNetwork) {
    // Yerel ağdayken (bilgisayar, telefon, iPad vs.) sunucunun IP adresiyle bağlan:
    API_BASE = `http://${hostname}:8000`;
} else {
    // Vercel Proxy (Rewrites) ile CORS engellerini sıfırlayan aynı domain altı API köprüsü:
    API_BASE = '/api';
}

export default API_BASE;