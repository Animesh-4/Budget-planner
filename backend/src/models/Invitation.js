// backend/src/models/Invitation.js
const db = require('../config/database');

const Invitation = {
  /**
   * Creates a new invitation record in the database.
   * @param {object} invitationData - The data for the invitation.
   * @returns {Promise<object>} The newly created invitation object.
   */
  async create({ budgetId, inviterId, inviteeEmail, role, token }) {
    const query = `
      INSERT INTO invitations (budget_id, inviter_id, invitee_email, role, token)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [budgetId, inviterId, inviteeEmail, role, token];
    const { rows } = await db.query(query, values);
    return rows[0];
  },
};

module.exports = Invitation;
