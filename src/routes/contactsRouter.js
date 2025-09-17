import { Router } from "express";
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
} from "../controllers/contacts.js";

const router = Router();

router.get("/", getAllContactsController);
router.get("/:id", getContactByIdController);
router.post("/", createContactController);

export default router;
