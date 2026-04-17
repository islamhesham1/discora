// js/components.js - UI component renderers

function renderAvatar(user, size = 'md') {
  const cls = `avatar avatar-${size}`;
  const statusCls = user.status ? `status-${user.status}` : '';
  const initials = getInitials(user.username);
  return `<div class="${cls}" style="background:${user.avatarColor}" data-user-id="${user.id}">
    ${initials}
    ${user.status ? `<span class="status-dot ${statusCls}"></span>` : ''}
  </div>`;
}

function renderServerBar(servers, activeId) {
  let html = '';
  // Home button
  html += `<div class="server-icon-wrapper ${!activeId ? 'active' : ''}" data-server="home">
    <div class="server-icon home-icon" title="Home">🏠</div>
  </div>`;
  html += '<div class="server-separator"></div>';
  // Servers
  servers.forEach(s => {
    const hasUnread = s.categories.some(c => c.channels.some(ch => ch.unread));
    const totalMentions = s.categories.reduce((sum, c) => sum + c.channels.reduce((s2, ch) => s2 + (ch.mentions || 0), 0), 0);
    html += `<div class="server-icon-wrapper ${s.id === activeId ? 'active' : ''} ${hasUnread ? 'has-unread' : ''}" data-server="${s.id}" title="${s.name}">
      <div class="server-icon" style="background:${s.iconColor}">${s.icon}
        ${totalMentions > 0 ? `<span class="server-badge">${totalMentions}</span>` : ''}
      </div>
    </div>`;
  });
  html += '<div class="server-separator"></div>';
  html += `<div class="server-icon-wrapper" data-server="add">
    <div class="server-icon add-server-icon" title="Add Server">+</div>
  </div>`;
  return html;
}

function renderChannelList(server) {
  let html = '';
  server.categories.forEach(cat => {
    html += `<div class="channel-category">
      <div class="category-header" data-category="${cat.name}">
        <span class="category-arrow">▼</span> ${cat.name}
      </div>
      <div class="category-channels">`;
    cat.channels.forEach(ch => {
      if (ch.type === 'text') {
        html += `<div class="channel-item ${ch.unread ? 'unread' : ''}" data-channel="${ch.id}">
          <span class="channel-icon">#</span>
          <span class="channel-name text-ellipsis">${ch.name}</span>
          ${ch.mentions ? `<span class="mention-badge">${ch.mentions}</span>` : ''}
        </div>`;
      } else {
        html += `<div class="channel-item" data-channel="${ch.id}" data-type="voice">
          <span class="channel-icon">🔊</span>
          <span class="channel-name text-ellipsis">${ch.name}</span>
        </div>`;
        if (ch.connectedUsers && ch.connectedUsers.length > 0) {
          html += '<div class="voice-users">';
          ch.connectedUsers.forEach(uid => {
            const u = USERS[uid];
            if (u) html += `<div class="voice-user">${renderAvatar(u, 'sm')} <span>${u.username}</span></div>`;
          });
          html += '</div>';
        }
      }
    });
    html += '</div></div>';
  });
  return html;
}

function renderMessages(channelId) {
  const msgs = MESSAGES[channelId];
  if (!msgs || !msgs.length) {
    return '<div class="empty-state"><div class="empty-icon">💬</div><p>No messages yet. Be the first!</p></div>';
  }
  let html = '';
  let lastUserId = null;
  let lastDate = null;
  msgs.forEach((msg, i) => {
    const user = USERS[msg.userId];
    if (!user) return;
    const msgDate = formatDate(msg.timestamp);
    if (msgDate !== lastDate) {
      html += `<div class="date-divider">${msgDate}</div>`;
      lastDate = msgDate;
      lastUserId = null;
    }
    const isGrouped = lastUserId === msg.userId && i > 0;
    if (isGrouped) {
      html += `<div class="message-group anim-message" data-msg-id="${msg.id}">
        <span class="compact-timestamp">${formatTime(msg.timestamp)}</span>
        <div class="message-content-wrapper">
          <div class="message-text">${parseMarkdown(msg.content)}</div>
          ${msg.reactions ? renderReactions(msg.reactions, msg.id) : ''}
        </div>
      </div>`;
    } else {
      html += `<div class="message-group first-in-group anim-message" data-msg-id="${msg.id}">
        <div class="msg-avatar" data-user-id="${user.id}">${renderAvatar(user, 'md')}</div>
        <div class="message-content-wrapper">
          <div class="message-header">
            <span class="message-author" style="color:${user.avatarColor}" data-user-id="${user.id}">${user.username}</span>
            ${user.isBot ? '<span class="bot-badge">BOT</span>' : ''}
            <span class="message-timestamp">${formatTime(msg.timestamp)}</span>
          </div>
          <div class="message-text">${parseMarkdown(msg.content)}</div>
          ${msg.reactions ? renderReactions(msg.reactions, msg.id) : ''}
        </div>
      </div>`;
    }
    lastUserId = msg.userId;
  });
  return html;
}

