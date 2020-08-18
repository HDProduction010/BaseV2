// eslint-disable-next-line no-unused-vars
module.exports.run = (client, message, args, level, Discord) => {
  const channel = message.mentions.channels.first() || message.channel;
  if (!channel.permissionsFor(message.guild.id).has('SEND_MESSAGES')) {
    client.error(message.channel, 'Channel Already Locked!', `Everyone already does not have permission to send messages in ${channel}!`);
    return;
  }
  channel.updateOverwrite(message.guild.id, { 'SEND_MESSAGES': false }, 'Lock Channel')
    .then(() => {
      if (channel.id !== message.channel.id) {
        client.success(message.channel, 'Channel Locked!', 'No one can send messages until the channel is unlocked! To unlock the channel, use \`.unlockchannel\`.');
      }
      channel.send("**Channel Locked**!", "This channel has been locked by an administrator. Thank you for your patience.");
    })
    .catch((error) => client.error(message.channel, 'Channel Lock Failed!', `The channel failed to be locked because: \`${error}\``));
};

module.exports.conf = {
  guildOnly: true,
  aliases: ['lockch'],
  permLevel: 'Senior Moderator',
};

module.exports.help = {
  name: 'lockchannel',
  category: 'moderation',
  description: 'Locks the mentioned channel down or the channel the command is used in. No one can send messages in that channel.',
  usage: 'lockchannel <#channel>',
  details: '<#channel> => The channel to be locked.',
};
