import { Message } from "discord.js";
import { QueueContract } from "src/interfaces";
import playYt from "play-dl";
import { PlaylistGuild } from "../db/schemas";
import { createConnection } from "../utils/createConnection";
import { play } from "./play";

export async function playlist(
  message: Message<boolean>,
  serverQueue: QueueContract
) {
  const args = message.content.split(" ");

  const playlistSelected = await PlaylistGuild.findOne({
    guildId: message.guild.id,
    customName: args[1],
  });

  const playlistInfo = await playYt.playlist_info(playlistSelected.url, {
    incomplete: true,
  });
  const playlistSongs = await playlistInfo.all_videos();

  const songs = playlistSongs.map((song) => ({
    title: song.title,
    url: song.url,
  }));

  const queueContract = createConnection(message, songs) as QueueContract;
  play(message.guild, queueContract.songs[0]);
}
