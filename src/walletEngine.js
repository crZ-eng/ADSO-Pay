const { faker } = require('@faker-js/faker');

const transactionStatus = [
  'Completado',
  'Pendiente',
  'Rechazado'
];

const generateTransactionHistory = (count) => {

  return Array.from({ length: count }, () => ({

    id: faker.string.uuid(),

    accountNumber:
      faker.finance.accountNumber(),

    // MUCHOS retiros para forzar Gasto Crítico
    type:
      Math.random() > 0.2
        ? 'Retiro'
        : 'Ingreso',

    amount: faker.number.float({
      min: 10000,
      max: 500000,
      fractionDigits: 2
    }),

    date:
      faker.date.recent({ days: 30 }),

    status:
      faker.helpers.arrayElement(
        transactionStatus
      )

  }));

};

const calculateNetBalance = (transactions) => {

  return transactions.reduce(
    (total, transaction) => {

      if (
        transaction.status !== 'Completado'
      ) {
        return total;
      }

      if (
        transaction.type === 'Ingreso'
      ) {
        return total + transaction.amount;
      }

      return total - transaction.amount;

    },
    0
  );

};

const generateExchangeRate = () => {

  return faker.number.int({
    min: 3900,
    max: 4300
  });

};

const buyUSDT = (
  copBalance,
  copAmount
) => {

  const exchangeRate =
    generateExchangeRate();

  if (copAmount > copBalance) {

    return {

      status: 'Rechazado',

      message: 'Saldo insuficiente',

      exchangeRate

    };

  }

  const usdtAmount = Number(
    (copAmount / exchangeRate)
      .toFixed(6)
  );

  return {

    status: 'Completado',

    copSpent: copAmount,

    exchangeRate,

    usdtReceived: usdtAmount,

    remainingBalance:
      copBalance - copAmount

  };

};

const analyzeSpendingProfile = (
  transactions
) => {

  let totalIngresos = 0;

  let totalRetiros = 0;

  transactions.forEach(
    (transaction) => {

      if (
        transaction.type === 'Ingreso'
      ) {

        totalIngresos +=
          transaction.amount;

      }

      if (
        transaction.type === 'Retiro'
      ) {

        totalRetiros +=
          transaction.amount;

      }

    }
  );

  if (totalIngresos === 0) {

    return 'Gasto Crítico';

  }

  const porcentaje =
    (totalRetiros / totalIngresos)
    * 100;

  return porcentaje >= 71
    ? 'Gasto Crítico'
    : 'Estable';

};

module.exports = {

  generateTransactionHistory,

  calculateNetBalance,

  generateExchangeRate,

  buyUSDT,

  analyzeSpendingProfile

};