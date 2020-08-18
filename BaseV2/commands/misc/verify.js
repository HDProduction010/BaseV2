// eslint-disable-next-line no-unused-vars
module.exports.run = (client, message, args, level) => {
  const role = message.guild.roles.cache.find((r) => r.name === "Community");
  const roleName = role.name;
  if (message.member.roles.cache.has(role.id)) {
    return client.error(message.channel, 'You are already verified into the server', '');
  }
  return message.member.roles.add(role).then(() => {
    client.success(message.channel, 'Success!', `I've successfully verified you into the server`);
  }).catch((err) => {
    client.error(message.channel, 'Error!', 'There appears to be an error! DM FGL Mod Mail for assistance');
    console.error(err);
  });
};

module.exports.conf = {
  guildOnly: true,
  aliases: [],
  permLevel: 'User',
};

module.exports.help = {
  name: 'verify',
  category: 'misc',
  description: 'Verifies user',
  usage: 'verify',
  details: '',
};
