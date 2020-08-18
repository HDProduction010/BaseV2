// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
  client.info(message.channel, "Server Unlockdown has begun", "This server will now be unlocked down. Due to rate limits, this might take a while...");
  message.guild.channels.cache.forEach(channel => {
    channel.updateOverwrite(message.guild.id, { 'SEND_MESSAGES': true }, 'Unlockdown Server')
      .then((channel) => {
         try {
           client.info(channel, "**Server Unlockdown**!", "The whole server has been unlocked down by an administrator. You can chat now!");
        }
        catch {
           ;
        }
     })
  });
  return client.success(message.channel, "**Server unlock was successful**", "The server has been fully unlocked. Everyone can now chat again!");
};

module.exports.conf = {
  guildOnly: true,
  aliases: ['unlocks', 'unlockdown'],
  permLevel: 'Admin',
};

module.exports.help = {
  name: 'unlockserver',
  category: 'moderation',
  description: 'Completely unlocks the whole server.',
  usage: 'lockchannel',
  details: '',
};
