export interface DbConfig {
  HOST: string;
  USER: string;
  PASSWORD: string;
  DB: string;
  dialect: string;
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}

const dbConfig: DbConfig = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "Admin12345#",
  DB: "Digi-Forum",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

export default dbConfig;
