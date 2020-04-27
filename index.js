const Discord = require("discord.js");
const config = require("./config.json");
const color = require("./color.json");
const client = new Discord.Client();

client.on("ready", async () => {
    console.log(`${client.user.username} is online.`);
    client.user.setActivity("Developed By Hyperion Dev Team", {type: "CUSTOM_STATUS"});
});

client.on(`guildMemberAdd`, memberadd => {
    const channel = memberadd.guild.channels.cache.find(ch => ch.name === 'welcome-goodbye');
    if(!channel) return;
    channel.send(`Welcome, ${memberadd} ! Enjoy your stay and have fun.`);
});

client.on(`guildMemberRemove`, memberremove => {
    const channel = memberremove.guild.channels.cache.find(ch => ch.name === 'welcome-goodbye');
    if(!channel) return;
    channel.send(`Goodbye, ${memberremove} . We are sorry to see you go.`);
});

client.on("message", async message => {
    if(message.author.bot || message.channel.type === "dm") return;

    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if(command === `${prefix}hi`) {
        return message.channel.send("Hi! Nice to see you. :wave:");
    }
});

client.login(config.token);
