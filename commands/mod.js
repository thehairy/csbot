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
        if (!message.member.permissions.has("BAN_MEMBERS")) return;
        // Grab the user details
        let member = message.mentions.members.first();
        let user = member.user;
        let reason = "";
        let duration = 0;
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
          description: `User: ${user} (ID: ${user.id})\nDuration: ${duration == 0 || duration > 7 || isNaN(duration) ? "Forever" : duration + " days"}\nReason: ${reason == "" ? "No reason set yet" : reason}`,
          timestamp: new Date(),
          footer: {
            text: "Case 0000"
          }
        })
        let channels = Client.channels.cache.filter(channel => channel.name == "support-bot");
        await channels.forEach(channel => {
          channel.send(banEmbed);
        })
        // ban the user
        break;
      case "kick": // Only for mods+
        break;
      case "dev": // For everyone
        break;
      case "bug": // For everyone
        break;
      case "faq": // For everyone
        break;
      case "setReason": // Only for mods+
        break;
      case "setDuration": // Only for mods+
        break;
    }
	},
};