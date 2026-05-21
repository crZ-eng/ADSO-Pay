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

const generateExchangeRate = () => {
  return faker.number.int({
    min: 3900,
    max: 4300
  });
};

const buyUSDT = (copBalance, copAmount) => {

  const exchangeRate = generateExchangeRate();

  if (copAmount > copBalance) {
    return {
      status: 'Rechazado',
      message: 'Saldo insuficiente',
      exchangeRate
    };
  }

  const usdtAmount = Number((copAmount / exchangeRate).toFixed(6));

  return {
    status: 'Completado',
    copSpent: copAmount,
    exchangeRate,
    usdtReceived: usdtAmount,
    remainingBalance: copBalance - copAmount
  };
};
const generateSavingGoals = (count) => {

  return Array.from({ length: count }, () => ({

    id: faker.string.uuid(),

    name: faker.finance.accountName(),

    savedAmount: faker.number.float({
      min: 0,
      max: 300000,
      fractionDigits: 2
    }),

    targetAmount: faker.number.float({
      min: 500000,
      max: 5000000,
      fractionDigits: 2
    })

  }));

};

const transferToGoal = (walletBalance, goal, amount) => {

  if (amount <= 0) {
    return {
      status: 'Rechazado',
      message: 'El monto debe ser mayor a cero'
    };
  }

  if (amount > walletBalance) {
    return {
      status: 'Rechazado',
      message: 'Saldo insuficiente'
    };
  }

  goal.savedAmount += amount;

  return {
    status: 'Completado',
    transferredAmount: amount,
    remainingBalance: walletBalance - amount,
    updatedGoal: goal
  };

};

module.exports = {
  generateTransactionHistory,
  calculateNetBalance,
  generateExchangeRate,
  buyUSDT,
  generateSavingGoals,
  transferToGoal
};