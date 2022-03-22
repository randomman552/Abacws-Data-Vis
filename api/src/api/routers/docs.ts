import express, { Response, Request } from "express";
import swaggerUi from "swagger-ui-express"
import { readFileSync } from "fs"
import { parse } from "yaml"

// Read openapi.yaml
const file = readFileSync("openapi.yaml", "utf-8");
const openapi = parse(file);


export const router = express.Router()

router.all("/openapi.json", (_req: Request, res: Response) => {
    res.status(200).json(openapi);
});
router.use("/", swaggerUi.serve, swaggerUi.setup(openapi));
