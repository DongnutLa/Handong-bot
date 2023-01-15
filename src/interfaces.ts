import { AudioPlayer, AudioResource, VoiceConnection } from "@discordjs/voice";
import {
  DMChannel,
  NewsChannel,
  PartialDMChannel,
  PrivateThreadChannel,
  PublicThreadChannel,
  TextChannel,
  VoiceBasedChannel,
  VoiceChannel,
} from "discord.js";

export type QueueContract = {
  textChannel:
    | DMChannel
    | PartialDMChannel
    | NewsChannel
    | TextChannel
    | PrivateThreadChannel
    | PublicThreadChannel<boolean>
    | VoiceChannel;
  voiceChannel: VoiceBasedChannel;
  connection: VoiceConnection | null;
  songs: Song[];
  volume: number;
  playing: boolean;
  player: AudioPlayer | null;
  resource: AudioResource<null>;
};

export type Song = {
  title: string;
  url: string;
};
