// eslint-disable-next-line no-unused-vars
module.exports.run = (client, message, args, level, Discord) => {
    const channel = message.mentions.channels.first() || message.channel;
    if(args[0].includes("@")) {
      args[0] = args[0].substr(1);
    }
    var role;
    if(args[0] === "everyone") {
      role = message.guild.roles.everyone;
    }
    else {
      role = message.guild.roles.cache.find((r) => r.name === args[0]);
    }
    var i = 2;
    msg = '';
    while(i <= args.length - 1) {
      msg += args[i];
      msg += " ";
      i++;
    }
    console.log(channel, role, args[0]);
    try {
       console.log(args[2])
       channel.send(role.toString());
       const embed = new Discord.MessageEmbed()
        .setAuthor(`Announcement by ${message.author.username}`)
        .setColor('#f5ec42')
        .addField('Hey there!', `${msg}`)
        .setFooter(`ID: ${message.guild.id}`)
        .setTimestamp();
      console.log(embed);
      channel.send(embed);
      message.delete();
    }
    catch (err) {
      message.channel.send("**Role does not exist and/or incorrect arguments**\nThe specified role does not exist or invalid parameters have been passed to the function");
    }
};

module.exports.conf = {
  guildOnly: true,
  aliases: [],
  permLevel: 'Admin',
  args: 3,
};

module.exports.help = {
  name: 'announce',
  category: 'misc',
  description: 'Announces a message to the specified channel.',
  usage: 'announce role <#channel> msg',
  details: 'role => role to ping, <#channel> => The channel to announce to, msg => Message to print in said channel',
};
