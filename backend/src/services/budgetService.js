// backend/src/services/budgetService.js
const Budget = require('../models/Budget');
const User = require('../models/User');
const BudgetUser = require('../models/BudgetUser');

const budgetService = {
  async getBudgetsByUserId(userId) {
    console.log(`[Service: budgetService] getBudgetsByUserId called for user: ${userId}`);
    const budgets = await Budget.findByUserId(userId);
    console.log(`[Service: budgetService] Found ${budgets.length} budgets for user: ${userId}`);
    return budgets;
  },

  async getBudgetById(budgetId, userId) {
    console.log(`[Service: budgetService] getBudgetById called for budget: ${budgetId} by user: ${userId}`);
    return await Budget.findById(budgetId, userId);
  },

  async createBudget(budgetData) {
    console.log('[Service: budgetService] createBudget called with data:', budgetData);
    const newBudget = await Budget.create(budgetData);
    console.log('[Service: budgetService] Budget created successfully:', newBudget);
    return newBudget;
  },

  async updateBudget(budgetId, budgetData, userId) {
    console.log(`[Service: budgetService] updateBudget called for budget: ${budgetId} with data:`, budgetData);
    const budget = await Budget.findById(budgetId, userId);
    if (!budget) {
        console.log(`[Service: budgetService] Update failed: Budget ${budgetId} not found or user ${userId} lacks access.`);
        return null;
    }
    const updatedBudget = await Budget.update(budgetId, budgetData, userId);
    console.log('[Service: budgetService] Budget updated successfully:', updatedBudget);
    return updatedBudget;
  },

  async deleteBudget(budgetId, userId) {
    console.log(`[Service: budgetService] deleteBudget called for budget: ${budgetId} by user: ${userId}`);
    const budget = await Budget.findById(budgetId, userId);
    if (!budget || budget.user_id !== userId) {
        return 0; // Or throw an error for access denied
    }
    return await Budget.delete(budgetId, userId);
  },

  async inviteUserToBudget({ budgetId, email, role, inviterId }) {
    console.log(`[Service: budgetService] inviteUserToBudget called by user ${inviterId} to invite ${email} to budget ${budgetId}`);
    const budget = await Budget.findById(budgetId, inviterId);
    if (!budget || budget.user_id !== inviterId) {
      const error = new Error('Forbidden: Only the budget owner can invite users.');
      error.statusCode = 403;
      throw error;
    }
    const userToInvite = await User.findByEmail(email);
    if (!userToInvite) {
      const error = new Error('Not Found: A user with this email address does not exist.');
      error.statusCode = 404;
      throw error;
    }
    if (userToInvite.id === inviterId) {
        const error = new Error('Bad Request: You cannot invite yourself to your own budget.');
        error.statusCode = 400;
        throw error;
    }
    return await BudgetUser.addUserToBudget(budgetId, userToInvite.id, role);
  },

  async getBudgetCollaborators(budgetId, userId) {
    console.log(`[Service: budgetService] getBudgetCollaborators called for budget: ${budgetId} by user: ${userId}`);
    const hasAccess = await BudgetUser.findUserInBudget(budgetId, userId);
    if (!hasAccess) {
        const error = new Error('Forbidden: You do not have access to this budget.');
        error.statusCode = 403;
        throw error;
    }
    return await BudgetUser.findUsersByBudgetId(budgetId);
  },

  async removeUserFromBudget({ budgetId, userIdToRemove, removerId }) {
    console.log(`[Service: budgetService] removeUserFromBudget called by user ${removerId} to remove ${userIdToRemove} from budget ${budgetId}`);
    const budget = await Budget.findById(budgetId, removerId);
    if (!budget || budget.user_id !== removerId) {
      const error = new Error('Forbidden: Only the budget owner can remove users.');
      error.statusCode = 403;
      throw error;
    }
    if (parseInt(userIdToRemove, 10) === removerId) {
        const error = new Error('Bad Request: The budget owner cannot be removed.');
        error.statusCode = 400;
        throw error;
    }
    return await BudgetUser.removeUserFromBudget(budgetId, userIdToRemove);
  },
};

module.exports = budgetService;
