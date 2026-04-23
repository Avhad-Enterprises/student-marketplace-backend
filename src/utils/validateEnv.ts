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
    MINIO_ACCESS_KEY: str(),
    MINIO_SECRET_KEY: str(),
    MINIO_BUCKET_NAME: str(),
    MINIO_ENDPOINT: str(),
    MINIO_PORT: port(),
    MINIO_USE_SSL: str({ choices: ['true', 'false'] }),
  });
};

export default validateEnv;
