import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();


export async function connectToDB() {
  if(process.env.NODE_ENV === "test"){
    const mysqlConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE_TEST
    });

    return mysqlConnection;

  }

  const mysqlConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE_NAME
  });

  return mysqlConnection;
  
}

