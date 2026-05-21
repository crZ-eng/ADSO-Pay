const {
    transferToGoal
  } = require('../walletEngine');
  
  describe('Módulo de Metas de Ahorro', () => {
  
    test('debe transferir dinero correctamente a la meta de ahorro', () => {
  
      const walletBalance = 500000;
  
      const goal = {
        id: 1,
        name: 'Para la moto',
        savedAmount: 0,
        targetAmount: 2000000
      };
  
      const transferAmount = 100000;
  
      const result = transferToGoal(
        walletBalance,
        goal,
        transferAmount
      );
  
      expect(result.status).toBe('Completado');
  
      expect(result.remainingBalance).toBe(400000);
  
      expect(result.updatedGoal.savedAmount).toBe(100000);
  
      const totalMoney =
        result.remainingBalance +
        result.updatedGoal.savedAmount;
  
      expect(totalMoney).toBe(500000);
  
    });
  
  });