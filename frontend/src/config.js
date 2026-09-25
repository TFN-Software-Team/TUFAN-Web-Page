// API base URL — Bulut ortamı ve yerel ağ (localhost) uyumluluğu
let API_BASE;

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Kendi bilgisayarındayken eski sistemin tıkır tıkır çalışmaya devam etsin:
    API_BASE = `http://${window.location.hostname}:8000`;
} else {
    // Site internete (Render'a) çıktığında dün kurduğumuz canlı backend adresine bağlansın:
    API_BASE = 'https://tufan-backend.onrender.com';
}

export default API_BASE;