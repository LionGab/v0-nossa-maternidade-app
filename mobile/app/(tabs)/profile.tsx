/**
 * Tela de Perfil
 * Configurações e informações da usuária
 */

import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar e Info */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👩</Text>
          </View>
          <Text style={styles.name}>Maria Silva</Text>
          <Text style={styles.email}>maria.silva@email.com</Text>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsRow}>
          <StatBox icon="🏆" value="125" label="Pontos" />
          <StatBox icon="✨" value="5" label="Conquistas" />
          <StatBox icon="📅" value="15" label="Dias Ativos" />
        </View>

        {/* Configurações */}
        <Text style={styles.sectionTitle}>Configurações</Text>
        
        <SettingItem
          icon="🔔"
          title="Notificações"
          subtitle="Receber lembretes e atualizações"
          rightElement={
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#ccc', true: '#FFB6C1' }}
              thumbColor={notificationsEnabled ? '#FF69B4' : '#f4f3f4'}
            />
          }
        />

        <SettingItem
          icon="🌙"
          title="Modo Escuro"
          subtitle="Ativar tema escuro"
          rightElement={
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#ccc', true: '#FFB6C1' }}
              thumbColor={darkModeEnabled ? '#FF69B4' : '#f4f3f4'}
            />
          }
        />

        <SettingItem
          icon="🔒"
          title="Privacidade"
          subtitle="Gerenciar dados e privacidade"
        />

        <SettingItem
          icon="💬"
          title="Idioma"
          subtitle="Português (Brasil)"
        />

        {/* Ações */}
        <Text style={styles.sectionTitle}>Conta</Text>
        
        <SettingItem
          icon="📧"
          title="Editar Perfil"
          subtitle="Alterar informações pessoais"
        />

        <SettingItem
          icon="❓"
          title="Ajuda e Suporte"
          subtitle="Precisa de ajuda?"
        />

        <SettingItem
          icon="📄"
          title="Termos e Política"
          subtitle="Ler termos de uso e privacidade"
        />

        {/* Versão */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versão 1.0.0</Text>
          <Text style={styles.versionSubtext}>Nossa Maternidade © 2025</Text>
        </View>

        {/* Botão Sair */}
        <TouchableOpacity 
          style={styles.logoutButton}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ icon, value, label }: any) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SettingItem({ icon, title, subtitle, rightElement }: any) {
  return (
    <TouchableOpacity 
      style={styles.settingItem}
      activeOpacity={rightElement ? 1 : 0.7}
    >
      <Text style={styles.settingIcon}>{icon}</Text>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      {rightElement ? (
        rightElement
      ) : (
        <Text style={styles.settingArrow}>›</Text>
      )}
    </TouchableOpacity>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFE4E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#FF69B4',
  },
  avatarText: {
    fontSize: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  settingItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  settingArrow: {
    fontSize: 24,
    color: '#ccc',
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    color: '#ccc',
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF69B4',
    marginBottom: 24,
  },
  logoutButtonText: {
    color: '#FF69B4',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
