const express = require('express');
const graphqlMiddleware = require('express-graphql');
const { buildSchema } = require('graphql');
const customers = require('./customer');

const app = express();

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