const moment = require('moment');

module.exports.run = async (client, message, args, level) => {
  let member;
  if (args.length > 0 && level >= 2) {
    // Mods can see other's infractions
    member = message.mentions.members.first();
    if (!member) {
      if (parseInt(args[0], 10)) {
        try {
          member = await client.users.fetch(args[0]);
        } catch (err) {
          // Don't need to send a message here
        }
      }
    }
    if (!member) {
      member = client.searchMember(args[0]);
    }

    // If no user mentioned, display this
    if (!member) {
      return client.error(message.channel, 'Invalid Member!', 'Please mention a valid member of this server!');
    }
  } else {
    member = message.author;
  }

  const { infractions } = client.userDB.ensure(member.id, client.config.userDBDefaults);
  let msg = `__**${member.guild ? member.user.tag : `${member.username}#${member.discriminator}`}'s warnings**__`;
  let expPoints = 0;
  let expMsg = '';
  let curPoints = 0;
  let curMsg = '';
  const time = Date.now();
  infractions.forEach((i) => {
    if (i.points > 0 || level >= 2) {
      const moderator = client.users.cache.get(i.moderator);
      if ((i.points * 604800000) + i.date > time) {
        curPoints += i.points;
        curMsg += `\n• **Case** ${i.case} -${level >= 2 ? ` ${moderator ? `**Mod:** ${moderator.tag}` : `Unknown Mod ID: ${i.moderator || 'No ID Stored'}`} -` : ''} (${moment.utc(i.date).format('DD MMM YYYY')} UTC) ${i.points} warn${i.points === 1 ? '' : 's'}\n> Reason: ${i.reason}`;
      } else {
        expPoints += i.points;
        expMsg += `\n• **Case** ${i.case} -${level >= 2 ? ` ${moderator ? `**Mod:** ${moderator.tag}` : `Unknown Mod ID: ${i.moderator || 'No ID Stored'}`} -` : ''} (${moment.utc(i.date).format('DD MMM YYYY')} UTC) ${i.points} warn${i.points === 1 ? '' : 's'}\n> Reason: ${i.reason}`;
      }
    }
  });
  
  // Where to send message
  // No infractions
  if(curPoints === 0) {
    return message.channel.send(`${member.guild ? member.user.tag : `${member.username}#${member.discriminator}`} doesn't have any warnings!`);
  }
  else {
    return message.channel.send(msg += curMsg, { split: true });
  }
};

module.exports.conf = {
  guildOnly: false,
  aliases: ['warnings'],
  permLevel: 'Verified',
};

module.exports.help = {
  name: 'warnlog',
  category: 'moderation',
  description: 'Shows a list of warnings given to a member',
  usage: 'beestinglog <@member>',
  details: '<@member> The member to list warnings for.',
};
