// eslint-disable-next-line no-unused-vars

// Include lodash which was already needed by discord.js anyways
var _ = require('lodash');
var array = require('lodash/array');
var object = require('lodash/fp/object');

module.exports.run = async (client, message, args, level) => {
   choices = ["Yes", "Maybe...", "I don't know", "Possibly, but I'm not too sure", "Possibly", "Not a chance", "No", "No, I don't think so", "Unlikely"];
   i = 0;
   qastr = '';
   while(i <= args.length - 1) {
     qastr += args[i];
     i++;
   }
   return message.channel.send(`**Question Asked:** ${qastr}\n**My answer:** ${_.sample(choices)}`);
};

module.exports.conf = {
  guildOnly: true,
  aliases: ['8b'],
  permLevel: 'Verified',
  args: 1,
};

module.exports.help = {
  name: '8ball',
  category: 'game',
  description: 'Ask the bot a question! Have fun with 8 ball!',
  usage: '8ball <question>',
  details: '<question> => Question to ask the bot',
};
