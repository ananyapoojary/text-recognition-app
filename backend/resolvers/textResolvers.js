const Text = require('../models/TextModel');

const resolvers = {
  Query: {
    getTexts: async () => await Text.find()
  },
  Mutation: {
    addText: async (_, { extractedText }) => {
      const text = new Text({ extractedText });
      await text.save();
      return text;
    }
  }
};

module.exports = resolvers;
