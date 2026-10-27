(() => {
  const $ = s => document.querySelector(s);
  const panel = $('#ragChatPanel');
  const messages = $('#ragMessages');
  const input = $('#ragQuestion');
  const imageInput = $('#ragImageInput');
  const attachBtn = $('#ragAttachBtn');
  const imagePreview = $('#ragImagePreview');
  const previewThumb = $('#ragPreviewThumb');
  const removeImageBtn = $('#ragRemoveImage');
  const suggestionsBox = $('#ragSuggestions');
  const clearBtn = $('#ragChatClear');
  const exportBtn = $('#ragChatExport');

  // Dedicated AI Tab Workspace Elements
  const tabQuestion = $('#aiTabQuestion');
  const tabSendBtn = $('#aiTabSendBtn');
  const tabImageInput = $('#aiTabImageInput');
  const tabDropzone = $('#aiTabDropzone');
  const tabDropContent = $('#aiTabDropzoneContent');
  const tabDropPreview = $('#aiTabDropzonePreview');
  const tabPreviewImg = $('#aiTabPreviewImg');
  const tabRemoveImg = $('#aiTabRemoveImg');
  const boardBody = $('#aiBoardBody');
  const boardCopyBtn = $('#aiBoardCopyBtn');
  const boardPrintBtn = $('#aiBoardPrintBtn');
  const boardClearBtn = $('#aiBoardClearBtn');
  const tabFastPrompts = $('#aiTabFastPrompts');

  const STORAGE_KEY = 'mathlab_chat_history_v2';
  const MODE_KEY = 'mathlab_chat_mode_v2';
  const PANEL_KEY = 'mathlab_chat_panel_open_v2';

  let currentMode = localStorage.getItem(MODE_KEY) || 'detail'; // 'detail' | 'socratic' | 'teacher'
  let currentImage = null; // { data: base64, type: mimeType }
  let tabCurrentImage = null; // for the dedicated workspace
  let chatHistory = []; // [ { id, text, type, sources, imageThumb, timestamp } ]
  let knowledge = [];

  // Fetch knowledge base
  fetch('knowledge-base.json')
    .then(r => r.json())
    .then(x => knowledge = x)
    .catch(() => {});

  const SUGGESTIONS = {
    detail: [
      "Tính diện tích toàn phần hình trụ khi r = 5, h = 10 cm",
      "Tính thể tích hình nón khi r = 3, h = 4 cm",
      "Chứng minh định lý Pythagore đảo",
      "Cách giải hệ phương trình bằng phương pháp thế"
    ],
    socratic: [
      "Em chưa hiểu tại sao mặt cắt hình cầu lại là hình tròn có bán kính r' = sqrt(R^2 - hc^2)?",
      "Em chưa hiểu công thức diện tích xung quanh hình trụ",
      "Làm sao biết một tam giác có phải tam giác vuông không?",
      "Gợi ý cho em cách tìm nghiệm phương trình bậc 2"
    ],
    teacher: [
      "Kế hoạch bài dạy và phương pháp trực quan hóa bài Hình nón (Toán 9)",
      "Mục tiêu cần đạt và phân tích lỗi sai bài Hình trụ (SGV 9)",
      "Phương pháp dạy bài Định lí Pythagore lớp 8",
      "Gợi ý câu hỏi kiểm tra đánh giá chương Hình học không gian"
    ]
  };

  const updateSuggestions = () => {
    if (suggestionsBox) {
      const list = SUGGESTIONS[currentMode] || SUGGESTIONS.detail;
      suggestionsBox.innerHTML = list.map(t => `<button type="button">${t}</button>`).join('');
      suggestionsBox.querySelectorAll('button').forEach(b => {
        b.onclick = () => ask(b.textContent);
      });
    }
  };

  // Switch pedagogy mode across both workspace and popup
  const setMode = (mode) => {
    currentMode = mode;
    localStorage.setItem(MODE_KEY, currentMode);

    // Update popup buttons
    document.querySelectorAll('.rag-mode-btn').forEach(b => {
      b.classList.toggle('active', (b.dataset.mode || 'detail') === mode);
    });

    // Update workspace cards
    document.querySelectorAll('.ai-mode-card').forEach(c => {
      c.classList.toggle('active', (c.dataset.mode || 'detail') === mode);
    });

    updateSuggestions();
  };

  document.querySelectorAll('.rag-mode-btn').forEach(btn => {
    btn.onclick = () => setMode(btn.dataset.mode || 'detail');
  });

  document.querySelectorAll('.ai-mode-card').forEach(btn => {
    btn.onclick = () => setMode(btn.dataset.mode || 'detail');
  });

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

  // Safe localStorage saver
  const safeSaveHistory = () => {
    try {
      const trimmed = chatHistory.slice(-50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.warn('LocalStorage save quota exceeded:', e);
      try {
        const textOnly = chatHistory.slice(-30).map(m => ({ ...m, imageThumb: null }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(textOnly));
      } catch (err) {}
    }
  };

  // Lightweight thumbnail for storage
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

  // Render on dedicated big board
  const renderToBoard = (text, type, sources = [], imageObj = null) => {
    if (!boardBody) return;

    // Remove empty state if present
    const emptyState = boardBody.querySelector('.ai-empty-state');
    if (emptyState) emptyState.remove();

    if (type === 'user') {
      const qItem = document.createElement('div');
      qItem.className = 'ai-board-item';
      let html = `<div class="ai-board-q"><span>👤 Đề bài / Yêu cầu của bạn:</span><div style="margin-top:6px;">${renderMarkdownAndMath(text)}</div>`;
      if (imageObj && imageObj.data) {
        const src = imageObj.data.startsWith('data:') ? imageObj.data : `data:${imageObj.type || 'image/jpeg'};base64,${imageObj.data}`;
        html += `<img src="${src}" alt="Ảnh đề bài đính kèm" />`;
      }
      html += `</div>`;
      qItem.innerHTML = html;
      renderMath(qItem);
      boardBody.appendChild(qItem);
    } else if (type === 'bot') {
      const aItem = document.createElement('div');
      aItem.className = 'ai-board-a';
      aItem.innerHTML = renderMarkdownAndMath(text);
      renderMath(aItem);

      if (sources && sources.length) {
        const refs = document.createElement('div');
        refs.className = 'rag-sources';
        refs.style.marginTop = '16px';
        refs.innerHTML = '<b>Nguồn đối chiếu SGK & SGV Kết Nối Tri Thức</b>' + sources.map(s => {
          const typeBadge = s.type === 'SGV' ? '<span class="badge sgv">SGV</span>' : '<span class="badge sgk">SGK</span>';
          return `<span>${typeBadge} Toán ${s.grade} · <b>${s.lesson}</b> (Trang ${s.page})</span>`;
        }).join('');
        aItem.appendChild(refs);
      }

      boardBody.appendChild(aItem);
      boardBody.scrollTop = boardBody.scrollHeight;
    }
  };

  // Add message to chat box & board
  const add = (text, type = 'bot', sources = [], imageObj = null, save = true) => {
    // 1. Render to popup chat
    if (messages) {
      const box = document.createElement('div');
      box.className = 'rag-message ' + type;

      if (imageObj && imageObj.data) {
        const imgEl = document.createElement('img');
        imgEl.src = imageObj.data.startsWith('data:') ? imageObj.data : `data:${imageObj.type || 'image/jpeg'};base64,${imageObj.data}`;
        imgEl.className = 'rag-msg-image';
        imgEl.alt = 'Đề bài đính kèm';
        box.appendChild(imgEl);
      }

      const contentDiv = document.createElement('div');
      contentDiv.className = 'rag-msg-content';
      contentDiv.innerHTML = renderMarkdownAndMath(text);
      box.appendChild(contentDiv);
      renderMath(contentDiv);

      if (sources && sources.length) {
        const refs = document.createElement('div');
        refs.className = 'rag-sources';
        refs.innerHTML = '<b>Nguồn đối chiếu SGK & SGV</b>' + sources.map(s => {
          const typeBadge = s.type === 'SGV' ? '<span class="badge sgv">SGV</span>' : '<span class="badge sgk">SGK</span>';
          return `<span>${typeBadge} Toán ${s.grade} · <b>${s.lesson}</b> (Trang ${s.page})</span>`;
        }).join('');
        box.appendChild(refs);
      }

      if (type === 'bot' && !type.includes('loading')) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'rag-msg-actions';
        actionsDiv.innerHTML = '<button type="button" class="rag-msg-copy-btn" title="Sao chép lời giải này"><span>📋</span> Sao chép</button>';
        const copyBtn = actionsDiv.querySelector('.rag-msg-copy-btn');
        copyBtn.onclick = () => {
          navigator.clipboard.writeText(text).then(() => {
            copyBtn.innerHTML = '<span>✅</span> Đã chép!';
            setTimeout(() => { copyBtn.innerHTML = '<span>📋</span> Sao chép'; }, 2000);
          });
        };
        box.appendChild(actionsDiv);
      }

      messages.appendChild(box);
      messages.scrollTop = messages.scrollHeight;
    }

    // 2. Render to prominent Board
    if (!type.includes('loading')) {
      renderToBoard(text, type, sources, imageObj);
    }

    // 3. Save to history
    if (save && !type.includes('loading')) {
      const item = {
        id: Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        text,
        type,
        sources: sources || [],
        imageThumb: (imageObj && imageObj.data) ? imageObj.data : null,
        timestamp: Date.now()
      };
      chatHistory.push(item);
      safeSaveHistory();
    }

    return messages ? messages.lastElementChild : null;
  };

  // Restore history on load
  const restoreHistory = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const items = JSON.parse(raw);
        if (Array.isArray(items) && items.length > 0) {
          chatHistory = items;
          if (messages) {
            messages.innerHTML = '';
            const badge = document.createElement('div');
            badge.className = 'rag-history-badge';
            badge.innerHTML = '<span>💾 Đã khôi phục phiên làm việc trước đó</span>';
            messages.appendChild(badge);
          }

          if (boardBody) {
            boardBody.innerHTML = '';
          }

          items.forEach(msg => {
            add(
              msg.text,
              msg.type,
              msg.sources || [],
              msg.imageThumb ? { data: msg.imageThumb, type: 'image/jpeg' } : null,
              false
            );
          });
        }
      }
    } catch (e) {
      console.warn('Lỗi khôi phục lịch sử:', e);
    }

    setMode(currentMode);

    const wasOpen = localStorage.getItem(PANEL_KEY);
    if (wasOpen === 'true' && panel) {
      panel.hidden = false;
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
  async function ask(q, attachedImg = null) {
    const sendingImage = attachedImg || currentImage || tabCurrentImage;
    
    // Clear image selections
    currentImage = null;
    tabCurrentImage = null;
    if (imagePreview) { imagePreview.hidden = true; previewThumb.src = ''; }
    if (tabDropPreview) { tabDropPreview.hidden = true; tabPreviewImg.src = ''; tabDropContent.hidden = false; }
    if (imageInput) imageInput.value = '';
    if (tabImageInput) tabImageInput.value = '';

    if (sendingImage) {
      makeSmallThumbnail(sendingImage.data, (thumb) => {
        add(q || '[Đã gửi một ảnh đề bài]', 'user', [], { data: thumb || sendingImage.data, type: 'image/jpeg' }, true);
      });
    } else {
      add(q, 'user', [], null, true);
    }

    const waiting = add('Đang phân tích dữ kiện và tra cứu SGK…', 'bot loading', [], null, false);
    if (boardBody) {
      const waitBoard = document.createElement('div');
      waitBoard.id = 'aiBoardWaiting';
      waitBoard.style.cssText = 'padding:14px;background:#eef8f4;border-radius:10px;color:#126b5b;font-style:italic;margin-top:10px;';
      waitBoard.textContent = '⏳ AI đang nhận diện đề bài, phân tích định lý SGK và giải toán chi tiết...';
      boardBody.appendChild(waitBoard);
      boardBody.scrollTop = boardBody.scrollHeight;
    }

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
      if (waiting) waiting.remove();
      const waitBoard = $('#aiBoardWaiting');
      if (waitBoard) waitBoard.remove();

      add(data.answer || data.error, 'bot', data.sources || [], null, true);
    } catch {
      const sources = localRetrieve(q);
      if (waiting) waiting.remove();
      const waitBoard = $('#aiBoardWaiting');
      if (waitBoard) waitBoard.remove();

      if (sources.length) {
        add(sources[0].content + '\n\n*(Bản demo đang dùng chế độ tra cứu cục bộ. Khi kết nối máy chủ LAN, Gemini Flash sẽ giải toán và kết xuất công thức KaTeX)*', 'bot', sources, null, true);
      } else {
        add('Mình chưa tìm thấy nội dung phù hợp trong kho kiến thức hiện có.', 'bot', [], null, true);
      }
    }
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

  // Popup Image Selection
  if (attachBtn && imageInput) {
    attachBtn.onclick = () => imageInput.click();
    imageInput.onchange = () => {
      const file = imageInput.files && imageInput.files[0];
      if (!file) return;
      compressImage(file, (imgObj) => {
        currentImage = imgObj;
        previewThumb.src = imgObj.data;
        imagePreview.hidden = false;
        input.focus();
      });
    };
    if (removeImageBtn) {
      removeImageBtn.onclick = () => {
        currentImage = null;
        imagePreview.hidden = true;
        previewThumb.src = '';
        imageInput.value = '';
      };
    }
  }

  // Dedicated Workspace Image Dropzone
  if (tabDropzone && tabImageInput) {
    tabDropzone.onclick = (e) => {
      if (e.target !== tabRemoveImg) tabImageInput.click();
    };

    tabImageInput.onchange = () => {
      const file = tabImageInput.files && tabImageInput.files[0];
      if (!file) return;
      compressImage(file, (imgObj) => {
        tabCurrentImage = imgObj;
        tabPreviewImg.src = imgObj.data;
        tabDropPreview.hidden = false;
        tabDropContent.hidden = true;
      });
    };

    if (tabRemoveImg) {
      tabRemoveImg.onclick = (e) => {
        e.stopPropagation();
        tabCurrentImage = null;
        tabDropPreview.hidden = true;
        tabPreviewImg.src = '';
        tabDropContent.hidden = false;
        tabImageInput.value = '';
      };
    }

    // Drag and Drop
    tabDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      tabDropzone.classList.add('dragover');
    });
    tabDropzone.addEventListener('dragleave', () => tabDropzone.classList.remove('dragover'));
    tabDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      tabDropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        compressImage(e.dataTransfer.files[0], (imgObj) => {
          tabCurrentImage = imgObj;
          tabPreviewImg.src = imgObj.data;
          tabDropPreview.hidden = false;
          tabDropContent.hidden = true;
        });
      }
    });
  }

  // Handle Paste Image from Clipboard (Ctrl + V) across whole document or textareas
  window.addEventListener('paste', (e) => {
    const items = (e.clipboardData || window.clipboardData).items;
    for (let item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          compressImage(file, (imgObj) => {
            // Set for both
            currentImage = imgObj;
            tabCurrentImage = imgObj;

            if (previewThumb) previewThumb.src = imgObj.data;
            if (imagePreview) imagePreview.hidden = false;

            if (tabPreviewImg) tabPreviewImg.src = imgObj.data;
            if (tabDropPreview) tabDropPreview.hidden = false;
            if (tabDropContent) tabDropContent.hidden = true;
          });
        }
        break;
      }
    }
  });

  // Dedicated Workspace Send Button
  if (tabSendBtn && tabQuestion) {
    tabSendBtn.onclick = () => {
      const q = tabQuestion.value.trim();
      if (q || tabCurrentImage) {
        tabQuestion.value = '';
        ask(q, tabCurrentImage);
      } else {
        alert('Vui lòng nhập câu hỏi hoặc chọn ảnh bài tập.');
      }
    };

    tabQuestion.onkeydown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        tabSendBtn.click();
      }
    };
  }

  // Dedicated Workspace Fast Prompts
  if (tabFastPrompts) {
    tabFastPrompts.querySelectorAll('button').forEach(b => {
      b.onclick = () => {
        if (tabQuestion) tabQuestion.value = b.textContent;
        ask(b.textContent);
      };
    });
  }

  // Board Header Tools
  if (boardCopyBtn) {
    boardCopyBtn.onclick = () => {
      if (!chatHistory.length) {
        alert('Bảng chưa có nội dung lời giải để sao chép.');
        return;
      }
      const last = chatHistory.filter(m => m.type === 'bot').pop();
      const txt = last ? last.text : chatHistory.map(m => m.text).join('\n\n');
      navigator.clipboard.writeText(txt).then(() => {
        boardCopyBtn.innerHTML = '<span>✅</span> Đã chép!';
        setTimeout(() => { boardCopyBtn.innerHTML = '<span>📋</span> Sao chép'; }, 2000);
      });
    };
  }

  if (boardPrintBtn) {
    boardPrintBtn.onclick = () => {
      window.print();
    };
  }

  if (boardClearBtn) {
    boardClearBtn.onclick = () => {
      if (confirm('Bạn có chắc muốn làm mới bảng và bắt đầu bài toán mới?')) {
        chatHistory = [];
        localStorage.removeItem(STORAGE_KEY);
        if (boardBody) {
          boardBody.innerHTML = `
            <div class="ai-empty-state">
              <div class="ai-empty-illustration">📐 ✦ 🧮</div>
              <h4>Bảng Lời Giải Đang Chờ Đề Bài Của Bạn</h4>
              <p>Hãy tải ảnh bài tập lên hoặc chọn một câu hỏi gợi ý bên trái để quan sát AI giải từng bước, trích dẫn kiến thức SGK và kết xuất công thức KaTeX chuẩn mực.</p>
              <div class="ai-features-grid">
                <div><b>100% KaTeX</b><small>Công thức toán sắc nét, chuẩn mực</small></div>
                <div><b>Đa phương thức</b><small>Nhận diện đề từ ảnh chụp phiếu bài tập</small></div>
                <div><b>SGK & SGV</b><small>Bộ Kết Nối Tri Thức Toán 6–9</small></div>
              </div>
            </div>
          `;
        }
        if (messages) {
          messages.innerHTML = `
            <div class="rag-message bot">
              Chào bạn! Mình là Trợ lý Toán học THCS (Bộ Kết Nối Tri Thức). Bạn có thể gõ câu hỏi, chọn chế độ học tập hoặc <b>bấm nút 📷 (hoặc dán ảnh Ctrl+V)</b> để giải toán qua ảnh chụp nhé!
            </div>
          `;
        }
      }
    };
  }

  // Popup open/close
  if ($('#ragChatButton')) {
    $('#ragChatButton').onclick = () => {
      panel.hidden = false;
      localStorage.setItem(PANEL_KEY, 'true');
      input.focus();
      updateSuggestions();
    };
  }

  if ($('#ragChatClose')) {
    $('#ragChatClose').onclick = () => {
      panel.hidden = true;
      localStorage.setItem(PANEL_KEY, 'false');
    };
  }

  // Clear Popup Button
  if (clearBtn) {
    clearBtn.onclick = () => {
      if (confirm('Bạn có chắc muốn xóa lịch sử trò chuyện và bắt đầu bài mới?')) {
        boardClearBtn.click();
      }
    };
  }

  // Export Entire Transcript
  if (exportBtn) {
    exportBtn.onclick = () => {
      if (!chatHistory.length) {
        alert('Chưa có nội dung để sao chép.');
        return;
      }
      const transcript = [
        '=== LỊCH SỬ HỎI ĐÁP TOÁN HỌC (MATHLAB AI) ===',
        `Thời gian: ${new Date().toLocaleString('vi-VN')}`,
        ''
      ];
      chatHistory.forEach(m => {
        const role = m.type === 'user' ? '👤 [Học sinh]' : '🤖 [Trợ lý AI]';
        transcript.push(`${role}:\n${m.text}\n`);
      });
      navigator.clipboard.writeText(transcript.join('\n')).then(() => {
        exportBtn.innerHTML = '✅';
        setTimeout(() => { exportBtn.innerHTML = '📋'; }, 2000);
      });
    };
  }

  // Popup form submit
  if ($('#ragChatForm')) {
    $('#ragChatForm').onsubmit = (e) => {
      e.preventDefault();
      const q = input.value.trim();
      if (q || currentImage) {
        input.value = '';
        ask(q);
      }
    };
  }

  // Global MathLabChat API
  window.MathLabChat = {
    open: () => {
      // Scroll smoothly to the workspace tab!
      const tabEl = document.getElementById('ai-tab');
      if (tabEl) {
        tabEl.scrollIntoView({ behavior: 'smooth' });
        if (tabQuestion) tabQuestion.focus();
      } else if (panel) {
        panel.hidden = false;
        localStorage.setItem(PANEL_KEY, 'true');
        input.focus();
      }
    },
    openWithPrompt: (promptText) => {
      const tabEl = document.getElementById('ai-tab');
      if (tabEl) {
        tabEl.scrollIntoView({ behavior: 'smooth' });
        if (tabQuestion) tabQuestion.value = promptText;
        ask(promptText);
      } else {
        if (panel) {
          panel.hidden = false;
          localStorage.setItem(PANEL_KEY, 'true');
          input.value = promptText;
          input.focus();
        }
        ask(promptText);
      }
    }
  };

  // Initialize
  restoreHistory();
})();
