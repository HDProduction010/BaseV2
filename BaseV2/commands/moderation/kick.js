// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
  // Setting member to first member memntioned
  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

  // If no member mentioned, display this message
  if (!member) {
    return client.error(message.channel, 'Invalid Member!', 'Please mention a valid member of this server!');
  }

  // If member can't be kicked, display this
  if (!member.kickable) {
    return client.error(message.channel, 'Member Not Kickable!', 'I cannot kick this user! Do they have a higher role? Do I have kick permissions? Are you trying to kick the owner?');
  }
  // Check if user is kickable
  tgt_user = args[0].replace(/[\\<>@#&!]/g, "");
  tgt_pos = message.guild.members.cache.get(tgt_user).roles.highest.position;
  cur_pos = message.member.roles.highest.position;
  if(tgt_pos >= cur_pos) {
    return client.error(message.channel, "You do not have permission to kick this member", "You cannot kick this user as they have a higher role than you");
  }

  // Sets reason shown in audit logs
  const reason = args[1] ? args.slice(1).join(' ') : 'No reason provided';

  try {
    const dmChannel = await member.createDM();
    await dmChannel.send(`You have been kicked from the ${message.guild.name} server for the following reason:
**${reason}**`);
  } catch (e) {
    client.error(message.guild.channels.cache.get(client.config.staffChat), 'Failed to Send DM to Member!', "I've failed to send a dm to the most recent member kicked. They most likely had dms off.");
  }


  // Kicks the member
  await member.kick(reason).catch((error) => client.error(message.channel, 'Kick Failed!', `I've failed to kick this member! Error: ${error}`));
  // If kick is successful, display this
  return client.success(message.channel, 'Kick Successful!', `I've successfully kicked **${member.user.tag}**!`);
};

module.exports.conf = {
  guildOnly: true,
  aliases: ['k'],
  permLevel: 'Moderator',
  args: 1,
};

module.exports.help = {
  name: 'kick',
  category: 'moderation',
  description: 'kicks the mentioned member. Can be used with or without a stated reason.',
  usage: 'kick <@member> <reason>',
  details: '<@member> => Any valid member of the server that does not have a higher role and is not the owner.\n<reason> => The reason for the kick. Totally optional.',
};
