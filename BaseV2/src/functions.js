/* eslint-disable no-param-reassign */
const Discord = require('discord.js');
const moment = require('moment');

module.exports = (client) => {
  client.permLevel = (message) => {
    let permName = 'User';
    let permlvl = 0;
    const permOrder = client.config.permLevels.slice(0)
      .sort((p, c) => (p.level < c.level ? 1 : -1));

    while (permOrder.length) {
      const currentlvl = permOrder.shift();

      if (currentlvl.check(client, message)) {
        permName = currentlvl.name;
        permlvl = currentlvl.level;
        break;
      }
    }
    return [permName, permlvl];
  };

  client.clean = async (clientParam, text) => {
    if (text && text.constructor.name === 'Promise') {
      text = await text;
    }
    if (typeof evaled !== 'string') {
      // eslint-disable-next-line global-require
      text = require('util').inspect(text, { depth: 1 });
    }

    text = text
      .replace(/`/g, `\`${String.fromCharCode(8203)}`)
      .replace(/@/g, `@${String.fromCharCode(8203)}`)
      .replace(clientParam.token, 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0');

    return text;
  };

  client.fetchOwner = async () => {
    const owner = await client.users.fetch(client.config.ownerID);
    return owner;
  };

  client.info = (channel, suc, msg) => {
    channel.send(`${client.emoji.gameDie} **${suc}**\n${msg}`, { split: true });
  };

  client.success = (channel, suc, msg) => {
    channel.send(`${client.emoji.checkMark} **${suc}**\n${msg}`, { split: true });
  };

  client.error = (channel, err, msg) => {
    channel.send(`${client.emoji.redX} **${err}**\n${msg}`, { split: true });
  };

  client.humanTimeBetween = (time1, time2) => {
    if (time1 < time2) {
      const temp = time1;
      time1 = time2;
      time2 = temp;
    }
    const timeDif = moment.duration(moment(time1).diff(moment(time2)));

    const times = [
      timeDif.years(),
      timeDif.months(),
      timeDif.days(),
      timeDif.hours(),
      timeDif.minutes(),
      timeDif.seconds(),
    ];

    const units = ['year', 'month', 'day', 'hour', 'minute', 'second'];

    // Grab the top 3 units of time that aren't 0
    let outTimes = '';
    let c = 0;
    for (let t = 0; t < units.length; t++) {
      if (times[t] > 0) {
        outTimes += `${c === 1 ? '|' : ''}${c === 2 ? '=' : ''}${times[t]} ${units[t]}${times[t] === 1 ? '' : 's'}`;
        c += 1;
        if (c === 3) {
          break;
        }
      }
    }

    if (outTimes.includes('=')) {
      outTimes = outTimes.replace('|', ', ').replace('=', ', and ');
    } else {
      outTimes = outTimes.replace('|', ' and ');
    }

    return outTimes || '0 seconds';
  };

  client.timeRegex = /^([0-9]+)(?:([dhms])[a-z]*)?/i;

  client.stringToTime = (str) => {
    let match;
    let ms = 0;

    str = str.trim();

    while (str !== '' && (match = str.match(client.timeRegex)) !== null) {
      if (match[2] === 'd') ms += match[1] * 1000 * 60 * 60 * 24;
      else if (match[2] === 'h') ms += match[1] * 1000 * 60 * 60;
      else if (match[2] === 'm') ms += match[1] * 1000 * 60;
      else if (match[2] === 's' || !match[2]) ms += match[1] * 1000;

      str = str.slice(match[0].length);
    }

    if (str !== '') {
      return null;
    }

    return ms;
  };


  client.regexCount = (regexp, str) => {
    if (typeof regexp !== 'string') {
      return 0;
    }
    regexp = regexp === '.' ? `\\${regexp}` : regexp;
    regexp = regexp === '' ? '.' : regexp;
    return ((str || '').match(new RegExp(regexp, 'g')) || []).length;
  };

  client.reactPrompt = async (message, question, opt) => {
    if (!opt) {
      const confirm = await message.channel.send(question);
      await confirm.react(client.emoji.checkMark);
      await confirm.react(client.emoji.redX);

      const filter = (reaction, user) => [client.emoji.checkMark, client.emoji.redX].includes(reaction.emoji.name)
          && user.id === message.author.id;

      let decision = false;
      await confirm.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
        .then((collected) => {
          const reaction = collected.first();

          if (reaction.emoji.name === client.emoji.checkMark) {
            decision = true;
          }
        })
        .catch(() => {
          console.log('React Prompt timed out.');
        });
      await confirm.delete();
      return decision;
    }
    let counter = 0x1F1E6;
    let body = question;
    opt.slice(0, 20).forEach((option) => {
      body += `\n${String.fromCodePoint(counter)} : \`${option}\``;
      counter += 1;
    });
    const confirm = await message.channel.send(body);
    counter = 0x1F1E6;
    const emojiList = [];
    await client.asyncForEach(opt.slice(0, 20), async () => {
      emojiList.push(String.fromCodePoint(counter));
      await confirm.react(String.fromCodePoint(counter));
      counter += 1;
    });
    const filter = (reaction, user) => emojiList.includes(reaction.emoji.name)
          && user.id === message.author.id;

    let decision = '';
    await confirm.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
      .then((collected) => {
        const reaction = collected.first();

        decision = opt[reaction.emoji.toString().codePointAt(0) - 0x1F1E6];
      })
      .catch(() => {
        console.log('React Prompt timed out.');
      });
    await confirm.delete();
    return decision;
  };

  client.asyncForEach = async (array, callback) => {
    for (let i = 0; i < array.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await callback(array[i], i, array);
    }
  };

  // eslint-disable-next-line no-unused-vars
  client.searchMember = (name, threshold = 0.5) => undefined;
  client.clearSongQueue = () => {
  };

  client.raidModeActivate = async (guild) => {
    const modLog = guild.channels.cache.get(client.config.modLog);
    // Enable Raid Mode
    client.raidMode = true;
    // Save @everyone role and staff/actionlog channels here for ease of use.
    const { everyone } = guild.roles;
    const staffChat = guild.channels.cache.get(client.config.staffChat);
    const joinLeaveLog = guild.channels.cache.get(client.config.joinLeaveLog);
    guild.channels.cache.forEach(channel => {
      if(channel.id === staffChat.id || channel.id === modLog.id) {
         return;
      }
      channel.updateOverwrite(guild.id, { 'SEND_MESSAGES': false }, 'Lockdown Server')
        .then((channel) => {
           try {
           client.info(channel, "**Server Lockdown**!", "The whole server has been locked down due to a raid. Please DM FGL Mod Mail if you have any questions or DM an admin or higher if and only if FGL Mod Mail is disabled. Thank you for your patience");
        }
        catch {
           ;
        }
     })
  });
    // Send message to staff with prompts
    client.raidMessage = await staffChat.send(`**##### RAID MODE ACTIVATED #####**

A list of members that is raiding is currently being created here.
This message updates every 5 seconds, and you should wait to decide until the count stops increasing.

If you would like to remove any of the members from the list, use the \`.raidremove <ID>\` command.

Would you like to ban all ${client.raidJoins.length} members that joined in the raid?`);
    await client.raidMessage.react(client.emoji.checkMark);
    await client.raidMessage.react(client.emoji.redX);
    // Listen for reactions and log which action was taken and who made the decision.
    const filter = (reaction, user) => [client.emoji.checkMark, client.emoji.redX].includes(reaction.emoji.name)
        && guild.members.fetch(user).then((m) => m.hasPermission('BAN_MEMBERS')) && !user.bot;
    client.raidMessage.awaitReactions(filter, { max: 1 })
      .then(async (collected) => {
        const reaction = collected.first();
        const modUser = reaction.users.cache.last();
        if (reaction.emoji.name === client.emoji.checkMark) {
          // A valid user has selected to ban the raid party.
          // Log that the banning is beginning and who approved of the action.
          client.success(staffChat, 'Banning!', `User ${modUser.tag} has chosen to ban the raid. It may take some time to finish banning all raid members.`);
          client.raidBanning = true;
          client.mtmp = client.raidJoins.length;
          // Create a setInterval to ban members without rate limiting.
          const interval = setInterval(() => {
            if (client.raidJoins.length !== 0) {
              // Ban the next member
              try {
                client.raidJoins.shift().ban({ days: 1, reason: 'Member of raid.' })
              }
			  catch (err) {
                staffChat.send(`Could not ban a member who was raiding due to error ${err}`);
              }
            } else {
              // We've finished banning, annouce that raid mode is ending.
              staffChat.send('Finished banning all raid members. Raid Mode is deactivated.');
              joinLeaveLog.send(`The above ${client.mtmp} members have been banned.`);
              // Reset all raid variables
              client.raidMode = false;
              // Deactivate Raid Banning after a few seconds to allow for other events generated to finish
              setTimeout(() => {
                client.raidBanning = false;
              }, 15000);
              client.raidJoins = [];
              client.raidMessage = null;
              client.raidMembersPrinted = 0;

              // Allow users to send messages again.
              guild.channels.cache.forEach(channel => {
                if(channel.id === staffChat.id || channel.id === modLog.id) {
                   return;
                }
                channel.updateOverwrite(guild.id, { 'SEND_MESSAGES': true }, 'Unlockdown Server')
                  .then((channel) => {
                     try {
                       client.info(channel, "**Server Unlockdown**!", "The raid has finished and as such, the server has been unlocked. We thank you for your patience!");
                     }
                     catch {
                         ;
                     }
                 })
              });

              clearInterval(interval);
            }
          }, 100); // 100 ms is 10 bans a second, hopefully not too many.
        } else {
          // A valid user has selected not to ban the raid party.
          client.error(staffChat, 'Not Banning!', `User ${modUser.tag} has chosen to not ban the raid. Raid Mode is deactivated.`);
          // Reset all raid variables
          client.raidMode = false;
          client.raidJoins = [];
          client.raidMessage = null;
          client.raidMembersPrinted = 0;
          // Allow users to send messages again.
          guild.channels.cache.forEach(channel => {
             if(channel.id === staffChat.id || channel.id === modLog.id) {
                return;
             }
             channel.updateOverwrite(guild.id, { 'SEND_MESSAGES': true }, 'Unlockdown Server')
               .then((channel) => {
                  try {
                    client.info(channel, "**Server Unlockdown**!", "The raid has finished and as such, the server has been unlocked. We thank you for your patience!");
                  }
                  catch {
                    ;
                  }
              })
           });

         }
      })
      .catch(console.error);
    // If there are new joins, regularly log them to raid-logs and update the message with the count
    let msg = '**##### RAID MODE ACTIVATED #####**\nBELOW IS A LIST OF ALL MEMBERS THAT JOINED IN THE RAID';
    const updateRaid = setInterval(() => {
      // If the raid is over, don't update anymore.
      if (!client.raidMode) {
        clearInterval(updateRaid);
      } else if (!client.raidBanning) {
        client.raidMessage.edit(`**##### RAID MODE ACTIVATED #####**

A list of members that joined in the raid is being updated.
This message updates every 5 seconds, and you should wait to decide until the count stops increasing.
If you would like to remove any of the members from the list, use the \`.raidremove <ID>\` command.
Would you like to ban all ${client.raidJoins.length} members that joined in the raid?`);
        // Grab all the new raid members since last update.
        if (client.raidMembersPrinted !== client.raidJoins.length) {
          const newMembers = client.raidJoins.slice(client.raidMembersPrinted);
          client.raidMembersPrinted += newMembers.length;
          newMembers.forEach((mem) => {
            msg += `\n${mem.user.tag} (${mem.id})`;
          });
          staffChat.send(msg, { split: true });
          msg = '';
        }
      }
    }, 5000);
  };
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(String.prototype, 'toProperCase', {
    value() {
      return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    },
  });
};
