const {
  generateTransactionHistory
} = require('../walletEngine');

describe('Pruebas walletEngine', () => {

  test('Debe generar la cantidad exacta de transacciones', () => {

    const total = 10;

    const result = generateTransactionHistory(total);

    expect(result).toHaveLength(total);

  });

  test('Cada transacción debe tener la estructura correcta', () => {

    const result = generateTransactionHistory(1);

    const transaction = result[0];

    expect(transaction).toHaveProperty('id');

    expect(transaction).toHaveProperty('accountNumber');

    expect(transaction).toHaveProperty('type');

    expect(transaction).toHaveProperty('amount');

    expect(transaction).toHaveProperty('date');

    expect(transaction).toHaveProperty('status');

  });

});