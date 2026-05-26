const { faker } = require('@faker-js/faker');

const transactionStatus = [
  'Completado',
  'Pendiente',
  'Rechazado'
];

const transactionTypes = [
  'Ingreso',
  'Retiro'
];

const savingGoalNames = [
  'Viaje',
  'Moto',
  'Laptop',
  'iPhone',
  'Emergencias',
  'Universidad'
];

const generateTransactionHistory = (count) => {

  return Array.from(
    { length: count },
    () => {

      const amount =
        faker.number.float({
          min: 10000,
          max: 500000,
          fractionDigits: 2
        });

      return {

        id: faker.string.uuid(),

        accountNumber:
          faker.finance.accountNumber(),

        type: faker.helpers.arrayElement(
          transactionTypes
        ),

        amount,

        date: faker.date.recent({
          days: 30
        }),

        status:
          faker.helpers.arrayElement(
            transactionStatus
          )

      };

    }
  );

};

const calculateNetBalance = (
  transactions
) => {

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

        return total +
          transaction.amount;

      }

      return total -
        transaction.amount;

    },

    0

  );

};

const analyzeSpendingProfile = (
  transactions
) => {

  let totalIngresos = 0;

  let totalRetiros = 0;

  transactions.forEach(
    (transaction) => {

      if (
        transaction.status !== 'Completado'
      ) {

        return;

      }

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
    (
      totalRetiros /
      totalIngresos
    ) * 100;

  return porcentaje >= 71
    ? 'Gasto Crítico'
    : 'Estable';

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

  if (
    copAmount > copBalance
  ) {

    return {

      status: 'Rechazado',

      message:
        'Saldo insuficiente',

      exchangeRate

    };

  }

  const usdtAmount =
      copAmount / exchangeRate

  return {

    status: 'Completado',

    copSpent: copAmount,

    exchangeRate,

    usdtReceived:
      usdtAmount,

    remainingBalance:
      copBalance - copAmount

  };

};

const generateSavingGoals = (
  count
) => {

  return Array.from(
    { length: count },
    () => {

      const targetAmount =
        faker.number.int({
          min: 500000,
          max: 10000000
        });

      const savedAmount =
        faker.number.int({
          min: 0,
          max: targetAmount
        });

      return {

        id: faker.string.uuid(),

        name:
          faker.helpers.arrayElement(
            savingGoalNames
          ),

        targetAmount,

        savedAmount

      };

    }
  );

};

const transferToGoal = (
  walletBalance,
  goal,
  amount
) => {

  if (
    amount > walletBalance
  ) {

    return {

      status: 'Rechazado',

      message:
        'Saldo insuficiente'

    };

  }

  const updatedGoal = {

    ...goal,

    savedAmount:
      goal.savedAmount + amount

  };

  return {

    status: 'Completado',

    updatedGoal,

    remainingBalance:
      walletBalance - amount

  };

};

module.exports = {

  generateTransactionHistory,

  calculateNetBalance,

  analyzeSpendingProfile,

  generateExchangeRate,

  buyUSDT,

  generateSavingGoals,

  transferToGoal

};