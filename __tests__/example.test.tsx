/**
 * Exemplo de teste unitário para React Native/Expo
 * Usa @testing-library/react-native
 */

import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text, View, TouchableOpacity } from 'react-native';
import { describe, it, expect } from 'vitest';

// Componente de exemplo
function ExampleComponent({ onPress }: { onPress: () => void }) {
  return (
    <View>
      <Text testID="title">Nossa Maternidade</Text>
      <TouchableOpacity testID="button" onPress={onPress}>
        <Text>Clique aqui</Text>
      </TouchableOpacity>
    </View>
  );
}

describe('ExampleComponent', () => {
  it('deve renderizar o título', () => {
    const mockOnPress = vi.fn();
    render(<ExampleComponent onPress={mockOnPress} />);

    const title = screen.getByTestId('title');
    expect(title).toBeTruthy();
    expect(title.props.children).toBe('Nossa Maternidade');
  });

  it('deve chamar onPress quando o botão é pressionado', () => {
    const mockOnPress = vi.fn();
    render(<ExampleComponent onPress={mockOnPress} />);

    const button = screen.getByTestId('button');
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});

// Exemplo de teste de hook
import { useState } from 'react';
import { renderHook, act } from '@testing-library/react-native';

function useCounter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  return { count, increment, decrement };
}

describe('useCounter', () => {
  it('deve incrementar o contador', () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('deve decrementar o contador', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
      result.current.increment();
    });

    expect(result.current.count).toBe(2);

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(1);
  });
});
