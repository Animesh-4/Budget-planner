// src/pages/BudgetsPage.js
import React, { useState } from 'react';
import BudgetList from '../components/Budget/BudgetList';
import BudgetForm from '../components/Budget/BudgetForm';
import Modal from '../components/Shared/Modal';
import Button from '../components/Shared/Button';
import { useBudgets } from '../hooks/useBudgets';

const BudgetsPage = () => {
  const { fetchBudgets } = useBudgets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState(null);

  const handleOpenModal = () => {
    setBudgetToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditBudget = (budget) => {
    setBudgetToEdit(budget);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBudgetToEdit(null);
  };

  const handleFormSubmit = () => {
    handleCloseModal();
    fetchBudgets(); // Refetch budgets to ensure the list is up-to-date
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Budgets</h1>
        <Button onClick={handleOpenModal}>Add New Budget</Button>
      </div>
      <BudgetList onEditBudget={handleEditBudget} />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <BudgetForm
          budgetToEdit={budgetToEdit}
          onFormSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default BudgetsPage;
