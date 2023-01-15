import {
  joinVoiceChannel,
  createAudioPlayer,
  AudioPlayerStatus,
} from "@discordjs/voice";
import { Guild, Message } from "discord.js";
import playYt from "play-dl";
import { QueueContract, Song } from "../interfaces";
import { getYTResource } from "../utils/getResource";

export const queue = new Map<string, QueueContract>();

export async function execute(
  message: Message<boolean>,
  serverQueue: QueueContract
) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "¡Debes estar en un canal de voz para poner música!"
    );

  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("Connect") || !permissions.has("Speak")) {
    return message.channel.send(
      "¡Necesito permisos para unirme y hablar en tu canal de voz!"
    );
  }

  const songInfo = await playYt.video_info(args[1]);
  const song = {
    title: songInfo.video_details.title,
    url: songInfo.video_details.url,
  };

  if (serverQueue && serverQueue.songs.length) {
    serverQueue.songs.push(song);
    console.log(serverQueue.songs.map((song) => song.title));
    return message.channel.send(`He agregado ${song.title} a la cola~`);
  }

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
  queueContract.songs.push(song);

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

    // Call play function to start a song
    play(message.guild, queueContract.songs[0]);
  } catch (error) {
    console.log(error);
    queue.delete(message.guild.id);
    return message.channel.send(error);
  }
}

async function play(guild: Guild, song: Song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.connection.disconnect();
    serverQueue.textChannel.send(`No pude reproducir esta canción :(`);
    queue.delete(guild.id);
    return;
  }

  const resource = await getYTResource(song);
  resource.volume.setVolumeLogarithmic(1);
  serverQueue.resource = resource;

  serverQueue.player.play(resource);

  serverQueue.player.on(AudioPlayerStatus.Idle, async (oldState, newState) => {
    serverQueue.songs.shift();
    if (!!serverQueue.songs[0]) {
      const newResource = await getYTResource(serverQueue.songs[0]);
      serverQueue.player.play(newResource);
    }
  });

  serverQueue.connection.subscribe(serverQueue.player);
  serverQueue.textChannel.send(`Reproduciendo: ${song.title}`);
}
