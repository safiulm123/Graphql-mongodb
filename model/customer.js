const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema ({
    name: {
        type:String,
    },
    email: {
        type:String,
    },
    age: {
        type:Number,
    }
})

module.exports=Customers=mongoose.model('customer',CustomerSchema)