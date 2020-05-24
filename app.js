const express = require('express');
const bodyParser = require('body-parser');
const graphqlHandler = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event');
const app = express();

app.use(bodyParser.json());

app.use('/graphqlApi',graphqlHandler({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        input EventInput{
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type queryTypes {
            events : [Event!]!
        }

        type mutationTypes {
            createEvent(eventInput: EventInput): Event 
        }

        schema {
            query : queryTypes 
            mutation : mutationTypes
        }
    `),
    rootValue: {
        events: () => {
            return Event.find()
            .then(events => {
                return events.map(event => {
                    return { ...event._doc , _id: event._doc._id.toString()};
                }) 
            })
            .catch(err => {
                throw err;
            })
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            });
            return event
            .save()
            .then(result => {
                console.log(result);
                return { ...result._doc , _id: event.id };
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
        }
    },
    graphiql: true
}));

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
        process.env.MONGO_PASSWORD
    }@cluster0-fetsc.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
)
.then(() => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});
