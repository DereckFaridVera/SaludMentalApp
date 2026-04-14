import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { theme } from '../utils/theme';
import useStore from '../store/useStore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const quotes = [
  "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
  "Respira profundo. Es solo un mal día, no una mala vida.",
  "La salud mental es una prioridad, no un lujo.",
  "Tu bienestar importa más que tus calificaciones.",
  "Pide ayuda si lo necesitas. Eso también es ser valiente.",
];

export default function HomeScreen() {
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const emotionalRecords = useStore((state) => state.emotionalRecords);
  const navigation = useNavigation();

  const [isProfileVisible, setProfileVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Cerrar Sesión", 
          style: "destructive",
          onPress: () => {
            setProfileVisible(false);
            logout();
          }
        }
      ]
    );
  };

  // Get a random quote based on current date
  const quoteIndex = new Date().getDate() % quotes.length;
  const dailyQuote = quotes[quoteIndex];

  const lastMood = emotionalRecords.length > 0 ? emotionalRecords[emotionalRecords.length - 1] : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>¡Hola, {user?.name || 'Estudiante'}!</Text>
          <Text style={styles.subtitle}>Cuidando tu mente, construyes tu futuro</Text>
        </View>
        <TouchableOpacity style={styles.avatar} onPress={() => setProfileVisible(true)}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isProfileVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setProfileVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.profileModal}>
            <View style={styles.profileModalHeader}>
              <Text style={styles.profileModalTitle}>Tu Perfil</Text>
              <TouchableOpacity onPress={() => setProfileVisible(false)}>
                <Ionicons name="close" size={28} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileModalContent}>
              <View style={[styles.avatar, styles.largeAvatar]}>
                <Text style={styles.largeAvatarText}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
              </View>
              <Text style={styles.profileName}>{user?.name || 'Estudiante'}</Text>
              
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.quoteCard}>
        <Ionicons name="sunny-outline" size={24} color={theme.colors.accent} style={{ marginBottom: 8 }} />
        <Text style={styles.quoteText}>"{dailyQuote}"</Text>
      </View>

      <Text style={styles.sectionTitle}>Tu Bienestar Reciente</Text>
      
      {lastMood ? (
        <View style={styles.statusCard}>
          <Ionicons name={lastMood.mood.icon} size={40} color={lastMood.mood.color} />
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>Último registro:</Text>
            <Text style={[styles.statusMood, { color: lastMood.mood.color }]}>{lastMood.mood.label}</Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Registro")}>
          <Ionicons name="add-circle-outline" size={30} color={theme.colors.primary} />
          <Text style={styles.actionCardText}>¿Cómo te sientes hoy? Haz tu primer registro.</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
      
      <View style={styles.grid}>
        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate("Test")}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.colors.error + '15' }]}>
            <Ionicons name="pulse" size={32} color={theme.colors.error} />
          </View>
          <Text style={styles.gridText}>Test de Estrés</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate("Relax")}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.colors.secondary + '20' }]}>
            <Ionicons name="leaf" size={32} color={theme.colors.secondary} />
          </View>
          <Text style={styles.gridText}>Relajación guiada</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl * 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl * 1.5,
  },
  greeting: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: theme.colors.surface,
    fontSize: 20,
    fontWeight: 'bold',
  },
  quoteCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.l,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: theme.spacing.xl * 1.5,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.accent,
  },
  quoteText: {
    ...theme.typography.body,
    fontStyle: 'italic',
    color: theme.colors.text,
    lineHeight: 24,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  statusCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.l,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    elevation: 2,
  },
  statusInfo: {
    marginLeft: theme.spacing.l,
  },
  statusTitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  statusMood: {
    ...theme.typography.h3,
    fontWeight: 'bold',
    marginTop: 2,
  },
  actionCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary + '10',
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  actionCardText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    marginLeft: theme.spacing.m,
    fontWeight: '600',
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.m,
  },
  gridItem: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.l,
    alignItems: 'center',
    elevation: 2,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  gridText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  profileModal: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    width: '100%',
    padding: theme.spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  profileModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  profileModalTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  profileModalContent: {
    alignItems: 'center',
  },
  largeAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: theme.spacing.m,
  },
  largeAvatarText: {
    color: theme.colors.surface,
    fontSize: 36,
    fontWeight: 'bold',
  },
  profileName: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl * 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.error + '15',
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.m,
    width: '100%',
    justifyContent: 'center',
  },
  logoutText: {
    color: theme.colors.error,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: theme.spacing.s,
  },
});
