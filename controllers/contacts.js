const {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
} = require("../services/contactService");
const errorHandler = require("../helpers/errorHandler");

const listContacts = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { page = 1, limit = 10, favorite } = req.query;
    const skipped = (page - 1) * limit;
    const skip = skipped < 0 ? 0 : skipped;

    const contacts = await getAll(_id, skip, limit, favorite);
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getById(id);

    if (!contact) {
      errorHandler(404, "Not Found");
    }

    res.json(contact);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const contact = await create({ ...req.body, owner: _id });
    res.status(201).json(contact);
  } catch (error) {
    if (error.message.includes("duplicate")) {
      error.status = 400;
    }
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await deleteById(id);
    if (!contact) {
      errorHandler(404, "Not Found");
    }
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedContact = req.body;
    const contact = await updateById(id, updatedContact);
    if (!contact) {
      errorHandler(404, "Not Found");
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const contact = await updateById(id, updatedData);
    if (!contact) {
      errorHandler(404, "Missing field favorite");
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
