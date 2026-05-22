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

    test('Debe otorgar el 1% en Puntos ADSO si la compra supera los $50.000 COP', () => {
        faker.number.int.mockReturnValue(4000);
        const result = buyUSDT(500000, 400000); 
        
        expect(result.status).toBe('Completado');
        expect(result.puntosADSO).toBe(4000); 
    });

    test('No debe otorgar Puntos ADSO si la compra es de $50.000 COP o menos', () => {
        faker.number.int.mockReturnValue(4000);
        const result = buyUSDT(100000, 30000); 
        
        expect(result.status).toBe('Completado');
        expect(result.puntosADSO).toBe(0); 
    });

});