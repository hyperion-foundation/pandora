// Module
const Discord = require('discord.js');

// Configuration
require('dotenv').config();

// Client
const client = new Discord.Client();

// Console Log
client.on('ready', async () => {
    console.log(`${client.user.username} is ready to go.`);
    client.user.setActivity('Hyperion Discord server', {type: 'WATCHING'});
});

// Member Joined
client.on('guildMemberAdd', memberJoined => {
    const channel = memberJoined.guild.channels.cache.find(ch => ch.name === 'welcome-goodbye');
    if(!channel) return;
    channel.send(`Welcome, ${memberJoined}! Please consider to read the server rules.`);
});

// Member Left
client.on('guildMemberRemove', memberLeft => {
    const channel = memberLeft.guild.channels.cache.find(ch => ch.name === 'welcome-goodbye');
    if(!channel) return;
    channel.send(`Goodbye, ${memberLeft}. We hope to see you again.`)
});

// Pong
client.on('message', msg => {
    if (msg.content === 'ping') {
      msg.reply('pong');
    }
  });

// Client Login
client.login(process.env.TOKEN);

/*
    Pandora® is developed by Hyperion Dev Team. All the Pandora® codes are copyrighted to Hyperion ("Hyperion Foundation").
*/
