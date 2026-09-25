import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const result = await pool.query('SELECT * FROM media WHERE id=$1', [id]);
      if (!result.rows[0]) return res.status(404).json({ error: 'Medya bulunamadı' });
      const r = result.rows[0];
      return res.status(200).json({ ...r, imageUrl: r.image_url });
    }

    if (req.method === 'PUT') {
      const { title, date, imageUrl, image_url, description } = req.body;
      const img = imageUrl || image_url;
      const result = await pool.query(
        `UPDATE media SET
          title = COALESCE($1, title),
          date = COALESCE($2, date),
          image_url = COALESCE($3, image_url),
          description = COALESCE($4, description)
        WHERE id = $5 RETURNING *`,
        [title, date, img, description, id]
      );
      if (!result.rows[0]) return res.status(404).json({ error: 'Medya bulunamadı' });
      const r = result.rows[0];
      return res.status(200).json({
        id: r.id, title: r.title, date: r.date,
        image_url: r.image_url, imageUrl: r.image_url, description: r.description
      });
    }

    if (req.method === 'DELETE') {
      await pool.query('DELETE FROM media WHERE id=$1', [id]);
      return res.status(200).json({ message: 'Medya silindi' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    console.error('Media[id] API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
