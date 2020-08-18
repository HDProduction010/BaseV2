// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level, Discord) => {
function cleanArray(actual) {
  var newArray = new Array();
  for (var i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}
  const dmChannel = await message.member.createDM();
  const questions = [
    "What is your timezone?",
    "How old are you right now?",                  
    "Why do you want to be a moderator?", 
    "If someone is being bullied, what do you do?",
    "If someone is abusing their role, what do you do?",
    "What do you do during a staff disagreement?",
    "What do you do in an uncomfortable situation?",
    "Have you moderated any servers before? If yes, please type them here."      
  ];                                     
  const filter = m => m.channel.type === 'dm' || m.author.bot === 0;
  const collector = dmChannel.createMessageCollector(filter, { });
  var pane;
  pane = 0;
  var ans = [];
  var stopped = 0;
  var uwarned = 0;
  var begun = 0;
  dmChannel.send(`Hi there. Welcome to FGL Staff Applications. If you wish to stop the application at any time, please type stop. To start your application, please type your username#descriminator and hit enter.\n\n`);
  collector.on('collect', m => {
    if(m.author.bot) {
      return;
    }
    if(pane === questions.length) {
      ans[pane] = m.content;
      console.log(ans, pane);
      dmChannel.send("Are you ready to submit your application? If not, please type stop and reapply. Otherwise, type submit.");
      pane++;
      return;
    }
    if(pane === questions.length + 1) {
      if(m.content === "submit") {
        dmChannel.send("Submitted your application. Thank you and have a good day");
        collector.stop();
        return;
      }
      if (uwarned === 0){
        dmChannel.send("Invalid response. Please type stop to close the application and type submit to submit it. Note that continuing to give an invalid response will stop your application");
        uwarned = 1;
        return;
      }
    }
    if(m.content.toLowerCase() === 'stop' || uwarned === 1) {
      dmChannel.send("Stopped your application. Thank you and have a good day!");
      stopped = 1;
      collector.stop();
      return;
    }

    if(pane === 0) {
    	dmChannel.send(`**${questions[pane]}**`);
    	pane++;
    }
    else {
    	ans[pane] = m.content;
    	dmChannel.send(`**${questions[pane]}**`);
    	pane++;
	}
  });

  collector.on('end', collected => {
    ans.splice(0, 1);
    var msg = `__**Staff application for ${message.author.tag}**__\n`;
    var channel = client.channels.cache.get(client.config.applyChannel);
    for(var i = 0; i < questions.length; i++) {
      msg += `**${questions[i]}**: ${ans[i]}\n`;
    }
    if(stopped === 0) {
      channel.send(msg);
    }
  });
};

module.exports.conf = {
  guildOnly: true,
  aliases: [],
  permLevel: 'Verified',
};

module.exports.help = {
  name: 'apply',
  category: 'misc',
  description: 'Apply for staff',
  usage: 'apply',
  details: '',
};
