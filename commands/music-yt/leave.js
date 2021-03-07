module.exports = {
  name: "ytl",
  description: "Finaliza a reprodução de audio e saí do canal de voz.",
  execute([messageProps,]) {
    const { voiceChannel, conn, broadcast } = messageProps

    if (!voiceChannel || !conn || !broadcast) return

    broadcast.end()
    conn.disconnect()

  }
}