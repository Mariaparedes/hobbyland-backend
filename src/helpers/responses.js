export const responseOK = (res, statusCode, message, data) => {
  return res.status(200).json({
    statusCode,
    message,
    data,
  });
};

export const responseCreated = (res, message, data) => {
  return res.status(201).json({
    statusCode: 201,
    message,
    data,
  });
};

export const responseServerError = (res, error) => {
  return res.status(500).json({
    statusCode: 500,
    message: "Internal server error",
    error,
  });
};

export const responseNotFound = (res, message, data) => {
  return res.status(404).json({
    statusCode: 404,
    message,
    data,
  });
};

export const responseGeneric = (res, statusCode, message, data, error) => {
  return res.status(statusCode).json({
    statusCode,
    message,
    data,
    error,
  });
};
