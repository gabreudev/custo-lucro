function getEnvVar(name: string, required = true): string {
  const value = process.env[name];

  if (required && (!value || value.trim() === '')) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value || '';
}

export const env = {

  BASE_URL: getEnvVar('BASE_URL'),
  NEXT_PUBLIC_SUPABASE_ANON_URL: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
};