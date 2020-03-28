module.exports.execute = async (message) => {
    const embedMessage = new Discord.RichEmbed()
        .setColor('#3486eb')
        .setTitle('Wanna contribute to Horace?')
        .addField('Come checkout my Github!', 'https://github.com/Knights-Of-Academia/horace')
        .addField('How to help', 'Contribute code or report issues, anything helps!')
        .setFooter(`Requested by ${message.author.username}`)
    message.channel.send(embedMessage)
}