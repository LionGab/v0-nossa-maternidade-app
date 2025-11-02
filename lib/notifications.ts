/**
 * Notification System
 * 
 * Provides utilities for managing notifications across the application.
 * Supports multiple notification types and delivery methods.
 */

import { createClient } from '@/lib/supabase/client';

// Constants
const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;

export type NotificationType = 
  | 'appointment_reminder'
  | 'exam_result'
  | 'health_update'
  | 'community_message'
  | 'system_alert'
  | 'achievement';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  read: boolean;
  readAt?: string;
  createdAt: string;
  scheduledFor?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  appointmentReminders: boolean;
  examResults: boolean;
  healthUpdates: boolean;
  communityMessages: boolean;
  achievements: boolean;
}

/**
 * Create a new notification
 */
export async function createNotification(
  notification: Omit<Notification, 'id' | 'createdAt' | 'read' | 'readAt'>
): Promise<Notification | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('notifications')
    .insert([
      {
        user_id: notification.userId,
        type: notification.type,
        priority: notification.priority,
        title: notification.title,
        message: notification.message,
        action_url: notification.actionUrl,
        action_label: notification.actionLabel,
        scheduled_for: notification.scheduledFor,
        metadata: notification.metadata,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating notification:', error);
    return null;
  }

  return mapNotificationFromDb(data);
}

/**
 * Get notifications for a user
 */
export async function getUserNotifications(
  userId: string,
  options?: {
    unreadOnly?: boolean;
    limit?: number;
    offset?: number;
  }
): Promise<Notification[]> {
  const supabase = createClient();

  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (options?.unreadOnly) {
    query = query.eq('read', false);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || DEFAULT_LIMIT) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  return (data || []).map(mapNotificationFromDb);
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('notifications')
    .update({
      read: true,
      read_at: new Date().toISOString(),
    })
    .eq('id', notificationId);

  if (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }

  return true;
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('notifications')
    .update({
      read: true,
      read_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('read', false);

  if (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }

  return true;
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  if (error) {
    console.error('Error deleting notification:', error);
    return false;
  }

  return true;
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false);

  if (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Subscribe to notification updates via Supabase Realtime
 */
export function subscribeToNotifications(
  userId: string,
  callback: (notification: Notification) => void
) {
  const supabase = createClient();

  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        const notification = mapNotificationFromDb(payload.new);
        callback(notification);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Create appointment reminder notification
 */
export async function createAppointmentReminder(
  userId: string,
  appointmentId: string,
  appointmentDate: string,
  doctorName: string
): Promise<Notification | null> {
  // Schedule reminder 24 hours before appointment
  const reminderDate = new Date(appointmentDate);
  reminderDate.setHours(reminderDate.getHours() - 24);

  return createNotification({
    userId,
    type: 'appointment_reminder',
    priority: 'high',
    title: 'Lembrete de Consulta',
    message: `Você tem uma consulta agendada com ${doctorName} amanhã às ${new Date(appointmentDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.`,
    actionUrl: `/dashboard/appointments/${appointmentId}`,
    actionLabel: 'Ver Detalhes',
    scheduledFor: reminderDate.toISOString(),
    metadata: {
      appointmentId,
      doctorName,
      appointmentDate,
    },
  });
}

/**
 * Create exam result notification
 */
export async function createExamResultNotification(
  userId: string,
  examId: string,
  examName: string
): Promise<Notification | null> {
  return createNotification({
    userId,
    type: 'exam_result',
    priority: 'high',
    title: 'Resultado de Exame Disponível',
    message: `O resultado do exame "${examName}" está disponível.`,
    actionUrl: `/dashboard/exams/${examId}`,
    actionLabel: 'Ver Resultado',
    metadata: {
      examId,
      examName,
    },
  });
}

/**
 * Create achievement notification
 */
export async function createAchievementNotification(
  userId: string,
  achievementId: string,
  achievementTitle: string,
  points: number
): Promise<Notification | null> {
  return createNotification({
    userId,
    type: 'achievement',
    priority: 'medium',
    title: '🎉 Nova Conquista Desbloqueada!',
    message: `Parabéns! Você conquistou "${achievementTitle}" e ganhou ${points} pontos.`,
    actionUrl: '/dashboard/achievements',
    actionLabel: 'Ver Conquistas',
    metadata: {
      achievementId,
      achievementTitle,
      points,
    },
  });
}

/**
 * Helper function to map database notification to app notification
 */
function mapNotificationFromDb(dbNotification: any): Notification {
  return {
    id: dbNotification.id,
    userId: dbNotification.user_id,
    type: dbNotification.type,
    priority: dbNotification.priority,
    title: dbNotification.title,
    message: dbNotification.message,
    actionUrl: dbNotification.action_url,
    actionLabel: dbNotification.action_label,
    read: dbNotification.read,
    readAt: dbNotification.read_at,
    createdAt: dbNotification.created_at,
    scheduledFor: dbNotification.scheduled_for,
    metadata: dbNotification.metadata,
  };
}
