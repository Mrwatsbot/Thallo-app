import type { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.usethallo.app',
  appName: 'Thallo',
  webDir: 'out',
  server: {
    // Load from live Vercel URL (Phase 1 approach)
    url: 'https://budgetwise-puce.vercel.app',
    cleartext: false,
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#09090b', // matches app dark background
    preferredContentMode: 'mobile',
    scheme: 'thallo',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: '#09090b',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#09090b',
    },
  },
};

export default config;
