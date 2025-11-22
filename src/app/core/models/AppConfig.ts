export interface AppConfig {
    appName: string;
    apiUrl: string;
    /**
     * Allows enabling/disabling features without redeploying.
     */
    featureFlags?: Record<string, boolean>;
    defaultTheme?: 'light' | 'dark';
}
