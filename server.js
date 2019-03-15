const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressGraphQL = require("express-graphql")
const app = express();
const schema = require('./graphql/schema.js')

app.use(bodyParser.json());

//Setting the key to db variable
const db = require("./config/keys").mongoURI;

//Connecting to Mongo Database
mongoose
  .connect(db)
  .then(() => console.log("Mongo Connected ... "))
  .catch(err => console.log(err));

app.use('/graphql',expressGraphQL({
    schema:schema,
    graphiql:true
}))

// Started the server with 9999 port 
const port = process.env.PORT || 9999;
app.listen(port,()=>console.log("Server is now listening on port 9999"))