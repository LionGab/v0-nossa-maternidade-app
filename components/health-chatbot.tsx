'use client';

/**
 * Health Chatbot Component
 * 
 * AI-powered chatbot for health and maternity support.
 * Features context-aware responses and conversation history.
 */

import { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isFeatureEnabled } from '@/lib/feature-flags';

export interface HealthChatbotProps {
  className?: string;
  initialMessages?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  onMessageSent?: (message: string) => void;
  placeholder?: string;
}

export function HealthChatbot({
  className,
  initialMessages = [],
  onMessageSent,
  placeholder = 'Digite sua mensagem...',
}: HealthChatbotProps) {
  // Check if feature is enabled
  const chatbotEnabled = isFeatureEnabled('chatbot');
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    initialMessages: initialMessages.map((msg, index) => ({
      id: `initial-${index}`,
      role: msg.role,
      content: msg.content,
    })),
    onFinish: (message) => {
      // Could save to database here
      console.log('Message finished:', message);
    },
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isAtBottom && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAtBottom]);

  // Track scroll position
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const atBottom = scrollHeight - scrollTop - clientHeight < 50;
      setIsAtBottom(atBottom);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      handleSubmit(e);
      onMessageSent?.(input);
    }
  };

  if (!chatbotEnabled) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center text-muted-foreground">
          O chatbot está temporariamente indisponível.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('flex flex-col h-[600px]', className)}>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          NathAI - Assistente de Saúde
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Seu assistente virtual para dúvidas sobre maternidade e bem-estar
        </p>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <div 
          ref={scrollRef}
          className="h-full overflow-y-auto p-4"
          onScroll={handleScroll}
        >
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Olá! Sou a NathAI 👋</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Estou aqui para ajudar com dúvidas sobre gestação, saúde materna e bem-estar. 
                  Como posso te apoiar hoje?
                </p>
                <p className="text-xs text-muted-foreground mt-4">
                  ⚠️ Lembre-se: Não substituo consultas médicas profissionais
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <div className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0',
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                )}>
                  {message.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>

                <div
                  className={cn(
                    'rounded-lg px-4 py-2 max-w-[80%]',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 bg-muted">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-lg px-4 py-2 bg-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}

            {error && (
              <div className="text-center p-4 text-sm text-destructive">
                Ocorreu um erro. Por favor, tente novamente.
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t p-4">
        <form onSubmit={onSubmit} className="flex w-full gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1"
            autoComplete="off"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
