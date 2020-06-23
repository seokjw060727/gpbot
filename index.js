const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.token;

client.on('ready', () => {
  console.log('봇 켜짐.');
});

client.on('message', (message) => {
  if(message.author.bot) return;

  if(message.content == '!ping') {
    return message.reply('현재 Ping은' + client.ping + 'ms 입니다!');
  }

  if(message.content.startsWith('!공지')) {
    if(checkPermission(message)) return
    if(message.member != null) { // 채널에서 공지 쓸 때
      let contents = message.content.slice('!공지'.length);
      message.member.guild.members.array().forEach(x => {
        if(x.user.bot) return;
        x.user.send(`<${contents}`);
      });
  
      return message.reply('해당공지를 전송했습니다');
    } else {
      return message.reply('채널에서 실행해주세요.');
    }
  }
});

function checkPermission(message) {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send(`<@${message.author.id}> ` + "당신은 서버의 관리자권한이 없습니다.")
    return true;
  } else {
    return false;
  }
}

client.login(token);