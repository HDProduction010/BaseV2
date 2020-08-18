// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
  // Sets the role to the Muted role
  const role = message.guild.roles.cache.find((r) => r.name === 'Muted');
  const role_community = message.guild.roles.cache.find((r) => r.name === 'Community');

  // Sets the member to the user mentioned
  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

  if (!member) {
    if (parseInt(args[0], 10)) {
      try {
        member = await message.guild.members.fetch(args[0]);
      } catch (err) {
        // Don't need to send a message here
      }
    }
  }

  // If no user mentioned, display this
  if (!member) {
    return client.error(message.channel, 'Invalid Member!', 'Please mention a valid member of this server!');
  }
  // Check if user is mutable
  tgt_user = args[0].replace(/[\\<>@#&!]/g, "");
  tgt_pos = message.guild.members.cache.get(tgt_user).roles.highest.position;
  cur_pos = message.member.roles.highest.position;
  if(tgt_pos >= cur_pos) {
    return client.error(message.channel, "You do not have permission to mute this member", "You cannot mute this user as they have a higher role than you");
  }

  // Kick member if in voice
  if (member.voice.channel) {
    member.voice.kick();
  }

  // Get reason
  var reason = "";
  for(var i = 1; i <= args.length; i++) {
    reason += args[i];
  }
  if(reason === "") {
    member.send(`You have been muted in ${member.guild.name}. There was no specified reason. This mute expires when a moderator a administrator decides to unmute you.\nPlease DM FGL Mod Mail if you have any queries.`);
  }
  else {
    member.send(`You have been muted in ${member.guild.name} for reason: ${reason}. This mute expires when a moderator or a administrator decides to unmute you.\nPlease DM FGL Mod Mail if you have any queries.`);
  }

  // Adds the role to the member, removes the community role and deletes the message that initiated the command
  member.roles.add(role).catch((err) => console.error(err));
  member.roles.remove(role_community).catch((err) => console.error(err));
  message.delete().catch((err) => console.error(err));
  return message.channel.send(`Successfully muted ${member}!`).catch((err) => console.error(err));
};

module.exports.conf = {
  guildOnly: true,
  aliases: ['m'],
  permLevel: 'Moderator',
  args: 1,
};

module.exports.help = {
  name: 'mute',
  category: 'moderation',
  description: 'Gives the mentioned user the Muted role',
  usage: 'mute <@user> <reason (optional)>',
  details: '<@user> => Any valid member of the server, reason => reason to mute the member',
};
