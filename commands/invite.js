module.exports.execute = async (client, message, args) => {
  let inviteText = 'Invite to the KOA server: https://discord.gg/EYX7XGG';

  if (args[0]) {
    if (args[0].toLowerCase() === 'kod') {
      inviteText = 'Invite to the Knights off Duty server: https://discord.gg/wu3a6JA';
    }
    if (args[0].toLowerCase() === 'koai') {
      inviteText = 'Invite to the Knights of Academia: International server: https://discord.gg/Fuvabsm';
    }
  }
  return message.channel.send(inviteText);
};

module.exports.config = {
  name: 'invite',
  aliases: ['invite', 'discord'],
  description: 'Want to invite a friend to the server? This will get you the invite link.',
  usage: ['invite', 'invite camelot', 'invite koai'],
};
