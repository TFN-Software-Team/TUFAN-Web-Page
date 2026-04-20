# Node.js alpine imajı (oldukça küçüktür)
FROM node:18-alpine

WORKDIR /app

# Bağımlılık dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Tüm kodu kopyala
COPY . .

# Uygulamayı dışarıya aç (Vite için genellikle 5173 portu kullanılır)
EXPOSE 5173

# Vite geliştirme sunucusunu başlat
CMD ["npm", "run", "dev", "--", "--host"]