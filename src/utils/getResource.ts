import { AudioResource, createAudioResource } from "@discordjs/voice";
import { Song } from "../interfaces";
import playYt from "play-dl";

export async function getYTResource(song: Song): Promise<AudioResource<null>> {
  const stream = await playYt.stream(song.url);

  return createAudioResource(stream.stream, {
    inputType: stream.type,
    inlineVolume: true,
  });
}
