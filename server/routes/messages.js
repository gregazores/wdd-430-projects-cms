var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');

router.get('/', async (req, res, next) => {
  //console.log('Hello from GET router messages')
  try {
    //call the Message model find() method to get all message in the collection
    const messages = await Message.find()
    //return response status 200 and a JSON object containing the list of message
    res.status(200).json(messages)
  } catch (error) {
    //if an error occurred, return response status 500 and a JSON object containing information about the error
    res.status(500).json({message: error.message})
  }
})

router.post('/', async (req, res, next) => {
  //console.log('Hello from POST router messages')
  //This method first calls the sequenceGenerator.nextId() method to get a unique value to assign to the message’s id property.
  const maxMessageId = await sequenceGenerator.nextId("messages");

  //It then creates a new Message model object. This is done by passing a JSON object to the Message model’s constructor function.
  const message = new Message({
    //The unique value returned from the nextId() method is assigned to the id property.
    id: maxMessageId,
    //The remaining values assigned to the new Message are retrieved from the
    //HTTP Request object passed to the request input parameter.
    subject: req.body.subject,
    msgText: req.body.msgText,
    sender: req.body.sender
  });

  try {
    const createdMessage = await message.save()
    res.status(201).json({
      message: 'Message added successfully',
      msg: createdMessage
    });
} catch (error) {
    res.status(400).json({
      message: 'An error occurred',
      error: error
    })
}

});

router.put('/:id', (req, res, next) => {
  //console.log('Hello from PUT router messages')
  Message.findOne({ id: req.params.id })
    .then(message => {
      message.subject = req.body.subject;
      message.msgText = req.body.msgText;
      message.sender = req.body.sender;

      Message.updateOne({ id: req.params.id }, message).exec()
        .then(result => {
            res.status(201).json({
              message: 'Message updated successfully',
              msg: message
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
        message: 'Message not found.',
        error: { message: 'Message not found'}
      });
    });
})

router.delete("/:id", (req, res, next) => {
  //console.log('Hello from DELETE router messages)
  Message.findOne({ id: req.params.id })
    .then(message => {
      Message.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({
            message: "Message deleted successfully"
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
        message: 'Message not found.',
        error: { message: 'Message not found'}
      });
    });
});

module.exports = router;
