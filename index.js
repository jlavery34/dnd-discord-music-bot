const { Client, GatewayIntentBits } = require('discord.js');
const { join } = require('path');
require('dotenv').config();
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const token = process.env.BOT_TOKEN;
let connection;
const criticalRole = "./songs/criticalrole_downtime.m4a";
const skyrim = "./songs/skyrim.m4a";
const witcher = "./songs/witcher_downtime.m4a";

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates]
  });

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('messageCreate', async (message) => {
    var songPath;
    if (message.content.startsWith('!play')) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('You need to be in a voice channel to use this command.');
        }
        if(message.content.toLowerCase().includes("skyrim")){
            songPath = skyrim;
        }
        else if (message.content.toLowerCase().includes("critical role")){
            songPath = criticalRole;
        }
        else if (message.content.toLowerCase().includes("witcher")){
            songPath = witcher;
        }
        else{
            songPath = skyrim;
        }
        try {
            if (message.member.voice.channel) {
                connection = joinVoiceChannel({
                  channelId: message.member.voice.channel.id,
                  guildId: message.guild.id,
                  adapterCreator: message.guild.voiceAdapterCreator,
                  selfDeaf: false,
                });
              }
            const resourcePath = join(__dirname, songPath);
            const resource = createAudioResource(resourcePath);
            player = createAudioPlayer();
            player.play(resource);
            connection.subscribe(player);
            player.on('error', (error) => {
                play(connection);
                console.error('Error playing audio:', error.message);
            });
        } catch (error) {
            console.error('Error joining voice channel:', error.message);
        }
    }
    else if (message.content.startsWith('!stop')) {
        player.stop();
        connection.destroy();
      } 
});

client.login(token);
