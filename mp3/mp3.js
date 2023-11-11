const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const fetch = require('node-fetch');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegStatic);
const prefix = '.';

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildBans,
        Discord.GatewayIntentBits.GuildEmojisAndStickers,
        Discord.GatewayIntentBits.GuildWebhooks,
        Discord.GatewayIntentBits.GuildInvites,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildMessageTyping,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.DirectMessageReactions,
        Discord.GatewayIntentBits.DirectMessageTyping
    ],
    partials: [
        Discord.Partials.User,
        Discord.Partials.Channel,
        Discord.Partials.GuildMember,
        Discord.Partials.Message,
        Discord.Partials.Reaction,
        Discord.Partials.GuildScheduledEvent,
        Discord.Partials.ThreadMember
    ], 
    allowedMentions:{
        repliedUser: false,
        parse: ['users','roles','everyone']
    },
    presence: {
        activities: [
            {
                name: `null 💛 mp3`,
            }
        ],
           status: "idle",
           
    },
});

client.on('ready', () => {
    console.log('Hello World.');
});
client.on('messageCreate', async (message) => {
    if (message.content.startsWith(prefix)) {
        if (message.author.bot) return;
        const args = message.content.slice(prefix.length).trim().split(' ');
        const command = args.shift().toLowerCase();

        if (command === 'yt') {
            const url = message.content.split(' ')[1];
            if (!ytdl.validateURL(url)) {
                return message.reply('Lütfen geçerli bir YouTube bağlantısı sağlayın.');
            }

            try {
                const stream = ytdl(url, { filter: 'audioonly' });
                const info = await ytdl.getInfo(url);
                const title = info.videoDetails.title;
                
                ffmpeg(stream)
                    .audioBitrate(128)
                    .save(`${title}.mp3`)
                    .on('end', async () => {
                        const attachment = new Discord.AttachmentBuilder(`${title}.mp3`);
                        await message.reply({ content: `İşte mp3 dosyası olarak şarkınız:`, files: [attachment] });
                    });
            } catch (error) {
                console.error(error);
                message.reply('Şarkıyı indirip dönüştürmeye çalışırken bir hata oluştu.');
            }
        }
    }
});

client.login('TOKEN');
