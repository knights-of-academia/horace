require('dotenv').config();
const { Client, Intents } = require('discord.js');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
});

client.once('ready', () => {
  console.log('Ready!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Regex matches 'Reflection' allowing optional bold/italic markdown characters
  // Matches: Reflection, *Reflection*, **Reflection**, ***Reflection***, __Reflection__
  const reflectionRegex = /(?:\*+|_+)?Reflection(?:\*+|_)?/i;

  if (reflectionRegex.test(message.content)) {
    try {
      await message.react('🛡️');
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
