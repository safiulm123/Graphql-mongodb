const Customers = require("../model/customer.js");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require("graphql");

// Customer Type
const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt }
  })
});

//Root Query Setup
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return Customers.findById(args.id).then(customer => customer);
      }
    },
    customers: {
        type: new GraphQLList(CustomerType),
        resolve(parentValue,args){
            return Customers.find().then(customers=>customers)
        }
    }
  }
});

//Mutation function will be used to add, delete and edit a customer
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addCustomer: {  // THis is to add Customer with some required arguments
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve(parentValue, args) {
        const newCustomer = new Customers({
          name: args.name,
          email: args.email,
          age: args.age
        });
        return newCustomer.save().then(customer => customer); // One thing to note is the return issue. Return should be in the form of JSON*
      }
    },
    editCustomer: { // THis is to edit Customer with some only id requirement
        type: CustomerType,
        args: {
            id: {type: new GraphQLNonNull(GraphQLString)},
          name: { type: GraphQLString },
          email: { type: GraphQLString },
          age: { type: GraphQLInt }
        },
        resolve(parentValue, args) {
        return Customers.findOne({_id:args.id
          }).then(foundObject=>{        
                  if(!foundObject){
                       {error:"no data with this ID"}
                  } else {
                      if(args.name){
                        foundObject.name=args.name;
                      }if (args.email){
                        foundObject.email=args.email;
                      }if (args.age){
                        foundObject.age=args.age;
                      }

                 return  foundObject.save().then(customer=>customer)
                   .catch(err=> console.log(err))
                  }
              
          })
            .catch(err => console.log(err))
        }
      },
      deleteCustomer: { // function to delete the user with only id args
        type: CustomerType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(parentValue, args) {
          return Customers.findByIdAndRemove(args.id)
                .then(customer=>customer) // One thing to note is the return issue. Return should be in the form of JSON*
        }
      }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});

