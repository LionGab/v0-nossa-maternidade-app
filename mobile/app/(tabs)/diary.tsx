/**
 * Tela de Diário Digital
 * Registro de sentimentos e reflexões diárias
 */

import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DiaryEntry {
  id: string;
  date: Date;
  mood: string;
  text: string;
}

export default function DiaryScreen() {
  const [entries] = useState<DiaryEntry[]>([
    {
      id: '1',
      date: new Date(),
      mood: '😊',
      text: 'Hoje foi um dia especial. Consegui fazer uma caminhada pela manhã e me sinto mais disposta!',
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000),
      mood: '😴',
      text: 'Noite difícil, mas estou aprendendo a lidar melhor com a rotina.',
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMood, setNewMood] = useState('😊');
  const [newText, setNewText] = useState('');

  const moods = ['😊', '😢', '😴', '😰', '💪', '🥰'];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meu Diário</Text>
          <Text style={styles.headerSubtitle}>
            Registre seus sentimentos e acompanhe sua jornada
          </Text>
        </View>

        {/* Botão Nova Entrada */}
        <TouchableOpacity 
          style={styles.newEntryButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.newEntryButtonIcon}>✏️</Text>
          <Text style={styles.newEntryButtonText}>Nova Entrada</Text>
        </TouchableOpacity>

        {/* Entradas */}
        <Text style={styles.sectionTitle}>Entradas Recentes</Text>
        {entries.map((entry) => (
          <DiaryEntryCard key={entry.id} entry={entry} />
        ))}
      </ScrollView>

      {/* Modal de Nova Entrada */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Entrada</Text>
            
            {/* Seletor de Humor */}
            <Text style={styles.modalLabel}>Como você está se sentindo?</Text>
            <View style={styles.moodSelector}>
              {moods.map((mood) => (
                <TouchableOpacity
                  key={mood}
                  style={[
                    styles.moodButton,
                    newMood === mood && styles.moodButtonSelected,
                  ]}
                  onPress={() => setNewMood(mood)}
                >
                  <Text style={styles.moodButtonText}>{mood}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Campo de Texto */}
            <Text style={styles.modalLabel}>Conte-nos sobre seu dia:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Escreva aqui seus pensamentos..."
              placeholderTextColor="#999"
              value={newText}
              onChangeText={setNewText}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            {/* Botões */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setNewText('');
                  setNewMood('😊');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => {
                  // Aqui você salvaria a entrada
                  setModalVisible(false);
                  setNewText('');
                  setNewMood('😊');
                }}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function DiaryEntryCard({ entry }: { entry: DiaryEntry }) {
  return (
    <View style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <Text style={styles.entryMood}>{entry.mood}</Text>
        <Text style={styles.entryDate}>
          {entry.date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </Text>
      </View>
      <Text style={styles.entryText}>{entry.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  newEntryButton: {
    backgroundColor: '#FF69B4',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  newEntryButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  newEntryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  entryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryMood: {
    fontSize: 32,
    marginRight: 12,
  },
  entryDate: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  entryText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  moodButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodButtonSelected: {
    backgroundColor: '#FFE4E1',
    borderWidth: 2,
    borderColor: '#FF69B4',
  },
  moodButtonText: {
    fontSize: 28,
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    height: 150,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#FF69B4',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
