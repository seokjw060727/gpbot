const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.token;

client.on('ready', () => {
  console.log('봇 켜짐.');
  client.user.setPresence({ game: { name: '게임페인서버 온라인!' }, status: 'online' })
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

if(message.content.startsWith('!청소')) {
  if(checkPermission(message)) return

  var clearLine = message.content.slice('!청소 '.length);
  var isNum = !isNaN(clearLine)

  if(isNum && (clearLine <= 0 || 100 < clearLine)) {
    message.channel.send("1부터 100까지의 숫자만 입력해주세요.")
    return;
  } else if(!isNum) { // c @나긋해 3
    if(message.content.split('<@').length == 2) {
      if(isNaN(message.content.split(' ')[2])) return;

      var user = message.content.split(' ')[1].split('<@!')[1].split('>')[0];
      var count = parseInt(message.content.split(' ')[2])+1;
      const _limit = 10;
      let _cnt = 0;

      message.channel.fetchMessages({limit: _limit}).then(collected => {
        collected.every(msg => {
          if(msg.author.id == user) {
            msg.delete();
            ++_cnt;
          }
          return !(_cnt == count);
        });
      });
    }
  } else {
    message.channel.bulkDelete(parseInt(clearLine)+1)
      .then(() => {
        AutoMsgDelete(message, `<@${message.author.id}> ` + parseInt(clearLine) + "개의 메시지를 삭제했습니다. (이 메세지는 잠시 후에 사라집니다.)");
      })
      .catch(console.error)
  }
}

function checkPermission(message) {
if(!message.member.hasPermission("MANAGE_MESSAGES")) {
  message.channel.send(`<@${message.author.id}> ` + "명령어를 수행할 관리자 권한을 소지하고 있지않습니다.")
  return true;
} else {
  return false;
}
}

function changeCommandStringLength(str, limitLen = 8) {
let tmp = str;
limitLen -= tmp.length;

for(let i=0;i<limitLen;i++) {
    tmp += ' ';
}

return tmp;
}

async function AutoMsgDelete(message, str, delay = 3000) {
let msg = await message.channel.send(str);

setTimeout(() => {
  msg.delete();
}, delay);
}

client.login(token);