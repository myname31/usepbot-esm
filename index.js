/** 
    * Created By Usep.
    * Function By https://github.com/BochilGaming/games-wabot-md
    * Follow https://github.com/myname31
*/

import './worker/lib/global.js';
const { 
      default: makeWASocket,
      useMultiFileAuthState, 
      fetchLatestBaileysVersion, 
      DisconnectReason,
      makeInMemoryStore,
      proto
} = (await import('@adiwajshing/baileys')).default
import pino from 'pino';
import { banner } from './worker/lib/banner.js';
import db, { loadDatabase } from './worker/lib/database.js';
// Feature //
import usep from './worker/conn.js';

// store //
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
// Database //
if (db.data == null) loadDatabase()
setInterval(async () => {
if (db.data) await db.write().catch(console.error)
}, 60 * 1000) // 1minutes

async function __startConnect() {
console.log(banner.string)
const { state, saveCreds } = await useMultiFileAuthState('./session')
const { version, isLatest } = await fetchLatestBaileysVersion()
  const conn = makeWASocket({
  logger: pino({ level: 'silent' }),
  printQRInTerminal: true,
  browser: ['Usep Bot Esm', 'Edge', '1.0.0'],
  auth: state,
  version
})

store.bind(conn.ev)

conn.ev.process(async (events) => {
// connect close //
if (events['connection.update']) {
const update = events['connection.update']
const { connection, lastDisconnect } = update    
if (connection == 'close') {      
lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut ? __startConnect() : console.log('connection closed')  
}  
console.log('connection update', update)
}
// savestate //
if (events['creds.update']) {
await saveCreds()
}
// command //
if (events['messages.upsert']) {
try {
const upsert = events['messages.upsert']
if (upsert.type === 'notify') {
for (let mek of upsert.messages) {
usep(conn, mek, store)
}
}
} catch (err) {
console.log(err)
}
}
})
return conn
}
__startConnect()