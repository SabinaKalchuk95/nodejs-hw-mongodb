import { Router } from "express";
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactController,
} from "../controllers/contacts.js";

const router = Router();

router.get("/", getAllContactsController);
router.get("/:id", getContactByIdController);
router.post("/", createContactController);
router.patch("/:id", patchContactController);
router.delete("/:id", deleteContactController);

export default router;