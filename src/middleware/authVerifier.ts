import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();



function verifyAuth(req: Request, res: Response, next: NextFunction): boolean {
    let token: string | null = null;
    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token === null) {
        console.log('cant find header');
        return false;
    }

    try {
        const user = verify(token, secret);
        return true;

    } catch (error: any) {
        console.error(`Authorization error: ${error.message}`);
        return false;
    }

}

export function authorize(req: Request, res: Response, next: NextFunction) {
    if (!verifyAuth(req, res, next)) {
        return res.status(401).json({status: "Error", data: "You are not authorized to access this resource"})
    } else {
        next();
    }

}







