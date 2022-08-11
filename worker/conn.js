/** 
    * Created By Usep.
    * Function By https://github.com/BochilGaming/games-wabot-md
    * Follow https://github.com/myname31
*/

import { watchFile, unwatchFile } from 'fs';
import { fileURLToPath } from 'url';
import util from 'util';
import chalk from 'chalk';
import Helper from './lib/helper.js';
import db, { loadDatabase } from './lib/database.js';
import { smsg, getBuffer, fetchJson } from './lib/simple.js';
export default async function usep(conn, mek, store) {
try {
const from = mek.key.remoteJid
const type = Object.keys(mek.message)[0]
const body = (type === 'conversation' && mek.message.conversation) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'documentMessage') && mek.message.documentMessage.caption ? mek.message.documentMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text ? mek.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') && mek.message.buttonsResponseMessage.selectedButtonId ? mek.message.buttonsResponseMessage.selectedButtonId : (type == "templateButtonReplyMessage" && mek.message.templateButtonReplyMessage.selectedId) ? mek.message.templateButtonReplyMessage.selectedId : ''
const budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
const prefix = /^[°•π÷×¶∆£¢€¥®™✓=|~zZ+×_*!#%^&./\\©^]/.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™✓=|~xzZ+×_*!#,|`÷?;:%^&./\\©^]/gi) : '.'
const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
const isCmd = body.startsWith(prefix)
const isGroup = from.endsWith('@g.us')
const args = body.trim().split(/ +/).slice(1)
const text = args.join(' ')
const m = smsg(conn, mek, store)
const sender = isGroup ? (mek.key.participant ? mek.key.participant : mek.participant) : mek.key.remoteJid
const isOwner = [conn.user.id, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(sender)
const banChats = false
// Public & Self
if (!banChats) {
if (!mek.key.fromMe) return
}
const reply = (teks) => {
conn.sendMessage(from, { text: teks }, { quoted: mek })
}
switch (true) {
case /^(cek)$/i.test(command):
conn.sendMessage(from, { text: 'Tes' }, { quoted: mek })
break
default:
// Eval //
if (budy.startsWith('>')) {
if (!isOwner) return 
try {
let evaled = await eval(budy.slice(2))
if (typeof evaled !== 'string') evaled = util.inspect(evaled)
await reply(evaled)
} catch (err) {
await reply(String(err))
}
}
///////////////
}
} catch (e) {
console.log(e)
}
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'conn.js'"))
  import(`${file}?update=${Date.now()}`)
})