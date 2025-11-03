/**
 * Tela Inicial - Dashboard
 * Visão geral com cards de acesso rápido
 */

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Saudação */}
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Olá, Mamãe! 👋</Text>
          <Text style={styles.greetingSubtext}>Como você está se sentindo hoje?</Text>
        </View>

        {/* Cards de Status */}
        <View style={styles.statsContainer}>
          <StatCard icon="🏆" value="125" label="Pontos" color="#FFD700" />
          <StatCard icon="🎯" value="3" label="Desafios" color="#FF69B4" />
          <StatCard icon="✨" value="5" label="Conquistas" color="#87CEEB" />
        </View>

        {/* Acesso Rápido */}
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>
        <View style={styles.quickAccess}>
          <QuickAccessCard icon="💬" title="Chat NathAI" subtitle="Converse agora" />
          <QuickAccessCard icon="📊" title="Triagem" subtitle="Análise emocional" />
          <QuickAccessCard icon="🍳" title="Receitas" subtitle="Ideias com IA" />
          <QuickAccessCard icon="🎮" title="Desafios" subtitle="3 ativos" />
        </View>

        {/* Dica do Dia */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Dica do Dia</Text>
            <Text style={styles.tipText}>
              Reserve 15 minutos hoje só para você. Autocuidado é essencial!
            </Text>
          </View>
        </View>

        {/* Atividades Recentes */}
        <Text style={styles.sectionTitle}>Atividades Recentes</Text>
        <ActivityItem 
          icon="📝" 
          title="Diário atualizado" 
          time="Há 2 horas" 
        />
        <ActivityItem 
          icon="🏆" 
          title="Desafio concluído: Meditação" 
          time="Ontem" 
        />
        <ActivityItem 
          icon="💬" 
          title="Conversa com NathAI" 
          time="Há 3 dias" 
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ icon, value, label, color }: any) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function QuickAccessCard({ icon, title, subtitle }: any) {
  return (
    <TouchableOpacity style={styles.quickAccessCard} activeOpacity={0.7}>
      <Text style={styles.quickAccessIcon}>{icon}</Text>
      <Text style={styles.quickAccessTitle}>{title}</Text>
      <Text style={styles.quickAccessSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

function ActivityItem({ icon, title, time }: any) {
  return (
    <View style={styles.activityItem}>
      <Text style={styles.activityIcon}>{icon}</Text>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
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
  greeting: {
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  greetingSubtext: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderLeftWidth: 4,
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
    fontSize: 24,
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
  quickAccess: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  quickAccessCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickAccessIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickAccessTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  quickAccessSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  tipCard: {
    backgroundColor: '#FFE4E1',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 24,
  },
  tipIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  activityItem: {
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
  activityIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
});
