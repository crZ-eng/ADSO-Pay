const { faker } = require('@faker-js/faker');

const transactionTypes = [
  'Ingreso',
  'Retiro'
];

const transactionStatus = [
  'Completado',
  'Pendiente',
  'Rechazado'
];

const generateTransactionHistory = (count) => {

  return Array.from({ length: count }, () => {

    const status = faker.helpers.arrayElement(
      transactionStatus
    );

    const amount = faker.number.float({
      min: 10000,
      max: 500000,
      fractionDigits: 2
    });

    return {

      id: faker.string.uuid(),

      accountNumber: faker.finance.accountNumber(),

      type: faker.helpers.arrayElement(
        transactionTypes
      ),

      amount,

      date: faker.date.recent({
        days: 30
      }),

      status,

      puntosAdso:
        status === 'Completado' && amount > 50000
          ? Math.floor(amount * 0.01)
          : 0

    };

  });

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
    (
      copAmount / exchangeRate
    ).toFixed(6)
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

const calcularPuntosCashback = (
  transaccion
) => {

  if (
    transaccion.status === 'Completado' &&
    transaccion.amount > 50000
  ) {

    return Math.floor(
      transaccion.amount * 0.01
    );

  }

  return 0;

};

const generateSavingGoals = () => {

  return [

    {
      id: '1',
      title: 'Viaje a Cartagena',
      target: 3000000,
      saved: 1200000
    },

    {
      id: '2',
      title: 'Nuevo Celular',
      target: 2500000,
      saved: 800000
    },

    {
      id: '3',
      title: 'Laptop Gamer',
      target: 5000000,
      saved: 2000000
    }

  ];

};

module.exports = {

  generateTransactionHistory,

  calculateNetBalance,

  generateExchangeRate,

  buyUSDT,

  calcularPuntosCashback,

  generateSavingGoals

};