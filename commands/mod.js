const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'mod',
	description: 'Mod commands',
	async execute(message, args, Client) {
    if (args.length < 1) return; // Maybe send a message
    switch (args[0]) {
      // args[0] -> subcommand
      // args[1] -> user
      // args[2] -> options
      case "ban": // Only for mods+
        if (!message.member.permissions.has("BAN_MEMBERS") || message.mentions.members.size == 0) return;
        // Grab the user details
        var member = message.mentions.members.first();
        var user = member.user;
        var reason = "";
        var duration = 0;
        if (!member || !member.bannable) return;
        if (message.member.roles.highest.position < member.roles.highest.position) return;
        // Ask for reason
        if (args[2] === undefined || args[2] !== "-f") {
          let filter = msg => msg.author.id == message.author.id;
          let msgReason = await message.reply("please provide a reason for the ban:");
          await message.channel.awaitMessages(filter, {max: 1, time: 10000, errors: ['time']}).then(collected => {
            reason = collected.first().content;
          }).catch(error => msgReason.edit("Case: 404 | No reason set, you can set the reason later."));
          // Ask for duration
          msgReason = await message.reply("please provide a duration for the ban (0 - 7):");
          await message.channel.awaitMessages(filter, {max: 1, time: 10000, errors: ['time']}).then(collected => {
            duration = collected.first().content == "0" ? 0 : parseInt(collected.first().content) > 7 ? 0 : parseInt(collected.first().content);
          }).catch(error => msgReason.edit("Case: 404 | No duration set, you can set the duration later."));
        }
        // Send the information to the log channel
        let banEmbed = new MessageEmbed({
          author: {
            name: `${message.member.displayName} (ID: ${message.author.id})`,
            icon_url: `${message.author.displayAvatarURL()}`
          },
          thumbnail: {
            url: "https://i0.kym-cdn.com/photos/images/original/000/065/301/banhammer_forecast.gif"
          },
          color: "#FF0000",
          description: `**User:** ${user} (ID: ${user.id})\n**Duration:** ${duration == 0 || duration > 7 || isNaN(duration) ? "Forever" : duration + " days"}\n**Reason:** ${reason == "" ? "No reason set yet" : reason}`,
          timestamp: new Date(),
          footer: {
            text: "Case 404 | Ban"
          }
        })
        var channels = Client.channels.cache.filter(channel => channel.id == "732174841095913472");
        await channels.forEach(channel => {
          channel.send(banEmbed);
        })
        // ban the user
        await member.send(`You got banned from the discord \`${message.guild.name}\` for \`${duration == 0 || duration > 7 || isNaN(duration) ? "unlimited" : duration} days\`. You got banned because \`${reason == "" ? "No reason set" : reason}\`.`)
        await member.ban({
          days: duration,
          reason: reason
        })
        message.channel.send('User successfully banned.');
        break;
      case "kick": // Only for mods+
        if (!message.member.permissions.has("KICK_MEMBERS") || message.mentions.members.size == 0) return;
        // Details
        var member = message.mentions.members.first();
        var user = member.user;
        var reason = "";
        console.log(member.kickable)
        if (!member || !member.kickable) return;
        console.log(message.member.roles.highest.position < member.roles.highest.position)
        if (message.member.roles.highest.position < member.roles.highest.position) return;
        // Ask for reason
        if (args[2] === undefined || args[2] !== "-f") {
          let filter = msg => msg.author.id == message.author.id;
          let msgReason = await message.reply("please provide a reason for the kick:");
          await message.channel.awaitMessages(filter, {max: 1, time: 10000, errors: ['time']}).then(collected => {
            reason = collected.first().content
          }).catch(error => msgReason.edit("Case 404 | No reason set, you can set the reason later."))
        }
        // Send the information to the log channel
        let kickEmbed = new MessageEmbed({
          author: {
            name: `${message.member.displayName} (ID: ${message.author.id})`,
            icon_url: `${message.author.displayAvatarURL()}`
          },
          thumbnail: {
            url: "https://media.makeameme.org/created/kick-him-out-6g3pdp.jpg"
          },
          color: "#FF7F00",
          description: `**User:** ${user} (ID: ${user.id})\n**Reason:** ${reason == "" ? "No reason set yet" : reason}`,
          timestamp: new Date(),
          footer: {
            text: "Case 404 | Kick"
          }
        })
        var channels = Client.channels.cache.filter(channel => channel.id == "732174841095913472");
        await channels.forEach(channel => {
          channel.send(kickEmbed);
        })
        // kick the user
        await member.send(`You got kicked from \`${message.guild.name}\` for \`${reason}\`.`);
        await member.kick({
          reason: reason
        })
        message.channel.send('User successfully kicked.')
        break;
      case "dev": // For everyone
        let devEmbed = new MessageEmbed({
          thumbnail: {
            url: "https://files.thehairy.org/cslady.png"
          },
          description: "Please check <#713363507785105419> if you have problems running your game. If you still have problems, please upload your 'output_log.txt' here and provide your 'DXDIAG informations'. How to access both is described in <#615545764663263278>.",
        })
        message.channel.send({
          embed: devEmbed
        });
        break;
      case "bug": // For everyone
        let bugEmbed = new MessageEmbed({
          thumbnail: {
            url: "https://files.thehairy.org/csbug.png"
          },
          title: `How to report a bug`,
          description: `If you want to report a bug, please provide as much details as possible. Also please upload your output_log.txt and your dxdiag.txt. How to find them is explained in <#615545764663263278>.`,
        })
        message.channel.send(bugEmbed);
        break;
      case "faq":
        let faqEmbed = new MessageEmbed({
          thumbnail: {
            url: "https://files.thehairy.org/csfaq.png"
          },
          title: `The majestic FAQ`,
          description: `Before making any suggestions, please first read the FAQ provided in <#587658747220983817> and try to not suggest stuff that is already mentioned there.`
        })
        message.channel.send(faqEmbed)
        break;
      case "switch":
        let switchEmbed = new MessageEmbed({
          thumbnail: {
            url: "https://files.thehairy.org/foreverentertainment.png"
          },
          title: `Switch Support`,
          description: `We do not provide technical support for the Switch version of the game. For technical support, please reach out to [Forever Entertainment](https://thehairy.org/redirect/forevent.php).\nIf you have questions regarding the gameplay, you can ask in the appropriate channel or in <#586181771259936769>.`
        })
        message.channel.send(switchEmbed)
        break;
      case "setReason": // Only for mods+
        // TODO: Implement database so that this command can work.
        break;
      case "setDuration": // Only for mods+
        // TODO: Implement database so that this command can work.
        break;
    }
	},
};