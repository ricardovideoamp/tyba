import dotenv from 'dotenv';

dotenv.config();
export const testEnvironmentVariable = process.env.TEST_ENV_VARIABLE;
export const connectionString = process.env.CONNECTION_STRING;
export const googleApiUrl = process.env.GOOGLE_API_URL;
export const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
