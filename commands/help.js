const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Showing list of available commands'),
  async execute(interaction) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('DarkPurple')
          .setTitle(`${interaction.client.user.username} Commands`)
          .setDescription(`${interaction.client.user.username} have a several commands that can be interacted. Not all commands can be used by regular member, there are some commands that needs **special permissions**.\n\n**Moderation Command**\n\`/ban\` (Keeping the server clean from bad members by banning them)\n\n**General Commands**\n\`/help\` (Showing list of available commands)\n\`/latency\` (Checking the Roundtrip Latency & WebSocket connection in miliseconds)\n\n**Miscellaneous Commands**\n\`/version\` (Checking the version of the bot)`)
      ]
    }) && console.log(`${interaction.user.tag} (${interaction.user.id}) just used the /help command.`);
  }
};