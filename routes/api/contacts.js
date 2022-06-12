const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
  updateStatusContact,
} = require("../../controllers/contacts");
const { schemaCreate, schemaPath } = require("../../models/contact");
const { validateRequest } = require("../../middlewares/validateRequest");
const router = express.Router();
const { auth } = require("../../middlewares/auth");

router.get("/", auth, listContacts);
router.get("/:id", auth, getContactById);
router.post("/", validateRequest(schemaCreate), auth, addContact);
router.put("/:id", auth, updateContact);
router.patch(
  "/:id/favorite",
  validateRequest(schemaPath),
  auth,
  updateStatusContact
);
router.delete("/:id", auth, removeContact);

module.exports = router;
