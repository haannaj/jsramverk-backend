require('dotenv').config()
const express = require("express");
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3132;

const visual = true;
const { graphqlHTTP } = require('express-graphql');

const {
  GraphQLSchema
} = require("graphql");

const RootQueryType = require("./graphql/root.js");

const list = require('./routes/list');
const mails = require('./routes/mails');
const auth = require('./routes/auth');


app.use(express.json());
const httpServer = require("http").createServer(app);

app.use(cors());
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});

console.log(port)



const schema = new GraphQLSchema({
    query: RootQueryType
});


app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: visual, // Visual är satt till true under utveckling
}));



// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use('/', list);
app.use('/auth', auth);
app.use('/api', mails);


const io = require("socket.io")(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

io.sockets.on('connection', function(socket) {
    console.log(socket.id); // Nått lång och slumpat

    socket.on("amount", function(data) {
        console.log(data)
        socket.broadcast.emit("amount", data);
    })
});



app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});

const server = httpServer.listen(port, () => console.log(`Jsramverk listening on port ${port}!`));

module.exports = server;