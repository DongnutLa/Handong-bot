import { Message } from "discord.js";
import { COMMANDS } from "./constants";
import { execute, skip, stop, volume } from "../functions";
import { QueueContract } from "src/interfaces";

export const actions: Record<
  string,
  (
    message: Message<boolean>,
    serverQueue: QueueContract
  ) => Promise<Message<false> | Message<true>> | void
> = {
  [COMMANDS.PLAY]: execute,
  [COMMANDS.SKIP]: skip,
  [COMMANDS.STOP]: stop,
  [COMMANDS.VOLUME]: volume,
};
