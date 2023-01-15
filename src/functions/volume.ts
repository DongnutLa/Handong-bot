import { Message } from "discord.js";
import { QueueContract } from "src/interfaces";

export function volume(message: Message<boolean>, serverQueue: QueueContract) {
  if (!serverQueue || !serverQueue.connection)
    return message.channel.send(
      "¡Primero asegúrate de reproducir alguna canción!"
    );

  let volume = +message.content.split(" ")[1];

  if (volume > 100)
    return message.channel.send("Hey, Te vas a quedar sin oídos!");

  if (volume >= 0 && volume <= 100) {
    volume = volume / 100;
    if (volume === 0) message.channel.send("Acabas de silenciarme... :c");
    return serverQueue.resource.volume.setVolumeLogarithmic(volume);
  } else {
    return message.channel.send("¿Qué volúmen se supone que deba poner?");
  }
}
