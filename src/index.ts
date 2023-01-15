import * as dotenv from "dotenv";
import { Client, Partials } from "discord.js";

import { queue } from "./functions";
import { QueueContract } from "./interfaces";
import { INTENTS, PREFIX, COMMANDS } from "./utils/constants";
import { actions } from "./utils/actions";
dotenv.config();

const token = process.env.TOKEN;

//Create client and login with token
const client = new Client({
  intents: INTENTS,
  partials: [Partials.Channel, Partials.Message],
});
client.login(token);

// Add listeners
client.once("ready", () => {
  console.log("Ready!");
});
client.once("reconnecting", () => {
  console.log("Reconnecting!");
});
client.once("disconnect", () => {
  console.log("Disconnect!");
});

// Read messages
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const serverQueue: QueueContract = queue.get(message.guild.id);

  const command = message.content.split(" ")[0];

  if (!Object.values(COMMANDS).includes(command)) {
    message.channel.send("¡Hey, no reconozco ese comando!");
  }

  actions[command](message, serverQueue);
});
