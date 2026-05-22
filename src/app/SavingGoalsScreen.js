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

export default function SavingGoalsScreen({ onBack }) {

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

        setWalletBalance(
          result.remainingBalance
        );

        return result.updatedGoal;
      }

      return goal;
    });

    setGoals(updatedGoals);
  };

  const renderGoal = ({ item }) => {

    const progress =
      (
        item.savedAmount /
        item.targetAmount
      ) * 100;

    return (

      <View style={styles.card}>

        <View style={styles.goalHeader}>

          <Text style={styles.goalName}>
            {item.name}
          </Text>

          <Text style={styles.goalPercentage}>
            {progress.toFixed(0)}%
          </Text>

        </View>

        <Text style={styles.goalText}>
          Ahorrado:
          {' '}
          ${item.savedAmount.toLocaleString('es-CO')}
        </Text>

        <Text style={styles.goalText}>
          Meta:
          {' '}
          ${item.targetAmount.toLocaleString('es-CO')}
        </Text>

        <View style={styles.progressBarBackground}>

          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.min(progress, 100)}%`
              }
            ]}
          />

        </View>

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
  };

  return (

    <View style={styles.container}>

      <View style={styles.header}>

        <Text style={styles.title}>
          Metas de Ahorro
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
        >
          <Text style={styles.backButtonText}>
            Volver
          </Text>
        </TouchableOpacity>

      </View>

      <View style={styles.balanceContainer}>

        <Text style={styles.balanceLabel}>
          Saldo Disponible
        </Text>

        <Text style={styles.balance}>
          ${walletBalance.toLocaleString('es-CO')}
        </Text>

      </View>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={renderGoal}
        showsVerticalScrollIndicator={false}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    paddingTop: 60
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },

  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },

  backButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12
  },

  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15
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
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10
  },

  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16
  },

  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },

  goalName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },

  goalPercentage: {
    color: '#00C853',
    fontSize: 18,
    fontWeight: 'bold'
  },

  goalText: {
    color: '#ccc',
    fontSize: 15,
    marginBottom: 6
  },

  progressBarBackground: {
    height: 10,
    backgroundColor: '#333',
    borderRadius: 20,
    marginTop: 10,
    overflow: 'hidden'
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#6200EE',
    borderRadius: 20
  },

  button: {
    marginTop: 18,
    backgroundColor: '#6200EE',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center'
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15
  }

});