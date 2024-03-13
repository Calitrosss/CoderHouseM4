import ErrorEnum from "../errors/ErrorEnum.js";

export const ErrorHandler = (error, req, res, next) => {
  error.cause = error.cause || error.message;
  console.error(error.cause);

  switch (error.code) {
    case ErrorEnum.INVALID_TYPE_ERROR:
    case ErrorEnum.INVALID_PARAM:
      return res.status(400).send({ status: "error", error: error.name });

    case ErrorEnum.NOT_FOUND:
      return res.status(404).send({ status: "error", error: error.name });

    case ErrorEnum.ROUTING_ERROR:
    case ErrorEnum.DATABASE_ERROR:
      return res.status(500).send({ status: "error", error: error.name });

    default:
      return res.status(500).send({ status: "error", error: "Unhandled error" });
  }
};
