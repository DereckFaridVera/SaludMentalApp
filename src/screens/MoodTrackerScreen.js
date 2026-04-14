import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { theme } from '../utils/theme';
import useStore from '../store/useStore';
import { Ionicons } from '@expo/vector-icons';

const moods = [
  { id: 1, label: 'Muy Mal', icon: 'sad-outline', color: '#E74C3C', recommendation: 'Tómate un momento para respirar profundo. Está bien no sentirse bien hoy. Ayúdate con un ejercicio de relajación o desconecta un momento.' }, 
  { id: 2, label: 'Mal', icon: 'thumbs-down-outline', color: '#FF9800', recommendation: 'Parece que hoy es un día pesado. Intenta no sobrecargarte de deberes y tómate pausas frecuentes.' }, 
  { id: 3, label: 'Neutral', icon: 'remove-circle-outline', color: '#95A5A6', recommendation: 'Un día tranquilo. Mantén un ritmo de estudio constante pero sin llegar al agotamiento.' }, 
  { id: 4, label: 'Bien', icon: 'thumbs-up-outline', color: '#3498DB', recommendation: '¡Qué bueno! Aprovecha esta energía positiva para avanzar en tus proyectos académicos.' }, 
  { id: 5, label: 'Excelente', icon: 'happy-outline', color: '#2ECC71', recommendation: '¡Día fenomenal! Mantén esta motivación viva, es tu mejor herramienta para el éxito.' }, 
];

export default function MoodTrackerScreen() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const addEmotionalRecord = useStore((state) => state.addEmotionalRecord);

  const handleSave = () => {
    if (!selectedMood) {
      Alert.alert("Selecciona un estado", "Por favor selecciona cómo te sientes hoy antes de guardar.");
      return;
    }

    const record = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood: selectedMood,
      note: note.trim(),
    };

    addEmotionalRecord(record);
    setSelectedMood(null);
    setNote('');
    Alert.alert("¡Guardado!", "Tu estado emocional ha sido registrado con éxito.");
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>¿Cómo te sientes hoy?</Text>
        <Text style={styles.subtitle}>Selecciona la opción que mejor represente tu estado actual</Text>

        <View style={styles.moodContainer}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodButton,
                selectedMood?.id === mood.id && { backgroundColor: mood.color + '20', borderColor: mood.color }
              ]}
              onPress={() => setSelectedMood(mood)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={mood.icon} 
                size={40} 
                color={selectedMood?.id === mood.id ? mood.color : theme.colors.textSecondary} 
              />
              <Text style={[
                styles.moodLabel,
                selectedMood?.id === mood.id && { color: mood.color, fontWeight: 'bold' }
              ]}>
                {mood.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedMood && (
          <View style={[styles.recommendationBox, { borderLeftColor: selectedMood.color }]}>
            <Ionicons name="bulb-outline" size={24} color={selectedMood.color} />
            <Text style={styles.recommendationText}>{selectedMood.recommendation}</Text>
          </View>
        )}

        <View style={styles.noteContainer}>
          <Text style={styles.noteTitle}>¿Quieres agregar algún detalle?</Text>
          <TextInput
            style={styles.input}
            placeholder="Escribe aquí sobre tu día (opcional)..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={4}
            value={note}
            onChangeText={setNote}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, !selectedMood && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={!selectedMood}
        >
          <Text style={styles.saveButtonText}>Guardar Registro</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flexGrow: 1,
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xl * 2,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl * 1.5,
    textAlign: 'center',
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.m,
    marginBottom: theme.spacing.xl * 1.5,
  },
  moodButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.m,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: theme.spacing.m,
  },
  moodLabel: {
    marginTop: theme.spacing.s,
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  noteContainer: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  noteTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    color: theme.colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    minHeight: 120,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
    marginTop: 'auto',
  },
  saveButtonDisabled: {
    backgroundColor: theme.colors.textSecondary,
    opacity: 0.5,
  },
  saveButtonText: {
    color: theme.colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
  recommendationBox: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.xl,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    alignItems: 'center',
  },
  recommendationText: {
    flex: 1,
    ...theme.typography.caption,
    color: theme.colors.text,
    marginLeft: theme.spacing.m,
    fontStyle: 'italic',
  },
});
