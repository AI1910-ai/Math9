/**
 * MathLab 2026 - Authentication & Owner Access Control Module
 * Bảo vệ quyền truy cập và kiểm soát website dành riêng cho Chủ sở hữu.
 */

(function () {
  "use strict";

  const SALT = "_mathlab_salt_2026";
  const CONFIG_KEY = "mathlab_auth_config";
  const SESSION_KEY = "mathlab_auth_session";
  const MASTER_RECOVERY_KEY = "MATHLAB@RESET2026";

  // Mặc định ban đầu: admin / admin123
  const DEFAULT_USERNAME = "admin";
  const DEFAULT_PASSWORD = "admin123";

  /**
   * Thuật toán băm SHA-256 đồng bộ (chạy tương thích 100% trên cả HTTPS, localhost và mạng LAN HTTP)
   */
  function sha256Sync(str) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    const lengthProperty = "length";
    let i, j;
    let result = "";
    const words = [];
    // Hỗ trợ ký tự Unicode UTF-8
    const ascii = unescape(encodeURIComponent(str));
    const asciiBitLength = ascii[lengthProperty] * 8;
    const hash = [];
    const k = [];
    let primeCounter = 0;
    const isComposite = {};

    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 313; i += candidate) {
          isComposite[i] = candidate;
        }
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }

    let padded = ascii + "\x80";
    while (padded[lengthProperty] % 64 - 56) padded += "\x00";

    for (i = 0; i < padded[lengthProperty]; i++) {
      j = padded.charCodeAt(i);
      words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }

    words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
    words[words[lengthProperty]] = asciiBitLength;

    for (j = 0; j < words[lengthProperty]; ) {
      const w = words.slice(j, (j += 16));
      const oldHash = hash.slice(0);
      for (i = 0; i < 64; i++) {
        const w15 = w[i - 15],
          w2 = w[i - 2];
        const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
        const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
        w[i] = i < 16 ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0;
        const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
        const maj =
          (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
        const s0_ =
          rightRotate(hash[0], 2) ^
          rightRotate(hash[0], 13) ^
          rightRotate(hash[0], 22);
        const s1_ =
          rightRotate(hash[4], 6) ^
          rightRotate(hash[4], 11) ^
          rightRotate(hash[4], 25);
        const t1 = hash[7] + s1_ + ch + k[i] + w[i];
        const t2 = s0_ + maj;
        hash[7] = hash[6];
        hash[6] = hash[5];
        hash[5] = hash[4];
        hash[4] = (hash[3] + t1) | 0;
        hash[3] = hash[2];
        hash[2] = hash[1];
        hash[1] = hash[0];
        hash[0] = (t1 + t2) | 0;
      }
      for (i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }

    for (i = 0; i < 8; i++) {
      for (let b = 3; b >= 0; b--) {
        const byte = (hash[i] >> (b * 8)) & 255;
        result += (byte < 16 ? "0" : "") + byte.toString(16);
      }
    }
    return result;
  }

  function hashPassword(pwd) {
    return sha256Sync(pwd + SALT);
  }

  // Khởi tạo cấu hình tài khoản nếu chưa có trong LocalStorage
  function getAuthConfig() {
    try {
      const raw = localStorage.getItem(CONFIG_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {}

    const initial = {
      username: DEFAULT_USERNAME,
      passwordHash: hashPassword(DEFAULT_PASSWORD),
      updatedAt: Date.now(),
    };
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(initial));
    } catch (e) {}
    return initial;
  }

  function saveAuthConfig(username, newPassword) {
    const config = {
      username: username.trim(),
      passwordHash: hashPassword(newPassword),
      updatedAt: Date.now(),
    };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    return config;
  }

  // Kiểm tra phiên đăng nhập hiện tại
  function getActiveSession() {
    try {
      const raw =
        sessionStorage.getItem(SESSION_KEY) ||
        localStorage.getItem(SESSION_KEY);
      if (raw) {
        const session = JSON.parse(raw);
        if (session && session.expire && session.expire > Date.now()) {
          return session;
        }
      }
    } catch (e) {}
    return null;
  }

  function setSession(username, rememberMe) {
    const duration = rememberMe
      ? 30 * 24 * 60 * 60 * 1000 // 30 ngày nếu chọn ghi nhớ
      : 12 * 60 * 60 * 1000; // 12 giờ cho phiên tạm
    const session = {
      username: username,
      token: "tok_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36),
      expire: Date.now() + duration,
      remember: !!rememberMe,
    };
    try {
      if (rememberMe) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        sessionStorage.removeItem(SESSION_KEY);
      } else {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        localStorage.removeItem(SESSION_KEY);
      }
    } catch (e) {}
    return session;
  }

  function clearSession() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  }

  function showToast(message) {
    let toast = document.getElementById("authToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "authToast";
      toast.className = "auth-toast";
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>🛡️</span> <span>${message}</span>`;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  /**
   * Tạo và gắn giao diện Đăng nhập + Hộp thoại Cài đặt Tài khoản
   */
  function ensureAuthUI() {
    // 1. Overlay đăng nhập
    if (!document.getElementById("authOverlay")) {
      const overlay = document.createElement("div");
      overlay.id = "authOverlay";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.innerHTML = `
        <div class="auth-card">
          <div class="auth-header">
            <div class="auth-icon-wrap">🔒</div>
            <span class="auth-badge">XÁC THỰC CHỦ SỞ HỮU</span>
            <h2>Phòng Thí Nghiệm MathLab 2026</h2>
            <p>Trang web được thiết lập quyền riêng tư. Vui lòng đăng nhập tài khoản chủ sở hữu để mở khóa hệ thống.</p>
          </div>

          <form id="authLoginForm" class="auth-form" autocomplete="on">
            <div id="authAlert" class="auth-alert" style="display:none;"></div>

            <div class="auth-group">
              <label for="authUsernameInput">
                <span>Tên đăng nhập</span>
                <small style="color:var(--muted);font-weight:normal;">(Chủ sở hữu)</small>
              </label>
              <div class="auth-input-wrapper">
                <span class="auth-input-icon">👤</span>
                <input type="text" id="authUsernameInput" name="username" placeholder="Nhập tên đăng nhập..." required autocomplete="username" />
              </div>
            </div>

            <div class="auth-group">
              <label for="authPasswordInput">
                <span>Mật khẩu</span>
              </label>
              <div class="auth-input-wrapper">
                <span class="auth-input-icon">🔑</span>
                <input type="password" id="authPasswordInput" name="password" placeholder="Nhập mật khẩu..." required autocomplete="current-password" />
                <button type="button" class="auth-toggle-pwd" id="authTogglePwdBtn" title="Hiện/Ẩn mật khẩu" aria-label="Hiện/Ẩn mật khẩu">👁️</button>
              </div>
            </div>

            <div class="auth-options">
              <label class="auth-remember">
                <input type="checkbox" id="authRememberInput" checked />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <a href="javascript:void(0)" id="authForgotBtn" class="auth-forgot-link">Quên mật khẩu?</a>
            </div>

            <button type="submit" class="auth-btn-submit" id="authSubmitBtn">
              <span>Đăng nhập vào hệ thống</span>
              <span>→</span>
            </button>
          </form>

          <div class="auth-footer">
            <span>Hệ thống bảo vệ quyền tác giả & sáng kiến MathLab 2026.</span>
            <small>Tài khoản mặc định ban đầu: <b>admin</b> / <b>admin123</b></small>
          </div>
        </div>
      `;
      document.body.prepend(overlay);
    }

    // 2. Dialog Đổi tài khoản & mật khẩu
    if (!document.getElementById("accountDialog")) {
      const dialog = document.createElement("dialog");
      dialog.id = "accountDialog";
      dialog.className = "auth-dialog";
      dialog.innerHTML = `
        <div class="auth-dialog-card">
          <div class="auth-dialog-head">
            <h3><span>👑</span> Quản Lý Tài Khoản Chủ Sở Hữu</h3>
            <button type="button" id="closeAccountDialogBtn" title="Đóng">&times;</button>
          </div>
          <form id="accountSettingsForm" class="auth-dialog-body">
            <div id="accAlert" class="auth-alert" style="display:none;"></div>

            <div class="auth-group">
              <label for="accNewUsername">Tên đăng nhập mới</label>
              <div class="auth-input-wrapper">
                <span class="auth-input-icon">👤</span>
                <input type="text" id="accNewUsername" required placeholder="Nhập tên đăng nhập mới..." />
              </div>
            </div>

            <div class="auth-group">
              <label for="accCurrentPassword">Mật khẩu hiện tại <small style="color:#b91c1c;">*</small></label>
              <div class="auth-input-wrapper">
                <span class="auth-input-icon">🔑</span>
                <input type="password" id="accCurrentPassword" required placeholder="Nhập mật khẩu hiện tại để xác thực..." />
              </div>
            </div>

            <div class="auth-group">
              <label for="accNewPassword">Mật khẩu mới</label>
              <div class="auth-input-wrapper">
                <span class="auth-input-icon">🔒</span>
                <input type="password" id="accNewPassword" placeholder="Nhập mật khẩu mới (tối thiểu 4 ký tự)..." />
              </div>
            </div>

            <div class="auth-group">
              <label for="accConfirmPassword">Xác nhận mật khẩu mới</label>
              <div class="auth-input-wrapper">
                <span class="auth-input-icon">✔️</span>
                <input type="password" id="accConfirmPassword" placeholder="Nhập lại mật khẩu mới..." />
              </div>
            </div>

            <div class="auth-dialog-footer">
              <button type="button" class="ghost-btn" id="cancelAccountBtn">Hủy bỏ</button>
              <button type="submit" class="primary-btn" id="saveAccountBtn">Lưu thay đổi</button>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(dialog);
    }
  }

  /**
   * Hiển thị bảng điều khiển người dùng trên thanh Topbar
   */
  function renderTopbarControls(username) {
    const nav = document.querySelector(".topbar nav");
    if (!nav) return;

    let panel = document.getElementById("authUserPanel");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "authUserPanel";
      panel.className = "auth-user-panel";
      nav.appendChild(panel);
    }

    panel.innerHTML = `
      <span class="auth-user-badge" title="Tài khoản đang đăng nhập">
        <span class="auth-role-crown">👑</span>
        <span id="authTopbarUsername">${username}</span>
      </span>
      <button type="button" class="auth-btn-tool" id="openAccountSettingsBtn" title="Cài đặt đổi tài khoản và mật khẩu">
        <span>⚙️</span> <span>Tài khoản</span>
      </button>
      <button type="button" class="auth-btn-logout" id="logoutBtn" title="Đăng xuất và khóa trang web">
        <span>🚪</span> <span>Đăng xuất</span>
      </button>
    `;

    // Gắn sự kiện nút Cài đặt tài khoản
    const openBtn = document.getElementById("openAccountSettingsBtn");
    if (openBtn) {
      openBtn.onclick = openAccountModal;
    }

    // Gắn sự kiện nút Đăng xuất
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.onclick = handleLogout;
    }
  }

  function removeTopbarControls() {
    const panel = document.getElementById("authUserPanel");
    if (panel) {
      panel.remove();
    }
  }

  function setLockedState(isLocked) {
    const overlay = document.getElementById("authOverlay");
    if (isLocked) {
      document.documentElement.classList.add("auth-locked-html");
      document.body.classList.add("auth-locked");
      if (overlay) {
        overlay.removeAttribute("hidden");
        overlay.style.display = "flex";
      }
      removeTopbarControls();
    } else {
      document.documentElement.classList.remove("auth-locked-html");
      document.body.classList.remove("auth-locked");
      if (overlay) {
        overlay.setAttribute("hidden", "true");
        overlay.style.display = "none";
      }
    }
  }

  function showAlert(alertEl, message, type) {
    if (!alertEl) return;
    alertEl.className = "auth-alert " + (type || "error");
    alertEl.innerHTML = (type === "success" ? "✅ " : type === "info" ? "ℹ️ " : "⚠️ ") + message;
    alertEl.style.display = "flex";
  }

  function hideAlert(alertEl) {
    if (alertEl) {
      alertEl.style.display = "none";
    }
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    const alertEl = document.getElementById("authAlert");
    hideAlert(alertEl);

    const userInput = document.getElementById("authUsernameInput");
    const pwdInput = document.getElementById("authPasswordInput");
    const rememberInput = document.getElementById("authRememberInput");

    const username = (userInput ? userInput.value : "").trim();
    const password = pwdInput ? pwdInput.value : "";
    const remember = rememberInput ? rememberInput.checked : true;

    if (!username || !password) {
      showAlert(alertEl, "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
      return;
    }

    const config = getAuthConfig();
    const inputHash = hashPassword(password);

    // Kiểm tra tên đăng nhập (không phân biệt hoa thường) và mật khẩu
    if (username.toLowerCase() === config.username.toLowerCase() && inputHash === config.passwordHash) {
      setSession(config.username, remember);
      setLockedState(false);
      renderTopbarControls(config.username);
      showToast(`Đăng nhập thành công! Chào mừng Chủ sở hữu: ${config.username}`);
      if (pwdInput) pwdInput.value = "";
    } else {
      showAlert(alertEl, "Sai tên đăng nhập hoặc mật khẩu! Vui lòng thử lại.");
      if (pwdInput) {
        pwdInput.focus();
        pwdInput.select();
      }
      const card = document.querySelector(".auth-card");
      if (card) {
        card.style.animation = "none";
        card.offsetHeight; /* trigger reflow */
        card.style.animation = "authShake 0.35s ease-in-out";
      }
    }
  }

  function handleLogout() {
    if (confirm("Bạn có chắc chắn muốn đăng xuất và khóa trang web không?")) {
      const bgMusic = document.getElementById("bgMusic");
      if (bgMusic && typeof bgMusic.pause === "function") {
        try { bgMusic.pause(); } catch(e) {}
      }
      clearSession();
      setLockedState(true);
      showToast("Đã đăng xuất và khóa trang web an toàn.");
      const userInput = document.getElementById("authUsernameInput");
      const pwdInput = document.getElementById("authPasswordInput");
      if (userInput) {
        const config = getAuthConfig();
        userInput.value = config.username;
      }
      if (pwdInput) {
        pwdInput.value = "";
        pwdInput.focus();
      }
    }
  }

  function openAccountModal() {
    const dialog = document.getElementById("accountDialog");
    if (!dialog) return;

    const config = getAuthConfig();
    const newUsernameInput = document.getElementById("accNewUsername");
    const currentPassInput = document.getElementById("accCurrentPassword");
    const newPassInput = document.getElementById("accNewPassword");
    const confirmPassInput = document.getElementById("accConfirmPassword");
    const alertEl = document.getElementById("accAlert");

    hideAlert(alertEl);
    if (newUsernameInput) newUsernameInput.value = config.username;
    if (currentPassInput) currentPassInput.value = "";
    if (newPassInput) newPassInput.value = "";
    if (confirmPassInput) confirmPassInput.value = "";

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "true");
    }
  }

  function closeAccountModal() {
    const dialog = document.getElementById("accountDialog");
    if (!dialog) return;
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }

  function handleAccountSave(e) {
    e.preventDefault();
    const alertEl = document.getElementById("accAlert");
    hideAlert(alertEl);

    const config = getAuthConfig();
    const newUsername = (document.getElementById("accNewUsername").value || "").trim();
    const currentPassword = document.getElementById("accCurrentPassword").value || "";
    const newPassword = document.getElementById("accNewPassword").value || "";
    const confirmPassword = document.getElementById("accConfirmPassword").value || "";

    // 1. Kiểm tra mật khẩu hiện tại
    if (hashPassword(currentPassword) !== config.passwordHash) {
      showAlert(alertEl, "Mật khẩu hiện tại không chính xác! Không thể lưu thay đổi.");
      document.getElementById("accCurrentPassword").focus();
      return;
    }

    // 2. Kiểm tra tên đăng nhập mới
    if (!newUsername) {
      showAlert(alertEl, "Tên đăng nhập không được để trống!");
      return;
    }

    // 3. Nếu muốn đổi mật khẩu mới
    let finalPassword = currentPassword;
    if (newPassword || confirmPassword) {
      if (newPassword.length < 4) {
        showAlert(alertEl, "Mật khẩu mới phải có ít nhất 4 ký tự!");
        return;
      }
      if (newPassword !== confirmPassword) {
        showAlert(alertEl, "Mật khẩu mới và mật khẩu xác nhận không khớp!");
        return;
      }
      finalPassword = newPassword;
    }

    // Lưu cấu hình mới
    saveAuthConfig(newUsername, finalPassword);

    // Cập nhật session hiện tại
    const session = getActiveSession();
    if (session) {
      setSession(newUsername, session.remember);
    }

    renderTopbarControls(newUsername);
    closeAccountModal();
    showToast("Đã cập nhật tên đăng nhập và mật khẩu thành công!");
  }

  function handleForgotPassword() {
    const code = prompt(
      "🛡️ KHÔI PHỤC TÀI KHOẢN CHỦ SỞ HỮU\n\nVui lòng nhập Mã Khôi Phục Bí Mật của bạn để đặt lại tài khoản về mặc định (admin / admin123):",
      ""
    );
    if (!code) return;

    if (code.trim() === MASTER_RECOVERY_KEY) {
      saveAuthConfig(DEFAULT_USERNAME, DEFAULT_PASSWORD);
      clearSession();
      alert("✅ Khôi phục thành công!\n\nTài khoản đã được đặt lại về:\n- Tên đăng nhập: admin\n- Mật khẩu: admin123\n\nHãy đăng nhập và đổi mật khẩu mới ngay.");
      const userInput = document.getElementById("authUsernameInput");
      const pwdInput = document.getElementById("authPasswordInput");
      if (userInput) userInput.value = DEFAULT_USERNAME;
      if (pwdInput) {
        pwdInput.value = DEFAULT_PASSWORD;
        pwdInput.focus();
      }
    } else {
      alert("❌ Mã khôi phục không đúng! Chỉ chủ sở hữu có mã mới thực hiện được thao tác này.");
    }
  }

  function bindEvents() {
    // Form đăng nhập
    const loginForm = document.getElementById("authLoginForm");
    if (loginForm) {
      loginForm.onsubmit = handleLoginSubmit;
    }

    // Nút hiện/ẩn mật khẩu
    const toggleBtn = document.getElementById("authTogglePwdBtn");
    if (toggleBtn) {
      toggleBtn.onclick = function () {
        const pwdInput = document.getElementById("authPasswordInput");
        if (pwdInput) {
          if (pwdInput.type === "password") {
            pwdInput.type = "text";
            toggleBtn.textContent = "🙈";
          } else {
            pwdInput.type = "password";
            toggleBtn.textContent = "👁️";
          }
        }
      };
    }

    // Nút Quên mật khẩu
    const forgotBtn = document.getElementById("authForgotBtn");
    if (forgotBtn) {
      forgotBtn.onclick = handleForgotPassword;
    }

    // Form cài đặt tài khoản
    const accountForm = document.getElementById("accountSettingsForm");
    if (accountForm) {
      accountForm.onsubmit = handleAccountSave;
    }

    const closeAccBtn = document.getElementById("closeAccountDialogBtn");
    if (closeAccBtn) {
      closeAccBtn.onclick = closeAccountModal;
    }

    const cancelAccBtn = document.getElementById("cancelAccountBtn");
    if (cancelAccBtn) {
      cancelAccBtn.onclick = closeAccountModal;
    }
  }

  function init() {
    ensureAuthUI();
    bindEvents();

    const session = getActiveSession();
    if (session) {
      // Đã đăng nhập hợp lệ
      setLockedState(false);
      renderTopbarControls(session.username);
    } else {
      // Chưa đăng nhập -> Khóa trang và mở màn hình đăng nhập
      setLockedState(true);
      const config = getAuthConfig();
      const userInput = document.getElementById("authUsernameInput");
      if (userInput) {
        userInput.value = config.username;
      }
    }
  }

  // Khởi động khi DOM sẵn sàng
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Xuất API toàn cục để hỗ trợ nếu cần gọi từ console
  window.MathLabAuth = {
    logout: handleLogout,
    resetToDefault: function (key) {
      if (key === MASTER_RECOVERY_KEY) {
        saveAuthConfig(DEFAULT_USERNAME, DEFAULT_PASSWORD);
        clearSession();
        window.location.reload();
        return "Reset successful: admin / admin123";
      }
      return "Invalid master key.";
    },
    getConfig: function () {
      const cfg = getAuthConfig();
      return { username: cfg.username, updatedAt: cfg.updatedAt };
    },
  };
})();
