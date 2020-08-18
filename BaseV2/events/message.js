/* eslint-disable max-len */
/* eslint-disable consistent-return */
const Discord = require('discord.js');

const cooldowns = new Discord.Collection();
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = async (client, message) => {
  // Ignore all bots
  if (message.author.bot) {
    return;
  }
  // React in needs-voting channel
  try {
     const channel = message.guild.channels.cache.find(channel => channel.name === "voting");
     var cid;
     try {
       let cid = channel.id;
     }
     catch {
       let cid = '';
     }
  }
  catch {
    let cid = '';
  }
  if (message.channel.id === cid) {
    const guilty = client.emojis.find(emoji => emoji.name === "guilty");
    const inconclusive = client.emojis.find(emoji => emoji.name === "inconclusive"); 
    const innocent = client.emojis.find(emoji => emoji.name === "innocent"); 
    try {
       await message.react(guilty);
       await message.react(inconclusive);
       await message.react(innocent);
    }
    catch {
       ;
    }
  }

  /* client.previous_message = "";
     client.antispam_counter = 0;
     client.antispam_time = Date.now();
  */

  rslur = ["nigger", "nigga", "homo", "pedo", "gay", "liberal", "commie", "communist", "democrat", "bitch", "faggot", "fag"]

  // Racial Slurs Check
  if(message.guild != null) {
  	 const mrole = message.guild.roles.cache.find((r) => r.name === 'Muted');
	 for(var i = 0; i < rslur.length; i++) {
    	if(message.content.toLowerCase().includes(rslur[i])) {
       		message.channel.send("**Permanent Mute**\nYou have been muted permanently as a result of typing racial slurs, zalgo or politics. Please DM FGL Mod Mail if you wish to appeal this.");
       		message.member.roles.add(mrole).catch((err) => console.error(err));
			return;
    	}
  	}
 }

  const level = client.permLevel(message);

  if (message.guild && message.guild.id === client.config.mainGuild) {
    // User activity tracking
    client.userDB.set(message.author.id, message.createdTimestamp, 'lastMessageTimestamp');

    // Emoji finding and tracking
    const regex = /<a?:\w+:([\d]+)>/g;
    const msg = message.content;
    let regMatch;
    while ((regMatch = regex.exec(msg)) !== null) {
      // If the emoji ID is in our emojiDB, then increment its count
      if (client.emojiDB.has(regMatch[1])) {
        client.emojiDB.inc(regMatch[1]);
      }
    }

    // Banned Words
    if (level[1] < 2) {
      const tokens = message.content.split(/ +/g);
      let ban = false;
      let del = false;
      let match;

      tokens.forEach((s, index, arr) => {
        const matches = client.bannedWordsFilter.search(s);
        if (matches.length === 0) {
          return;
        }

        match = client.bannedWordsDB.find((w) => w.word === matches[0].original);

        if (match.phrase.length !== 0) {
          for (let i = 0; i < match.phrase.length; i++) {
            if (arr[index + (i + 1)].toLowerCase() !== match.phrase[i].toLowerCase()) {
              return;
            }
          }
        }

        if (match.blockedChannels && !match.blockedChannels.includes(message.channel.id)) {
          // Only blocked in specific channels, so exit if not in that channel
          return;
        }
        if (match.autoBan) {
          ban = true;
          return;
        }
        // Delete message
        del = true;
      });

      const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor('RED')
        .setFooter(`ID: ${message.author.id}`)
        .setTimestamp()
        .setTitle(`Banned word sent by ${message.author} in ${message.channel}`)
        .setDescription(message.content);

      const modLogCh = client.channels.cache.get(client.config.modLog);

      if (ban) {
        message.delete()
          .catch((err) => client.error(modLogCh, 'Message Delete Failed!', `I've failed to delete a message containing a banned word from ${message.author}! ${err}`));
        return message.guild.members.ban(message.author, { reason: '[Auto] Banned Word', days: 1 })
          .catch((err) => client.error(modLogCh, 'Ban Failed!', `I've failed to ban ${message.author}! ${err}`));
      }
      if (del) {
        return message.delete()
          .catch((err) => client.error(modLogCh, 'Message Delete Failed!', `I've failed to delete a message containing a banned word from ${message.author}! ${err}`));
      }

      if (ban || del) {
        embed.addField('Match', match, true)
          .addField('Action', ban ? 'Banned' : 'Deleted', true);

        return modLogCh.send(embed);
      }
    }

    // Anti Mention Spam
    if (message.mentions.members && message.mentions.members.size > 10) {
      // They mentioned more than 10 members, automute them for 10 mintues.
      if (message.member && level[1] < 2) {
        // Mute
        message.member.roles.add(client.config.mutedRole, 'Mention Spam');
        // Delete Message
        if (!message.deleted) {
          message.delete();
        }
        // Schedule unmute
        setTimeout(() => {
          try {
            message.member.roles.remove(client.config.mutedRole, 'Unmuted after 10 mintues for Mention Spam');
          } catch (error) {
            // Couldn't unmute, oh well
            console.error('Failed to unmute after Anit Mention Spam');
            console.error(error);
          }
        }, 600000);
        // Notify mods so they may ban if it was a raider.
        message.guild.channels.cache.get(client.config.staffChat).send(`**Mass Mention Attempt!**
  <@&495865346591293443> <@&494448231036747777>
  The member **${message.author.tag}** just mentioned ${message.mentions.members.size} members and was automatically muted for 10 minutes!
  They have been a member of the server for ${client.humanTimeBetween(Date.now(), message.member.joinedTimestamp)}.
  If you believe this member is a mention spammer bot, please ban them with the command:
  \`.ban ${message.author.id} Raid Mention Spammer\``);
      }
    }

    // Delete non-image containing messages from image only channels
    if (message.guild && client.config.imageOnlyChannels.includes(message.channel.id)
        && message.attachments.size === 0 && level[1] < 2) {
      // Message is in the guild's image only channels, without an image or link in it, and is not a mod's message, so delete
      if (!message.deleted && message.deletable) {
        message.delete();
        client.imageOnlyFilterCount += 1;
        if (client.imageOnlyFilterCount === 5) {
          client.imageOnlyFilterCount = 0;
          const autoMsg = await message.channel.send('Image Only Channel!\nThis channel only allows posts with images. Everything else is automatically deleted.');
          setTimeout(() => {
            autoMsg.delete();
          }, 30000);
        }
      }
      return;
    }

    // Delete messages that don't contain BOTH image and text from image&text only channels
    if (message.guild && client.config.imageAndTextOnlyChannels.includes(message.channel.id)
      && (message.attachments.size === 0 || message.content === '')
      && level[1] < 2) {
      if (!message.deleted && message.deletable) {
        message.delete();
        client.imageAndTextOnlyFilterCount += 1;
        if (client.imageAndTextOnlyFilterCount === 5) {
          client.imageAndTextOnlyFilterCount = 0;
          const autoMsg = await message.channel.send('Image And Text Channel!\nThis channel only allows messages with both images and text. Everything else is automatically deleted. This allows for keywords to be searchable.');
          autoMsg.delete({ timeout: 30000 });
        }
      }
      return;
    }

    // Delete posts with too many new line characters or images to prevent spammy messages in trade channels
    if (message.guild && client.config.newlineLimitChannels.includes(message.channel.id)
        && ((message.content.match(/\n/g) || []).length >= client.config.newlineLimit
        || (message.attachments.size + (message.content.match(/https?:\/\//gi) || []).length) >= client.config.imageLinkLimit)
        && level[1] < 2) {
      // Message is in the guild, in a channel that has a limit on newline characters, and has too many or too many links + attachments, and is not a mod's message, so delete
      if (!message.deleted && message.deletable) {
        message.delete();
        client.newlineLimitFilterCount += 1;
        if (client.newlineLimitFilterCount === 5) {
          client.newlineLimitFilterCount = 0;
          const autoMsg = await message.channel.send('Too Many New Lines or Attachments + Links!\nThis channel only allows posts with less than 10 newline characters and less than 3 attachments + links in them. Messages with more than that are automatically deleted.');
          setTimeout(() => {
            autoMsg.delete();
          }, 30000);
        }
      }
      return;
    }

    // Delete posts with @ mentions in villager and turnip channels
    if (message.guild && client.config.noMentionChannels.includes(message.channel.id)
      && message.mentions.members.size > 0
      && level[1] < 2) {
    // Message is in the guild, in a channel that restricts mentions, and is not a mod's message, so delete
      if (!message.deleted && message.deletable) {
        message.delete();
        client.noMentionFilterCount += 1;
        if (client.noMentionFilterCount === 5) {
          client.noMentionFilterCount = 0;
          const autoMsg = await message.channel.send('No Mention Channel!\nThis channel is to be kept clear of @ mentions of any members. Any message mentioning another member will be automatically deleted.');
          setTimeout(() => {
            autoMsg.delete();
          }, 30000);
        }
      }
      return;
    }
  }

  // Ignore messages not starting with the prefix
  if (message.content.indexOf(client.config.prefix) !== 0) {
    return;
  }

  // Our standard argument/command name definition.
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Grab the command data and aliases from the client.commands Enmap
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  let enabledCmds = client.enabledCmds.get(command);
  if (enabledCmds === undefined) {
    enabledCmds = client.enabledCmds.get(client.aliases.get(command));
  }

  // If that command doesn't exist, silently exit and do nothing
  if (!cmd) {
    return;
  }

  if (message.guild && message.guild.id === client.config.modMailGuild
    && cmd.help.name !== 'warn'
    && cmd.help.name !== 'warnlog'
    && cmd.help.name !== 'info'
    && cmd.help.name !== 'nicknames'
    && cmd.help.name !== 'usernames'
    && cmd.help.name !== 'mute'
    && cmd.help.name !== 'unmute'
    && cmd.help.name !== 'delwarn') {
    return;
  }

  if (enabledCmds === false && level[1] < 4) {
    return client.error(message.channel, 'Command Disabled!', 'This command is currently disabled!');
  }

  if (!message.guild && cmd.conf.guildOnly) {
    return client.error(message.channel, 'Command Not Available in DMs!', 'This command is unavailable in DMs. Please use it in a server!');
  }

  if (cmd.conf.blockedChannels && cmd.conf.blockedChannels.includes(message.channel.id) && level[1] < 4) {
    return client.error(message.channel, 'Command Not Available in this Channel!', 'You will have to use this command in the <#549858839994826753> channel!');
  }

  if (cmd.conf.allowedChannels && !cmd.conf.allowedChannels.includes(message.channel.id) && level[1] < 4) {
    return client.error(message.channel, 'Command Not Available in this Channel!', `You will have to use this command in one of the allowed channels: ${cmd.conf.allowedChannels.map((ch) => `<#${ch}>`).join(', ')}.`);
  }

  // eslint-disable-next-line prefer-destructuring
  message.author.permLevel = level[1];

  if (level[1] < client.levelCache[cmd.conf.permLevel]) {
    client.error(message.channel, 'Invalid Permissions!', `You do not currently have the proper permssions to run this command!\n**Current Level:** \`${level[0]}: Level ${level[1]}\`\n**Level Required:** \`${cmd.conf.permLevel}: Level ${client.levelCache[cmd.conf.permLevel]}\``);
    return console.log(`${message.author.tag} (${message.author.id}) tried to use cmd '${cmd.help.name}' without proper perms!`);
  }

  if (cmd.conf.args && (cmd.conf.args > args.length)) {
    return client.error(message.channel, 'Invalid Arguments!', `The proper usage for this command is \`${client.config.prefix}${cmd.help.usage}\`! For more information, please see the help command by using \`${client.config.prefix}help ${cmd.help.name}\`!`);
  }

  if (!cooldowns.has(cmd.help.name)) {
    cooldowns.set(cmd.help.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(cmd.help.name);
  const cooldownAmount = (cmd.conf.cooldown || 0) * 1000;

  if (timestamps.has(message.author.id)) {
    if (level[1] < 2) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        let timeLeft = (expirationTime - now) / 1000;
        let time = 'second(s)';
        if (cmd.conf.cooldown > 60) {
          timeLeft = (expirationTime - now) / 60000;
          time = 'minute(s)';
        }
        return client.error(message.channel, 'Woah There Bucko!', `Please wait **${timeLeft.toFixed(2)} more ${time}** before reusing the \`${cmd.help.name}\` command!`);
      }
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // Run the command
  const guildUsed = message.guild ? `#${message.channel.name}` : 'DMs';

  console.log(`${message.author.tag} (${message.author.id}) ran cmd '${cmd.help.name}' in ${guildUsed}!`);
  cmd.run(client, message, args, level[1], Discord);
};
