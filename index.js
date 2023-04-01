require('dotenv').config();
const { Client, Collection, EmbedBuilder, Events, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const config = require('./lib/config.json');
const BadWords = require('./lib/badwords.json').words;
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.aliases = new Collection();
client.emotes = config.emoji;

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  }
  else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

client.on('ready', async () => {
  console.log(`"${client.user.username}" is ready to go!`);
  client.user.setPresence({ activities: [{ name: '/help' }], status: 'dnd' });
});
client.on('debug', console.log);

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  }
  catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    }
    else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

client.on('messageCreate', async message => {
  if (BadWords.some(word => message.content.toLowerCase().includes(word))) {
    message.delete();
    message.channel.send(`Dear **${message.author}**, please do not send any messages containing bad words!`);
    console.log(`[LOG (Info)]: "${message.author.tag}" (User ID: ${message.author.id}) just send a message containing bad words on "#${message.channel.name}" (Channel ID: ${message.channel.id}), and the message successfully deleted.`);
    console.log(`[LOG (Info)]: "${message.client.user.tag}" (Client ID: ${message.client.user.id}) just deleted "${message.author.tag}" (User ID: ${message.author.id}) message for bad words reasons.`);
  }
});

client.on('guildMemberAdd', (member) => {
  const channel = member.guild.channels.cache.get('716421095737262110');
  if (!channel) return;
  channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor('DarkPurple')
        .setTitle(`${client.emotes.in} | In`)
        .setDescription(`Welcome, **${member.user.tag}**! ${client.emotes.wave}\nWe're hoping you enjoy your stay.`)
    ]
  });
  console.log(`${member.user.tag} (${member.user.id}) just joined to ${member.guild.name} (${member.guild.id}).`);
});

client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.get('1090548139280302096');
  channel.setName(`Total Members: ${member.guild.memberCount}`);
  console.log(`[LOG (Info)]: "${member.user.tag}" (User ID: ${member.user.id}) just joined to "${member.guild.name}" (Guild ID: ${member.guild.id}), and the server now has "${member.guild.memberCount}" members.`);
});

client.on('guildMemberRemove', (member) => {
  const channel = member.guild.channels.cache.get('716421095737262110');
  if (!channel) return;
  channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor('DarkPurple')
        .setTitle(`${client.emotes.out} | Out`)
        .setDescription(`We're sorry to see you go! Goodbye, **${member.user.tag}**! ${client.emotes.wave}`)
    ]
  });
  console.log(`[LOG (Info)]: "${member.user.tag}" (User ID: ${member.user.id}) just left from "${member.guild.name}" (Guild ID: ${member.guild.id}).`);
});

client.on('guildMemberRemove', member => {
  const channel = member.guild.channels.cache.get('1090548139280302096');
  channel.setName(`Total Members: ${member.guild.memberCount}`);
  console.log(`[LOG (Info)]: "${member.user.tag}" (User ID: ${member.user.id} just left from "${member.guild.name}" (Guild ID: ${member.guild.id}), and the server now has "${member.guild.memberCount}" members.`);
});

client.login(process.env.TOKEN);
