export interface IConfig {
  appName: string;
  apiUrls: {
    chatQuery: string;
    getChatsBySession: string;
    getChatHistory: string;
    saveFeedback: string;
  };
  branding: {
    theme: {
      primaryBgColor: string;
      primaryFgColor: string;
      secondaryBgColor: string;
      secondaryFgColor: string;
    };
  };
  oktaConfig: {
    issuer: string | undefined;
    clientId: string | undefined;
    redirectUri: string;
  };
  AppLevelConstants: {
    defaultQuestions: {
      id: number;
      text: string;
    }[];
  };
}
