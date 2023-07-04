const mongoose = require("mongoose");

const documentSchema = mongoose.Schema ({
  id: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String },
  //The objects in the contacts collection contain a group property that is an array of ObjectId values.
  //Each ObjectId is a foreign key to the Contact objects that belong to the group.
  //The datatype for the group property will be an array of ObjectIds.
  //The ObjectId values will be the value of the _id property of the Contact objects that are assigned to the group.
  children:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }]
})

module.exports = mongoose.model('Document', documentSchema);
