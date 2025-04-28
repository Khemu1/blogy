export interface DatabaseConfig {
  username: string;
  password: string | null;
  database: string;
  host: string;
  dialect: string;
}

export interface Config {
  development: DatabaseConfig;
  test: DatabaseConfig;
  production: DatabaseConfig;
}
