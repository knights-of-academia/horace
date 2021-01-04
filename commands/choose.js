module.exports.execute = async (client, message, args) => {
  if (args.length) {
    const argsSplit = args.join(' ').split(/,+ */);

    if (argsSplit.includes('')) {
      return message.channel.send('Choices cannot be empty!');
    }

    const choiceIndex = Math.floor(Math.random() * args.length);
    return message.channel.send(`Horace says... ${args[choiceIndex]}!`);
  }

  return message.channel.send('Please specify the options I should choose from!\nHint: !choose option1, option2, ..., optionX');
};

module.exports.config = {
  name: 'choose',
  aliases: ['choose', 'pick'],
  description: 'I will choose one of your options at random.',
  usage: ['choose option1, option2, ..., optionX'],
};
