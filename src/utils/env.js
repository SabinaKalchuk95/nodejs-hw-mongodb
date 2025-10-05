import 'dotenv/config';


export const getEnv = (name) => {
  const value = process.env[name];

  if (!value) {
    console.error(`Missing environment variable: ${name}`);
    process.exit(1);
  }

  return value;
};


export const PORT = getEnv('PORT');
export const MONGODB_USER = getEnv('MONGODB_USER');
export const MONGODB_PASSWORD = getEnv('MONGODB_PASSWORD');
export const MONGODB_HOST = getEnv('MONGODB_HOST');
export const MONGODB_DB_NAME = getEnv('MONGODB_DB_NAME');
export const MONGODB_APP_NAME = getEnv('MONGODB_APP_NAME');


export const JWT_SECRET = getEnv('JWT_SECRET');
export const REFRESH_SECRET = getEnv('REFRESH_SECRET');