function renderReactions(reactions, msgId) {
  if (!reactions || !reactions.length) return '';
  let html = '<div class="reactions">';
  reactions.forEach(r => {
    html += `<div class="reaction ${r.reacted ? 'reacted' : ''}" data-msg-id="${msgId}" data-emoji="${r.emoji}">
      <span>${r.emoji}</span><span class="reaction-count">${r.count}</span>
    </div>`;
  });
  html += '</div>';
  return html;
}

function renderDMList() {
  if (!DM_CONVERSATIONS.length) {
    return '<div class="empty-state"><div class="empty-icon">📭</div><p>No messages yet</p></div>';
  }
  let html = '';
  DM_CONVERSATIONS.forEach(dm => {
    const user = USERS[dm.recipientId];
    if (!user) return;
    const lastMsg = dm.messages[dm.messages.length - 1];
    const preview = lastMsg.userId === 'user_self' ? `You: ${lastMsg.content}` : lastMsg.content;
    html += `<div class="dm-item" data-dm-id="${dm.id}" data-recipient="${dm.recipientId}">
      ${renderAvatar(user, 'md')}
      <div class="dm-info">
        <div class="dm-name text-ellipsis">${user.username}</div>
        <div class="dm-preview text-ellipsis">${preview}</div>
      </div>
      <span class="dm-time">${formatRelativeTime(lastMsg.timestamp)}</span>
    </div>`;
  });
  return html;
}

function renderFriendsList() {
  const online = FRIENDS.filter(id => USERS[id] && USERS[id].status !== 'offline');
  const offline = FRIENDS.filter(id => USERS[id] && USERS[id].status === 'offline');
  let html = '';
  if (online.length) {
    html += `<div class="friend-section-header">Online — ${online.length}</div>`;
    online.forEach(id => { html += renderFriendItem(USERS[id]); });
  }
  if (offline.length) {
    html += `<div class="friend-section-header">Offline — ${offline.length}</div>`;
    offline.forEach(id => { html += renderFriendItem(USERS[id]); });
  }
  return html;
}

function renderFriendItem(user) {
  return `<div class="friend-item" data-user-id="${user.id}">
    ${renderAvatar(user, 'md')}
    <div class="friend-info">
      <div class="friend-name">${user.username}</div>
      <div class="friend-status text-ellipsis">${user.customStatus || user.status || ''}</div>
    </div>
    <div class="friend-actions">
      <button class="friend-action-btn" title="Message">💬</button>
      <button class="friend-action-btn" title="More">⋯</button>
    </div>
  </div>`;
}

function renderMentionsList() {
  if (!MENTIONS.length) {
    return '<div class="empty-state"><div class="empty-icon">🔔</div><p>No new mentions</p></div>';
  }
  let html = '';
  MENTIONS.forEach(m => {
    const server = SERVERS.find(s => s.id === m.serverId);
    const channel = server ? server.categories.flatMap(c => c.channels).find(ch => ch.id === m.channelId) : null;
    const msgs = MESSAGES[m.channelId];
    const msg = msgs ? msgs.find(x => x.id === m.messageId) : null;
    const user = msg ? USERS[msg.userId] : null;
    if (!server || !channel || !msg || !user) return;
    html += `<div class="mention-item" data-server="${m.serverId}" data-channel="${m.channelId}">
      <div class="mention-context">
        <span>${server.icon} ${server.name}</span> <span style="color:var(--text-muted)">›</span> <span>#${channel.name}</span>
      </div>
      <div class="mention-message">
        ${renderAvatar(user, 'sm')}
        <div>
          <span class="message-author" style="color:${user.avatarColor};font-size:var(--fs-sm)">${user.username}</span>
          <span class="message-timestamp">${formatRelativeTime(msg.timestamp)}</span>
          <div class="message-text" style="font-size:var(--fs-sm);margin-top:2px">${parseMarkdown(msg.content)}</div>
        </div>
      </div>
    </div>`;
  });
  return html;
}

