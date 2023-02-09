export const isProductionEnv = () => process.env.NODE_ENV === 'production';
export const isTestingEnv = () => process.env.NODE_ENV === 'test';
export const isDevelopmentEnv = () => process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
