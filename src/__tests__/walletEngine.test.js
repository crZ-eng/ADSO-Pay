const {
  generateTransactionHistory,
  calculateNetBalance,
  buyUSDT,
  generateExchangeRate,
  calcularPuntosCashback
} = require('../walletEngine');

jest.mock('@faker-js/faker', () => ({
  faker: {
    number: {
      int: jest.fn()
    }
  }
}));

const { faker } = require('@faker-js/faker');

describe('Wallet Engine Tests', () => {

  test('Debe generar exactamente 50 transacciones', () => {

    const transactions = generateTransactionHistory(50);

    expect(transactions).toHaveLength(50);

  });

  test('El amount siempre debe ser positivo y diferente de cero', () => {

    const transactions = generateTransactionHistory(100);

    transactions.forEach((transaction) => {

      expect(transaction.amount).toBeGreaterThan(0);

    });

  });

  test('Ningún campo debe venir undefined', () => {

    const transactions = generateTransactionHistory(20);

    transactions.forEach((transaction) => {

      Object.values(transaction).forEach((value) => {

        expect(value).not.toBeUndefined();

      });

    });

  });

  test('Debe calcular correctamente el saldo neto', () => {

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

    const result = calculateNetBalance(transactions);

    expect(result).toBe(600000);

  });

});

describe('Modulo de compra USDT', () => {

  test('Debe rechazar la compra si no hay saldo suficiente', () => {

    faker.number.int.mockReturnValue(4000);

    const result = buyUSDT(100000, 200000);

    expect(result.status).toBe('Rechazado');

    expect(result.message).toBe('Saldo insuficiente');

  });

  test('Debe calcular correctamente la conversion COP a USDT', () => {

    faker.number.int.mockReturnValue(4000);

    const result = buyUSDT(500000, 400000);

    expect(result.status).toBe('Completado');

    expect(result.exchangeRate).toBe(4000);

    expect(result.usdtReceived).toBe(100);

  });

  test('La tasa debe estar entre 3900 y 4300', () => {

    faker.number.int.mockReturnValue(4100);

    const rate = generateExchangeRate();

    expect(rate).toBeGreaterThanOrEqual(3900);

    expect(rate).toBeLessThanOrEqual(4300);

  });

});

describe('Modulo de Puntos de Fidelidad (Cashback)', () => {

  test('Debe otorgar el 1% en puntos para transacciones completadas mayores a $50,000 COP', () => {

    const transaccionValida = {
      amount: 60000,
      status: 'Completado'
    };

    const puntos = calcularPuntosCashback(transaccionValida);

    expect(puntos).toBe(600);

  });

  test('Debe sumar exactamente 0 puntos si la transacción es menor o igual a $50,000 COP', () => {

    const transaccionBaja = {
      amount: 45000,
      status: 'Completado'
    };

    const puntos = calcularPuntosCashback(transaccionBaja);

    expect(puntos).toBe(0);

  });

  test('Debe retornar 0 puntos si el estado es Rechazado o Pendiente', () => {

    const transaccionRechazada = {
      amount: 100000,
      status: 'Rechazado'
    };

    const transaccionPendiente = {
      amount: 100000,
      status: 'Pendiente'
    };

    expect(
      calcularPuntosCashback(transaccionRechazada)
    ).toBe(0);

    expect(
      calcularPuntosCashback(transaccionPendiente)
    ).toBe(0);

  });

  test('No debe otorgar Puntos ADSO si la compra es de $50.000 COP o menos', () => {
        faker.number.int.mockReturnValue(4000);
        const result = buyUSDT(100000, 30000); 
        
        expect(result.status).toBe('Completado');
        expect(result.puntosADSO).toBe(0); 
    });

});