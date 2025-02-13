// src/config/oidcConfig.ts
import config from "./config.json";
export interface OIDCProviderConfig {
  authority: string;
  clientId: string;
  redirectUri: string;
  responseType: string;
  scope: string;
}

export const oidcConfigs: Record<string, OIDCProviderConfig> =
  config.authConfigs.providers;

export const selectedOIDCConfig =
  oidcConfigs[config.authConfigs.activeProvider];
