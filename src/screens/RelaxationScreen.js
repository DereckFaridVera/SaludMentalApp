import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';

const QUOTES = [
  "No tienes que tenerlo todo resuelto hoy. Solo respira.",
  "Estar cansado no significa que seas débil. Significa que eres humano.",
  "Tus calificaciones no definen tu valor como persona.",
  "Haz una pausa. El mundo seguirá ahí cuando regreses.",
  "El progreso lento sigue siendo progreso.",
  "Hablar de cómo te sientes es el primer paso para sanar."
];

export default function RelaxationScreen() {
  const [activeTab, setActiveTab] = useState('breathe'); // 'breathe', 'grounding', 'quotes'

  // Breathing animation states
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.7)).current;
  const animationRef = useRef(null);
  const [isBreathing, setIsBreathing] = useState(false);

  // Quotes states
  const [quoteIndex, setQuoteIndex] = useState(0);

  const startBreathing = () => {
    setIsBreathing(true);
    const sequence = Animated.sequence([
      Animated.parallel([
        Animated.timing(scale, { toValue: 1.5, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 4000, useNativeDriver: true })
      ]),
      Animated.delay(4000),
      Animated.parallel([
        Animated.timing(scale, { toValue: 1, duration: 6000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.7, duration: 6000, useNativeDriver: true })
      ])
    ]);

    animationRef.current = Animated.loop(sequence);
    animationRef.current.start();
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    if (animationRef.current) {
      animationRef.current.stop();
    }
    Animated.parallel([
      Animated.timing(scale, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.7, duration: 500, useNativeDriver: true })
    ]).start();
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) animationRef.current.stop();
    };
  }, []);

  const changeQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
  };

  const renderContent = () => {
    if (activeTab === 'breathe') {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.contentTitle}>Respiración 4-4-6</Text>
          <Text style={styles.contentSubtitle}>Inhala cuando el círculo crece (4s), mantén (4s), y exhala cuando se reduce (6s).</Text>
          
          <View style={styles.circleContainer}>
            <Animated.View style={[styles.circle, { transform: [{ scale }], opacity }]} />
          </View>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.button} onPress={startBreathing}>
              <Text style={styles.buttonText}>{isBreathing ? "Reiniciar" : "Comenzar"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={stopBreathing} disabled={!isBreathing}>
              <Text style={[styles.buttonTextSecondary, !isBreathing && {color: theme.colors.textSecondary}]}>Detener</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (activeTab === 'grounding') {
      return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.contentTitle}>Técnica 5-4-3-2-1</Text>
          <Text style={styles.contentSubtitle}>Ideal para cuando sientes ansiedad o pánico. Enfócate en tu entorno:</Text>
          
          <View style={styles.groundingCard}>
            <Text style={styles.groundingNumber}>👁️ 5</Text>
            <Text style={styles.groundingText}>Cosas que puedes <Text style={styles.boldText}>VER</Text>. (Ej: un lápiz, una nube...)</Text>
          </View>

          <View style={styles.groundingCard}>
            <Text style={styles.groundingNumber}>🖐️ 4</Text>
            <Text style={styles.groundingText}>Cosas que puedes <Text style={styles.boldText}>TOCAR</Text>. (Ej: la textura de tu ropa...)</Text>
          </View>

          <View style={styles.groundingCard}>
            <Text style={styles.groundingNumber}>👂 3</Text>
            <Text style={styles.groundingText}>Cosas que puedes <Text style={styles.boldText}>ESCUCHAR</Text>. (Ej: pájaros, tráfico...)</Text>
          </View>

          <View style={styles.groundingCard}>
            <Text style={styles.groundingNumber}>👃 2</Text>
            <Text style={styles.groundingText}>Cosas que puedes <Text style={styles.boldText}>OLER</Text>. (Ej: tu perfume, café...)</Text>
          </View>

          <View style={styles.groundingCard}>
            <Text style={styles.groundingNumber}>👅 1</Text>
            <Text style={styles.groundingText}>Cosa que puedes <Text style={styles.boldText}>SABOREAR</Text>. (Ej: un chicle, agua...)</Text>
          </View>
        </ScrollView>
      );
    }

    if (activeTab === 'quotes') {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.contentTitle}>Frases Inspiradoras</Text>
          <View style={styles.quoteCardBig}>
            <Ionicons name="flower-outline" size={40} color={theme.colors.accent} style={{ marginBottom: 16 }} />
            <Text style={styles.quoteTextBig}>"{QUOTES[quoteIndex]}"</Text>
          </View>
          <TouchableOpacity style={styles.nextQuoteButton} onPress={changeQuote}>
            <Text style={styles.nextQuoteButtonText}>Leer otra frase</Text>
            <Ionicons name="arrow-forward" size={18} color={theme.colors.surface} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Espacio de Calma</Text>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'breathe' && styles.activeTab]} onPress={() => setActiveTab('breathe')}>
          <Ionicons name="leaf-outline" size={20} color={activeTab === 'breathe' ? theme.colors.surface : theme.colors.primary} />
          <Text style={[styles.tabText, activeTab === 'breathe' && styles.activeTabText]}>Respirar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.tab, activeTab === 'grounding' && styles.activeTab]} onPress={() => setActiveTab('grounding')}>
          <Ionicons name="footsteps-outline" size={20} color={activeTab === 'grounding' ? theme.colors.surface : theme.colors.primary} />
          <Text style={[styles.tabText, activeTab === 'grounding' && styles.activeTabText]}>Ansiedad</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab, activeTab === 'quotes' && styles.activeTab]} onPress={() => setActiveTab('quotes')}>
          <Ionicons name="chatbubbles-outline" size={20} color={activeTab === 'quotes' ? theme.colors.surface : theme.colors.primary} />
          <Text style={[styles.tabText, activeTab === 'quotes' && styles.activeTabText]}>Frases</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentArea}>
        {renderContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.xl * 2,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.l,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.m,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
    gap: theme.spacing.s,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.borderRadius.l,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tabText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: theme.colors.surface,
  },
  contentArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  scrollContainer: {
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xl * 3,
  },
  centerContainer: {
    flex: 1,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  contentTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.s,
  },
  contentSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  // Breathing
  circleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: theme.colors.secondary,
    shadowColor: theme.colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 8,
  },
  controls: {
    flexDirection: 'row',
    gap: theme.spacing.m,
    marginTop: 'auto',
    width: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    color: theme.colors.surface,
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonTextSecondary: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Grounding
  groundingCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.m,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  groundingNumber: {
    fontSize: 24,
    marginRight: theme.spacing.l,
    width: 45,
    textAlign: 'center',
  },
  groundingText: {
    ...theme.typography.body,
    flex: 1,
    color: theme.colors.text,
  },
  boldText: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  // Quotes
  quoteCardBig: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.l,
    width: '100%',
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  quoteTextBig: {
    ...theme.typography.h2,
    fontStyle: 'italic',
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 34,
  },
  nextQuoteButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.l,
    alignItems: 'center',
    marginTop: 'auto',
  },
  nextQuoteButtonText: {
    color: theme.colors.surface,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
