import express, { Response, Request } from "express";
import swaggerUi from "swagger-ui-express"
import openapi from "../openapi.json"

export const router = express.Router()


router.all("/openapi.json", (_req: Request, res: Response) => {
    res.status(200).json(openapi);
});
router.use("/", swaggerUi.serve, swaggerUi.setup(openapi));
