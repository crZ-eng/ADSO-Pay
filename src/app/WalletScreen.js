import React, { useMemo, useState } from 'react';

import SavingGoalsScreen from './SavingGoalsScreen';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

const {
  generateTransactionHistory,
  calculateNetBalance
} = require('../walletEngine');

export default function WalletScreen() {

  const [filter, setFilter] = useState('Todos');

  const [showGoals, setShowGoals] = useState(false);

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

  if (showGoals) {
    return (
      <SavingGoalsScreen />
    );

  const renderItem = ({ item }) => {

    const amountStyle =
      item.type === 'Ingreso'
        ? styles.income
        : styles.withdraw;
    }

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
  }

});