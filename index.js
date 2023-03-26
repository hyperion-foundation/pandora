require('dotenv').config();
const Discord = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const config = require('./config.json');
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.config = require('./package.json');
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
  console.log(`${client.user.username} is ready to go!`);
  client.user.setPresence({ activities: [{ name: '/help' }], status: 'idle' });
});
client.on('debug', console.log);

client.on(Discord.Events.InteractionCreate, async interaction => {
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

client.on('guildMemberAdd', (member) => {
  const channel = member.guild.channels.cache.get('716421095737262110');
  if (!channel) return;
  channel.send({
    embeds: [
      new Discord.EmbedBuilder()
        .setColor('DarkPurple')
        .setTitle(`${client.emotes.in} | In`)
        .setDescription(`Welcome, ${member.user.username}! We're hoping you enjoy your stay.`)
    ]
  });
  console.log(`${member.user.tag} (${member.user.id}) just joined to ${member.guild.name} (${member.guild.id}).`);
});

client.on('guildMemberRemove', (member) => {
  const channel = member.guild.channels.cache.get('716421095737262110');
  if (!channel) return;
  channel.send({
    embeds: [
      new Discord.EmbedBuilder()
        .setColor('DarkPurple')
        .setTitle(`${client.emotes.out} | Out`)
        .setDescription(`We're sorry to see you go! Goodbye, ${member.user.username}!\nReason: \`Leave with their own decision (Non-administrative)\``)
    ]
  });
  console.log(`${member.user.tag} (${member.user.id}) just left from ${member.guild.name} (${member.guild.id}).`);
});

client.login(process.env.TOKEN);
