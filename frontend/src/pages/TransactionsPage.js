// src/pages/TransactionsPage.js
import React, { useState } from 'react';
import TransactionList from '../components/Transaction/TransactionList';
import TransactionForm from '../components/Transaction/TransactionForm';
import Modal from '../components/Shared/Modal';
import Button from '../components/Shared/Button';
import { useBudgets } from '../hooks/useBudgets';

const TransactionsPage = () => {
  const { fetchTransactions } = useBudgets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  const handleOpenModal = () => {
    setTransactionToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTransactionToEdit(null);
  };

  const handleFormSubmit = () => {
    handleCloseModal();
    // The context handles the state update, but we can trigger a refetch
    // to ensure the data is perfectly in sync with the backend.
    fetchTransactions();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">All Transactions</h1>
        <Button onClick={handleOpenModal}>Add Transaction</Button>
      </div>
      
      <TransactionList onEditTransaction={handleEditTransaction} />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <TransactionForm
          transactionToEdit={transactionToEdit}
          onFormSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default TransactionsPage;
