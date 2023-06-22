const express = require('express');
const contactRouter = express.Router();
const contactHandler = require('../handler/contact');



// GET /api/contact/:messageId
contactRouter.get('/:messageId', contactHandler.getContactMessage); // Retrieve a specific contact message

// GET /api/contact/
contactRouter.get('/', contactHandler.getContactMessageList); // Get a list of contact messages

// DELETE /api/contact/:messageId
contactRouter.delete('/:messageId', contactHandler.deleteContactMessage); // Delete a specific contact message

// POST /api/contact/
contactRouter.post('/', contactHandler.saveFormData); // Save form data

module.exports = { contactRouter };
