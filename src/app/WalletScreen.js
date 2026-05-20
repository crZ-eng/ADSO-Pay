import React, { useMemo, useState } from 'react';

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

const WalletScreen = () => {

  const [filter, setFilter] = useState('Todos');

  const transactions = useMemo(() => {
    return generateTransactionHistory(200);
  }, []);

  const filteredTransactions = useMemo(() => {

    if (filter === 'Ingreso') {
      return transactions.filter(
        transaction => transaction.type === 'Ingreso'
      );
    }

    if (filter === 'Retiro') {
      return transactions.filter(
        transaction => transaction.type === 'Retiro'
      );
    }

    return transactions;

  }, [filter, transactions]);

  const netBalance = useMemo(() => {
    return calculateNetBalance(transactions);
  }, [transactions]);

  const renderItem = ({ item }) => (

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

      <Text
        style={[
          styles.amount,
          item.type === 'Ingreso'
            ? styles.income
            : styles.withdraw
        ]}
      >
        ${item.amount.toLocaleString('es-CO')}
      </Text>

    </View>

  );

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        ADSO-Pay
      </Text>

      <View style={styles.balanceContainer}>

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
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews
      />

    </View>

  );

};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
    paddingTop: 60
  },

  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20
  },

  balanceContainer: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20
  },

  balanceLabel: {
    color: '#94a3b8',
    fontSize: 16
  },

  balance: {
    color: '#22c55e',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10
  },

  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },

  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 10,
    width: '30%'
  },

  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },

  card: {
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  type: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },

  account: {
    color: '#cbd5e1',
    marginTop: 5
  },

  status: {
    color: '#94a3b8',
    marginTop: 5
  },

  amount: {
    fontSize: 18,
    fontWeight: 'bold'
  },

  income: {
    color: '#22c55e'
  },

  withdraw: {
    color: '#ef4444'
  }

});

export default WalletScreen;