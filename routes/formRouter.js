import express from 'express'
import * as formRouter from "../controller/formController.js"


const router = express.Router();

router.post("/", formRouter.save)

export default router;