import { Request, Response, NextFunction, Router } from "express";
import { TicketService } from "../services/ticketService/ticketService";
import { authorize } from "../middleware/authVerifier";

export class TicketController {

    /**
     * Create the routes.
     *
     * @method loadRoutes
     */
    public loadRoutes(prefix: string, router: Router) {
        this.createTicket(prefix, router);
   
    }

    private createTicket(prefix: string, router: Router): any {
        router.post(prefix + "", authorize, async (req, res: Response, next: NextFunction) => {
            new TicketService().createTicket(req, res);
        })
    }



}
