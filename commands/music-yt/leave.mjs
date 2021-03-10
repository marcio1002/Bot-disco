const command = {
  name: "ytl",
  description: "Saí do canal de voz.",
  execute([messageProps,]) {
    const { voiceChannel, conn, broadcast } = messageProps

    if (!voiceChannel || !conn || !broadcast) return

    broadcast.end()
    conn.disconnect()

  }
}


export default command