/**
   * Created By Usep.
   * Follow https://github.com/myname31
   
   * Function By https://github.com/BochilGaming/games-wabot-md
   * Function By https://github.com/DikaArdnt/Hisoka-Morou
*/



const {
    
   jidDecode,
    
   proto

} = (await import('@adiwajshing/baileys')).default

import axios from 'axios';

import fs from 'fs';

import path from 'path';

import fetch from 'node-fetch';

import { fileTypeFromBuffer } from 'file-type';

import { fileURLToPath } from 'url'

import { toAudio, toPTT, toVideo, } from './_converter.js';



const __dirname = path.dirname(fileURLToPath(import.meta.url))



// getBuffer //

export async function getBuffer(url, options) {
	
try {
		
options ? options : {}
		
const res = await axios({
			
method: "get",
			
url,
			
headers: {
				
'DNT': 1,
				
'Upgrade-Insecure-Request': 1
			
},
			
...options,
			
responseType: 'arraybuffer'
		
})
		
return res.data
	
} catch (err) {
		
return err
	
}

}



// fetchJson //

export async function fetchJson(url, options) {
    
try {
        
options ? options : {}
        
const res = await axios({
            
method: 'GET',
            
url: url,
            
headers: {
                
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            
},
            
...options
        
})
        
return res.data
    
} catch (err) {
        
return err
    
}

}



export async function smsg(conn, m, store) {

// decodejid //

conn.decodeJid = (jid) => {

if (!jid) return jid
if (/:\d+@/gi.test(jid)) {

let decode = jidDecode(jid) || {}

return decode.user && decode.server && decode.user + '@' + decode.server || jid

} else return jid

}


// getfile //

conn.getFile = async (PATH, returnAsFilename) => {
        
let res, filename
        
let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        
if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
        
let type = await fileTypeFromBuffer(data) || {
            
mime: 'application/octet-stream',
            
ext: '.bin'
        
}
        
if (data && returnAsFilename && !filename) (filename = path.join(__dirname, '../tmp/' + new Date * 1 + '.' + type.ext), 
await fs.promises.writeFile(filename, data))
        
return {
            
res,
            
filename,
            
...type,
            
data
        
}

}


// sendfile //

conn.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
        
let type = await conn.getFile(path, true)
        
let { res, data: file, filename: pathFile } = type
        
if (res && res.status !== 200 || file.length <= 65536) {
            
try { 
throw { 
json: JSON.parse(file.toString()) 
} 
}
catch (e) { 
if (e.json) throw e.json 
}
        
}
        
let opt = { filename }
        
if (quoted) opt.quoted = quoted
        
if (!type) if (options.asDocument) options.asDocument = true
        
let mtype = '', mimetype = type.mime
        
if (/webp/.test(type.mime)) mtype = 'sticker'
        
else if (/image/.test(type.mime)) mtype = 'image'
        
else if (/video/.test(type.mime)) mtype = 'video'
        
else if (/audio/.test(type.mime)) (
            
convert = await (ptt ? toPTT : toAudio)(file, type.ext),
            
file = convert.data,
            
pathFile = convert.filename,
            
mtype = 'audio',
            
mimetype = 'audio/ogg; codecs=opus'
        
)
        
else mtype = 'document'
        
return await conn.sendMessage(jid, {
            
...options,
            
caption,
            
ptt,
            
[mtype]: { 
url: pathFile 
},
            
mimetype
        
}, {
            
ephemeralExpiration: 86400,
            
...opt,
            
...options
        
})

}    
// ============================================= //

}