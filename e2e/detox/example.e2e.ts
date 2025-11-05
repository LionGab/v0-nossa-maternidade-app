/**
 * Exemplo de teste Detox para E2E
 * Detox é uma alternativa mais robusta ao Maestro
 *
 * Instalação:
 * npm install --save-dev detox
 *
 * iOS:
 * brew tap wix/brew
 * brew install applesimutils
 *
 * Execução:
 * npm run test:e2e:ios
 */

import { device, expect, element, by } from 'detox';

describe('Example E2E Test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('deve mostrar a tela inicial', async () => {
    await expect(element(by.id('home-screen'))).toBeVisible();
  });

  it('deve navegar para login', async () => {
    await element(by.id('login-button')).tap();
    await expect(element(by.id('login-screen'))).toBeVisible();
  });

  it('deve fazer login com sucesso', async () => {
    await element(by.id('login-button')).tap();
    await element(by.id('email-input')).typeText('usuario@exemplo.com');
    await element(by.id('password-input')).typeText('senha123');
    await element(by.id('submit-button')).tap();
    await expect(element(by.id('dashboard-screen'))).toBeVisible();
  });
});
