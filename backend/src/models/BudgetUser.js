// backend/src/models/BudgetUser.js
const db = require('../config/database');

const BudgetUser = {
  // ... existing functions ...
  async addUserToBudget(budgetId, userId, role) { /* ... */ },
  async removeUserFromBudget(budgetId, userId) { /* ... */ },
  async findUsersByBudgetId(budgetId) { /* ... */ },

  /**
   * Checks if a specific user is a collaborator on a specific budget.
   * @param {number} budgetId - The ID of the budget.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<object|null>} The relationship object or null if not found.
   */
  async findUserInBudget(budgetId, userId) {
    const query = 'SELECT * FROM budget_users WHERE budget_id = $1 AND user_id = $2;';
    const { rows } = await db.query(query, [budgetId, userId]);
    return rows[0];
  }
};

module.exports = BudgetUser;
