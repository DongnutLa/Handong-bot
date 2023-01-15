import { Message } from "discord.js";
import { QueueContract } from "src/interfaces";

export function skip(message: Message<boolean>, serverQueue: QueueContract) {
  if (!message.member.voice.channel)
    return message.channel.send("Hey, Debes estar en un canal de voz!");
  if (!serverQueue)
    return message.channel.send("No hay una canción que pueda saltar!");
  serverQueue.player.stop(true);
}
