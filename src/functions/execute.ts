import { Message } from "discord.js";
import playYt from "play-dl";
import { createConnection } from "../utils/createConnection";
import { QueueContract } from "../interfaces";
import { play } from "./play";

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

  const queueContract = createConnection(message, [song]) as QueueContract;
  play(message.guild, queueContract.songs[0]);
}
