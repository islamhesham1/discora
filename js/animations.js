// js/animations.js - Touch handling and transition helpers
function scrollToBottom(el) {
  if (!el) return;
  requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
}

function addRippleListeners() {
  document.querySelectorAll('.ripple-container').forEach(el => {
    el.addEventListener('click', e => createRipple(e, el));
  });
}

function simulateTyping(container, duration = 3000) {
  const indicator = document.getElementById('typing-indicator');
  if (!indicator) return;
  const onlineUsers = Object.values(USERS).filter(u => u.id !== 'user_self' && u.status === 'online');
  if (!onlineUsers.length) return;
  const randomUser = onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
  indicator.innerHTML = `<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
    <span><strong>${randomUser.username}</strong> is typing...</span>`;
  indicator.classList.add('visible');
  setTimeout(() => { indicator.classList.remove('visible'); }, duration);
}

// Smooth scroll with momentum
function enableSmoothScroll(el) {
  let isDown = false, startY, scrollTop;
  el.addEventListener('touchstart', e => {
    isDown = true; startY = e.touches[0].pageY - el.offsetTop; scrollTop = el.scrollTop;
  }, { passive: true });
  el.addEventListener('touchmove', e => {
    if (!isDown) return;
    const y = e.touches[0].pageY - el.offsetTop;
    el.scrollTop = scrollTop - (y - startY);
  }, { passive: true });
  el.addEventListener('touchend', () => { isDown = false; }, { passive: true });
}
