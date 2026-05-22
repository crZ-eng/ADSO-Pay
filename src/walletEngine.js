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

  return transactions.reduce((acumulado, transaction) => {

    if (transaction.status !== 'Completado') {
      return acumulado;
    }

    if (transaction.type !== 'Ingreso' && transaction.amount > 50000) {
      const puntosGanados = transaction.amount * 0.01;
      acumulado.puntosADSO += puntosGanados;
    }

    if (transaction.type === 'Ingreso') {
      acumulado.saldoNeto += transaction.amount;
    } else {
      acumulado.saldoNeto -= transaction.amount;
    }

    return acumulado;

  }, { saldoNeto: 0, puntosADSO: 0 });
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
  const puntosGanados = copAmount > 50000 ? copAmount * 0.01 : 0;

  return {
    status: 'Completado',
    copSpent: copAmount,
    exchangeRate,
    usdtReceived: usdtAmount,
    remainingBalance: copBalance - copAmount,
    puntosADSO: puntosGanados 
  };
};

module.exports = {
  generateTransactionHistory,
  calculateNetBalance,
  generateExchangeRate,
  buyUSDT
};