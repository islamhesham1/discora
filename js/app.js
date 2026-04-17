// js/app.js - Main application controller
class DiscordApp {
  constructor() {
    this.activeTab = 'home';
    this.activeServer = SERVERS[0];
    this.activeChannel = null;
    this.activeDM = null;
    this.emojiPickerOpen = false;
    this.emojiTarget = null; // 'input' or message id
  }

  init() {
    // Show splash then load
    setTimeout(() => {
      const splash = $('#splash-screen');
      if (splash) { splash.classList.add('fade-out'); setTimeout(() => splash.style.display = 'none', 500); }
    }, 1500);

    this.renderAll();
    this.setupEventListeners();
    // Simulate typing periodically
    setInterval(() => { if (this.activeChannel) simulateTyping(); }, 12000);
  }

  renderAll() {
    // Server bar
    $('#server-bar').innerHTML = renderServerBar(SERVERS, this.activeServer ? this.activeServer.id : null);
    // Channel list
    if (this.activeServer) {
      $('#channel-header').textContent = this.activeServer.name;
      $('#channel-list').innerHTML = renderChannelList(this.activeServer);
    }
    // User area
    this.renderUserArea();
    // Friends tab (DMs)
    this.renderFriendsTab();
    // Search tab
    this.renderSearchTab();
    // Mentions tab
    this.renderMentionsTab();
    // Profile tab
    this.renderProfileTab();
    // Update nav badges
    this.updateNavBadges();
    // Emoji picker
    $('#emoji-picker').innerHTML = renderEmojiPicker();
  }

  renderUserArea() {
    const u = CURRENT_USER;
    $('#user-area').innerHTML = `${renderAvatar(u, 'sm')}
      <div class="user-info">
        <div class="username text-ellipsis">${u.username}</div>
        <div class="user-status-text text-ellipsis">${u.customStatus || u.status}</div>
      </div>
      <div class="user-actions">
        <button title="Mute" id="btn-mute">🎤</button>
        <button title="Deafen" id="btn-deafen">🎧</button>
        <button title="Settings" id="btn-settings">⚙️</button>
      </div>`;
  }

  renderFriendsTab() {
    const content = $('#friends-content');
    if (!content) return;
    // Tab selector
    let html = `<div style="display:flex;gap:var(--sp-sm);padding:var(--sp-sm) var(--sp-lg);border-bottom:1px solid rgba(255,255,255,0.04)">
      <button class="friends-filter active" data-filter="messages" style="padding:var(--sp-xs) var(--sp-md);border-radius:var(--radius-xl);font-size:var(--fs-sm);font-weight:var(--fw-medium);background:var(--bg-active);color:var(--text-primary)">Messages</button>
      <button class="friends-filter" data-filter="friends" style="padding:var(--sp-xs) var(--sp-md);border-radius:var(--radius-xl);font-size:var(--fs-sm);font-weight:var(--fw-medium);color:var(--text-muted)">Friends</button>
    </div>`;
    html += `<div id="friends-messages-list">${renderDMList()}</div>`;
    html += `<div id="friends-friends-list" style="display:none">${renderFriendsList()}</div>`;
    content.innerHTML = html;
  }

  renderSearchTab() {
    const content = $('#search-content');
    if (!content) return;
    content.innerHTML = `<div class="search-input-wrapper">
      <span class="search-icon">🔍</span>
      <input type="text" placeholder="Search servers, channels, or messages..." id="search-input-field">
    </div>
    <div class="search-results">
      <div class="empty-state"><div class="empty-icon">🔍</div><p>Start typing to search</p></div>
    </div>`;
  }

  renderMentionsTab() {
    const content = $('#mentions-content');
    if (!content) return;
    content.innerHTML = renderMentionsList();
  }

  renderProfileTab() {
    const content = $('#profile-content');
    if (!content) return;
    content.innerHTML = renderProfile();
  }

  updateNavBadges() {
    const totalMentions = SERVERS.reduce((sum, s) =>
      sum + s.categories.reduce((s2, c) => s2 + c.channels.reduce((s3, ch) => s3 + (ch.mentions || 0), 0), 0), 0);
    const mentionBadge = $('#nav-mentions-badge');
    if (mentionBadge) {
      if (totalMentions > 0) { mentionBadge.textContent = totalMentions; mentionBadge.classList.remove('hidden'); }
      else { mentionBadge.classList.add('hidden'); }
    }
  }

