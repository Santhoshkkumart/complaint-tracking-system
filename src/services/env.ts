const formatMissingEnvMessage = (scope: string, keys: string[]) =>
  `[${scope}] Missing required environment variables: ${keys.join(", ")}. ` +
  "Local `.env` files are not deployed automatically. Add these VITE_* values to the environment that builds your hosted app and redeploy.";

export const getRequiredEnvValue = (key: string) => {
  const value = import.meta.env[key];
  return typeof value === "string" ? value.trim() : "";
};

export const getMissingEnvKeys = (keys: string[]) =>
  keys.filter((key) => !getRequiredEnvValue(key));

export const assertRequiredEnv = (scope: string, keys: string[]) => {
  const missingKeys = getMissingEnvKeys(keys);

  if (missingKeys.length > 0) {
    throw new Error(formatMissingEnvMessage(scope, missingKeys));
  }
};

export const warnMissingEnv = (scope: string, keys: string[]) => {
  const missingKeys = getMissingEnvKeys(keys);

  if (missingKeys.length > 0) {
    console.warn(formatMissingEnvMessage(scope, missingKeys));
    return true;
  }

  return false;
};
