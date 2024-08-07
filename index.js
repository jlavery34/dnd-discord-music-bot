const { Client, GatewayIntentBits } = require('discord.js');
const { join } = require('path');
require('dotenv').config();
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const token = process.env.BOT_TOKEN; //create a file called .env with the text "BOT_TOKEN = replace-with-your-token" and paste in your token from the discord developer portal
let connection;

//save songs to a folder titled /songs/ within this project's folder
const criticalRole = "./songs/criticalrole_downtime.m4a";
const skyrim = "./songs/skyrim.m4a";
const witcher = "./songs/witcher_downtime.m4a";
const eso = "./songs/eso_lucky_cat_landing.m4a"
const bg3 = "./songs/raphaels_final_act.m4a"
const oblivion = "./songs/oblivion.m4a";
const rosymorn = "./songs/rosymorn_monastery.m4a";
//then add them to the if statements in the client.on method below

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates]
  });

client.once('ready', () => {
    console.log(`${client.user.tag} is online!`);
});

client.on("voiceStateUpdate", (oldState, newState) => {
  const voiceChannel = oldState.channel || newState.channel;
  if (voiceChannel && voiceChannel.members.size === 0) {
      voiceChannel.connection.disconnect();
  }
});


client.on('messageCreate', async (message) => {
    var songPath;
    if (message.content.startsWith('!play')) {
        //update below with the song paths defined above
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('You need to join a voice channel to play music');
        }

        //should probs tidy this into a switch case now that it's getting long
        if(message.content.toLowerCase().includes("skyrim")){
            songPath = skyrim;
        }
        else if (message.content.toLowerCase().includes("critical role")){
            songPath = criticalRole;
        }
        else if (message.content.toLowerCase().includes("witcher")){
            songPath = witcher;
        }
        else if (message.content.toLowerCase().includes("elder scrolls")){
            songPath = eso;
        }
        else if(message.content.toLowerCase().includes("baldurs gate") || message.content.toLowerCase().includes("baldur's gate")){
          songPath = bg3;
        }
        else if(message.content.toLowerCase().includes("oblivion")){
          songPath = oblivion;
        }
        else if(message.content.toLowerCase().includes("rosymorn")){
          songPath = rosymorn;
        }
        else{
          message.reply("Song not found. Enter !help to see the full track list. Playing default track (Skyrim)...");
            songPath = skyrim; //set a default here as well in case someone just enters !play without another song
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
      else if (message.content.startsWith('!pause')) {
        if (player.state.status !== AudioPlayerStatus.Paused) {
          player.pause();
        } else {
          message.reply('The player is already paused.');
        }
      }
      else if (message.content.startsWith('!resume')) {
        if (player.state.status === AudioPlayerStatus.Paused) {
          player.unpause();
        } else {
          message.reply('The player is not paused.');
        }
      }  
      //finally, update the help message with the song options
      else if (message.content.startsWith('!help')) {
        message.reply(
`Play a song: !play + song
Songs from:
- Skyrim
- Witcher
- Critical Role
- Elder Scrolls Online
- Baldur's Gate
- Oblivion
- Rosymorn Monastery
Stop the player: !stop
Help message: !help`
        )
      }
});




//then start the bot with "node index.js" in vscode or with "pm2 start index.js" to have it running full-time on a raspberry pi
client.login(token);
