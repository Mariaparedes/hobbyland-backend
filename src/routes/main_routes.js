import { Router } from "express";
import user from "./userRoutes.js";
// import sesion from "./sesion_routes";

const routes = Router();

routes.use("/test", (req, res) => res.send("hello world"));
routes.use("/user",user);
// routes.use("/sesion", sesion);

export default routes;