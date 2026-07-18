import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactsRouter from "./contacts";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactsRouter);
router.use(statsRouter);

export default router;
