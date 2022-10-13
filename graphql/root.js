const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');

const users = require("../models/users");
const UserType = require("./users");


const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        users: {
            type: new GraphQLList(UserType),
            description: 'List of all users',
            resolve: async function() {
                const user = await users.getUsersGraphql();

                return user;
            }
        }
    })
});
    
module.exports = RootQueryType;



// name: 'Query',
//     description: 'Root Query',
//     fields: () => ({
//         doc: {
//             type: DocType,
//             description: 'A single course',
//             args: {
//                 allowed_users: { type: GraphQLString }
//             },
//             resolve: async function(parent, args) {
//                 console.log("hello")
//                 console.log(args.allowed_users)
//                 const doc = await docs.getDocs(args.allowed_users)

//                 console.log(doc)

//                 return doc;
//             }
//         },

