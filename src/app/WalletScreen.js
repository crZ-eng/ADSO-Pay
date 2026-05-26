import React, { useMemo, useState } from 'react';

import SavingGoalsScreen from './SavingGoalsScreen';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';

const {
  generateTransactionHistory,
  calculateNetBalance,
  analyzeSpendingProfile,
  buyUSDT
} = require('../walletEngine');

export default function WalletScreen() {

  const [filter, setFilter] = useState('Todos');

  const [showGoals, setShowGoals] = useState(false);

  const [copAmount, setCopAmount] = useState('');

  const [usdtResult, setUsdtResult] =
    useState(null);

  const transactions = useMemo(
    () => generateTransactionHistory(200),
    []
  );

  const filteredTransactions = useMemo(() => {

    if (filter === 'Ingreso') {
      return transactions.filter(
        item => item.type === 'Ingreso'
      );
    }

    if (filter === 'Retiro') {
      return transactions.filter(
        item => item.type === 'Retiro'
      );
    }

    return transactions;

  }, [filter, transactions]);

  const netBalance = useMemo(
    () => calculateNetBalance(transactions),
    [transactions]
  );

  const spendingProfile = useMemo(
    () => analyzeSpendingProfile(transactions),
    [transactions]
  );

  const handleBuyUSDT = () => {

    const amount = Number(copAmount);

    if (!amount || amount <= 0) {

      Alert.alert(
        'Error',
        'Ingrese un valor válido'
      );

      return;
    }

    const result = buyUSDT(
      netBalance,
      amount
    );

    setUsdtResult(result);

    if (result.status === 'Rechazado') {

      Alert.alert(
        'Compra rechazada',
        result.message
      );

      return;
    }

    Alert.alert(
      'Compra exitosa',
      `Compraste ${result.usdtReceived} USDT`
    );
  };

  if (showGoals) {
    return (
      <SavingGoalsScreen
        onBack={() => setShowGoals(false)}
      />
    );

  }

  const renderItem = ({ item }) => {

    const amountStyle =
      item.type === 'Ingreso'
        ? styles.income
        : styles.withdraw;

    return (
      <View style={styles.card}>

        <View>

          <Text style={styles.type}>
            {item.type}
          </Text>

          <Text style={styles.account}>
            {item.accountNumber}
          </Text>

          <Text style={styles.status}>
            {item.status}
          </Text>

        </View>

        <Text style={[styles.amount, amountStyle]}>
          ${item.amount.toLocaleString('es-CO')}
        </Text>

      </View>
    );
  };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        ADSO-Pay
      </Text>

      <View style={styles.balanceContainer}>

        <TouchableOpacity
          style={styles.savingsButton}
          onPress={() => setShowGoals(true)}
        >
          <Text style={styles.buttonText}>
            Ver Metas de Ahorro
          </Text>
        </TouchableOpacity>

        <Text style={styles.balanceLabel}>
          Saldo Neto Total
        </Text>

        <Text style={styles.balance}>
          ${netBalance.toLocaleString('es-CO')}
        </Text>

        <View
          style={[
            styles.alertContainer,

            spendingProfile === 'Gasto Crítico'
              ? styles.critical
              : styles.stable
          ]}
        >

          <Text style={styles.alertText}>
            {spendingProfile}
          </Text>
        </View>

      </View>

      <View style={styles.cryptoContainer}>

        <Text style={styles.cryptoTitle}>
          Comprar USDT
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Cantidad en COP"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={copAmount}
          onChangeText={setCopAmount}
        />

        <TouchableOpacity
          style={styles.buyButton}
          onPress={handleBuyUSDT}
        >
          <Text style={styles.buttonText}>
            Comprar
          </Text>
        </TouchableOpacity>

        {
          usdtResult &&
          usdtResult.status === 'Completado' && (

            <View style={styles.resultBox}>

              <Text style={styles.resultText}>
                Tasa:
                {' '}
                $
                {usdtResult.exchangeRate}
              </Text>

              <Text style={styles.resultText}>
                USDT recibidos:
                {' '}
                {usdtResult.usdtReceived}
              </Text>

            </View>
          )
        }

      </View>

      <View style={styles.filters}>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setFilter('Todos')}
        >
          <Text style={styles.buttonText}>
            Todos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setFilter('Ingreso')}
        >
          <Text style={styles.buttonText}>
            Ingresos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setFilter('Retiro')}
        >
          <Text style={styles.buttonText}>
            Retiros
          </Text>
        </TouchableOpacity>

      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
    paddingTop: 60
  },

  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20
  },

  balanceContainer: {
    backgroundColor: '#1f1f1f',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20
  },

  balanceLabel: {
    color: '#aaa',
    fontSize: 16
  },

  balance: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10
  },

  alertContainer: {
    marginTop: 15,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center'
  },

  critical: {
    backgroundColor: '#ff1744'
  },

  stable: {
    backgroundColor: '#00c853'
  },

  alertText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  },

  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },

  button: {
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },

  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  type: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },

  account: {
    color: '#aaa',
    marginTop: 5
  },

  status: {
    color: '#888',
    marginTop: 5
  },

  amount: {
    fontSize: 18,
    fontWeight: 'bold'
  },

  income: {
    color: '#00C853'
  },

  withdraw: {
    color: '#FF5252'
  },

  savingsButton: {
    backgroundColor: '#6200EE',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20
  },

  cryptoContainer: {
  backgroundColor: '#1f1f1f',
  padding: 16,
  borderRadius: 14,
  marginBottom: 20
},

cryptoTitle: {
  color: '#fff',
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 12
},

input: {
  backgroundColor: '#2c2c2c',
  color: '#fff',
  borderRadius: 10,
  padding: 12,
  marginBottom: 12
},

buyButton: {
  backgroundColor: '#00C853',
  padding: 14,
  borderRadius: 12,
  alignItems: 'center'
},

resultBox: {
  marginTop: 15
},

resultText: {
  color: '#fff',
  marginTop: 5
}

});