import pkg from 'pg';
const { Pool } = pkg;

// NeonDB bağlantısı
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Tablo yoksa otomatik oluştur
const initTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS media (
      id SERIAL PRIMARY KEY,
      title VARCHAR,
      date VARCHAR,
      image_url VARCHAR,
      description VARCHAR
    )
  `);
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await initTable();

    if (req.method === 'GET') {
      const result = await pool.query('SELECT * FROM media ORDER BY id DESC');
      const rows = result.rows.map(r => ({
        id: r.id,
        title: r.title,
        date: r.date,
        image_url: r.image_url,
        imageUrl: r.image_url,
        description: r.description
      }));
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { title, date, imageUrl, image_url, description } = req.body;
      const img = imageUrl || image_url || '';
      const result = await pool.query(
        'INSERT INTO media (title, date, image_url, description) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, date, img, description]
      );
      const r = result.rows[0];
      return res.status(200).json({
        id: r.id, title: r.title, date: r.date,
        image_url: r.image_url, imageUrl: r.image_url, description: r.description
      });
    }

    if (req.method === 'DELETE') {
      await pool.query('DELETE FROM media');
      return res.status(200).json({ message: 'Tüm medyalar silindi' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    console.error('Media API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
