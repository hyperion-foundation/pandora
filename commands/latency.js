const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('latency')
    .setDescription('Checking the Roundtrip Latency & WebSocket connection in miliseconds'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Measuring...', fetchReply: true });
    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor('DarkPurple')
          .setDescription(`Client: \`${sent.createdTimestamp - interaction.createdTimestamp}\` ms\nWebSocket: \`${interaction.client.ws.ping}\` ms`)
      ]
    });
  }
};