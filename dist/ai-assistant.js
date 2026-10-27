(() => {
  const $ = s => document.querySelector(s);
  
  // DOM Elements - Inputs & Controls
  const questionInput = $('#aiQuestion');
  const sendBtn = $('#aiSendBtn');
  const imageInput = $('#aiImageInput');
  const dropzone = $('#aiDropzone');
  const dropContent = $('#aiDropContent');
  const dropPreview = $('#aiDropPreview');
  const previewImg = $('#aiPreviewImg');
  const removeImgBtn = $('#aiRemoveImg');
  const fastPrompts = $('#aiFastPrompts');
  const modeGroup = $('#aiModeGroup');

  // DOM Elements - Tabs & History
  const tabAskBtn = $('#tabAskBtn');
  const tabHistoryBtn = $('#tabHistoryBtn');
  const panelAsk = $('#panelAsk');
  const panelHistory = $('#panelHistory');
  const historyListEl = $('#aiHistoryList');
  const historySearchInput = $('#aiHistorySearch');
  const historyCountPill = $('#historyCountPill');
  const aiHeaderCount = $('#aiHeaderCount');
  const aiNewChatBtn = $('#aiNewChatBtn');
  const aiNewChatSubBtn = $('#aiNewChatSubBtn');
  const aiOpenHistoryBtn = $('#aiOpenHistoryBtn');
  const aiClearAllHistoryBtn = $('#aiClearAllHistoryBtn');

  // DOM Elements - Board
  const boardBody = $('#aiBoardBody');
  const copyBtn = $('#aiCopyBtn');
  const printBtn = $('#aiPrintBtn');
  const clearBtn = $('#aiClearBtn');

  const STORAGE_KEY = 'mathlab_chat_history_v2';
  const MODE_KEY = 'mathlab_chat_mode_v2';

  let currentMode = localStorage.getItem(MODE_KEY) || 'detail'; // 'detail' | 'socratic' | 'teacher'
  let currentImage = null; // { data: base64, type: mimeType }
  let qaSessions = []; // [ { id, title, question, answer, mode, sources, imageThumb, timestamp } ]
  let knowledge = [];

  const MODE_INFO = {
    detail: { name: '💡 Giải chi tiết', class: 'detail' },
    socratic: { name: '🎓 Gia sư Socrate', class: 'socratic' },
    teacher: { name: '👨‍🏫 Sách giáo viên', class: 'teacher' }
  };

  // Fetch local knowledge base for fallback
  fetch('knowledge-base.json')
    .then(r => r.json())
    .then(x => knowledge = x)
    .catch(() => {});

  // Set Pedagogy Mode
  const setMode = (mode) => {
    currentMode = mode;
    localStorage.setItem(MODE_KEY, currentMode);
    document.querySelectorAll('.ai-mode-card').forEach(c => {
      c.classList.toggle('active', (c.dataset.mode || 'detail') === mode);
    });
  };

  if (modeGroup) {
    modeGroup.querySelectorAll('.ai-mode-card').forEach(btn => {
      btn.onclick = () => setMode(btn.dataset.mode || 'detail');
    });
  }

  // Switch Left Tabs
  const switchTab = (tabName) => {
    if (tabName === 'ask') {
      if (tabAskBtn) tabAskBtn.classList.add('active');
      if (tabHistoryBtn) tabHistoryBtn.classList.remove('active');
      if (panelAsk) panelAsk.hidden = false;
      if (panelHistory) panelHistory.hidden = true;
    } else {
      if (tabHistoryBtn) tabHistoryBtn.classList.add('active');
      if (tabAskBtn) tabAskBtn.classList.remove('active');
      if (panelHistory) panelHistory.hidden = false;
      if (panelAsk) panelAsk.hidden = true;
      renderHistorySidebar();
    }
  };

  if (tabAskBtn) tabAskBtn.onclick = () => switchTab('ask');
  if (tabHistoryBtn) tabHistoryBtn.onclick = () => switchTab('history');
  if (aiOpenHistoryBtn) aiOpenHistoryBtn.onclick = () => switchTab('history');

  // Format relative timestamp
  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    if (isToday) {
      return `Hôm nay ${hours}:${minutes}`;
    }
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}/${month} ${hours}:${minutes}`;
  };

  // Robust Markdown & KaTeX rendering engine
  const renderMarkdownAndMath = (raw) => {
    if (!raw) return '';

    const mathBlocks = [];
    let tokenIdx = 0;

    // 1. Extract Display Math: $$ ... $$
    let text = raw.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
      const token = `__MATH_BLOCK_${tokenIdx++}__`;
      let rendered = '';
      if (window.katex) {
        try {
          rendered = window.katex.renderToString(math.trim(), { displayMode: true, throwOnError: false });
        } catch (e) {
          rendered = `<div class="katex-display">$$${math}$$</div>`;
        }
      } else {
        rendered = `<div class="katex-display">$$${math}$$</div>`;
      }
      mathBlocks.push({ token, html: rendered });
      return token;
    });

    // 2. Extract Display Math: \[ ... \]
    text = text.replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => {
      const token = `__MATH_BLOCK_${tokenIdx++}__`;
      let rendered = '';
      if (window.katex) {
        try {
          rendered = window.katex.renderToString(math.trim(), { displayMode: true, throwOnError: false });
        } catch (e) {
          rendered = `<div class="katex-display">\\[${math}\\]</div>`;
        }
      } else {
        rendered = `<div class="katex-display">\\[${math}\\]</div>`;
      }
      mathBlocks.push({ token, html: rendered });
      return token;
    });

    // 3. Extract Inline Math: \( ... \)
    text = text.replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => {
      const token = `__MATH_BLOCK_${tokenIdx++}__`;
      let rendered = '';
      if (window.katex) {
        try {
          rendered = window.katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
        } catch (e) {
          rendered = `<span class="katex">\\(${math}\\)</span>`;
        }
      } else {
        rendered = `<span class="katex">\\(${math}\\)</span>`;
      }
      mathBlocks.push({ token, html: rendered });
      return token;
    });

    // 4. Extract Inline Math: $ ... $ (no newline inside)
    text = text.replace(/\$([^\$\n\r]+?)\$/g, (_, math) => {
      const token = `__MATH_BLOCK_${tokenIdx++}__`;
      let rendered = '';
      if (window.katex) {
        try {
          rendered = window.katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
        } catch (e) {
          rendered = `<span class="katex">$${math}$</span>`;
        }
      } else {
        rendered = `<span class="katex">$${math}$</span>`;
      }
      mathBlocks.push({ token, html: rendered });
      return token;
    });

    // 5. Parse Markdown Headings
    text = text.replace(/^####\s+(.*?)$/gm, '<h4 class="ai-heading">$1</h4>');
    text = text.replace(/^###\s+(.*?)$/gm, '<h3 class="ai-heading">$1</h3>');
    text = text.replace(/^##\s+(.*?)$/gm, '<h2 class="ai-heading">$1</h2>');

    // 6. Horizontal divider
    text = text.replace(/^---$/gm, '<hr class="ai-divider" />');

    // 7. Bullet / Step items
    text = text.replace(/^\s*\*\s+(Bước\s+\d+[:\.]?.*?)$/gm, '<div class="ai-step-card"><b>$1</b></div>');
    text = text.replace(/^\s*\*\s+(.*?)$/gm, '<div class="ai-list-item"><span class="ai-list-bullet">✦</span><span>$1</span></div>');

    // 8. Bold & Italic
    text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    text = text.replace(/\*(.*?)\*/g, '<i>$1</i>');

    // 9. Paragraphs and line breaks
    text = text.replace(/\r\n/g, '\n');
    text = text.replace(/\n{2,}/g, '</p><p>');
    text = text.replace(/\n/g, '<br>');
    text = `<p>${text}</p>`;

    // Clean up empty tags around block elements
    text = text.replace(/<p><\/p>/g, '');
    text = text.replace(/<p>(<h[234] class="ai-heading">.*?<\/h[234]>)<\/p>/g, '$1');
    text = text.replace(/<p>(<hr class="ai-divider"\s*\/?>)<\/p>/g, '$1');
    text = text.replace(/<p>(<div class="ai-step-card">.*?<\/div>)<\/p>/g, '$1');
    text = text.replace(/<p>(<div class="ai-list-item">.*?<\/div>)<\/p>/g, '$1');

    // 10. Re-insert rendered Math blocks
    for (const item of mathBlocks) {
      text = text.replace(item.token, item.html);
    }

    return text;
  };

  // KaTeX DOM Fallback
  const renderMath = (element) => {
    if (window.renderMathInElement && element) {
      try {
        window.renderMathInElement(element, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false }
          ],
          throwOnError: false
        });
      } catch (e) {
        console.warn('KaTeX fallback note:', e);
      }
    }
  };

  // Safe localStorage saving
  const saveSessions = () => {
    try {
      const trimmed = qaSessions.slice(0, 50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.warn('LocalStorage save quota exceeded:', e);
      try {
        const textOnly = qaSessions.slice(0, 30).map(m => ({ ...m, imageThumb: null }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(textOnly));
      } catch (err) {}
    }
    updateHistoryCounts();
  };

  const updateHistoryCounts = () => {
    const count = qaSessions.length;
    if (historyCountPill) historyCountPill.textContent = count;
    if (aiHeaderCount) aiHeaderCount.textContent = count;
  };

  // Lightweight thumbnail for storage (<10KB)
  const makeSmallThumbnail = (dataUrl, callback) => {
    if (!dataUrl) return callback(null);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxDim = 220;
      let w = img.width, h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
        else { w = Math.round((w * maxDim) / h); h = maxDim; }
      }
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      callback(canvas.toDataURL('image/jpeg', 0.65));
    };
    img.onerror = () => callback(null);
    img.src = dataUrl;
  };

  // Backward-compatible migration from old {text, type} format to Q&A sessions
  const migrateOldHistory = (items) => {
    if (!Array.isArray(items) || items.length === 0) return [];
    if (items[0] && (items[0].question !== undefined || items[0].answer !== undefined)) {
      return items;
    }
    const sessions = [];
    let lastUser = null;
    for (const msg of items) {
      if (msg.type === 'user') {
        lastUser = msg;
      } else if (msg.type === 'bot' && lastUser) {
        sessions.unshift({
          id: lastUser.id || ('qa-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5)),
          title: (lastUser.text || 'Bài toán qua ảnh').substring(0, 60).trim(),
          question: lastUser.text || '',
          answer: msg.text || '',
          mode: currentMode || 'detail',
          sources: msg.sources || [],
          imageThumb: lastUser.imageThumb || null,
          timestamp: lastUser.timestamp || Date.now()
        });
        lastUser = null;
      }
    }
    return sessions;
  };

  // Render individual session item on the Board
  const renderSessionToBoard = (session, index) => {
    const item = document.createElement('div');
    item.className = 'ai-board-item';
    item.id = `session-${session.id}`;

    const modeInfo = MODE_INFO[session.mode] || MODE_INFO.detail;
    const timeStr = formatTime(session.timestamp);

    let html = `
      <div class="ai-item-head">
        <div class="ai-item-meta">
          <span class="ai-item-num">BÀI #${index + 1}</span>
          <span class="ai-hist-badge ${modeInfo.class}">${modeInfo.name}</span>
          <span class="ai-hist-time">⏱️ ${timeStr}</span>
        </div>
        <div class="ai-item-actions">
          <button type="button" class="ai-item-btn copy-item-btn" title="Sao chép lời giải bài này">
            <span>📋</span> Sao chép
          </button>
          <button type="button" class="ai-item-btn danger del-item-btn" title="Xóa bài này khỏi lịch sử">
            <span>🗑️</span>
          </button>
        </div>
      </div>
      <div class="ai-board-q">
        <span>👤 Đề bài / Yêu cầu của bạn:</span>
        <div style="margin-top:6px;">${renderMarkdownAndMath(session.question)}</div>
    `;

    if (session.imageThumb) {
      const src = session.imageThumb.startsWith('data:') ? session.imageThumb : `data:image/jpeg;base64,${session.imageThumb}`;
      html += `<img src="${src}" alt="Ảnh đề bài đính kèm" />`;
    }
    html += `</div>`;

    html += `<div class="ai-board-a">${renderMarkdownAndMath(session.answer)}</div>`;

    if (session.sources && session.sources.length) {
      html += `
        <div class="rag-sources" style="margin-top:16px;">
          <b>Nguồn đối chiếu SGK & SGV Kết Nối Tri Thức</b>
          ${session.sources.map(s => {
            const typeBadge = s.type === 'SGV' ? '<span class="badge sgv">SGV</span>' : '<span class="badge sgk">SGK</span>';
            return `<span>${typeBadge} Toán ${s.grade} · <b>${s.lesson}</b> (Trang ${s.page})</span>`;
          }).join('')}
        </div>
      `;
    }

    item.innerHTML = html;

    // Bind item buttons
    const itemCopy = item.querySelector('.copy-item-btn');
    if (itemCopy) {
      itemCopy.onclick = () => {
        navigator.clipboard.writeText(session.answer || '').then(() => {
          itemCopy.innerHTML = '<span>✅</span> Đã chép!';
          setTimeout(() => { itemCopy.innerHTML = '<span>📋</span> Sao chép'; }, 1800);
        });
      };
    }

    const itemDel = item.querySelector('.del-item-btn');
    if (itemDel) {
      itemDel.onclick = () => {
        if (confirm('Bạn có muốn xóa bài toán này khỏi lịch sử không?')) {
          deleteSession(session.id);
        }
      };
    }

    renderMath(item);
    return item;
  };

  // Render complete Board
  const renderBoard = () => {
    if (!boardBody) return;
    boardBody.innerHTML = '';

    if (!qaSessions.length) {
      boardBody.innerHTML = `
        <div class="ai-empty-state">
          <div class="ai-empty-illustration">📐 ✦ 🧮</div>
          <h4>Bảng Lời Giải Đang Chờ Đề Bài Của Bạn</h4>
          <p>Hãy tải ảnh bài tập lên hoặc chọn một câu hỏi gợi ý bên trái để quan sát AI phân tích dữ kiện từng bước, trích dẫn kiến thức SGK và kết xuất công thức KaTeX sắc nét.</p>
          <div class="ai-features-grid">
            <div><b>100% KaTeX</b><small>Công thức toán sắc nét, chuẩn mực</small></div>
            <div><b>Đa phương thức</b><small>Nhận diện đề từ ảnh chụp phiếu bài tập</small></div>
            <div><b>SGK & SGV</b><small>Bộ Kết Nối Tri Thức Toán 6–9</small></div>
          </div>
        </div>
      `;
      return;
    }

    // Render in chronological order on board (oldest to newest)
    const chronological = [...qaSessions].reverse();
    chronological.forEach((session, idx) => {
      const el = renderSessionToBoard(session, idx);
      boardBody.appendChild(el);
    });
  };

  // Render History in Left Sidebar
  const renderHistorySidebar = () => {
    if (!historyListEl) return;
    historyListEl.innerHTML = '';

    const query = (historySearchInput ? historySearchInput.value : '').toLowerCase().trim();
    const filtered = qaSessions.filter(s => {
      if (!query) return true;
      return (s.question && s.question.toLowerCase().includes(query)) ||
             (s.answer && s.answer.toLowerCase().includes(query)) ||
             (s.title && s.title.toLowerCase().includes(query));
    });

    if (!qaSessions.length) {
      historyListEl.innerHTML = `
        <div class="ai-history-empty">
          <span>📜</span>
          <p>Chưa có lịch sử hỏi đáp nào.<br>Hãy gửi bài toán đầu tiên để bắt đầu lưu lịch sử học tập nhé!</p>
        </div>
      `;
      return;
    }

    if (!filtered.length) {
      historyListEl.innerHTML = `
        <div class="ai-history-empty">
          <span>🔍</span>
          <p>Không tìm thấy bài toán nào khớp với từ khóa "<b>${query}</b>".</p>
        </div>
      `;
      return;
    }

    filtered.forEach(session => {
      const card = document.createElement('div');
      card.className = 'ai-history-card';
      card.dataset.id = session.id;

      const modeInfo = MODE_INFO[session.mode] || MODE_INFO.detail;
      const timeStr = formatTime(session.timestamp);

      card.innerHTML = `
        <div class="ai-hist-top">
          <span class="ai-hist-badge ${modeInfo.class}">${modeInfo.name}</span>
          <span class="ai-hist-time">${timeStr}</span>
        </div>
        <div class="ai-hist-body">
          ${session.imageThumb ? '📷 ' : ''}${session.title || session.question}
        </div>
        <div class="ai-hist-footer">
          <span class="ai-hist-view">Xem lời giải →</span>
          <button type="button" class="ai-hist-del" title="Xóa bài này">🗑️</button>
        </div>
      `;

      // Click card to scroll to solution
      card.onclick = (e) => {
        if (e.target.closest('.ai-hist-del')) return;
        document.querySelectorAll('.ai-history-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const targetEl = document.getElementById(`session-${session.id}`);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetEl.style.transition = 'box-shadow 0.4s, background 0.4s';
          targetEl.style.boxShadow = '0 0 0 3px var(--teal)';
          targetEl.style.borderRadius = '14px';
          setTimeout(() => { targetEl.style.boxShadow = ''; }, 2000);
        }
      };

      // Delete single session
      const delBtn = card.querySelector('.ai-hist-del');
      if (delBtn) {
        delBtn.onclick = (e) => {
          e.stopPropagation();
          if (confirm('Bạn có muốn xóa bài toán này khỏi danh sách lịch sử không?')) {
            deleteSession(session.id);
          }
        };
      }

      historyListEl.appendChild(card);
    });
  };

  // Delete a session
  const deleteSession = (id) => {
    qaSessions = qaSessions.filter(s => s.id !== id);
    saveSessions();
    renderBoard();
    renderHistorySidebar();
  };

  // Start new question
  const startNewChat = () => {
    switchTab('ask');
    if (questionInput) {
      questionInput.value = '';
      questionInput.focus();
    }
    currentImage = null;
    if (dropPreview) dropPreview.hidden = true;
    if (previewImg) previewImg.src = '';
    if (dropContent) dropContent.hidden = false;
    if (imageInput) imageInput.value = '';
  };

  if (aiNewChatBtn) aiNewChatBtn.onclick = startNewChat;
  if (aiNewChatSubBtn) aiNewChatSubBtn.onclick = startNewChat;

  // Search input handler
  if (historySearchInput) {
    historySearchInput.oninput = () => renderHistorySidebar();
  }

  // Clear all history
  if (aiClearAllHistoryBtn) {
    aiClearAllHistoryBtn.onclick = () => {
      if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử hỏi đáp không? Thao tác này không thể hoàn tác.')) {
        qaSessions = [];
        saveSessions();
        renderBoard();
        renderHistorySidebar();
      }
    };
  }

  // Restore history on load
  const restoreHistory = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        qaSessions = migrateOldHistory(parsed);
      }
    } catch (e) {
      console.warn('Lỗi khôi phục lịch sử:', e);
    }

    setMode(currentMode);
    renderBoard();
    updateHistoryCounts();
    renderHistorySidebar();

    // Check URL parameters (e.g. ?prompt=...)
    const params = new URLSearchParams(window.location.search);
    const initialPrompt = params.get('prompt') || params.get('q');
    if (initialPrompt) {
      if (questionInput) questionInput.value = initialPrompt;
      ask(initialPrompt);
    }
  };

  // Local fallback retrieval
  const localRetrieve = q => {
    const low = q.toLowerCase();
    const terms = (low.match(/[a-zA-ZÀ-ỹ0-9]+/g) || []).filter(x => x.length > 2);
    const ranked = knowledge.map(s => ({
      s,
      n: terms.reduce((n, t) => n + (s.title.toLowerCase().includes(t) ? 2 : 0) + (s.content.toLowerCase().includes(t) ? 1 : 0), 0) + 
         (low.includes((s.lesson || '').toLowerCase()) ? 8 : 0)
    })).filter(x => x.n).sort((a, b) => b.n - a.n);

    if (!ranked.length) return knowledge.slice(0, 3);
    return ranked.filter(x => x.n >= Math.max(2, ranked[0].n * 0.5)).slice(0, 3).map(x => x.s);
  };

  // Ask function
  async function ask(q) {
    const sendingImage = currentImage;
    currentImage = null;
    if (dropPreview) dropPreview.hidden = true;
    if (previewImg) previewImg.src = '';
    if (dropContent) dropContent.hidden = false;
    if (imageInput) imageInput.value = '';

    // Switch to Ask tab
    switchTab('ask');

    // Remove empty state
    const empty = boardBody ? boardBody.querySelector('.ai-empty-state') : null;
    if (empty) empty.remove();

    // Temporary User Item on Board
    const tempUserItem = document.createElement('div');
    tempUserItem.className = 'ai-board-item';
    tempUserItem.id = 'aiTempUserItem';
    let userHtml = `<div class="ai-board-q"><span>👤 Đề bài / Yêu cầu của bạn:</span><div style="margin-top:6px;">${renderMarkdownAndMath(q || '[Đã gửi một ảnh đề bài]')}</div>`;
    if (sendingImage && sendingImage.data) {
      userHtml += `<img src="${sendingImage.data}" alt="Ảnh đề bài đính kèm" />`;
    }
    userHtml += `</div>`;
    tempUserItem.innerHTML = userHtml;
    boardBody.appendChild(tempUserItem);

    // Waiting indicator on board
    const waitBoard = document.createElement('div');
    waitBoard.id = 'aiBoardWaiting';
    waitBoard.style.cssText = 'padding:16px;background:#eef8f4;border-radius:12px;color:#126b5b;font-style:italic;margin-top:14px;border:1px dashed #16a389;display:flex;align-items:center;gap:10px;';
    waitBoard.innerHTML = '<span style="font-size:20px;">⏳</span> <b>AI đang phân tích đề bài, đối chiếu SGK và kết xuất công thức KaTeX…</b>';
    boardBody.appendChild(waitBoard);
    boardBody.scrollTop = boardBody.scrollHeight;

    let botAnswer = '';
    let botSources = [];

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          image: sendingImage ? sendingImage.data : '',
          image_type: sendingImage ? sendingImage.type : 'image/jpeg',
          mode: currentMode
        })
      });

      if (!res.ok) throw new Error('offline');
      const data = await res.json();
      botAnswer = data.answer || data.error;
      botSources = data.sources || [];
    } catch {
      const sources = localRetrieve(q);
      botSources = sources;
      if (sources.length) {
        botAnswer = sources[0].content + '\n\n*(Bản demo đang dùng chế độ tra cứu cục bộ. Khi kết nối máy chủ LAN, Gemini Flash sẽ giải toán và kết xuất công thức KaTeX)*';
      } else {
        botAnswer = 'Mình chưa tìm thấy nội dung phù hợp trong kho kiến thức hiện có.';
      }
    } finally {
      const wb = $('#aiBoardWaiting');
      if (wb) wb.remove();
      const tu = $('#aiTempUserItem');
      if (tu) tu.remove();
    }

    // Save session
    makeSmallThumbnail(sendingImage ? sendingImage.data : null, (thumb) => {
      const newSession = {
        id: 'qa-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        title: (q || 'Bài toán qua ảnh').substring(0, 60).trim(),
        question: q || '[Đề bài qua ảnh chụp]',
        answer: botAnswer,
        mode: currentMode,
        sources: botSources,
        imageThumb: thumb || null,
        timestamp: Date.now()
      };

      qaSessions.unshift(newSession); // newest first
      saveSessions();
      renderBoard();
      renderHistorySidebar();

      // Scroll to newest session at the bottom of the board
      const latestEl = document.getElementById(`session-${newSession.id}`);
      if (latestEl) {
        latestEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    });
  }

  // Compress image helper
  const compressImage = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width, height = img.height;
        const maxDim = 1400;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        callback({
          data: canvas.toDataURL('image/jpeg', 0.88),
          type: 'image/jpeg'
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Dropzone handling
  if (dropzone && imageInput) {
    dropzone.onclick = (e) => {
      if (e.target !== removeImgBtn) imageInput.click();
    };

    imageInput.onchange = () => {
      const file = imageInput.files && imageInput.files[0];
      if (!file) return;
      compressImage(file, (imgObj) => {
        currentImage = imgObj;
        previewImg.src = imgObj.data;
        dropPreview.hidden = false;
        dropContent.hidden = true;
        if (questionInput) questionInput.focus();
      });
    };

    if (removeImgBtn) {
      removeImgBtn.onclick = (e) => {
        e.stopPropagation();
        currentImage = null;
        dropPreview.hidden = true;
        previewImg.src = '';
        dropContent.hidden = false;
        imageInput.value = '';
      };
    }

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        compressImage(file, (imgObj) => {
          currentImage = imgObj;
          previewImg.src = imgObj.data;
          dropPreview.hidden = false;
          dropContent.hidden = true;
          if (questionInput) questionInput.focus();
        });
      }
    });
  }

  // Paste image handler (Ctrl + V)
  window.addEventListener('paste', (e) => {
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          compressImage(file, (imgObj) => {
            currentImage = imgObj;
            if (previewImg) previewImg.src = imgObj.data;
            if (dropPreview) dropPreview.hidden = false;
            if (dropContent) dropContent.hidden = true;
            if (questionInput) questionInput.focus();
          });
        }
        break;
      }
    }
  });

  // Send button & enter key
  if (sendBtn) {
    sendBtn.onclick = () => {
      const q = questionInput ? questionInput.value.trim() : '';
      if (!q && !currentImage) {
        alert('Vui lòng nhập câu hỏi toán học hoặc tải lên ảnh đề bài.');
        if (questionInput) questionInput.focus();
        return;
      }
      ask(q);
      if (questionInput) questionInput.value = '';
    };
  }

  if (questionInput) {
    questionInput.onkeydown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
      }
    };
  }

  // Fast prompt tags
  if (fastPrompts) {
    fastPrompts.querySelectorAll('button').forEach(b => {
      b.onclick = () => {
        if (questionInput) questionInput.value = b.textContent;
        ask(b.textContent);
      };
    });
  }

  // Copy all button
  if (copyBtn) {
    copyBtn.onclick = () => {
      if (!qaSessions.length) {
        alert('Chưa có nội dung lời giải để sao chép.');
        return;
      }
      const txt = qaSessions.map(s => `[ĐỀ BÀI]: ${s.question}\n[LỜI GIẢI]:\n${s.answer}`).join('\n\n---\n\n');
      navigator.clipboard.writeText(txt).then(() => {
        copyBtn.innerHTML = '<span>✅</span> Đã chép!';
        setTimeout(() => { copyBtn.innerHTML = '<span>📋</span> Sao chép'; }, 2000);
      });
    };
  }

  // Print button
  if (printBtn) {
    printBtn.onclick = () => {
      window.print();
    };
  }

  // Clear board button
  if (clearBtn) {
    clearBtn.onclick = () => {
      if (confirm('Bạn có muốn làm sạch bảng để bắt đầu bài toán mới không? (Lịch sử các bài cũ vẫn được lưu an toàn trong tab Lịch sử)')) {
        startNewChat();
        boardBody.innerHTML = `
          <div class="ai-empty-state">
            <div class="ai-empty-illustration">📐 ✦ 🧮</div>
            <h4>Bảng Sẵn Sàng Cho Bài Toán Mới</h4>
            <p>Nhập câu hỏi hoặc tải ảnh đề bài ở cột trái để bắt đầu. Bạn có thể xem lại toàn bộ các bài trước trong tab <b>📜 Lịch sử hỏi đáp</b>.</p>
          </div>
        `;
      }
    };
  }

  // Initialize
  restoreHistory();

  // Safety re-render on window load
  window.addEventListener('load', () => {
    if (boardBody) {
      renderMath(boardBody);
    }
  });
})();
