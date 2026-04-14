import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../utils/theme';
import useStore from '../store/useStore';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const emotionalRecords = useStore((state) => state.emotionalRecords);
  const testResults = useStore((state) => state.testResults);

  // Combine and sort by date descending
  const combinedHistory = [
    ...emotionalRecords.map(r => ({ ...r, type: 'mood' })),
    ...testResults.map(r => ({ ...r, type: 'test' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu Historial</Text>
      
      <ScrollView contentContainerStyle={styles.list}>
        {combinedHistory.length === 0 ? (
          <Text style={styles.emptyText}>Aún no hay registros. ¡Haz tu primer registro emocional o test!</Text>
        ) : (
          combinedHistory.map((item) => {
            if (item.type === 'mood') {
              return (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.row}>
                      <Ionicons name={item.mood.icon} size={24} color={item.mood.color} />
                      <Text style={[styles.cardTitle, { color: item.mood.color, marginLeft: 8 }]}>
                        {item.mood.label}
                      </Text>
                    </View>
                    <Text style={styles.dateText}>{formatDate(item.date)}</Text>
                  </View>
                  {item.note ? (
                    <Text style={styles.noteText}>{item.note}</Text>
                  ) : null}
                </View>
              );
            } else if (item.type === 'test') {
              const isHighStress = item.score > 25;
              const stressColor = isHighStress ? theme.colors.error : (item.score > 10 ? theme.colors.accent : theme.colors.success);
              
              return (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.row}>
                      <Ionicons name="pulse" size={24} color={stressColor} />
                      <Text style={[styles.cardTitle, { color: stressColor, marginLeft: 8 }]}>
                        Test de Estrés
                      </Text>
                    </View>
                    <Text style={styles.dateText}>{formatDate(item.date)}</Text>
                  </View>
                  <Text style={styles.scoreText}>Puntaje: {item.score} / {item.maxScore}</Text>
                </View>
              );
            }
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
    paddingTop: theme.spacing.xl * 2,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.l,
    paddingHorizontal: theme.spacing.s,
  },
  list: {
    paddingBottom: theme.spacing.xl * 3,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xl * 2,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.m,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    ...theme.typography.h3,
    fontSize: 18,
  },
  dateText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  noteText: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginTop: theme.spacing.s,
    fontStyle: 'italic',
  },
  scoreText: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginTop: theme.spacing.s,
    fontWeight: 'bold',
  },
});
