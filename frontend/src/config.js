// API base URL — otomatik olarak tarayıcının hostname'ini kullanır
// Böylece aynı ağdaki farklı cihazlardan da erişilebilir
const API_BASE = `http://${window.location.hostname}:8000`;

export default API_BASE;
