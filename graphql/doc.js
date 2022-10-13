// const {
//     GraphQLObjectType,
//     GraphQLString,
//     GraphQLList,
//     GraphQLInt,
//     GraphQLFloat,
//     GraphQLNonNull
// } = require('graphql');


// const DocType = new GraphQLObjectType({
//     name: 'Doc',
//     description: 'This represents a document',
//     fields: () => ({
//         namn: { type: new GraphQLNonNull(GraphQLString) },
//         text: { type: new GraphQLNonNull(GraphQLString) },
//         owner: { type: new GraphQLNonNull(GraphQLString) },
//         allowed_users: { type: new GraphQLList(GraphQLString) }
//     })
// })

// module.exports = DocType;