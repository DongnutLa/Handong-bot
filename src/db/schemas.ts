import { model, Schema } from "mongoose";

const playlistGuildSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  playlistId: {
    type: String,
    required: true,
  },
  customName: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

export const PlaylistGuild = model("PlaylistGuild", playlistGuildSchema);
