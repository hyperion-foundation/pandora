const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();

client.on("ready", async () => {
    console.log(`${client.user.username} is ready to go!`);
    client.user.setActivity(`Hyperion Discord server`, {type: "WATCHING"});
});

client.on(`guildMemberAdd`, member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome-goodbye');
    if(!channel) return;
    channel.send(`Welcome, ${member}! Enjoy your stay and have fun.`);
});

client.on(`guildMemberRemove`, member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome-goodbye');
    if(!channel) return;
    channel.send(`Goodbye, ${member}. We are sorry to see you go.`);
});

client.login(config.token);
