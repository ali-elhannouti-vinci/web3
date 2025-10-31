import express, { type Request, type Response, type Router } from "express";
import { z } from "zod";

import { ServiceResponse } from "@/common/models/serviceResponse";

export const healthCheckRouter: Router = express.Router();

healthCheckRouter.get("/", (_req: Request, res: Response) => {
	const serviceResponse = ServiceResponse.success("Service is healthy", null);
	res.status(serviceResponse.statusCode).send(serviceResponse);
});
