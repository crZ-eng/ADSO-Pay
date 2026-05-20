const { faker } = require('@faker-js/faker');

const transactionTypes = ['Ingreso', 'Retiro'];

const transactionStatus = [
  'Completado',
  'Pendiente',
  'Rechazado'
];

const generateTransactionHistory = (count) => {

  return Array.from({ length: count }, () => ({

    id: faker.string.uuid(),

    accountNumber: faker.finance.accountNumber(),

    type: faker.helpers.arrayElement(transactionTypes),

    amount: faker.number.float({
      min: 10000,
      max: 500000,
      fractionDigits: 2
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

    return total - transaction.amount;

  }, 0);

};

module.exports = {
  generateTransactionHistory,
  calculateNetBalance
};