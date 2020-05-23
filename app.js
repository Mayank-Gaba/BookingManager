const express = require('express');
const bodyParser = require('body-parser');
const graphqlHandler = require('express-graphql');
const { buildSchema } = require('graphql');


const app = express();

app.use(bodyParser.json());

app.use('/graphqlApi',graphqlHandler({
    schema: buildSchema(`
        type queryTypes {
            events : [String!]!
        }

        type mutationTypes {
            createEvent(name: String): String 
        }

        schema {
            query : queryTypes 
            mutation : mutationTypes
        }
    `),
    rootValue: {
        events: () => {
            return ['Romantic','Game me','fuck you bitch'] 
        },
        createEvent: (args) => {
            const eventName = args.name;
            return eventName;
        }
    },
    graphiql: true
}));

app.listen(3000);