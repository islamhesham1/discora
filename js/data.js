// js/data.js - Mock data for Discord clone
const CURRENT_USER = {
  id: 'user_self', username: 'GamerX', discriminator: '0001',
  avatarColor: '#5865F2', status: 'online',
  customStatus: '🎮 Playing games', aboutMe: 'Full-stack dev & gamer. Coffee enthusiast ☕'
};

const USERS = {
  user_self: CURRENT_USER,
  u1: { id:'u1', username:'PixelMaster', discriminator:'4521', avatarColor:'#ED4245', status:'online', customStatus:'🎨 Creating art' },
  u2: { id:'u2', username:'CodeNinja', discriminator:'7890', avatarColor:'#3BA55D', status:'idle', customStatus:'💻 Coding...' },
  u3: { id:'u3', username:'MusicBot', discriminator:'0000', avatarColor:'#FAA61A', status:'online', customStatus:'🎵 Streaming music', isBot:true },
  u4: { id:'u4', username:'StarGazer', discriminator:'2345', avatarColor:'#9B59B6', status:'dnd', customStatus:'🔴 Do not disturb' },
  u5: { id:'u5', username:'NeonWolf', discriminator:'5678', avatarColor:'#E91E63', status:'online', customStatus:'🐺 Howling at the moon' },
  u6: { id:'u6', username:'ByteForce', discriminator:'3456', avatarColor:'#00BCD4', status:'offline' },
  u7: { id:'u7', username:'SkyRider', discriminator:'9012', avatarColor:'#FF9800', status:'online', customStatus:'✈️ Flying high' },
  u8: { id:'u8', username:'LunaEclipse', discriminator:'6789', avatarColor:'#673AB7', status:'idle', customStatus:'🌙 Dreaming' },
  u9: { id:'u9', username:'FireStorm', discriminator:'1111', avatarColor:'#F44336', status:'online', customStatus:'🔥 On fire!' },
  u10: { id:'u10', username:'AquaMarine', discriminator:'2222', avatarColor:'#009688', status:'offline' },
  u11: { id:'u11', username:'ThunderBolt', discriminator:'3333', avatarColor:'#FFEB3B', status:'online' },
  u12: { id:'u12', username:'CrystalVoid', discriminator:'4444', avatarColor:'#607D8B', status:'dnd' },
};

const SERVERS = [
  {
    id:'s1', name:'Gaming Hub', icon:'🎮', iconColor:'#5865F2', banner:'#5865F2',
    categories: [
      { name:'INFORMATION', collapsed:false, channels:[
        { id:'c1_1', name:'welcome', type:'text', unread:false },
        { id:'c1_2', name:'rules', type:'text', unread:false },
        { id:'c1_3', name:'announcements', type:'text', unread:true, mentions:2 },
      ]},
      { name:'GENERAL', collapsed:false, channels:[
        { id:'c1_4', name:'general', type:'text', unread:true },
        { id:'c1_5', name:'memes', type:'text', unread:false },
        { id:'c1_6', name:'off-topic', type:'text', unread:true },
      ]},
      { name:'VOICE CHANNELS', collapsed:false, channels:[
        { id:'c1_7', name:'Gaming Room', type:'voice', connectedUsers:['u1','u5'] },
        { id:'c1_8', name:'Chill Zone', type:'voice', connectedUsers:[] },
      ]},
    ]
  },
  {
    id:'s2', name:'Dev Community', icon:'💻', iconColor:'#3BA55D', banner:'#3BA55D',
    categories: [
      { name:'WELCOME', collapsed:false, channels:[
        { id:'c2_1', name:'introductions', type:'text', unread:false },
        { id:'c2_2', name:'resources', type:'text', unread:false },
      ]},
      { name:'DEVELOPMENT', collapsed:false, channels:[
        { id:'c2_3', name:'javascript', type:'text', unread:true, mentions:1 },
        { id:'c2_4', name:'python', type:'text', unread:false },
        { id:'c2_5', name:'rust', type:'text', unread:false },
        { id:'c2_6', name:'help', type:'text', unread:true },
      ]},
      { name:'SHOWCASE', collapsed:false, channels:[
        { id:'c2_7', name:'projects', type:'text', unread:false },
      ]},
    ]
  },
  {
    id:'s3', name:'Music Lounge', icon:'🎵', iconColor:'#FAA61A', banner:'#FAA61A',
    categories: [
      { name:'MUSIC', collapsed:false, channels:[
        { id:'c3_1', name:'general', type:'text', unread:true },
        { id:'c3_2', name:'share-music', type:'text', unread:false },
        { id:'c3_3', name:'Listening Party', type:'voice', connectedUsers:['u3','u8'] },
      ]},
    ]
  },
  {
    id:'s4', name:'Art Studio', icon:'🎨', iconColor:'#E91E63', banner:'#E91E63',
    categories: [
      { name:'GALLERY', collapsed:false, channels:[
        { id:'c4_1', name:'general', type:'text', unread:false },
        { id:'c4_2', name:'showcase', type:'text', unread:true },
        { id:'c4_3', name:'feedback', type:'text', unread:false },
      ]},
    ]
  },
  {
    id:'s5', name:'Anime World', icon:'⛩️', iconColor:'#9B59B6', banner:'#9B59B6',
    categories: [
      { name:'DISCUSSION', collapsed:false, channels:[
        { id:'c5_1', name:'general', type:'text', unread:true, mentions:3 },
        { id:'c5_2', name:'recommendations', type:'text', unread:false },
        { id:'c5_3', name:'Watch Together', type:'voice', connectedUsers:[] },
      ]},
    ]
  },
];

