import { Request, Response, NextFunction, Router } from "express";
import { EventService } from "../services/eventService/eventService";
import { authorize } from "../middleware/authVerifier";

export class EventController {

    /**
     * Create the routes.
     *
     * @method loadRoutes
     */
    public loadRoutes(prefix: string, router: Router) {
        this.createEvent(prefix, router);
        this.getUserEvents(prefix, router);
        this.updateEvent(prefix, router);
        this.getPosts(prefix, router);

    }

    private createEvent(prefix: string, router: Router): any {
        router.post(prefix + "", authorize, async (req, res: Response, next: NextFunction) => {
            new EventService().createEvent(req, res);
        })
    }

    private getUserEvents(prefix: string, router: Router): any {
        router.get(prefix + "/:user_id", authorize, async (req, res: Response, next: NextFunction) => {
            new EventService().getUserEvents(req, res);
        })
    }

    private updateEvent(prefix: string, router: Router): any {
        router.put(prefix + "/:event_id", authorize, async (req, res: Response, next: NextFunction) => {
            new EventService().updateEvent(req, res);
        })
    }

    private getPosts(prefix: string, router: Router): any {
        router.get(prefix + "/:user_id", (req, res: Response, next: NextFunction) => {
            console.log('id: ' + req.params.user_id);
            return res.json({ data: "Some posts" });
        })
    }


}
