import express  from 'express';
import { UserController } from './user.controller';


const router = express.Router();


router.get("/",UserController.getAllUsers)
router.get("/:id", UserController.getUserById)
router.post("/", UserController.createUser);



export const userRouter = router;