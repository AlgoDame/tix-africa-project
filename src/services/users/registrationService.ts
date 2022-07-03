import { Request, Response } from "express";
import { BaseService } from "../baseService";
import { UserRegistrationHandler } from "./registrationHandler";

export class RegistrationService extends BaseService {
    private USER_EXIST_MSG: string = "User already exists";

    public async create(req: Request, res: Response) {
        try {
            let failedValidation = UserRegistrationHandler.validateRegistration(req);

            if (failedValidation) return this.sendError(req, res, 400, failedValidation);

            let user = await UserRegistrationHandler.checkUserExistence(req);

            if (Array.isArray(user) && user.length){
                return this.sendError(req, res, 412, this.USER_EXIST_MSG)
            } 

            let userRecord = await UserRegistrationHandler.createUserRecord(req);

            if(Array.isArray(userRecord) && !userRecord.length){
                throw new Error("Failed to Register user")
            }

            return this.sendResponse(req, res, 201, userRecord);

        } catch (error:any) {
            console.error(`Error occurred in registrationService::: ${error}`);
            return this.sendError(req, res, 500, error.message);
        }
    }


}