  switchTab(tab) {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    $$('.tab-view').forEach(v => v.classList.remove('active'));
    $(`#${tab}-tab`).classList.add('active');
    $$('.nav-item').forEach(n => n.classList.remove('active'));
    $(`.nav-item[data-tab="${tab}"]`).classList.add('active');
    // Close chat if switching away from home
    if (tab !== 'home') this.closeChat();
  }

  selectServer(serverId) {
    if (serverId === 'home') {
      this.activeServer = null;
      this.activeChannel = null;
      this.closeChat();
      $('#channel-header').textContent = 'Home';
      $('#channel-list').innerHTML = '<div class="empty-state"><div class="empty-icon">🏠</div><p>Welcome home!</p></div>';
    } else if (serverId === 'add') {
      return; // Mock - no action
    } else {
      this.activeServer = SERVERS.find(s => s.id === serverId);
      if (!this.activeServer) return;
      this.activeChannel = null;
      this.closeChat();
      $('#channel-header').textContent = this.activeServer.name;
      $('#channel-list').innerHTML = renderChannelList(this.activeServer);
    }
    // Update server bar active state
    $$('.server-icon-wrapper').forEach(w => {
      w.classList.toggle('active', w.dataset.server === serverId);
    });
  }

  selectChannel(channelId) {
    if (!channelId) return;
    // Find channel info
    let channelInfo = null;
    if (this.activeServer) {
      for (const cat of this.activeServer.categories) {
        channelInfo = cat.channels.find(ch => ch.id === channelId);
        if (channelInfo) break;
      }
    }
    if (!channelInfo || channelInfo.type === 'voice') return;
    this.activeChannel = channelId;
    // Update channel list active state
    $$('.channel-item').forEach(ch => ch.classList.toggle('active', ch.dataset.channel === channelId));
    // Mark as read
    if (channelInfo) { channelInfo.unread = false; channelInfo.mentions = 0; }
    // Open chat
    this.openChat(channelInfo);
  }

  openChat(channelInfo) {
    const chatView = $('#chat-view');
    const channelName = $('#chat-channel-name');
    const messagesContainer = $('#messages-container');
    const messageInput = $('#message-input');

    channelName.innerHTML = `<span class="hash">#</span> ${channelInfo.name}`;
    messagesContainer.innerHTML = renderMessages(this.activeChannel);
    messageInput.placeholder = `Message #${channelInfo.name}`;

    chatView.classList.add('open');
    scrollToBottom(messagesContainer);
    // Trigger typing after a delay
    setTimeout(() => simulateTyping(), 2000);
  }

  closeChat() {
    const chatView = $('#chat-view');
    chatView.classList.remove('open');
    this.activeChannel = null;
    $$('.channel-item').forEach(ch => ch.classList.remove('active'));
  }

  sendMessage(text) {
    if (!text.trim() || !this.activeChannel) return;
    const channelMsgs = MESSAGES[this.activeChannel] || [];
    const newMsg = {
      id: 'msg_' + Date.now(),
      userId: 'user_self',
      content: text.trim(),
      timestamp: new Date(),
      reactions: []
    };
    channelMsgs.push(newMsg);
    MESSAGES[this.activeChannel] = channelMsgs;
    // Re-render messages
    const container = $('#messages-container');
    container.innerHTML = renderMessages(this.activeChannel);
    scrollToBottom(container);
    // Clear input
    $('#message-input').value = '';
    this.updateSendButton();
    // Simulate reply
    setTimeout(() => {
      simulateTyping($('#messages-container'), 2000);
      setTimeout(() => this.simulateReply(), 3000);
    }, 1000);
  }

  simulateReply() {
    if (!this.activeChannel) return;
    const onlineUsers = Object.values(USERS).filter(u => u.id !== 'user_self' && u.status === 'online');
    if (!onlineUsers.length) return;
    const user = onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
    const replies = [
      'That\'s awesome! 🔥', 'Totally agree!', 'Haha nice one 😄', 'Let\'s do it!',
      'Sounds good to me 👍', 'I was thinking the same thing', 'No way! Really?? 😮',
      'lol that\'s hilarious 😂', 'Count me in!', 'Great idea!', 'Facts 💯'
    ];
    const reply = { id: 'msg_' + Date.now(), userId: user.id, content: replies[Math.floor(Math.random() * replies.length)], timestamp: new Date(), reactions: [] };
    const msgs = MESSAGES[this.activeChannel] || [];
    msgs.push(reply);
    MESSAGES[this.activeChannel] = msgs;
    const container = $('#messages-container');
    container.innerHTML = renderMessages(this.activeChannel);
    scrollToBottom(container);
  }

