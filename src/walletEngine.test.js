const {
    buyUSDT,
    generateExchangeRate
} = require('./walletEngine');

jest.mock('@faker-js/faker', () => ({
    faker: {
        number: {
            int: jest.fn()
        }
    }
}));

const { faker } = require('@faker-js/faker');

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
        const transaccionValida = { amount: 60000, status: 'Completado' };
        const puntos = calcularPuntosCashback(transaccionValida);
        expect(puntos).toBe(600);
    });

    test('Debe sumar exactamente 0 puntos si la transacción es menor o igual a $50,000 COP', () => {
        const transaccionBaja = { amount: 45000, status: 'Completado' };
        const puntos = calcularPuntosCashback(transaccionBaja);
        expect(puntos).toBe(0);
    });

    test('Debe retornar 0 puntos si el estado es Rechazado o Pendiente', () => {
        const transaccionRechazada = { amount: 100000, status: 'Rechazado' };
        const transaccionPendiente = { amount: 100000, status: 'Pendiente' };
        
        expect(calcularPuntosCashback(transaccionRechazada)).toBe(0);
        expect(calcularPuntosCashback(transaccionPendiente)).toBe(0);
    });

});