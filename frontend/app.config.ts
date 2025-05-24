import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "interview-app",
  slug: "interview-app",
  version: "1.0.0",
  orientation: "portrait",
  sdkVersion: "53.0.0",
  platforms: ["ios", "android", "web"],
  extra: {
    apiBase: process.env.API_BASE,
  },
});