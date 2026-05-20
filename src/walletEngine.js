const { faker } = require('@faker-js/faker');

const generateTransactionHistory = (count) => {

  if (count <= 0) return [];

  const transactionTypes = ['Ingreso', 'Retiro'];

  const transactionStatus = [
    'Completado',
    'Pendiente',
    'Rechazado'
  ];

  return Array.from({ length: count }, () => ({

    id: faker.string.uuid(),

    accountNumber: faker.finance.accountNumber(),

    type: faker.helpers.arrayElement(transactionTypes),

    amount: faker.number.float({
      min: 10000,
      max: 500000,
      multipleOf: 0.01
    }),

    date: faker.date.recent({ days: 30 }),

    status: faker.helpers.arrayElement(transactionStatus)

  }));

};

const calculateNetBalance = (transactions) => {

  return transactions.reduce((total, transaction) => {

    if (transaction.status !== 'Completado') {
      return total;
    }

    if (transaction.type === 'Ingreso') {
      return total + transaction.amount;
    }

    if (transaction.type === 'Retiro') {
      return total - transaction.amount;
    }

    return total;

  }, 0);

};

module.exports = {
  generateTransactionHistory,
  calculateNetBalance
};