module.exports.run = async (client, message, args) => {
  const caseNum = parseInt(args[0], 10);

  if (!(caseNum > 0)) {
    return client.error(message.channel, 'Invalid Number!', 'Please provide a valid case number to delete.');
  }

  if (client.infractionDB.has(caseNum.toString())) {
    const userID = client.infractionDB.get(caseNum);
    // Remove the caseNum => userID entry in infractionDB
    client.infractionDB.delete(caseNum.toString());
    // Remove the infraction from the user
    const infs = client.userDB.get(userID, 'infractions');
    const infRemoved = infs.filter((inf) => inf.case === caseNum)[0];
    client.userDB.set(userID, infs.filter((inf) => inf.case !== caseNum), 'infractions');
    // Notify that the infraction was removed
    const user = await client.users.fetch(userID);
    return client.success(message.channel, 'Deleted Warning Successfully!', `**${user.tag}** had their warn removed successfully.`);
  }

  return client.error(message.channel, 'Invalid Case Number!', 'Please provide a valid case number to apply medicine to!');
};

module.exports.conf = {
  guildOnly: true,
  aliases: ['warndel'],
  permLevel: 'Moderator',
  args: 1,
};

module.exports.help = {
  name: 'delwarn',
  category: 'moderation',
  description: 'Remove warnings on server members.',
  usage: 'Medicine <case number>',
  details: '<case number> => The case number for the warning to be removed.',
};
