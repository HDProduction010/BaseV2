// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
  client.info(message.channel, "Server Lockdown has begun", "This server will now be locked down. Due to rate limits, this might take a while...");
  message.guild.channels.cache.forEach(channel => {
    channel.updateOverwrite(message.guild.id, { 'SEND_MESSAGES': false }, 'Lockdown Server')
      .then((channel) => {
         try {
           client.info(channel, "**Server Lockdown**!", "The whole server has been locked down by an administrator. Please DM FGL Mod Mail if you have any questions or DM an admin or higher if and only if FGL Mod Mail is disabled. Thank you for your patience");
        }
        catch {
           ;
        }
     })
  });
  return client.success(message.channel, "**Server lock was successful**", "The server has been fully locked down, no one without Administrative perms can read or send messages.");
};

module.exports.conf = {
  guildOnly: true,
  aliases: ['locks', 'lockdown'],
  permLevel: 'Admin',
};

module.exports.help = {
  name: 'lockserver',
  category: 'moderation',
  description: 'Completely locks the whole server down.',
  usage: 'lockchannel',
  details: '',
};
