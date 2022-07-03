import { Request } from "express";
import { registrationSchema } from "../../validation/userPayloadSchema";
import bcrypt from "bcrypt";
import { connectToDB } from "../../db/dbConnection";



export class UserRegistrationHandler {
    
    public static validateRegistration(req: Request) {
        const validation = registrationSchema.validate(req.body);
        const { error } = validation;
        let failedValidation = error ? error.message : null;
        return failedValidation;
    }

    public static async createUserRecord(req: Request) {
        let {
            first_name,
            last_name,
            password,
            email
        } = req.body;

        const passwordHash = await this.hashPassword(password);

        let createUserQuery = `INSERT INTO users (firstName, lastName, email, password)
        VALUES (?, ?, ?, ?)`;

        let connection = await connectToDB();
        let [rows,fields] = await connection.query(createUserQuery, [first_name, last_name, email, passwordHash]);
        console.log("user rows: ", rows)
        console.log("user fields: ", fields)

        let selectUserQuery = `SELECT user_id, firstName, lastName, email FROM users WHERE email = ?`;
        let [userResult] = await connection.query(selectUserQuery, [email]);
        return userResult;

    }

    private static async hashPassword(password: string) {
        const hashed = await bcrypt.hash(password, 10);
        return hashed;
    }

    public static async checkUserExistence(req: Request) {
        let email = req.body.email;
        let connection = await connectToDB();
        let sql = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await connection.query(sql, [email]);
        return rows;
    }

    



}
