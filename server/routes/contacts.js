var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Contact = require('../models/contact');

router.get('/', async (req, res, next) => {
  //console.log('Hello from GET router contacts')
  try {
    //call the Contact model find() method to get all contact in the collection
    const contacts = await Contact.find().populate('group')
    //return response status 200 and a JSON object containing the list of contact
    res.status(200).json(contacts)
  } catch (error) {
    //if an error occurred, return response status 500 and a JSON object containing information about the error
    res.status(500).json({message: error.message})
  }
})

router.post('/', async (req, res, next) => {
  //console.log('Hello from POST router contact')
  //This method first calls the sequenceGenerator.nextId() method to get a unique value to assign to the contact’s id property.
  const maxContactId = await sequenceGenerator.nextId("contacts");

  //It then creates a new Contact model object. This is done by passing a JSON object to the Contact model’s constructor function.
  const contact = new Contact({
    //The unique value returned from the nextId() method is assigned to the id property.
    id: maxContactId,
    //The remaining values assigned to the new Contact are retrieved from the
    //HTTP Request object passed to the request input parameter.
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    imageUrl: req.body.imageUrl,
    group: req.body.group
  });

  try {
    const createdContact = await contact.save()
    res.status(201).json({
      message: 'Contact added successfully',
      contact: createdContact
    });
} catch (error) {
    res.status(400).json({
      message: 'An error occurred',
      error: error
    })
}

})

router.put('/:id', (req, res, next) => {
  //console.log('Hello from PUT router contacts')
  Contact.findOne({ id: req.params.id })
    .then(contact => {
      contact.name = req.body.name;
      contact.email= req.body.email;
      contact.phone = req.body.phone;
      contact.imageUrl = req.body.imageUrl;
      contact.group = req.body.group;

      Contact.updateOne({ id: req.params.id }, contact).exec()
        .then(result => {
            res.status(201).json({
              message: 'Contact updated successfully',
              contact: contact
            })
          })
        .catch(error => {
            res.status(500).json({
              message: 'An error occurred',
              error: error
            });
          });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Contact not found.',
        error: { contact: 'Contact not found'}
      });
    });
})

router.delete("/:id", (req, res, next) => {
  //console.log('Hello from DELETE router contact')
  Contact.findOne({ id: req.params.id })
    .then(contact => {
      Contact.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({
            message: "Contact deleted successfully"
          });
        })
        .catch(error => {
            res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        })
    })
    .catch(error => {
      res.status(500).json({
        message: 'Contact not found.',
        error: { contact: 'Contact not found'}
      });
    });
});

module.exports = router;
