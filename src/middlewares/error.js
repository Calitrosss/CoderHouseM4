import ErrorEnum from "../errors/ErrorEnum.js";

export const ErrorHandler = (error, req, res, next) => {
  error.cause = error.cause || error.message;

  switch (error.code) {
    case ErrorEnum.INVALID_TYPE_ERROR:
    case ErrorEnum.INVALID_PARAM:
      req.logger.error(`${new Date().toLocaleString()} => ${error.cause}`);
      return res.status(400).send({ status: "error", error: error.name });

    case ErrorEnum.UNAUTHORIZED:
      req.logger.error(`${new Date().toLocaleString()} => ${error.cause}`);
      return res.status(401).send({ status: "error", error: error.name });

    case ErrorEnum.FORBIDDEN:
      req.logger.error(`${new Date().toLocaleString()} => ${error.cause}`);
      return res.status(403).send({ status: "error", error: error.name });

    case ErrorEnum.NOT_FOUND:
      req.logger.error(`${new Date().toLocaleString()} => ${error.cause}`);
      return res.status(404).send({ status: "error", error: error.name });

    case ErrorEnum.ROUTING_ERROR:
    case ErrorEnum.DATABASE_ERROR:
      req.logger.error(`${new Date().toLocaleString()} => ${error.cause}`);
      return res.status(500).send({ status: "error", error: error.name });

    default:
      req.logger.fatal(`${new Date().toLocaleString()} => ${error.cause}`);
      return res.status(500).send({ status: "error", error: "Unhandled error" });
  }
};
