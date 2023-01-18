import { joinVoiceChannel, createAudioPlayer } from "@discordjs/voice";
import { Message } from "discord.js";
import { queue } from "../functions";
import { QueueContract, Song } from "src/interfaces";

export const createConnection = (message: Message<boolean>, songs: Song[]) => {
  const voiceChannel = message.member.voice.channel;

  // Creating contract for queue
  const queueContract: QueueContract = {
    textChannel: message.channel,
    voiceChannel: voiceChannel,
    connection: null,
    songs: [],
    volume: 5,
    playing: true,
    player: null,
    resource: null,
  };

  //Setting the queue using our contract
  queue.set(message.guild.id, queueContract);

  // Setting the queue using our contract
  queueContract.songs = songs;

  try {
    // Try to join voice chat and save connection
    const connection = joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });
    const player = createAudioPlayer();

    queueContract.connection = connection;
    queueContract.player = player;

    return queueContract;
  } catch (error) {
    console.error(error);
    queue.delete(message.guild.id);
    return message.channel.send(error);
  }
};
