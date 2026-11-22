/* ============================================================
   WORKSHOP SUBAGENT — dang-ky.js (chỉ trang đăng ký)
   Vé + mã đơn + tin nhắn Zalo + Google Calendar
   ============================================================ */
var TICKETS = {
  vip:   { label: 'Vé VIP',            amount: 135000, text: 'Vé VIP — 135.000đ',            qr: 'assets/img/qr-vip-135k.png' },
  group: { label: 'Vé Nhóm (3 người)', amount: 199000, text: 'Vé Nhóm — 199.000đ / 3 người', qr: 'assets/img/qr-nhom-199k.png' }
};
var selected = 'vip';

function fmt(n) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ'; }

function genCode() {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var code = 'SA-';
  for (var i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function selectTicket(key) {
  selected = key;
  document.getElementById('tab-vip').classList.toggle('active', key === 'vip');
  document.getElementById('tab-group').classList.toggle('active', key === 'group');
  document.getElementById('tab-vip').setAttribute('aria-selected', key === 'vip');
  document.getElementById('tab-group').setAttribute('aria-selected', key === 'group');
  document.getElementById('f-ticket').value = TICKETS[key].text;
}

document.getElementById('tab-vip').addEventListener('click', function () { selectTicket('vip'); });
document.getElementById('tab-group').addEventListener('click', function () { selectTicket('group'); });

document.getElementById('reg-form').addEventListener('submit', function (e) {
  e.preventDefault();
  var name = document.getElementById('f-name').value.trim();
  var zalo = document.getElementById('f-zalo').value.trim();
  var email = document.getElementById('f-email').value.trim();
  if (!name || !zalo) return;

  var code = genCode();
  var t = TICKETS[selected];
  try {
    localStorage.setItem('reg_' + code, JSON.stringify({ name: name, zalo: zalo, email: email, ticket: selected, amount: t.amount, at: new Date().toISOString() }));
  } catch (err) {}

  document.getElementById('order-code').textContent = code;
  document.getElementById('order-code-2').textContent = code;
  document.getElementById('order-name').textContent = name;
  document.getElementById('order-ticket').textContent = t.label;
  document.getElementById('order-amount').textContent = fmt(t.amount);
  document.getElementById('order-content').textContent = code;
  document.getElementById('qr-img').src = t.qr;
  document.getElementById('qr-ticket').textContent = t.text;

  var msg = 'Chào anh Phong, em ' + name + ' đăng ký workshop Xây Đội Trợ Lý AI SubAgent.\n'
    + 'Mã đơn: ' + code + '\n'
    + 'Vé: ' + t.label + ' — ' + fmt(t.amount) + '\n'
    + 'Em gửi bill chuyển khoản ạ.';
  document.getElementById('zalo-message').textContent = msg;

  /* Google Calendar: 20:00-22:00 giờ VN = 13:00-15:00 UTC, 28/11/2026 */
  var cal = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
    + '&text=' + encodeURIComponent('Workshop Xây Đội Trợ Lý AI SubAgent — Nhật Phong')
    + '&dates=20261128T130000Z/20261128T150000Z'
    + '&details=' + encodeURIComponent('Link Zoom gửi qua Zalo trước giờ học. Mã đơn của bạn: ' + code)
    + '&location=' + encodeURIComponent('Trực tuyến qua Zoom');
  document.getElementById('btn-calendar').href = cal;

  var box = document.getElementById('order-box');
  box.classList.add('show');
  box.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.getElementById('btn-copy').addEventListener('click', function () {
  var text = document.getElementById('zalo-message').textContent;
  var btn = this;
  function done() { btn.textContent = '✓ Đã sao chép!'; setTimeout(function () { btn.textContent = '📋 Sao chép tin nhắn'; }, 2000); }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text); done(); });
  } else { fallbackCopy(text); done(); }
  function fallbackCopy(t) {
    var ta = document.createElement('textarea');
    ta.value = t; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (err) {}
    document.body.removeChild(ta);
  }
});

/* Form danh sách chờ */
var wlForm = document.getElementById('waitlist-form');
if (wlForm) {
  wlForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('wl-name').value.trim();
    var zalo = document.getElementById('wl-zalo').value.trim();
    if (!name || !zalo) return;
    try { localStorage.setItem('waitlist_' + Date.now(), JSON.stringify({ name: name, zalo: zalo })); } catch (err) {}
    wlForm.style.display = 'none';
    document.getElementById('wl-done').style.display = 'block';
  });
}
