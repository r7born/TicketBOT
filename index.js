/* POR FAVOR NÃO REMOVA OS CRÉDITOS, É O MINIMO QUE PODE FAZER NÉ ? */
const Eris = require("eris");
const axios = require('axios')
const config = require('./config.json')

const bot = new Eris(config.token)
const options = {debug: false,invalidClientInstanceError: true,ignoreRequestErrors: false};

const ErisComponents = require('eris-components');
const eClient = ErisComponents.Client(bot, options);

bot.on('ready',() => {
    console.log('BOT ON => By: JotaP#1445');
})

bot.on("messageCreate", async (msg) => {

    if (!msg.content.startsWith(config.prefix)) return;
    const Message = msg.content.split(" ")
    const cmd = Message[0].replace(config.prefix, "")

    if(cmd == "createticket"){
        if(config.owner == msg.author.id){
            bot.createMessage(msg.channel.id,{embed:{
                title: "Ticket",
                description: "Está com algum probléma ou dúvida?\n pressione no botão verde abaixo para entrar em contato com um dos nossos suportes!",
                color: 0x7289DA,
                footer: {text:"Ticket - JotaDev"}
            },
            components:[{
                type: 1,
                components:[{
                    type:2,
                    label:"❔ Abrir Ticket",
                    style:3,
                    custom_id: "open-ticket"
                }]
            }]
        })
        }
    }
})

bot.on('interactionCreate', (response) =>{

    if(response.data.custom_id == "open-ticket"){
        axios.post(`https://discord.com/api/v8/interactions/${response.id}/${response.token}/callback`,{type:7,data:{}})
        const TicketID = Math.floor(Math.random()*(999-100+1)+100)
        const GuildID = response.guild_id
            bot.createChannel(GuildID,`ticket-0${TicketID}`,0,{
                permissionOverwrites: [
                {
                    id: response.member.user.id,
                    type:1,
                    allow: 3072
                },
                {
                    id: GuildID,
                    type:0,
                    deny: 1024

                }
            ],
            type: 'text',
        }).then(async (channel) =>{

        return bot.createMessage(channel.id, {
            embed: {
                title: "Ticket",
                description: "Aguarde até que um dos atendentes te responda \nSe sua solicitação foi resolvida por favor clique no botão verde abaixo",
                color: 0x7289DA,
                footer: {text:'Ticket - JotaDev'},
                timestamp: new Date()
            },
            "components": [{
                "type":1,
                "components":[{
                    "type":2,
                    "label":"🔒 Close",
                    "style":2,
                    "custom_id":"close-ticket"
                }]
            }]
        })
    })
    }else if(response.data.custom_id == "close-ticket"){

        axios.post(`https://discord.com/api/v8/interactions/${response.id}/${response.token}/callback`,{type:7,data:{components:[]}})

        setTimeout(() => {
            bot.deleteChannel(response.channel_id,'Closed-ticket')
        }, 10000);

        bot.createMessage(response.channel_id,
            {embed:{
            title: "Ticket Encerrado",
            description: "Seu ticket foi encerrado e será apagado em 10 segundos\nCaso necessite de ajude novamente, você pode solicitar outro!.",
            color:0x7289DA,
            timestamp: new Date(),
            footer: {text:"Ticket - JotaDev"} 
        }})
    }
})
bot.connect()