import { Message } from "discord.js";
import { QueueContract } from "src/interfaces";

export function stop(message: Message<boolean>, serverQueue: QueueContract) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Debes estar en un canal de voz para detener la música!"
    );

  if (!serverQueue)
    return message.channel.send("No hay una canción que pueda detener!");

  serverQueue.songs = [];
  serverQueue.player.stop(true);
}
