const express = require("express");
const router = express.Router();

const {
  getAllContactLists,
  getContactListById,
  getAllContacts,
  createContactList,
  updateContactList,
  deleteContactList,
} = require("../controllers/contactListController");

/**
 * Contact Lists (Groups)
 */

// get all contact lists (for dropdowns, management)
router.get("/", getAllContactLists);

// get single contact list by id
router.get("/:id", getContactListById);

// create new contact list
router.post("/", createContactList);

// update contact list
router.put("/:id", updateContactList);

// delete contact list
router.delete("/:id", deleteContactList);

/**
 * Contacts (optional helper route)
 */

// get all contacts (used if needed)
router.get("/contacts/all", getAllContacts);

module.exports = router;