  toggleReaction(msgId, emoji) {
    if (!this.activeChannel) return;
    const msgs = MESSAGES[this.activeChannel];
    const msg = msgs ? msgs.find(m => m.id === msgId) : null;
    if (!msg) return;
    if (!msg.reactions) msg.reactions = [];
    const existing = msg.reactions.find(r => r.emoji === emoji);
    if (existing) {
      existing.reacted = !existing.reacted;
      existing.count += existing.reacted ? 1 : -1;
      if (existing.count <= 0) msg.reactions = msg.reactions.filter(r => r !== existing);
    } else {
      msg.reactions.push({ emoji, count: 1, reacted: true });
    }
    const container = $('#messages-container');
    container.innerHTML = renderMessages(this.activeChannel);
  }

  toggleEmojiPicker(target) {
    const picker = $('#emoji-picker');
    this.emojiTarget = target;
    if (this.emojiPickerOpen) {
      picker.classList.remove('visible');
      this.emojiPickerOpen = false;
    } else {
      picker.classList.add('visible');
      this.emojiPickerOpen = true;
    }
  }

  closeEmojiPicker() {
    const picker = $('#emoji-picker');
    picker.classList.remove('visible');
    this.emojiPickerOpen = false;
  }

  selectEmoji(emoji) {
    if (this.emojiTarget === 'input') {
      const input = $('#message-input');
      input.value += emoji;
      input.focus();
      this.updateSendButton();
    }
    this.closeEmojiPicker();
  }

  switchEmojiCategory(cat) {
    const grid = $('#emoji-picker .emoji-grid');
    let html = '';
    (EMOJIS[cat] || []).forEach(e => { html += `<div class="emoji-item" data-emoji="${e}">${e}</div>`; });
    grid.innerHTML = html;
    $$('.emoji-category-tab').forEach(t => t.classList.toggle('active', t.dataset.cat === cat));
  }

  updateSendButton() {
    const input = $('#message-input');
    const sendBtn = $('#send-btn');
    if (input.value.trim()) { sendBtn.classList.remove('hidden'); }
    else { sendBtn.classList.add('hidden'); }
  }

  showUserPopup(userId, x, y) {
    const user = USERS[userId];
    if (!user) return;
    const popup = $('#user-popup');
    const overlay = $('#overlay');
    popup.innerHTML = renderUserPopup(user);
    // Position popup
    popup.style.left = Math.min(x, window.innerWidth - 310) + 'px';
    popup.style.top = Math.min(y, window.innerHeight - 300) + 'px';
    popup.classList.add('visible');
    overlay.classList.add('visible');
  }

  closeUserPopup() {
    $('#user-popup').classList.remove('visible');
    $('#overlay').classList.remove('visible');
  }

  openDMChat(dmId) {
    const dm = DM_CONVERSATIONS.find(d => d.id === dmId);
    if (!dm) return;
    this.activeDM = dm;
    const user = USERS[dm.recipientId];
    const chatView = $('#dm-chat-view');
    chatView.querySelector('.dm-chat-header-name').textContent = user.username;
    chatView.querySelector('.dm-messages-container').innerHTML = renderDMChat(dm);
    chatView.classList.add('open');
    scrollToBottom(chatView.querySelector('.dm-messages-container'));
  }

  closeDMChat() {
    $('#dm-chat-view').classList.remove('open');
    this.activeDM = null;
  }

  sendDMMessage(text) {
    if (!text.trim() || !this.activeDM) return;
    this.activeDM.messages.push({ id: 'd_' + Date.now(), userId: 'user_self', content: text.trim(), timestamp: new Date() });
    const container = $('#dm-chat-view .dm-messages-container');
    container.innerHTML = renderDMChat(this.activeDM);
    scrollToBottom(container);
    $('#dm-message-input').value = '';
  }

