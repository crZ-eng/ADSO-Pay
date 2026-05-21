import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from 'react-native';

import {
  generateSavingGoals,
  transferToGoal
} from '../walletEngine';

export default function SavingGoalsScreen() {

  const [walletBalance, setWalletBalance] = useState(500000);

  const [goals, setGoals] = useState(
    generateSavingGoals(3)
  );

  const handleTransfer = (goalId) => {

    const updatedGoals = goals.map((goal) => {

      if (goal.id !== goalId) {
        return goal;
      }

      const result = transferToGoal(
        walletBalance,
        goal,
        50000
      );

      if (result.status === 'Completado') {

        setWalletBalance(result.remainingBalance);

        return result.updatedGoal;
      }

      return goal;
    });

    setGoals(updatedGoals);
  };

  const renderGoal = ({ item }) => (

    <View style={styles.card}>

      <Text style={styles.goalName}>
        {item.name}
      </Text>

      <Text>
        Ahorrado: ${item.savedAmount.toFixed(2)}
      </Text>

      <Text>
        Meta: ${item.targetAmount.toFixed(2)}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleTransfer(item.id)}
      >
        <Text style={styles.buttonText}>
          Ahorrar $50.000
        </Text>
      </TouchableOpacity>

    </View>
  );

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Metas de Ahorro
      </Text>

      <Text style={styles.balance}>
        Saldo disponible: ${walletBalance.toFixed(2)}
      </Text>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={renderGoal}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20
  },

  balance: {
    fontSize: 18,
    marginBottom: 20
  },

  card: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
    marginBottom: 15
  },

  goalName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },

  button: {
    marginTop: 15,
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 10
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  }

});