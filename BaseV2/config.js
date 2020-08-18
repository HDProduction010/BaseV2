/* eslint-disable max-len */
const config = {
  token: 'NzQyMDU4NDQxMzY3MDkzMjcy.XzAlxw.lKPwlGe8nVA0PBgO5JtkvEHk5jg',
  // MongoDB URI
  mongoURI: 'mongodb://user:pass@127.0.0.1:27017/?authSource=authdbname',

  // Raid Settings
  raidJoinsPerSecond: 60,
  raidJoinCount: 1,

  // Settings
  prefix: '=',
  verifiedRole: "734869160441675820",
  jrmodRole: '734869160449933315',
  modRole: '734869160449933316',
  srmodRole: '734869160449933317',
  jradminRole: '734869160450064466',
  adminRole: '734869160450064467',
  botadminRole: '734869160450064469',
  ownerRole: '734869160454258882',
  staffChat: '739684937887645767',
  modMail: '',
  reportMail: '',
  actionLog: '734869161976791159',
  joinLeaveLog: '734869161976791159',
  modLog: '4',
  applyChannel: '741363806231592990',
  botChannel: '741737593502433410',
  staffCommands: '734869161976791158',

  // Newline Limit Settings
  newlineLimitChannels: [],
  newlineLimit: 10,
  imageLinkLimit: 3,

  // No-Mention channels
  noMentionChannels: [''],

  // Ban appeals
  banAppealLink: 'LINK',

  // UserDB
  userDBDefaults: {
    roles: [],
    nicknames: [],
    usernames: [],
    infractions: [],
    lastMessageTimestamp: 0,
  },

  // Bot Perms and Stuff
  ownerID: ['715406424947294290'],

  admins: ['', ''],

  ignoreMember: [''],

  ignoreChannel: [''],

  support: ['', ''],

  // Guild Perms and Stuff
  permLevels: [
    {
      level: 0,
      name: 'User', // This is a regular unverified user.
      check: () => true,
    },
    {
      level: 1,
      name: 'Verified', // This is a verified user.
      check: (client, message) => {
        if (message.guild) {
          const verifiedRoleObj = message.guild.roles.cache.get(config.verifiedRole);

          if (verifiedRoleObj && message.member.roles.cache.has(verifiedRoleObj.id)) {
            return true;
          }
        }
        return false;
      },
    },
    {
      level: 2,
      name: 'Junior Moderator', // This is a Junior Moderator
      check: (client, message) => {
        if (message.guild) {
          const jrmodObj = message.guild.roles.cache.get(config.jrmodRole);

          if (jrmodObj && message.member.roles.cache.has(jrmodObj.id)) {
            return true;
          }
        }
        return false;
      },
    },
    {
      level: 3,
      name: 'Moderator', // This is a Moderator
      check: (client, message) => {
        if (message.guild) {
          const modObj = message.guild.roles.cache.get(config.modRole);

          if (modObj && message.member.roles.cache.has(modObj.id)) {
            return true;
          }
        }
        return false;
      },
    },
    {
      level: 4,
      name: 'Senior Moderator', // This is a Senior Moderator
      check: (client, message) => {
        if (message.guild) {
          const srmodRoleObj = message.guild.roles.cache.get(config.srmodRole);

          if (srmodRoleObj && message.member.roles.cache.has(srmodRoleObj.id)) {
            return true;
          }
        }
        return false;
      },
    },
    {
      level: 5,
      name: 'Junior Admin', // This is an Junior Admin and/or fallback role
      check: (client, message) => {
        if (message.guild) {
          const jradminRoleObj = message.guild.roles.cache.get(config.jradminRole);

          if ((jradminRoleObj && message.member.roles.cache.has(jradminRoleObj.id)) || message.member.hasPermission('ADMINISTRATOR')) {
            return true;
          }
        }
        return false;
      },
    },
    {
      level: 6,
      name: 'Admin', // This is an Admin
      check: (client, message) => {
        if (message.guild) {
          const adminRoleObj = message.guild.roles.cache.get(config.adminRole);

          if ((adminRoleObj && message.member.roles.cache.has(adminRoleObj.id))) {
            return true;
          }
        }
        return false;
      },
    },
    {
      level: 8,
      name: 'Bot Admin', // This is an Bot Admin
      check: (client, message) => {
        if (message.guild) {
          const botadminRoleObj = message.guild.roles.cache.get(config.botadminRole);

          if ((botadminRoleObj && message.member.roles.cache.has(botadminRoleObj.id))) {
            return true;
          }
        }
        return false;
      },
    },
    {
      level: 9,
      name: 'Server Owners', // This is an owner
      check: (client, message) => {
        if (message.guild) {
          const ownerRoleObj = message.guild.roles.cache.get(config.ownerRole);

           if ((ownerRoleObj && message.member.roles.cache.has(ownerRoleObj.id))) {
             return true;
           }
        }
        return false;
      }
    },
  ],
};

module.exports = config;

