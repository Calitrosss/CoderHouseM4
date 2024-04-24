import dotenv from "dotenv";

export const getVariables = () => {
  dotenv.config();

  return {
    environment: process.env.ENVIRONMENT,
    port: process.env.PORT,
    connString: process.env.MONGO_URL,
    connStringTest: process.env.MONGO_URL_TEST,
    secretKey: process.env.SECRET_KEY,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    githubCallbackUrl: process.env.GITHUB_CALLBACK_URL,
    googleAppEmail: process.env.GOOGLE_APP_EMAIL,
    googleAppPass: process.env.GOOGLE_APP_PASS,
  };
};
