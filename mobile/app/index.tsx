/**
 * Tela de Boas-Vindas
 * Primeira tela do aplicativo com apresentação e botão para entrar
 */

import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header com logo */}
      <View style={styles.header}>
        <Text style={styles.logo}>💗</Text>
        <Text style={styles.title}>Nossa Maternidade</Text>
        <Text style={styles.subtitle}>Seu apoio na jornada da maternidade</Text>
      </View>

      {/* Ilustração */}
      <View style={styles.illustrationContainer}>
        <Text style={styles.illustration}>👩‍👧‍👦</Text>
      </View>

      {/* Benefícios */}
      <View style={styles.features}>
        <FeatureItem icon="🤖" text="Chat com IA empática" />
        <FeatureItem icon="🏆" text="Gamificação e desafios" />
        <FeatureItem icon="📝" text="Diário digital seguro" />
        <FeatureItem icon="💪" text="Apoio emocional 24/7" />
      </View>

      {/* Botão de entrada */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/(tabs)')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Começar Agora</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footer}>
        Desenvolvido com ❤️ para mães brasileiras
      </Text>
    </View>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  illustration: {
    fontSize: 120,
  },
  features: {
    width: '100%',
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#FF69B4',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});
