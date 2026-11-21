/* ============================================================
   WORKSHOP SUBAGENT — app.js (dùng chung 2 trang)
   ⚠️ CẤU HÌNH DUY NHẤT CẦN SỬA KHI ĐỔI LỊCH:
   EVENT_DATE = ngày giờ khai giảng (tháng tính từ 0: 10 = tháng 11)
   ============================================================ */
var EVENT_DATE = new Date(2026, 10, 28, 20, 0, 0); // 20:00 Thứ Bảy 28/11/2026 (GIẢ ĐỊNH — anh chốt ngày thật thì sửa dòng này)
var EVENT_END = new Date(2026, 10, 28, 22, 0, 0);  // dự kiến kết thúc 22:00

function pad(n) { return (n < 10 ? '0' : '') + n; }

function tickCountdown() {
  var diff = EVENT_DATE - new Date();
  if (diff < 0) diff = 0;
  var d = Math.floor(diff / 86400000);
  var h = Math.floor(diff / 3600000) % 24;
  var m = Math.floor(diff / 60000) % 60;
  var s = Math.floor(diff / 1000) % 60;
  var ids = [['cd-d', d], ['cd-h', h], ['cd-m', m], ['cd-s', s]];
  ids.forEach(function (pair) {
    var el = document.getElementById(pair[0]);
    if (el) el.textContent = pad(pair[1]);
  });
  [['.cd-d2', d], ['.cd-h2', h], ['.cd-m2', m], ['.cd-s2', s]].forEach(function (pair) {
    document.querySelectorAll(pair[0]).forEach(function (el) { el.textContent = pad(pair[1]); });
  });
}

/* Chế độ chờ: hết hạn -> trang đăng ký hiện form chờ thay cho form đăng ký */
function applyWaitlistMode() {
  var expired = new Date() > EVENT_DATE;
  var regMain = document.getElementById('reg-main');
  var wlBox = document.getElementById('waitlist-box');
  if (regMain && wlBox && expired) {
    regMain.style.display = 'none';
    wlBox.classList.add('show');
  }
  if (expired) {
    document.querySelectorAll('.hero-actions .btn-primary').forEach(function (b) {
      b.textContent = 'Vào danh sách chờ →';
    });
  }
}

/* FAQ accordion */
function initFaq() {
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentElement;
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* Lead magnet: nhận checklist */
function initLeadForm() {
  var form = document.getElementById('lead-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('lead-name').value.trim();
    var zalo = document.getElementById('lead-zalo').value.trim();
    if (!name || !zalo) return;
    try { localStorage.setItem('lead_submitted', JSON.stringify({ name: name, zalo: zalo, at: new Date().toISOString() })); } catch (err) {}
    document.getElementById('checklist').classList.add('show');
    var btn = form.querySelector('button[type="submit"]');
    btn.textContent = '✓ Checklist của bạn ở dưới ↓';
    btn.disabled = true;
    document.getElementById('checklist').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

tickCountdown();
setInterval(tickCountdown, 1000);
applyWaitlistMode();
initFaq();
initLeadForm();
