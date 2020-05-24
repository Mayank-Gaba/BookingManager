const express = require('express');
const bodyParser = require('body-parser');
const graphqlHandler = require('express-graphql');
const mongoose = require('mongoose');
const { buildSchema } = require('graphql');
const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');

const app = express();

app.use(bodyParser.json());

app.use(
    '/graphqlApi',
    graphqlHandler({
        schema: graphqlSchema,
        rootValue: graphqlResolvers,
        graphiql: true
})
);

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
        process.env.MONGO_PASSWORD
    }@cluster0-fetsc.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
).then(() => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
});
