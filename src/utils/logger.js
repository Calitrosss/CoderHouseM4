import winston from "winston";
import { getVariables } from "../config/dotenv.config.js";

const { environment } = getVariables();

const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "blue",
    http: "cyan",
    debug: "white",
  },
};

const devLogger = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOptions.colors }),
        winston.format.simple()
      ),
    }),
  ],
});

const prodLogger = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "../../errors.log",
      level: "error",
      format: winston.format.simple(),
    }),
  ],
});

export const addLogger = (req, res, next) => {
  switch (environment) {
    case "development":
      req.logger = devLogger;
      break;
    case "production":
      req.logger = prodLogger;
      break;
    default:
      throw new Error("Environment doesn't exists");
  }

  req.logger.http(
    `${req.method} en ${req.url} - ${new Date().toLocaleString()} (${process.env.NODE_ENV})`
  );

  next();
};
