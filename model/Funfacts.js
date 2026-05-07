const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const funfactsSchema = new Schema({
   stateCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        minlength: 2,
        maxlength: 2
     },   
   funfacts: { 
        type: [String],
        default: []
     }
});

//module.exports = mongoose.model('States', statesSchema);
module.exports = mongoose.models.Funfacts || mongoose.model('Funfacts', funfactsSchema);