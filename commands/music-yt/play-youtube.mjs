import search from "../../modules/search_yt.mjs"
import { reproduce } from "../../modules/ytStateSong.mjs"
import permissionVoiceChannel from "../../modules/permissionVoiceChannel.mjs"

const prefix = process.env.PREFIX
let result

const command = {
  name: "ytp",
  description: "Reproduz a música ou adiciona na fila.",
  execute(useProps) {
    const { args, message: { channel, author } } = useProps[0]
    if (!permissionVoiceChannel(useProps)) return

    if (args.length == 0) return channel.send(`<@${author.id}>, digite o título da música ou a url.\n\`${prefix}${this.name}\` **título** ou **url**`)

    if (/(https|http):\/\/(www\.)?(.)+/.test(args.join(" ").toLowerCase()))
      this.ytUrl(useProps)
    else
      this.ytQuery(useProps)
  },

  async ytUrl(useProps) {
    const [messageProps, useMessageProps] = useProps
    const { voiceChannel, args, songs, message: { channel } } = messageProps
    let msg, match

    match = args.join(" ").match(/(v=|youtu\.be\/)\b(.)+/)

    msg = await channel.send("<a:load:771895739672428594>")

    search({ videoId: match[0].replace(match[1], "") }).then(data => {
      msg.delete()

      songs.set('queues', [...songs.get('queues'), data])

      voiceChannel.join()
        .then(connection => {
          messageProps.conn = connection
          useMessageProps(messageProps)
          reproduce(useProps)
        })
        .catch(_ => console.warn("Erro ao conectar no canal de voz"))

    })
  },

  async ytQuery(useProps) {
    const [messageProps, useMessageProps] = useProps
    const { voiceChannel, args, embed, songs, message: { channel, author } } = messageProps

    let msg, song, next = 10, prev = 0

    msg = await channel.send("<a:load:771895739672428594>")

    search(args.join(" ").toLowerCase()).then(async data => {
      result = data ?? []

      this.listOptions(prev, next).then(async ops => {
        embed
          .setColor("#E62117")
          .setTitle("Selecione a música para reproduzir no canal voz digitando um numero entre ``1`` a ``10``")
          .setDescription(ops);

        msg.edit({ content: "", embed })
        msg.delete({ timeout: 100000 })
        await msg.react('\⬅️')
        await msg.react('\➡️')
      })

      const filterEmjPrev = (reaction, user) => reaction.emoji.name == '\⬅️' && user.id == author.id

      msg
        .awaitReactions(filterEmjPrev, { max: 1, maxEmojis: 1, maxUsers: 1, time: 80000 })
        .then(async _ => {

          embed
            .setColor("#E62117")
            .setTitle("Selecione a música para reproduzir no canal voz digitando um numero entre ``1`` a ``10``")
            .setDescription(await this.listOptions(prev -= 10, next -= 10));

          msg.edit({ content: "", embed })
        })
        .catch(_ => console.log('Não reagiu no emoji prev'))


      const filterEmjNext = (reaction, user) => reaction.emoji.name == '\➡️' && user.id == author.id

      msg
        .awaitReactions(filterEmjNext, { max: 1, maxEmojis: 1, maxUsers: 1, time: 80000 })
        .then(async r => {

          embed
            .setColor("#E62117")
            .setTitle("Selecione a música para reproduzir no canal voz digitando um numero entre ``1`` a ``10``")
            .setDescription(await this.listOptions(prev = next, next += 10));

          msg.edit({ content: "", embed })
        })
        .catch(_ => console.log('Não reagiu no emoji next'))


      const filter = msg => msg.author.id === author.id && !isNaN(Number(msg.content)) || msg.content.toLowerCase() == "cancel"

      msg.channel.awaitMessages(filter, { max: 1, time: 100000 })
        .then(select => {
          if (select.first().content.toLowerCase() === "cancel") return channel.send("Cancelado")

          if (!(song = result.videos[Number(select.first().content) - 1])) return

          songs.set('queues', [...songs.get('queues'), song])

          voiceChannel.join()
            .then(connection => {
              messageProps.conn = connection
              useMessageProps(messageProps)
              reproduce(useProps)
            })
            .catch(_ => console.warn("Erro ao conectar no canal de voz"))
        })
        .catch(_ => console.info("Usuário não escolheu nenhum das opções de busca"))
    })
  },

  async listOptions(pageStart, pageEnd) {
    let option = 0, optionsInfo = []

    result
      .videos
      .forEach(video => {
        option += 1
        optionsInfo.push(`**${option}** ➜  <:youtube:817569761881227315> **\`\`${video.title}\`\`** \n`)
      })

    return optionsInfo.slice(pageStart, pageEnd)

  }

}

export default command