const Discord = require("discord.js");
const Config = require("./config.json");
const FS = require("fs");

const Prefix = "?";
const Client = new Discord.Client();
Client.commands = new Discord.Collection();

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

Client.on("guildBanAdd", (Guild, User) => {
  // Fetch reason and stuff
  // -
  // Send message to log
  // -
})

Client.login(Config.token);