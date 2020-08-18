module.exports.run = async (client, message, args, level, Discord) => {
  let member;
  if (parseInt(args[0], 10)) {
    try {
      member = await client.users.fetch(args[0]);
    } catch (err) {
      // Don't need to send a message here
    }
  }

  if (!member) {
    member = message.mentions.members.first();
  }

  // If no user mentioned, display this
  if (!member) {
    return client.error(message.channel, 'Invalid Member!', 'Please mention a valid member of this server!');
  }
  const newPoints = 1; // All Warnings are 1 point
  const reason = args[1] ? args.slice(1).join(' ') : 'There was no specified reason.';

  let curPoints = 0;
  const time = Date.now();
  client.userDB.ensure(member.id, client.config.userDBDefaults).infractions.forEach((i) => {
    // If (points * 1 week) + time of infraction > current time, then the points are still valid
    if ((i.points * 604800000) + i.date > time) {
      curPoints += i.points;
    }
  });

  let dmMsg = `You have been warned in ${message.guild.name} for reason: ${reason}.`;
  let action = 'Warn';
  let mute = 0;
  let ban = false;
  let dmSent = false;
    // Try to send DM
    try {
      const dmChannel = await member.createDM();
      await dmChannel.send(dmMsg);
      dmSent = true;
    } catch (e) {
      // Nothing to do here
    }

  // Create infraction in the infractionDB to get case number
  const caseNum = client.infractionDB.autonum;
  client.infractionDB.set(caseNum, member.id);

  // Create infraction in the userDB to store important information
  client.userDB.push(member.id, {
    case: caseNum,
    action,
    points: newPoints,
    reason: `${reason}${message.attachments.size > 0 ? `\n${message.attachments.map((a) => `${a.url}`).join('\n')}` : ''}`,
    moderator: message.author.id,
    dmSent,
    date: time,
  }, 'infractions', true);

  // Notify in channel
  client.success(message.channel, 'Warning Given!', `**${member.guild ? member.user.tag : member.tag || member}** was warned successfully`);

  // Send mod-log embed
  const embed = new Discord.MessageEmbed()
    .setAuthor(`Case ${caseNum} | ${action} | ${member.guild ? member.user.tag : member.tag || member}`, member.guild ? member.user.displayAvatarURL() : member.displayAvatarURL())
    .setColor('#fc6b03')
    .setDescription(`**Reason**: ${reason}`)
    .addField('User', `<@${member.id}>`, true)
    .addField('Moderator', `<@${message.author.id}>`, true)
    .addField('DM Sent?', dmSent ? `${client.emoji.checkMark} Yes` : `${client.emoji.redX} No`, true)
    .addField('Total Warnings', curPoints + newPoints, true)
    .setFooter(`ID: ${member.id}`)
    .setTimestamp();
  return message.guild.channels.cache.get(client.config.modLog).send(embed);
};

module.exports.conf = {
  guildOnly: true,
  aliases: ['strike'],
  permLevel: 'Junior Moderator',
  args: 1,
};

module.exports.help = {
  name: 'warn',
  category: 'moderation',
  description: 'Warns the specified member',
  usage: 'warn <@member> <reason>',
  details: '<@member> The member to give the warning to.\n<reason> => The reason for warning the member.',
};
