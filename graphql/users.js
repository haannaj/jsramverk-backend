const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLFloat,
    GraphQLNonNull
} = require('graphql');


const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'This represents users',
    fields: () => ({
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
    })
})

module.exports = UserType;