import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from "../services/contacts.js";

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

export const patchContactController = async (req, res) => {
  const { id } = req.params;
  const updatedContact = await updateContact(id, req.body);

  if (!updatedContact) {
    return res.status(404).json({
      status: 404,
      message: "Contact not found",
    });
  }

  res.status(200).json({
    status: 200,
    message: "Successfully patched contact!",
    data: updatedContact,
  });
};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const deletedContact = await deleteContact(id);

  if (!deletedContact) {
    return res.status(404).json({
      status: 404,
      message: "Contact not found",
    });
  }

  res.status(204).send();
};