// eslint-disable-next-line no-unused-vars

// Include lodash which was already needed by discord.js anyways
var _ = require('lodash');
var array = require('lodash/array');
var object = require('lodash/fp/object');

module.exports.run = async (client, message, args, level) => {
  return message.channel.send(`${_.sample(["Heads", "Tails"])}`);
};

module.exports.conf = {
  guildOnly: true,
  aliases: ['cf'],
  permLevel: 'Verified',
};

module.exports.help = {
  name: 'coinflip',
  category: 'game',
  description: 'Return Heads Or Tails',
  usage: 'coinflip',
  details: '',
};
