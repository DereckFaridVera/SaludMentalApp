import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { theme } from '../utils/theme';
import { stressTestQuestions } from '../utils/questions';
import useStore from '../store/useStore';
import { Ionicons } from '@expo/vector-icons';

export default function StressTestScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testCompleted, setTestCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const addTestResult = useStore((state) => state.addTestResult);

  const handleSelectOption = (optionIndex) => {
    const newAnswers = { ...answers, [currentQuestion]: optionIndex };
    setAnswers(newAnswers);

    if (currentQuestion < stressTestQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      // Calculate score
      let score = 0;
      Object.values(newAnswers).forEach((val) => {
        score += val; // 0 to 4 per question
      });
      setFinalScore(score);
      setTestCompleted(true);
      
      // Save result
      addTestResult({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        score: score,
        maxScore: stressTestQuestions.length * 4,
      });
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setTestCompleted(false);
    setFinalScore(0);
  };

  const getRecommendation = (score) => {
    if (score <= 10) return { title: "Nivel de Estrés Bajo", text: "Excelente manejo del estrés. Sigue con tus buenos hábitos académicos y pausas activas.", color: theme.colors.success };
    if (score <= 25) return { title: "Nivel de Estrés Moderado", text: "Estás experimentando algo de desgaste. Sería bueno organizar mejor tus tiempos y empezar a realizar los ejercicios de relajación diaria.", color: theme.colors.accent };
    return { title: "Nivel de Estrés Alto", text: "Atención: Tu desgaste académico es elevado. Prioriza tu sueño, usa las técnicas de relajación intensiva y considera contactar a un consejero o familiar para hablar de esto.", color: theme.colors.error };
  };

  if (testCompleted) {
    const recommendation = getRecommendation(finalScore);
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="shield-checkmark" size={80} color={recommendation.color} />
        <Text style={styles.title}>Resultados del Test</Text>
        <Text style={styles.scoreText}>Puntaje: {finalScore} / 40</Text>
        
        <View style={[styles.recommendationCard, { borderTopColor: recommendation.color }]}>
          <Text style={[styles.recommendationTitle, { color: recommendation.color }]}>{recommendation.title}</Text>
          <Text style={styles.recommendationText}>{recommendation.text}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={resetTest}>
          <Text style={styles.buttonText}>Realizar de nuevo en el futuro</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const question = stressTestQuestions[currentQuestion];
  const progressPercent = ((currentQuestion) / stressTestQuestions.length) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test de Estrés Académico</Text>
      
      {/* ProgressBar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
      </View>
      <Text style={styles.progressText}>Pregunta {currentQuestion + 1} de {stressTestQuestions.length}</Text>

      <ScrollView contentContainerStyle={styles.card}>
        <Text style={styles.questionText}>{question.question}</Text>
        
        <View style={styles.optionsContainer}>
          {question.options.map((opt, index) => {
            const isSelected = answers[currentQuestion] === index;
            return (
              <TouchableOpacity 
                key={index} 
                style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                onPress={() => handleSelectOption(index)}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{opt}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xl * 2,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    marginBottom: theme.spacing.s,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  progressText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'right',
    marginBottom: theme.spacing.l,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.l,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
    marginBottom: theme.spacing.xl,
  },
  questionText: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl * 1.5,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: theme.spacing.m,
  },
  optionButton: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  optionButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10', // 10% opacity
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  optionTextSelected: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  scoreText: {
    ...theme.typography.h3,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  recommendationCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.l,
    borderTopWidth: 6,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: theme.spacing.xl * 2,
    alignItems: 'center',
  },
  recommendationTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  recommendationText: {
    ...theme.typography.body,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
