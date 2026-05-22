const {
  generateTransactionHistory,
  calculateNetBalance,
  analyzeSpendingProfile
} = require('../walletEngine');

describe('Wallet Engine Tests', () => {

  test('Debe generar exactamente 50 transacciones', () => {

    const transactions =
      generateTransactionHistory(50);

    expect(transactions).toHaveLength(50);

  });

  test(
    'El amount siempre debe ser positivo y diferente de cero',
    () => {

      const transactions =
        generateTransactionHistory(100);

      transactions.forEach((transaction) => {

        expect(transaction.amount)
          .toBeGreaterThan(0);

      });

    }
  );

  test('Ningún campo debe venir undefined', () => {

    const transactions =
      generateTransactionHistory(20);

    transactions.forEach((transaction) => {

      Object.values(transaction)
        .forEach((value) => {

          expect(value)
            .not.toBeUndefined();

        });

    });

  });

  test(
    'Debe calcular correctamente el saldo neto',
    () => {

      const transactions = [

        {
          type: 'Ingreso',
          amount: 500000,
          status: 'Completado'
        },

        {
          type: 'Ingreso',
          amount: 200000,
          status: 'Completado'
        },

        {
          type: 'Retiro',
          amount: 100000,
          status: 'Completado'
        },

        {
          type: 'Retiro',
          amount: 50000,
          status: 'Pendiente'
        }

      ];

      const result =
        calculateNetBalance(transactions);

      expect(result).toBe(600000);

    }
  );

  test(
    'Debe devolver Gasto Crítico cuando los retiros superan el 70%',
    () => {

      const transactions = [

        {
          type: 'Ingreso',
          amount: 100000
        },

        {
          type: 'Retiro',
          amount: 71000
        }

      ];

      const result =
        analyzeSpendingProfile(transactions);

      expect(result)
        .toBe('Gasto Crítico');

    }
  );

  test(
    'Debe devolver Estable cuando los retiros están por debajo del 70%',
    () => {

      const transactions = [

        {
          type: 'Ingreso',
          amount: 100000000
        },

        {
          type: 'Retiro',
          amount: 50000
        }

      ];

      const result =
        analyzeSpendingProfile(transactions);

      expect(result)
        .toBe('Estable');

    }
  );

});