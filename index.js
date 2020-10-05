const Discord = require("discord.js");
const Config = require("./config.json");
const FS = require("fs");

const Prefix = "?";
const Client = new Discord.Client();
Client.commands = new Discord.Collection();
Client.badwords = require("./badwords.json").badwords // so is jz iwie nen array

const CommandFiles = FS.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const File of CommandFiles) {
  const Command = require(`./commands/${File}`);
  Client.commands.set(Command.name, Command);
}

Client.on("ready", () => {
  console.log("Ready 🥞");
  Client.user.setPresence({
    activity: {
      name: "Cooking Simulator",
      type: "PLAYING"
    },
    status: "online"
  })
})

Client.on("message", (message) => {
  // Badword filter
  if(Client.badwords.some(word => message.content.toLowerCase().includes(word.toLowerCase()))){
    message.delete({ reason: "Badword" });
    return;
  }
  // Check if message was send in DMs or comes from a bot
  if (message.author.bot || message.channel.type == "dm" || !message.content.startsWith(Prefix)) return;

  const Args = message.content.slice(Prefix.length).trim().split(/ +/);
  const Command = Args.shift().toLowerCase();
  
  if (!Client.commands.has(Command)) return;
  try {
    Client.commands.get(Command).execute(message, Args, Client);
  } catch (error) {
    console.log(error);
    message.reply("woopsie, the dev of this bot f'd up. 🥞")
  }
})

/*Client.on("guildBanAdd", async (Guild, User) => {
    let duration = "0";
    let reason = "No reason set yet.";
    let banEmbed = new Discord.MessageEmbed({
      author: {
        name: `Claim this ban and edit the reason. (Coming soon.)`
      },
      thumbnail: {
        url: "https://i0.kym-cdn.com/photos/images/original/000/065/301/banhammer_forecast.gif"
      },
      color: "#FF0000",
      description: `**User:** ${User.tag} (ID: ${User.id})\n**Duration:** ${duration == 0 || duration > 7 || isNaN(duration) ? "Forever" : duration + " days"}\n**Reason:** ${reason == "" ? "No reason set yet" : reason}`,
      timestamp: new Date(),
      footer: {
        text: "Case: 404 | Ban"
      }
    })
    Client.channels.cache.filter(channel => channel.name == "support-bot").forEach(ch => {
      ch.send(banEmbed);
    })
})*/

Client.login(Config.token);