const { getDB } = require('../driver/mongodb');
const { ObjectId } = require('mongodb');

// Function to save the form data to MongoDB
const saveFormData = async (req, res) => {
  const { firstName, lastName, email, contactNumber, message } = req.body;
  try {
    // Get the database object
    const db = getDB();

    // Get the contacts collection
    const contactsCollection = db.collection('contacts');

    // Insert the form data into the collection
    const result = await contactsCollection.insertOne({ firstName:firstName, lastName:lastName, email:email, contactNumber:contactNumber, message:message });
    console.log('Form data saved:', result.insertedId);
    return res.send(`Form data saved: ${result.insertedId}`);
  } catch (error) {
    console.error('Error saving form data:', error);
    return res.status(500).json({ message: 'Error saving form data', error: error });
  }
};

// Function to get a list of contact messages with specific fields
const getContactMessageList = async (req, res) => {
if(!req.session.isAdmin){//how you get here?
    return res.status(404);
}
try {
    // Get the database object
    const db = getDB();

    // Get the contacts collection
    const contactsCollection = db.collection('contacts');

    // Find all contact messages with specific fields
    const messages = await contactsCollection.find().toArray();

    return res.json(messages);
} catch (error) {
    console.error('Error retrieving contact messages:', error);
    return res.status(500).json({ message: 'Error retrieving contact messages', error: error });
}
};

// Function to get a contact message by ID
const getContactMessage = async (req, res) => {
if(!req.session.isAdmin){//how you get here?
    return res.status(404);
}
  const { messageId } = req.params;
  try {
    // Get the database object
    const db = getDB();

    // Get the contacts collection
    const contactsCollection = db.collection('contacts');

    // Find the contact message by ID
    const message = await contactsCollection.findOne({ _id: new ObjectId(messageId) });

    if (message) {
      return res.json(message);
    } else {
      return res.status(404).json({ message: 'Contact message not found' });
    }
  } catch (error) {
    console.error('Error retrieving contact message:', error);
    return res.status(500).json({ message: 'Error retrieving contact message', error: error });
  }
};

// Function to delete a contact message by ID
const deleteContactMessage = async (req, res) => {
if(!req.session.isAdmin){//how you get here?
    return res.status(404);
}
  const { messageId } = req.params;
  try {
    // Get the database object
    const db = getDB();

    // Get the contacts collection
    const contactsCollection = db.collection('contacts');

    // Delete the contact message by ID
    const result = await contactsCollection.deleteOne({ _id: new ObjectId(messageId) });

    if (result.deletedCount > 0) {
      return res.send(`Contact message with ID ${messageId} deleted`);
    } else {
      return res.status(404).json({ message: 'Contact message not found' });
    }
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return res.status(500).json({ message: 'Error deleting contact message', error: error });
  }
};

module.exports = {
  saveFormData,
  getContactMessage,
  deleteContactMessage,
  getContactMessageList,
};
