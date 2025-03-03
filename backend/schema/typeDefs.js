const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Text {
    id: ID!
    extractedText: String!
    date: String!
  }

  type Query {
    getTexts: [Text]
  }

  type Mutation {
    addText(extractedText: String!): Text
  }
`;

module.exports = typeDefs;
