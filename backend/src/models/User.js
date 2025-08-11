// backend/src/models/User.js
const db = require('../config/database');

const User = {
  async create(username, email, hashedPassword) {
    const query = `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email;
    `;
    const { rows } = await db.query(query, [username, email, hashedPassword]);
    return rows[0];
  },

  async findByEmail(email) {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  },

  async findById(id) {
    const { rows } = await db.query('SELECT id, username, email FROM users WHERE id = $1', [id]);
    return rows[0];
  },
  
  async update(id, { username }) {
    const { rows } = await db.query(
      'UPDATE users SET username = $1, updated_at = NOW() WHERE id = $2 RETURNING id, username, email',
      [username, id]
    );
    return rows[0];
  }
};

module.exports = User;
