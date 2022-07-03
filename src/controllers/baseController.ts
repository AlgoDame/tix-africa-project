import { Request, Response, NextFunction, Router } from "express";
import { RegistrationService } from "../services/users/registrationService";
import { LoginService } from "../services/users/login";


export class BaseController {

    /**
     * Create the routes.
     *
     * @method loadRoutes
     */
    public loadRoutes(prefix: string, router: Router) {
        this.registerUser(prefix, router);
        this.initLoginUser(prefix, router);
     

    }

    private registerUser(prefix: string, router: Router): any {
        router.post(prefix + "/register", async (req: Request, res: Response) => {
            new RegistrationService().create(req, res);
        });
    }

    private initLoginUser(prefix: string, router: Router): any {
        router.post(prefix + "/login", async (req: Request, res: Response) => {
            new LoginService(req, res).authenticate();
        });
    }

   


}