function t(mins) { return new Date(Date.now() - mins * 60000); }

const MESSAGES = {
  'c1_4': [
    { id:'m1', userId:'u1', content:'Hey everyone! Anyone up for some Valorant tonight? 🎯', timestamp:t(120), reactions:[{emoji:'🎯',count:3,reacted:false},{emoji:'👍',count:2,reacted:true}] },
    { id:'m2', userId:'u5', content:'Count me in! I\'ve been grinding ranked all week 💪', timestamp:t(118) },
    { id:'m3', userId:'u9', content:'Same here, let me finish this match first', timestamp:t(115) },
    { id:'m4', userId:'u1', content:'Perfect, lobby will be ready in 30 mins', timestamp:t(114), reactions:[{emoji:'✅',count:2,reacted:false}] },
    { id:'m5', userId:'u7', content:'Can I join too? Just hit Diamond yesterday! 🏆', timestamp:t(100) },
    { id:'m6', userId:'u1', content:'Of course! The more the merrier', timestamp:t(99) },
    { id:'m7', userId:'u11', content:'gg just won my promo game', timestamp:t(60) },
    { id:'m8', userId:'u5', content:'Nice! What rank?', timestamp:t(58) },
    { id:'m9', userId:'u11', content:'Plat 3 finally 😤', timestamp:t(55), reactions:[{emoji:'🎉',count:4,reacted:true},{emoji:'🔥',count:2,reacted:false}] },
    { id:'m10', userId:'u9', content:'Let\'s gooo! Time to celebrate with some games', timestamp:t(30) },
    { id:'m11', userId:'user_self', content:'Hey all, just got online. Room for one more?', timestamp:t(5) },
    { id:'m12', userId:'u1', content:'Always! Join voice channel whenever you\'re ready 🎧', timestamp:t(3), reactions:[{emoji:'❤️',count:1,reacted:true}] },
  ],
  'c1_3': [
    { id:'ma1', userId:'u3', content:'📢 **Server Update v2.5**\n\nNew channels added! Check out #memes and #off-topic.\nAlso updated the rules - please review them.', timestamp:t(1440), reactions:[{emoji:'📢',count:8,reacted:false}] },
    { id:'ma2', userId:'u3', content:'🎉 **Weekend Tournament**\n\nSign up for this Saturday\'s Valorant tournament!\nPrize: Custom Discord role + bragging rights', timestamp:t(300), reactions:[{emoji:'🎉',count:12,reacted:true},{emoji:'⚔️',count:6,reacted:false}] },
  ],
  'c2_3': [
    { id:'mj1', userId:'u2', content:'Anyone know how to fix this async/await issue?', timestamp:t(200) },
    { id:'mj2', userId:'u6', content:'Can you share the code? Hard to debug without seeing it', timestamp:t(195) },
    { id:'mj3', userId:'u2', content:'```js\nasync function fetchData() {\n  const res = await fetch("/api/data");\n  return res.json();\n}\n```\nIt keeps returning undefined', timestamp:t(190) },
    { id:'mj4', userId:'u6', content:'You need to await the `.json()` call too - it returns a Promise', timestamp:t(185) },
    { id:'mj5', userId:'u2', content:'Oh! That was it. Thanks so much! 🙏', timestamp:t(180), reactions:[{emoji:'💡',count:3,reacted:false}] },
    { id:'mj6', userId:'user_self', content:'Classic gotcha! Happens to everyone', timestamp:t(170) },
  ],
  'c3_1': [
    { id:'mm1', userId:'u8', content:'Just discovered this amazing album, been on repeat all day 🎶', timestamp:t(500) },
    { id:'mm2', userId:'u3', content:'Now playing: **Midnight City** by M83 🌃', timestamp:t(480), reactions:[{emoji:'🎵',count:5,reacted:true}] },
    { id:'mm3', userId:'u7', content:'Great taste! That song is a classic', timestamp:t(470) },
  ],
  'c5_1': [
    { id:'man1', userId:'u4', content:'Just finished watching Frieren, absolutely incredible anime 😭', timestamp:t(600) },
    { id:'man2', userId:'u8', content:'RIGHT?! The character development is insane', timestamp:t(595) },
    { id:'man3', userId:'u12', content:'Adding it to my watchlist rn', timestamp:t(590) },
    { id:'man4', userId:'u4', content:'You won\'t regret it. Top 3 anime of the decade for me', timestamp:t(585), reactions:[{emoji:'💯',count:5,reacted:true},{emoji:'✨',count:3,reacted:false}] },
  ],
};

