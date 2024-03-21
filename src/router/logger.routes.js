import { Router } from "express";
import { getVariables } from "../config/dotenv.config.js";

const loggerRoutes = Router();

const { environment } = getVariables();

loggerRoutes.get("/", (req, res) => {
  req.logger.debug(`Esto es un debug - ${new Date().toLocaleString()} (${environment})`);
  req.logger.http(`Esto es un http - ${new Date().toLocaleString()} (${environment})`);
  req.logger.info(`Esto es un info - ${new Date().toLocaleString()} (${environment})`);
  req.logger.warning(`Esto es warning - ${new Date().toLocaleString()} (${environment})`);
  req.logger.error(`Esto es un error - ${new Date().toLocaleString()} (${environment})`);
  req.logger.fatal(`Esto es un fatal - ${new Date().toLocaleString()} (${environment})`);

  res.send({ message: `Error de prueba - ${new Date().toLocaleString()}` });
});

export default loggerRoutes;
