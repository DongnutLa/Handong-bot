const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const ytdl = require('ytdl-core');

const { commands } = require('./constants');

//Create client and login with token
const client = new Discord.Client();
client.login(token);

// Add listeners
client.once('ready', () => {
  console.log('Ready!');
 });
 client.once('reconnecting', () => {
  console.log('Reconnecting!');
 });
 client.once('disconnect', () => {
  console.log('Disconnect!');
 });

// Read messages
client.on('message', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  const command = message.content.split(" ")[0];

  switch (command) {
    case commands.PLAY:
      execute(message, serverQueue);
      break;
    case commands.SKIP:
      skip(message, serverQueue);
      break;
    case commands.STOP:
      stop(message, serverQueue);
      break;
    case commands.VOLUME:
      volume(message, serverQueue)
      break;
    default:
      message.channel.send("¡Hey, no entiendo tu español. Háblame en chino!");
      break;
  }

})

const queue = new Map();

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send(
    "¡Debes estar en un canal de voz para poner música!"
  )

  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "¡Necesito permisos para unirme y hablar en tu canal de voz!"
    )
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
  }

  if (!serverQueue) {

  } else {
    serverQueue.songs.push(song);
    console.log(serverQueue.songs);
    return message.channel.send(`He agregado ${song.title} a la cola~`)
  }

  // Creating contract for queue
  const queueContract = {
    textChannel: message.channel,
    voiceChannel: voiceChannel,
    connection: null,
    songs: [],
    volume: 5,
    playing: true,
  }

  //Setting the queue using our contract
  queue.set(message.guild.id, queueContract);
  // Setting the queue using our contract
  queueContract.songs.push(song);

  try {
    // Try to join voice chat and save connection
    var connection = await voiceChannel.join();
    queueContract.connection = connection;

    // Call play function to start a song
    play(message.guild, queueContract.songs[0]);
  } catch (error) {
    console.log(error);
    queue.delete(message.guild.id);
    return message.channel.send(error);
  }
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.log(error));
  
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Ahora te canto: ${song.title}`);
}


function skip(message, serverQueue) {
  if (!message.member.voice.channel) return message.channel.send(
    "Debes estar en un canal de voz para saltar la canción!"
  );
  if (!serverQueue) return message.channel.send(
    "No hay una canción que pueda saltar!"
    );
  serverQueue.connection.dispatcher.end();
}


function stop(message, serverQueue) {
  if (!message.member.voice.channel) return message.channel.send(
    "Debes estar en un canal de voz para detener la música!"
  );

  if (!serverQueue) return message.channel.send(
    "No hay una canción que pueda detener!"
  );

  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}


function volume(message, serverQueue) {
  if(!serverQueue || !serverQueue.connection) return message.channel.send(
    "¡Primero asegúrate de reproducir alguna canción!"
  )

  let volume = +message.content.split(" ")[1];

  if (volume > 100) return message.channel.send(
    "Hey, Te vas a quedar sin oídos!"
  );
  
  if (volume >= 0 && volume <= 100) {
    volume = volume/20;
    if (volume === 0) message.channel.send(
      "Acabas de silenciarme... :c"
    );
    return serverQueue.connection.dispatcher.setVolumeLogarithmic(volume / 5);
  } else {
    message.channel.send("¿Qué volúmen se supone que deba poner?");
  }
}