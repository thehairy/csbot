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
        // Ask for reason
        if (args[2] === undefined || args[2] !== "-f") {
          let filter = msg => msg.author.id == message.author.id;
          let msgReason = await message.reply("please provide a reason for the ban:");
          await message.channel.awaitMessages(filter, {max: 1, time: 10000, errors: ['time']}).then(collected => {
            reason = collected.first().content;
          }).catch(error => msgReason.edit("Case 0000 | No reason set, you can set the reason later."));
          // Ask for duration
          msgReason = await message.reply("please provide a duration for the ban (0 - 7):");
          await message.channel.awaitMessages(filter, {max: 1, time: 10000, errors: ['time']}).then(collected => {
            duration = collected.first().content == "0" ? 0 : parseInt(collected.first().content) > 7 ? 0 : parseInt(collected.first().content);
          }).catch(error => msgReason.edit("Case 0000 | No duration set, you can set the duration later."));
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
            text: "Case 0000 | Ban"
          }
        })
        var channels = Client.channels.cache.filter(channel => channel.name == "support-bot");
        await channels.forEach(channel => {
          channel.send(banEmbed);
        })
        // ban the user
        member.ban({
          days: duration,
          reason: reason
        })
        break;
      case "kick": // Only for mods+
      console.log(message.mentions.members.size)
        if (!message.member.permissions.has("KICK_MEMBERS") || message.mentions.members.size == 0) return;
        // Details
        var member = message.mentions.members.first();
        var user = member.user;
        var reason = "";
        // Ask for reason
        if (args[2] === undefined || args[2] !== "-f") {
          let filter = msg => msg.author.id == message.author.id;
          let msgReason = await message.reply("please provide a reason for the kick:");
          await message.channel.awaitMessages(filter, {max: 1, time: 10000, errors: ['time']}).then(collected => {
            reason = collected.first().content
          }).catch(error => msgReason.edit("Case 0000 | No reason set, you can set the reason later."))
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
            text: "Case 0000 | Kick"
          }
        })
        var channels = Client.channels.cache.filter(channel => channel.name == "support-bot");
        await channels.forEach(channel => {
          channel.send(kickEmbed);
        })
        // kick the user
        member.kick({
          reason: reason
        })
        break;
      case "dev": // For everyone
        var devEmbed = new MessageEmbed({
          description: "Please check <#713363507785105419> if you have problems running your game. If you still have problems, please upload your 'output_log.txt' here and provide your 'DXDIAG informations'. How to access both is described in <#615545764663263278>.",
          thumbnail: {
            url: "https://files.thehairy.org/cslady.png"
          }
        })
        message.channel.send(devEmbed);
        break;
      case "bug": // For everyone
        var bugEmbed = new MessageEmbed({
          description: "",
          thumbnail: {
            url: "https://files.thehairy.org/csbug.png"
          }
        })
        message.channel.send(bugEmbed);
        break;
      case "setReason": // Only for mods+
        break;
      case "setDuration": // Only for mods+
        break;
      case "test":
        setTimeout(() => {
          message.client.channels.cache.find(c => c.name == 'ad').send({
                  embed: new MessageEmbed().setTitle("test")
              })
              .then(() => {
                  console.log('Done.')
                  message.member.send(new MessageEmbed().setTitle(`Ticket #${1 + 1} was sent to staff succesfully!`).setColor('GREEN').setTimestamp());
              }).catch(err => console.log(err));
          message.client.channels.cache.find(c => c.name == 'ad').send(`<@&755880817468637246> <@&755888092652765286>`);
        }, 3000);
        break;
    }
	},
};