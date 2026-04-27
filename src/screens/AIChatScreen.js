import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';
import useStore from '../store/useStore';
import { useNavigation } from '@react-navigation/native';

// Use your local IP or 10.0.2.2 if testing on Android Emulator
// For physical devices, replace localhost with your PC's IP address (e.g. 192.168.1.x)
const BACKEND_URL = "http://192.168.11.204:3000/api/chat";

export default function AIChatScreen() {
  const user = useStore((state) => state.user);
  const navigation = useNavigation();
  const [messages, setMessages] = useState([
    { id: '1', text: `Hola ${user?.name || ''}, soy Luz. Estoy aquí para escucharte y apoyarte sin juicios. ¿Cómo te sientes en este momento?`, sender: 'ai' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now().toString(), text: inputText.trim(), sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Assuming a real device might be testing this, we use localhost logic or a generic IP 
      // If it fails due to network on a real phone, the user might need to change localhost to their IP.
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text }),
      });

      const data = await response.json();
      
      if (response.ok && data.reply) {
        setMessages(prev => [...prev, { id: Date.now().toString(), text: data.reply, sender: 'ai' }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now().toString(), text: data.error || "Lo siento, hubo un problema al conectarme al servidor.", sender: 'ai' }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), text: "Lo siento, no pude comunicarme con el servidor local. Asegúrate de que el backend en el puerto 3000 esté corriendo y la IP sea correcta.", sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {!isUser && <Ionicons name="sparkles" size={16} color={theme.colors.accent} style={styles.aiIcon} />}
        <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Ionicons name="sparkles" size={20} color={theme.colors.accent} />
          <Text style={styles.headerTitle}>Luz (IA Premium)</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.accent} />
          <Text style={styles.loadingText}>Luz está escribiendo...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Escribe tu mensaje aquí..."
          placeholderTextColor={theme.colors.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={isLoading || !inputText.trim()}>
          <Ionicons name="send" size={20} color={theme.colors.surface} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: theme.spacing.xl * 2,
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: theme.spacing.s,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing.s,
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginLeft: 6,
  },
  chatContainer: {
    padding: theme.spacing.m,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.l,
    marginBottom: theme.spacing.m,
  },
  userBubble: {
    backgroundColor: theme.colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: theme.colors.surface,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.accent + '30',
    flexDirection: 'row',
  },
  messageText: {
    ...theme.typography.body,
  },
  userText: {
    color: theme.colors.surface,
  },
  aiText: {
    color: theme.colors.text,
    flex: 1,
  },
  aiIcon: {
    marginRight: 6,
    marginTop: 2,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.m,
  },
  loadingText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: 8,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  textInput: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    paddingHorizontal: theme.spacing.m,
    paddingTop: 12,
    paddingBottom: 12,
    maxHeight: 120,
    minHeight: 40,
    color: theme.colors.text,
  },
  sendButton: {
    backgroundColor: theme.colors.accent,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.s,
    marginBottom: 2,
  },
});
