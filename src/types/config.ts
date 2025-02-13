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
  authConfigs: {
    activeProvider: string;
    providers: {
      authority: string | undefined;
      clientId: string | undefined;
      redirectUri: string;
      responseType: string;
      scope: string;
    };
  };
  AppLevelConstants: {
    defaultQuestions: {
      id: number;
      text: string;
    }[];
  };
}
