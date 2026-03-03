import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    DB_HOST: str(),
    DB_PORT: port(),
    DB_USER: str(),
    DB_PASSWORD: str(),
    DB_DATABASE: str(),
    JWT_SECRET: str(),
  });
};

export default validateEnv;
