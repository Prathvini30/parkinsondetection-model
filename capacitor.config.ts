
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0a9e00f4ad0a4e79ba0e01b81f8495ad',
  appName: 'parkinson-insight-now',
  webDir: 'dist',
  server: {
    url: "https://0a9e00f4-ad0a-4e79-ba0e-01b81f8495ad.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  // Add iOS and Android specific configurations if needed
  ios: {},
  android: {}
};

export default config;