function renderProfile() {
  const u = CURRENT_USER;
  return `<div class="profile-banner" style="background:linear-gradient(135deg, ${u.avatarColor}, ${u.avatarColor}88)"></div>
    <div class="profile-avatar-section">
      ${renderAvatar(u, 'lg')}
    </div>
    <div class="profile-info">
      <div class="profile-display-name">${u.username}</div>
      <div class="profile-username">${u.username}#${u.discriminator}</div>
    </div>
    <div class="profile-section">
      <div class="profile-section-title">About Me</div>
      <div class="profile-about">${u.aboutMe || ''}</div>
    </div>
    <div class="profile-section">
      <div class="profile-section-title">Custom Status</div>
      <div class="profile-about">${u.customStatus || 'No status set'}</div>
    </div>
    <div style="height:1px;background:var(--bg-light);margin:var(--sp-md) var(--sp-lg)"></div>
    <div class="profile-settings-item"><div class="settings-icon">⚙️</div><div class="settings-label">Settings</div><div class="settings-arrow">›</div></div>
    <div class="profile-settings-item"><div class="settings-icon">🔔</div><div class="settings-label">Notifications</div><div class="settings-arrow">›</div></div>
    <div class="profile-settings-item"><div class="settings-icon">🎨</div><div class="settings-label">Appearance</div><div class="settings-arrow">›</div></div>
    <div class="profile-settings-item"><div class="settings-icon">🔒</div><div class="settings-label">Privacy</div><div class="settings-arrow">›</div></div>
    <div class="profile-settings-item" style="color:var(--red)"><div class="settings-icon">🚪</div><div class="settings-label" style="color:var(--red)">Log Out</div><div class="settings-arrow">›</div></div>`;
}

function renderEmojiPicker() {
  const categories = Object.keys(EMOJIS);
  let html = '<div class="emoji-picker-header">';
  categories.forEach((cat, i) => {
    html += `<button class="emoji-category-tab ${i === 0 ? 'active' : ''}" data-cat="${cat}">${cat}</button>`;
  });
  html += '</div><div class="emoji-grid">';
  EMOJIS[categories[0]].forEach(e => {
    html += `<div class="emoji-item" data-emoji="${e}">${e}</div>`;
  });
  html += '</div>';
  return html;
}

function renderUserPopup(user) {
  return `<div class="popup-banner" style="background:linear-gradient(135deg, ${user.avatarColor}, ${user.avatarColor}88)"></div>
    <div class="popup-avatar">${renderAvatar(user, 'lg')}</div>
    <div class="popup-info">
      <div class="popup-name">${user.username} <span class="popup-discriminator">#${user.discriminator}</span></div>
    </div>
    ${user.customStatus ? `<div class="popup-status">${user.customStatus}</div>` : ''}
    <div class="popup-divider"></div>
    ${user.aboutMe ? `<div class="popup-section-title">About Me</div><div class="popup-status">${user.aboutMe}</div>` : ''}`;
}

function renderDMChat(dm) {
  const user = USERS[dm.recipientId];
  let html = '';
  dm.messages.forEach((msg, i) => {
    const msgUser = USERS[msg.userId];
    const isGrouped = i > 0 && dm.messages[i-1].userId === msg.userId;
    if (isGrouped) {
      html += `<div class="message-group anim-message">
        <span class="compact-timestamp">${formatTime(msg.timestamp)}</span>
        <div class="message-content-wrapper">
          <div class="message-text">${parseMarkdown(msg.content)}</div>
        </div>
      </div>`;
    } else {
      html += `<div class="message-group first-in-group anim-message">
        ${renderAvatar(msgUser, 'md')}
        <div class="message-content-wrapper">
          <div class="message-header">
            <span class="message-author" style="color:${msgUser.avatarColor}">${msgUser.username}</span>
            <span class="message-timestamp">${formatTime(msg.timestamp)}</span>
          </div>
          <div class="message-text">${parseMarkdown(msg.content)}</div>
        </div>
      </div>`;
    }
  });
  return html;
}
