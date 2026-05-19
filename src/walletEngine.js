const { faker } = require('@faker-js/faker');

const generateTransactionHistory = (count) => {

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
      precision: 0.01
    }),

    date: faker.date.recent({ days: 30 }),

    status: faker.helpers.arrayElement(transactionStatus)

  }));

};

module.exports = {
  generateTransactionHistory
};