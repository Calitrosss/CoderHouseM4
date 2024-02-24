import dotenv from "dotenv";

export const getVariables = () => {
  dotenv.config();

  return {
    port: process.env.PORT,
    connString: process.env.MONGO_URL,
    secretKey: process.env.SECRET_KEY,
  };
};
