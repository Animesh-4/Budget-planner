// backend/src/models/Budget.js
const db = require('../config/database');

const Budget = {
  async create({ name, amount, category, userId }) {
    const query = `
      INSERT INTO budgets (user_id, name, amount, category)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [userId, name, amount, category];
    const { rows } = await db.query(query, values);
    // Also add the owner to the budget_users table
    await db.query(
        'INSERT INTO budget_users (budget_id, user_id, role) VALUES ($1, $2, $3)',
        [rows[0].id, userId, 'owner']
    );
    return rows[0];
  },

  async findByUserId(userId) {
    const query = `
      SELECT DISTINCT
        b.id, 
        b.user_id, 
        b.name, 
        b.amount,
        b.category,
        b.created_at,
        COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'expense' AND t.status = 'active'), 0.00) AS spent
      FROM budgets b
      LEFT JOIN transactions t ON b.id = t.budget_id
      JOIN budget_users bu ON b.id = bu.budget_id
      WHERE bu.user_id = $1
      GROUP BY b.id
      ORDER BY b.created_at DESC;
    `;
    const { rows } = await db.query(query, [userId]);
    return rows;
  },

  /**
   * Finds a single budget by its ID, ensuring the user has access.
   * @param {number} budgetId - The ID of the budget.
   * @param {number} userId - The ID of the user requesting access.
   * @returns {Promise<object|null>} The budget object or null if not found or no access.
   */
  async findById(budgetId, userId) {
    const query = `
      SELECT b.* FROM budgets b
      JOIN budget_users bu ON b.id = bu.budget_id
      WHERE b.id = $1 AND bu.user_id = $2;
    `;
    const { rows } = await db.query(query, [budgetId, userId]);
    return rows[0];
  },

  async update(budgetId, { name, amount, category }, userId) {
    const query = `
      UPDATE budgets
      SET name = $1, amount = $2, category = $3, updated_at = NOW()
      WHERE id = $4 AND user_id = $5
      RETURNING *;
    `;
    const values = [name, amount, category, budgetId, userId];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  async delete(budgetId, userId) {
    const query = 'DELETE FROM budgets WHERE id = $1 AND user_id = $2;';
    const { rowCount } = await db.query(query, [budgetId, userId]);
    return rowCount;
  },
};

module.exports = Budget;
