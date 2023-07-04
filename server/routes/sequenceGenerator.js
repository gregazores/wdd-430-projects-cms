//We need to create a sequence generator to generate unique id values each time a document, message, and contact is added to a collection in the MongoDB database.
var Sequence = require('../models/sequence');

var maxDocumentId;
var maxMessageId;
var maxContactId;
var sequenceId = null;

function SequenceGenerator() {

  //The SequenceGenerator() constructor function queries the Sequences collection in the database
  //to get the maximum id generated value for the contacts, messages, and documents collections.
  Sequence.findOne().exec()
    .then(
      (res) => {
        //console.log(res)
        sequenceId = res._id;
        maxDocumentId = res.maxDocumentId;
        maxMessageId = res.maxMessageId;
        maxContactId = res.maxContactId;
      }
    ).catch(
      (error) => {
        return res.status(500).json({
          title: 'An error occurred',
          error: error
        });
      }
    );
}


//This file also contains the nextId(collectionType) function.
//This function increments the maximum id for the specified collectionType and then updates
//the Sequence object in the sequences collection with the new maximum id value.
SequenceGenerator.prototype.nextId = async function(collectionType) {

  var updateObject = {};
  var nextId;

  switch (collectionType) {
    case 'documents':
      maxDocumentId++;
      updateObject = {maxDocumentId: maxDocumentId};
      nextId = maxDocumentId;
      break;
    case 'messages':
      maxMessageId++;
      updateObject = {maxMessageId: maxMessageId};
      nextId = maxMessageId;
      break;
    case 'contacts':
      maxContactId++;
      updateObject = {maxContactId: maxContactId};
      nextId = maxContactId;
      break;
    default:
      return -1;
  }

  // The $set operator replaces the value of a field with the specified value.
  //The $set operator expression has the following form: { $set: { <field1>: <value1>, ... } }
  try {
    await Sequence.updateOne({_id: sequenceId}, {$set: updateObject});
    return nextId;
  } catch (err) {
    console.log("nextId error = " + err);
    return null
  }


}

module.exports = new SequenceGenerator();
