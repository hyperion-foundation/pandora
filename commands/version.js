const pkg = require('../package.json');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('version')
    .setDescription('Checking the version of the bot'),
  async execute(interaction) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('DarkPurple')
          .setDescription(`**Project Name**: \`${pkg.name}\`\n**Bot Version**: \`v${pkg.version}\`\n**Author**: \`${pkg.author}\``)
      ]
    });
  }
};