const DM_CONVERSATIONS = [
  { id:'dm1', recipientId:'u1', messages:[
    { id:'d1', userId:'u1', content:'Hey! Want to duo queue later?', timestamp:t(30) },
    { id:'d2', userId:'user_self', content:'Sure! Give me like an hour', timestamp:t(25) },
    { id:'d3', userId:'u1', content:'Sounds good 👍', timestamp:t(24) },
  ]},
  { id:'dm2', recipientId:'u2', messages:[
    { id:'d4', userId:'u2', content:'Can you review my PR when you get a chance?', timestamp:t(180) },
    { id:'d5', userId:'user_self', content:'Yeah I\'ll take a look tonight', timestamp:t(170) },
  ]},
  { id:'dm3', recipientId:'u5', messages:[
    { id:'d6', userId:'u5', content:'Check out this clip I just hit 🔥', timestamp:t(60) },
    { id:'d7', userId:'user_self', content:'YOOO that was insane!!!', timestamp:t(55) },
    { id:'d8', userId:'u5', content:'haha thanks, took me by surprise too', timestamp:t(50) },
  ]},
  { id:'dm4', recipientId:'u8', messages:[
    { id:'d9', userId:'u8', content:'Have you heard the new album?', timestamp:t(720) },
    { id:'d10', userId:'user_self', content:'Not yet, is it good?', timestamp:t(700) },
  ]},
];

const FRIENDS = ['u1','u2','u5','u7','u8','u9','u11'];
const PENDING_FRIENDS = ['u4','u12'];

const MENTIONS = [
  { serverId:'s1', channelId:'c1_3', messageId:'ma2', userId:'u3', timestamp:t(300) },
  { serverId:'s2', channelId:'c2_3', messageId:'mj4', userId:'u6', timestamp:t(185) },
  { serverId:'s5', channelId:'c5_1', messageId:'man4', userId:'u4', timestamp:t(585) },
];

const EMOJIS = {
  'Smileys': ['😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😋','😎','😍','🥰','😘','🙂','🤗','🤩','🤔','😏','😌','🥺','😢','😭','😤','😡','🥳','😈','💀','🤡','👻','👽','🤖'],
  'Gestures': ['👍','👎','👊','✊','🤛','🤜','👏','🙌','🤝','👐','✋','🤚','👋','🤙','💪','🙏','✌️','🤞','🫡','🫶'],
  'Hearts': ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','💔','💕','💖','💗','💓','💝'],
  'Objects': ['🎮','🎯','🏆','🎧','🎤','🎵','🎶','💻','📱','🔥','⚡','🌟','✨','💫','🎉','🎊','💡','⚔️','🛡️','🏅'],
  'Nature': ['🌈','🌞','🌙','⭐','🌊','🌸','🌺','🌻','🍀','🌿','🐺','🦊','🐱','🐶','🦋'],
};
