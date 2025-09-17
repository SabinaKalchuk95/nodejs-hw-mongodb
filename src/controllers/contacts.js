import { getAllContacts, getContactById, createContact } from "../services/contacts.js";

export const getAllContactsController = async (req, res) => {
  const contacts = await getAllContacts();
  res.json({ data: contacts });
};

export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
  const contact = await getContactById(id);

  if (!contact) return res.status(404).json({ message: "Contact not found" });

  res.json({ data: contact });
};

export const createContactController = async (req, res) => {
  const newContact = await createContact(req.body);
  res.status(201).json({ data: newContact });
};
