var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Document = require('../models/document');

router.get('/', async (req, res, next) => {
  //console.log('Hello from GET router documents')
  try {
    //call the Document model find() method to get all documents in the collection
    const documents = await Document.find()
    //return response status 200 and a JSON object containing the list of documents
    res.status(200).json(documents)
  } catch (error) {
    //if an error occurred, return response status 500 and a JSON object containing information about the error
    res.status(500).json({message: error.message})
  }
})

router.post('/', async (req, res, next) => {
  //console.log('Hello from POST router document')
  //This method first calls the sequenceGenerator.nextId() method to get a unique value to assign to the document’s id property.
  const maxDocumentId = await sequenceGenerator.nextId("documents");

  //It then creates a new Document model object. This is done by passing a JSON object to the Document model’s constructor function.
  const document = new Document({
    //The unique value returned from the nextId() method is assigned to the id property.
    id: maxDocumentId,

    //The remaining values assigned to the new Document are retrieved from the
    //HTTP Request object passed to the request input parameter.
    name: req.body.name,
    description: req.body.description,
    url: req.body.url
  });

  try {
    const createdDocument = await document.save()
    res.status(201).json({
      message: 'Document added successfully',
      document: createdDocument
    });
} catch (error) {
    res.status(400).json({
      message: 'An error occurred',
      error: error
    })
}

});

router.put('/:id', (req, res, next) => {
  //console.log('Hello from PUT router document')
  Document.findOne({ id: req.params.id })
    .then(document => {
      document.name = req.body.name;
      document.description = req.body.description;
      document.url = req.body.url;

      Document.updateOne({ id: req.params.id }, document).exec()
        .then(result => {
            //console.log('document put result', result)
            res.status(201).json({
              message: 'Document updated successfully',
              document: document
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
        message: 'Document not found.',
        error: { document: 'Document not found'}
      });
    });
})


router.delete("/:id", (req, res, next) => {
  //console.log('Hello from DELETE router documents')
  Document.findOne({ id: req.params.id })
    .then(document => {
      Document.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({
            message: "Document deleted successfully"
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
        message: 'Document not found.',
        error: { document: 'Document not found'}
      });
    });
});

module.exports = router;
