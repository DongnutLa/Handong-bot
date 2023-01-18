import { AudioPlayerStatus } from "@discordjs/voice";
import { Guild } from "discord.js";
import { Song } from "src/interfaces";
import { getYTResource } from "../utils/getResource";
import { queue } from "./execute";

export async function play(guild: Guild, song: Song) {
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
