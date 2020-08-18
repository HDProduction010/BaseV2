const { Searcher } = require('fast-fuzzy');

// eslint-disable-next-line consistent-return
module.exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  let argsMod = args.slice(1).join(' ');
  let word;
  let phrase = [];

  if (argsMod.includes('“') || argsMod.includes('”')) {
    argsMod = argsMod.replace(/[“”]/gi, '"');
  }

  if (argsMod.includes('"')) {
    phrase = argsMod.match(/[^\s"]+|"([^"]*)"/g)[0].replace(/"/gi, '').split(' ');
    word = phrase.shift();
  } else {
    word = argsMod.split(' ').shift();
  }
  console.log(word);
  if (!word) {
    return client.error(message.channel, 'No Word or Phrase!', "You didn't supply a word or phrase!");
  }

  switch (args[0]) {
    case 'add':
    case 'a': {
      let autoBan = false;
      let global = true;
      const blockedChannels = [];

      autoBan = argsMod.split(phrase.length === 0 ? word : `"${word} ${phrase.join(' ')}"`)[1].trim().toLowerCase() === 'ban';

      if (message.mentions.channels.size > 0) {
        message.mentions.channels.forEach((ch) => blockedChannels.push(ch.id));
        global = false;
      }
      client.bannedWordsFilter.add({ word });

      client.bannedWordsDB.set(client.bannedWordsDB.autonum, {
        word, phrase, autoBan, global, blockedChannels,
      });

      client.success(message.channel, 'Successfully Added to Banned Words!', `I've successfully added \`${phrase.length === 0 ? `${word}` : `${word} ${phrase.join(' ')}`}\` to the banned words database!`);
      break;
    }
    case 'remove':
    case 'rem':
    case 'r':
    case 'delete':
    case 'del':
    case 'd': {
      const key = client.bannedWordsDB.findKey((s) => (s.word === word && s.phrase.length === 0 ? true : s.phrase.join(' ') === phrase));

      if (!key) {
        return client.error(message.channel, 'Not In Database', `The ${phrase.length === 0 ? `word \`${word}\`` : `phrase \`${word} ${phrase.join(' ')}\``}\` does not exist in the banned words database and therefore cannot be removed!`);
      }

      client.bannedWordsDB.delete(key);

      const bannedWordsArray = client.bannedWordsDB.array();
      client.bannedWordsFilter = new Searcher(bannedWordsArray, {
        keySelector: (s) => s.word, threshold: 1, returnMatchData: true, useSellers: false,
      });

      client.success(message.channel, 'Successfully Removed From Banned Words!', `I've successfully removed \`${phrase.length === 0 ? `${word}` : `${word} ${phrase.join(' ')}`}\` from the banned words database!`);
      break;
    }
    default:
      client.error(message.channel, 'Invalid Usage!', "You need to specify if you're adding or removing a word! Usage: \`.word <add|remove> <word|\"multiple words\"> <ban> <#channels>\`");
  }
};

module.exports.conf = {
  guildOnly: true,
  aliases: [],
  permLevel: 'Junior Admin',
  args: 2,
};

module.exports.help = {
  name: 'word',
  category: 'moderation',
  description: 'Adds or removes words and phrases from the banned words database',
  usage: 'word <add|remove> <word|"multiple words"> <ban> <#channels>\`',
  details: '<add|remove> => Whether to add or remove words or phrases from the database.\n<word|"multiple words"> => The word or phrase to add to the database. NOTE: Use quotes (") when adding phrases.\n<ban> => Whether to ban the member automatically for using this word or phrase.\n<#channels> => The channels for which this word or phrase is banned. NOTE: Only needed if the word or phrase is not global.',
};
