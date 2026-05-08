import { appsInToss } from '@apps-in-toss/framework/plugins';
import { hermes } from '@granite-js/plugin-hermes';
import { router } from '@granite-js/plugin-router';
import { defineConfig } from '@granite-js/react-native/config';

export default defineConfig({
  appName: 'right-turn-quiz',
  scheme: 'intoss',
  plugins: [
    router(),
    hermes(),
    appsInToss({
      brand: {
        displayName: '우회전 퀴즈',
        primaryColor: '#3182F6',
        icon: 'https://static.toss.im/appsintoss/33837/bb97132b-ce42-4524-aaa5-6d696b07ffa9.png',
      },
      permissions: [],
    }),
  ],
});