  setupEventListeners() {
    // Bottom nav
    $$('.nav-item').forEach(item => {
      item.addEventListener('click', () => this.switchTab(item.dataset.tab));
    });

    // Server bar clicks
    $('#server-bar').addEventListener('click', e => {
      const wrapper = e.target.closest('.server-icon-wrapper');
      if (wrapper) this.selectServer(wrapper.dataset.server);
    });

    // Channel clicks
    $('#channel-list').addEventListener('click', e => {
      const channelItem = e.target.closest('.channel-item');
      if (channelItem) {
        if (channelItem.dataset.type === 'voice') return;
        this.selectChannel(channelItem.dataset.channel);
        return;
      }
      const catHeader = e.target.closest('.category-header');
      if (catHeader) {
        catHeader.classList.toggle('collapsed');
        const channels = catHeader.nextElementSibling;
        if (channels) channels.style.display = catHeader.classList.contains('collapsed') ? 'none' : '';
      }
    });

    // Chat back button
    $('#chat-back').addEventListener('click', () => this.closeChat());

    // Message input
    const msgInput = $('#message-input');
    msgInput.addEventListener('input', () => this.updateSendButton());
    msgInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.sendMessage(msgInput.value); }
    });

    // Send button
    $('#send-btn').addEventListener('click', () => this.sendMessage(msgInput.value));

    // Emoji button
    $('#emoji-btn').addEventListener('click', () => this.toggleEmojiPicker('input'));

    // Emoji picker clicks
    $('#emoji-picker').addEventListener('click', e => {
      const item = e.target.closest('.emoji-item');
      if (item) { this.selectEmoji(item.dataset.emoji); return; }
      const tab = e.target.closest('.emoji-category-tab');
      if (tab) this.switchEmojiCategory(tab.dataset.cat);
    });

    // Reactions
    document.addEventListener('click', e => {
      const reaction = e.target.closest('.reaction');
      if (reaction) { this.toggleReaction(reaction.dataset.msgId, reaction.dataset.emoji); return; }
    });

    // User avatar/name clicks
    document.addEventListener('click', e => {
      const author = e.target.closest('.message-author');
      const avatar = e.target.closest('.msg-avatar');
      const target = author || avatar;
      if (target) {
        const userId = target.dataset.userId;
        if (userId) {
          const rect = target.getBoundingClientRect();
          this.showUserPopup(userId, rect.left, rect.bottom + 8);
        }
      }
    });

    // Overlay click - close popups
    $('#overlay').addEventListener('click', () => {
      this.closeUserPopup();
      this.closeEmojiPicker();
    });

    // Friends tab filter
    document.addEventListener('click', e => {
      const filter = e.target.closest('.friends-filter');
      if (!filter) return;
      $$('.friends-filter').forEach(f => { f.classList.remove('active'); f.style.background = ''; f.style.color = 'var(--text-muted)'; });
      filter.classList.add('active'); filter.style.background = 'var(--bg-active)'; filter.style.color = 'var(--text-primary)';
      const type = filter.dataset.filter;
      const msgList = $('#friends-messages-list');
      const friendList = $('#friends-friends-list');
      if (msgList) msgList.style.display = type === 'messages' ? '' : 'none';
      if (friendList) friendList.style.display = type === 'friends' ? '' : 'none';
    });

    // DM item clicks
    document.addEventListener('click', e => {
      const dmItem = e.target.closest('.dm-item');
      if (dmItem) this.openDMChat(dmItem.dataset.dmId);
    });

    // DM chat back
    const dmBack = $('#dm-chat-back');
    if (dmBack) dmBack.addEventListener('click', () => this.closeDMChat());

    // DM message input
    const dmInput = $('#dm-message-input');
    if (dmInput) {
      dmInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.sendDMMessage(dmInput.value); }
      });
    }
    const dmSend = $('#dm-send-btn');
    if (dmSend) dmSend.addEventListener('click', () => this.sendDMMessage($('#dm-message-input').value));

    // Mention item clicks - navigate to server/channel
    document.addEventListener('click', e => {
      const mention = e.target.closest('.mention-item');
      if (mention) {
        const serverId = mention.dataset.server;
        const channelId = mention.dataset.channel;
        this.switchTab('home');
        this.selectServer(serverId);
        setTimeout(() => this.selectChannel(channelId), 100);
      }
    });
  }
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
  const app = new DiscordApp();
  app.init();
});
