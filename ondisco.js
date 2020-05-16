const Discord = require("discord.js");
const bot = new Discord.Client();
const 
    comands  = require("./src/comands/comands");
    config = require("./config.json");
    express = require("express");
    port = process.env.PORT || 23011;
    token = (config.token)? config.token : process.env.TOKEN;
    prefix = (config.prefix)? config.prefix : process.env.PREFIX ;

bot.on("ready", () => {
    console.log(`Bot Online, com ${bot.users.cache.size} usuários, ${bot.channels.cache.size} canais e ${bot.guilds.cache.size} servidores.`);
});

bot.on("presenceUpdate", async () => {
    const temporaria = "Digite !dhelp para mais informações.";
    bot.user.setActivity('Bot em desenvolvimento para nova versão');
});

bot.on("guildCreate", guild => {
    console.log(`O bot entrou  no servidor: ${guild.name} (id ${guild.id}). população: ${guild.memberCount} membros.`);
    bot.user.setActivity(`Estou em ${bot.guilds.cache.size} servidores`);
});

bot.on("guildDelete", guild => {
    console.log(`O bot foi removido do servidor: ${guild.name} \nid: ${guild.id}`);
});

bot.on("guildMemberAdd", async newmember => {
    // canal = bot.channels.get('622940693022638090');
    // guild = bot.guilds.get('565566718446141450');
    // if (newmember.guild !== guild) return;
    // if (newmember.user === bot.user.bot) return;
    
    // let embed = new Discord.MessageEmbed();
    // embed.setTitle(newmember.user.tag)
    //     .setColor("#FFF100")
    //     .setTimestamp(canal.createdTimestamp)
    //     .setThumbnail(newmember.user.displayAvatarURL)
    //     .setDescription("**Você entrou no servidor:** **``" + newmember.guild.name + "``** \n**Com você temos:** **``" + newmember.guild.memberCount + "`` membros 🥳**")
    //     .setImage("https://cdn.dribbble.com/users/1029769/screenshots/3430845/hypeguy_dribbble.gif")
    //     .setFooter(bot.user.username, bot.user.avatarURL());

    // canal.send(` Bem vindo(a) !  \\😃  <@${newmember.user.id}>`, embed);
});

bot.on('message', async message => {
   
    if (message.author.bot || message.channel.type === "dm") return;

    const
        embedHelp = new Discord.MessageEmbed()
        .setColor("#B955D4")
        .setTimestamp(message.createdTimestamp)
        .setFooter(bot.user.username, bot.user.avatarURL());

        embedSong = new Discord.MessageEmbed()
        .setColor("#B955D4")
        .setTimestamp(message.createdTimestamp)
        .setFooter(bot.user.username, bot.user.avatarURL());
            
    if (message.content === "<@!617522102895116358>" || message.content === "<@617522102895116358>") {

        embedSong
            .setTitle(`Olá ${message.author.username}! \nMeu nome é Ondisco logo a baixo tem minha descrição:`)
            .setDescription("**prefixo:** **``!d``** \n **função do Ondisco:** **``Divertir os usuarios do Discord tocando músicas nos canais de voz``** \n **Criador do Ondisco:** **``Marcio#1506``**")
        message.channel.send(embedSong);
    }
    if (!message.content.startsWith(prefix)) return;
    const 
        mentionUser = message.mentions.users.first();
        memberMentions = message.guild.member(mentionUser);
        args = message.content.slice(prefix.length).trim().split(/ +/g);
        req = args.shift().toLowerCase();
    

   let  messageProps = {
        embedHelp: embedHelp,
        embedSong: embedSong,
        message: message,
        args: args,
        voiceChannel: message.member.voice.channel,
        bot: bot,
        mentionUser: mentionUser,
        memberMentions: memberMentions,
    }

    const func_comands = {

        "avatar": () => comands.avatar(messageProps),

        "help": () => comands.help(messageProps),

        "play": () => comands.play(messageProps),

        "leave": () => comands.leave(messageProps),

        "pause": () => comands.pause(messageProps),

        "back": () => comands.back(messageProps),

        "stop": () => comands.stop(messageProps),

        "vol": () => comands.vol(messageProps),

        "skip": () => comands.skip(messageProps)
    }

    if (func_comands[req]) func_comands[req]();

    

});

express().listen(port);
bot.login(token);
