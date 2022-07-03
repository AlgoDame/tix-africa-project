import { Request, Response } from "express";

export class BaseService {
    protected sendError(
        req: Request,
        res: Response,
        status: number,
        data: any
    ) {
        return res.status(status).json({
            status: "Error",
            data: data
        });
    }

    protected sendResponse(
        req: Request,
        res: Response,
        status: number,
        data: any
    ) {
        return res.status(status).json({
            status: "Success",
            data: data
        });
    }
}
