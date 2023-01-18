import { Message } from "discord.js";
import { QueueContract } from "src/interfaces";
import playYt from "play-dl";
import { PlaylistGuild } from "../db/schemas";

export async function playlistSave(
  message: Message<boolean>,
  serverQueue: QueueContract
) {
  const args = message.content.split(" ");

  const playlistInfo = await playYt.playlist_info(args[1], {
    incomplete: true,
  });

  const playlist = await PlaylistGuild.findOne({
    guildId: message.guild.id,
    playlistId: playlistInfo.id,
  });

  if (!playlist) {
    const playlistGuild = new PlaylistGuild({
      playlistId: playlistInfo.id,
      url: playlistInfo.url,
      title: playlistInfo.title,
      guildId: message.guild.id,
      customName: args[2],
    });

    await playlistGuild.save();
  } else {
    await playlist.updateOne({
      title: playlistInfo.title,
      updatedAt: new Date(),
    });
  }

  return message.channel.send(
    `Playlist ${playlistInfo.title} guardada como ${args[2]}!`
  );
}
