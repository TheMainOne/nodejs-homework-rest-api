const { Contact } = require("../models/contact");

const getAll = async (_id, skip, limit, favorite) => {
  if (favorite) {
    return Contact.find({ owner: _id, favorite: true }, "", {
      skip: skip,
      limit: Number(limit),
    }).populate("owner", "_id name email subscription");
  }

  return Contact.find({ owner: _id }, "", {
    skip: skip,
    limit: Number(limit),
  }).populate("owner", "_id name email subscription");
};

const getById = async (id) => {
  return Contact.findById(id);
};

const create = async (contact) => {
  return Contact.create(contact);
};

const updateById = async (id, contact) => {
  return Contact.findByIdAndUpdate(id, contact, { new: true });
};

const deleteById = async (id) => {
  return Contact.findByIdAndDelete(id);
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
