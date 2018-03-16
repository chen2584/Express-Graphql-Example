const express = require('express');
const graphqlMiddleware = require('express-graphql');
const { buildSchema } = require('graphql');
const customers = require('./customer');

const app = express();

app.use("*", function(req, res, next) {
    let api_key = req.header("api-key");
    if(api_key == "chennumberone")
        next();
    else {
        res.statusMessage = "Invalid Token";
        res.status(400);
        res.end()
    }
});

const schema = buildSchema(`
    type Query {
        customer(id: Int!): Customer
        customers(limit: Int = 3): [Customer]
    }
    
    type Customer {
        first_name: String
        last_name: String
        address: Address
    }
    type Address {
        street: String
        city: String
        state: String
        zip: String
    }
`);

const resolver = {
    customer(args) {
        return customers[args.id];
    },

    customers(args) {
        return customers.slice(0, args.limit);
    }
}

app.use(graphqlMiddleware({
    schema,
    rootValue: resolver,
    graphiql: true
}));

app.listen(3000);

console.log("Server running on port http://localhost:3000");