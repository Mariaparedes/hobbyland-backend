import { verify } from "jsonwebtoken";
import User from "../models/User.js";
import { responseGeneric, responseNotFound } from "../helpers/responses.js";

// Método para verificar que un usuario iniciara sesión a través del token obtenido del header 'Authorization'.

export const verifySession = async (req, res, next) => {
  const token = req.header("Authorization");
  let jwtPayload;
  let result = null;
  //Try to validate the token
  try {
    jwtPayload = verify(token, process.env.SECRET_KEY);
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    return responseGeneric(res, 401, "Token is not valid", result);
  }
  try {
    const user = await User.findOne({ _id: jwtPayload.id, status: true });
    res.locals.user = user;
  } catch (error) {
    return responseNotFound(res, "User not found", result);
  }
  next();
};
