import { Router } from "express";
import user from "./userRoutes.js";
import post from "./postRoutes.js";
import interest from "./interestRoutes.js";

const routes = Router();

routes.use("/test", (req, res) => res.send("hello world"));
routes.use("/user",user);
routes.use("/post", post);
routes.use("/interest", interest);

export default routes;