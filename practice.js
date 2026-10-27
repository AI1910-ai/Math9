// ==========================================================================
// TRUNG TÂM BÀI TẬP & LUYỆN TẬP TOÁN 9 (GDPT 2018)
// ==========================================================================

(() => {
  const STORAGE_KEY = 'mathlab_exercises_v1';
  const PROGRESS_KEY = 'mathlab_exercise_progress_v1';

  // 4 bài tập mẫu thực tế chuẩn SGK Toán 9 Kết Nối Tri Thức
  const DEFAULT_EXERCISES = [
    {
      id: "ex_cyl_1",
      title: "Bài 1: Tính diện tích vỏ tôn làm lon sữa Ông Thọ",
      category: "cylinder",
      categoryName: "Hình trụ",
      type: "fill",
      content: "Một hộp sữa đặc Ông Thọ hình trụ có bán kính đáy $r = 3.7\\text{ cm}$ và chiều cao $h = 8\\text{ cm}$. Người ta dùng tôn thiếc để dập vỏ hộp (gồm thân xung quanh và cả 2 nắp kín).\n\na) Tính diện tích xung quanh $S_{xq}$ của thân lon sữa (lấy $\\pi \\approx 3.14$, làm tròn đến chữ số thập phân thứ nhất).\nb) Tính tổng diện tích tôn $S_{tp}$ cần dùng để làm vỏ lon.",
      answer: "186.0",
      altAnswers: ["186", "185.98", "272", "272.0"],
      unit: "cm²",
      solution: "1. **Diện tích xung quanh của thân lon sữa**:\n$$S_{xq} = 2\\pi r h = 2 \\times 3.14 \\times 3.7 \\times 8 \\approx 185.984 \\approx 186.0\\text{ cm}^2$$\n\n2. **Diện tích hai nắp đáy**:\n$$2S_đ = 2\\pi r^2 = 2 \\times 3.14 \\times 3.7^2 \\approx 85.99 \\approx 86.0\\text{ cm}^2$$\n\n3. **Tổng diện tích tôn vỏ lon (diện tích toàn phần)**:\n$$S_{tp} = S_{xq} + 2S_đ = 186.0 + 86.0 = 272.0\\text{ cm}^2$$\n\n*Đáp số chấp nhận: 186.0 cm² (Sxq) hoặc 272.0 cm² (Stp).*",
      createdAt: "2026-10-27"
    },
    {
      id: "ex_cone_1",
      title: "Bài 2: Tính diện tích lá cọ lợp nón bài thơ xứ Huế",
      category: "cone",
      categoryName: "Hình nón",
      type: "choice",
      content: "Một chiếc nón lá bài thơ truyền thống có dạng hình nón với đường kính vành nón là $40\\text{ cm}$ (bán kính đáy $r = 20\\text{ cm}$) và độ dài đường sinh $l = 30\\text{ cm}$. Người thợ cần dùng lá cọ để lợp kín mặt xung quanh của nón (đáy nón để rỗng để đội đầu).\n\nDiện tích lá cọ tối thiểu cần dùng để lợp kín mặt xung quanh chiếc nón là bao nhiêu? (Lấy $\\pi \\approx 3.14$)",
      choices: [
        { key: "A", text: "1884 cm²" },
        { key: "B", text: "1256 cm²" },
        { key: "C", text: "3768 cm²" },
        { key: "D", text: "600 cm²" }
      ],
      correctChoice: "A",
      solution: "Vì đáy nón để rỗng để đội đầu, diện tích lá cọ cần dùng chỉ bằng diện tích xung quanh của hình nón:\n$$S_{xq} = \\pi r l = 3.14 \\times 20 \\times 30 = 1884\\text{ cm}^2$$\n\nĐáp án đúng là **A**.",
      createdAt: "2026-10-27"
    },
    {
      id: "ex_sph_1",
      title: "Bài 3: Thể tích lượng khí trong quả bóng rổ tiêu chuẩn",
      category: "sphere",
      categoryName: "Hình cầu",
      type: "fill",
      content: "Một quả bóng rổ thi đấu Size 7 có bán kính $r = 12\\text{ cm}$ (đường kính $24\\text{ cm}$). Khi được bơm căng đúng tiêu chuẩn, thể tích lượng khí chứa bên trong quả bóng rổ là bao nhiêu? (Lấy $\\pi \\approx 3.1416$, làm tròn kết quả đến hàng đơn vị).",
      answer: "7238",
      altAnswers: ["7238.2", "7238.23", "7235"],
      unit: "cm³",
      solution: "Áp dụng công thức tính thể tích khối cầu bán kính $r = 12\\text{ cm}$:\n$$V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3} \\times 3.1416 \\times 12^3 = \\frac{4}{3} \\times 3.1416 \\times 1728 \\approx 7238.23\\text{ cm}^3$$\n\nLàm tròn đến hàng đơn vị: **$7238\\text{ cm}^3$**.",
      createdAt: "2026-10-27"
    },
    {
      id: "ex_box_1",
      title: "Bài 4: Tính dung tích bể nước sinh hoạt hình hộp chữ nhật",
      category: "box",
      categoryName: "Hình hộp chữ nhật",
      type: "choice",
      content: "Một bể chứa nước gia đình có dạng hình hộp chữ nhật với kích thước bên trong lòng bể là: chiều dài $a = 2\\text{ m}$, chiều rộng $b = 1.5\\text{ m}$, và chiều cao $c = 1.2\\text{ m}$. Hỏi khi đổ đầy nước, bể chứa được tối đa bao nhiêu lít nước? (Biết $1\\text{ m}^3 = 1000\\text{ lít}$).",
      choices: [
        { key: "A", text: "360 lít" },
        { key: "B", text: "3600 lít" },
        { key: "C", text: "3.6 lít" },
        { key: "D", text: "1800 lít" }
      ],
      correctChoice: "B",
      solution: "1. Thể tích lòng bể chứa nước là:\n$$V = a \\times b \\times c = 2 \\times 1.5 \\times 1.2 = 3.6\\text{ m}^3$$\n\n2. Đổi sang đơn vị lít:\n$$3.6\\text{ m}^3 = 3.6 \\times 1000 = 3600\\text{ lít}$$\n\nĐáp án đúng là **B**.",
      createdAt: "2026-10-27"
    }
  ];

  // Helper functions
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  function getExercises(){
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if(data) {
        const parsed = jsonParse(data);
        if(Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch(e) {}
    return DEFAULT_EXERCISES;
  }

  function saveExercises(list){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function getProgress(){
    try {
      const data = localStorage.getItem(PROGRESS_KEY);
      if(data) return JSON.parse(data);
    } catch(e) {}
    return {};
  }

  function saveProgress(prog){
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(prog));
  }

  function jsonParse(str){
    return JSON.parse(str);
  }

  let currentFilter = 'all';

  // Render mathematical formulas with KaTeX
  function renderMath(container){
    if(window.renderMathInElement && container){
      window.renderMathInElement(container, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  }

  // Render Exercise Cards
  function renderExerciseList(){
    const grid = $('#exerciseGrid');
    if(!grid) return;

    const allExercises = getExercises();
    const progress = getProgress();

    // Update statistics
    const totalCount = allExercises.length;
    const completedCount = Object.keys(progress).filter(id => progress[id] && allExercises.some(e => e.id === id)).length;
    
    const progressEl = $('#practiceProgress');
    if(progressEl) {
      progressEl.innerHTML = `Đã hoàn thành: <b>${completedCount}/${totalCount}</b> bài`;
    }

    // Filter exercises
    const filtered = currentFilter === 'all' 
      ? allExercises 
      : allExercises.filter(e => e.category === currentFilter);

    if(filtered.length === 0){
      grid.innerHTML = `
        <div class="exercise-empty-state">
          <div style="font-size:36px;">📝</div>
          <h3>Chưa có bài tập nào trong mục này</h3>
          <p>Giáo viên có thể nhấp vào <b>"+ Giao bài tập mới"</b> phía trên để bổ sung bài tập cho học sinh.</p>
          <button type="button" class="primary-btn practice-add-btn" onclick="document.getElementById('openTeacherModal').click()">+ Giao bài tập ngay</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = '';

    filtered.forEach((ex, idx) => {
      const isDone = !!progress[ex.id];
      const card = document.createElement('article');
      card.className = 'exercise-card';
      card.dataset.id = ex.id;

      let solveHtml = '';
      if(ex.type === 'choice' && Array.isArray(ex.choices)){
        solveHtml = `
          <div class="exercise-choices">
            ${ex.choices.map(c => `
              <label class="exercise-choice-item ${isDone && progress[ex.id] === c.key ? 'selected' : ''}">
                <input type="radio" name="choice_${ex.id}" value="${c.key}" ${progress[ex.id] === c.key ? 'checked' : ''}>
                <b>${c.key}.</b> <span>${c.text}</span>
              </label>
            `).join('')}
          </div>
          <button type="button" class="exercise-submit-btn submit-choice-btn">Kiểm tra kết quả</button>
        `;
      } else {
        solveHtml = `
          <div class="exercise-fill-row">
            <input type="text" class="exercise-input fill-input" placeholder="Nhập đáp số..." value="${progress[ex.id] || ''}">
            <span class="exercise-unit-tag">${ex.unit || ''}</span>
            <button type="button" class="exercise-submit-btn submit-fill-btn">Kiểm tra</button>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="exercise-card-head">
          <span class="exercise-cat-tag ${ex.category}">${ex.categoryName || 'Toán 9'}</span>
          <span class="exercise-status-pill ${isDone ? 'completed' : ''}">${isDone ? '✓ Đã hoàn thành' : '○ Chưa làm'}</span>
        </div>
        <div class="exercise-card-body">
          <h3 class="exercise-title">${ex.title}</h3>
          <div class="exercise-content">${ex.content}</div>
          ${ex.image ? `<div class="exercise-img-wrap"><img src="${ex.image}" alt="Ảnh minh họa đề bài" loading="lazy"></div>` : ''}
          
          <div class="exercise-solve-box">
            ${solveHtml}
            <div class="exercise-feedback"></div>
          </div>

          ${ex.solution ? `
            <div class="exercise-solution-accordion">
              <button type="button" class="solution-toggle-btn"><span>✦ Xem gợi ý & Lời giải chi tiết</span> ▾</button>
              <div class="solution-content">${ex.solution}</div>
            </div>
          ` : ''}

          <div class="exercise-card-actions">
            <button type="button" class="btn-open-3d" title="Mở mô hình 3D tương ứng để quan sát trực quan">
              📐 Mô hình 3D
            </button>
            <a href="ai-assistant.html?q=${encodeURIComponent('Hướng dẫn giải chi tiết bài toán: ' + ex.title + '\n' + ex.content)}" class="btn-ask-ai" title="Nhờ AI phân tích và gợi ý cách giải">
              ✦ Hỏi AI
            </a>
            <div class="exercise-admin-btns" title="Dành cho Giáo viên">
              <button type="button" class="edit-btn" title="Chỉnh sửa bài tập">✏ Sửa</button>
              <button type="button" class="del-btn" title="Xóa bài tập này">🗑 Xóa</button>
            </div>
          </div>
        </div>
      `;

      // Event: Submit Choice
      const choiceBtn = card.querySelector('.submit-choice-btn');
      if(choiceBtn){
        choiceBtn.onclick = () => {
          const selected = card.querySelector(`input[name="choice_${ex.id}"]:checked`);
          const fb = card.querySelector('.exercise-feedback');
          if(!selected){
            fb.className = 'exercise-feedback incorrect';
            fb.textContent = 'Vui lòng chọn một phương án A, B, C hoặc D.';
            return;
          }
          const val = selected.value;
          if(val === ex.correctChoice){
            fb.className = 'exercise-feedback correct';
            fb.innerHTML = `🎉 <b>Chính xác!</b> Đáp án <b>${val}</b> hoàn toàn đúng. Hãy xem lời giải chi tiết bên dưới.`;
            card.querySelector('.exercise-status-pill').className = 'exercise-status-pill completed';
            card.querySelector('.exercise-status-pill').textContent = '✓ Đã hoàn thành';
            const prog = getProgress();
            prog[ex.id] = val;
            saveProgress(prog);
            renderProgressStats();
          } else {
            fb.className = 'exercise-feedback incorrect';
            fb.innerHTML = `❌ <b>Chưa chính xác.</b> Phương án <b>${val}</b> chưa đúng. Em hãy kiểm tra lại công thức hoặc tham khảo gợi ý nhé!`;
          }
        };
      }

      // Event: Submit Fill
      const fillBtn = card.querySelector('.submit-fill-btn');
      if(fillBtn){
        fillBtn.onclick = () => {
          const inp = card.querySelector('.fill-input');
          const fb = card.querySelector('.exercise-feedback');
          const userVal = (inp.value || '').trim().replace(',', '.');
          if(!userVal){
            fb.className = 'exercise-feedback incorrect';
            fb.textContent = 'Vui lòng nhập đáp số trước khi kiểm tra.';
            return;
          }

          const target = String(ex.answer || '').trim().replace(',', '.');
          const alts = (ex.altAnswers || []).map(a => String(a).trim().replace(',', '.'));
          
          let isCorrect = (userVal === target || alts.includes(userVal));
          if(!isCorrect && !isNaN(parseFloat(userVal)) && !isNaN(parseFloat(target))){
            const diff = Math.abs(parseFloat(userVal) - parseFloat(target));
            if(diff <= 0.15) isCorrect = true; // Cho phép sai số làm tròn nhẹ
          }

          if(isCorrect){
            fb.className = 'exercise-feedback correct';
            fb.innerHTML = `🎉 <b>Chính xác!</b> Đáp số <b>${userVal} ${ex.unit || ''}</b> chuẩn mực. Rất tốt!`;
            card.querySelector('.exercise-status-pill').className = 'exercise-status-pill completed';
            card.querySelector('.exercise-status-pill').textContent = '✓ Đã hoàn thành';
            const prog = getProgress();
            prog[ex.id] = userVal;
            saveProgress(prog);
            renderProgressStats();
          } else {
            fb.className = 'exercise-feedback incorrect';
            fb.innerHTML = `❌ <b>Chưa chính xác.</b> Đáp số <b>${userVal}</b> chưa trùng khớp. Em hãy kiểm tra lại phép tính hoặc nhấn "Xem gợi ý & Lời giải" nhé!`;
          }
        };
      }

      // Event: Toggle Solution
      const solBtn = card.querySelector('.solution-toggle-btn');
      const solBox = card.querySelector('.solution-content');
      if(solBtn && solBox){
        solBtn.onclick = () => {
          const isHidden = solBox.style.display !== 'block';
          solBox.style.display = isHidden ? 'block' : 'none';
          solBtn.querySelector('span').textContent = isHidden ? '✦ Thu gọn lời giải' : '✦ Xem gợi ý & Lời giải chi tiết';
          if(isHidden) renderMath(solBox);
        };
      }

      // Event: Open 3D Lab
      const open3dBtn = card.querySelector('.btn-open-3d');
      if(open3dBtn){
        open3dBtn.onclick = () => {
          if(window.openLab && window.MODELS){
            const targetM = window.MODELS.find(m => m.id === ex.category) || window.MODELS[0];
            window.openLab(targetM);
          } else {
            const modelTarget = document.getElementById('models');
            if(modelTarget) modelTarget.scrollIntoView({ behavior: 'smooth' });
          }
        };
      }

      // Event: Edit exercise (Teacher)
      const editBtn = card.querySelector('.edit-btn');
      if(editBtn){
        editBtn.onclick = () => openTeacherForm(ex.id);
      }

      // Event: Delete exercise (Teacher)
      const delBtn = card.querySelector('.del-btn');
      if(delBtn){
        delBtn.onclick = () => {
          if(confirm(`Bạn có chắc chắn muốn xóa "${ex.title}" khỏi danh sách bài tập không?`)){
            let list = getExercises();
            list = list.filter(item => item.id !== ex.id);
            saveExercises(list);
            renderExerciseList();
          }
        };
      }

      grid.append(card);
      renderMath(card);
    });
  }

  function renderProgressStats(){
    const all = getExercises();
    const prog = getProgress();
    const count = Object.keys(prog).filter(id => prog[id] && all.some(e => e.id === id)).length;
    const progressEl = $('#practiceProgress');
    if(progressEl) progressEl.innerHTML = `Đã hoàn thành: <b>${count}/${all.length}</b> bài`;
  }

  // Teacher Modal Management
  const teacherDialog = $('#teacherExerciseDialog');
  const teacherForm = $('#teacherExerciseForm');
  const typeSelect = $('#exType');
  const choiceBox = $('#choiceConfig');
  const fillBox = $('#fillConfig');
  const imgFileInput = $('#exImageFile');
  const imgUrlInput = $('#exImageUrl');
  const imgPreview = $('#exImagePreview');

  let currentImageData = null;

  function openTeacherForm(editId = null){
    if(!teacherDialog) return;
    teacherForm.reset();
    currentImageData = null;
    if(imgPreview){
      imgPreview.hidden = true;
      imgPreview.innerHTML = '';
    }

    const modalTitle = $('#teacherModalTitle');
    const idField = $('#editExerciseId');

    if(editId){
      const list = getExercises();
      const ex = list.find(item => item.id === editId);
      if(ex){
        modalTitle.textContent = 'Chỉnh sửa bài tập';
        idField.value = ex.id;
        $('#exTitle').value = ex.title || '';
        $('#exCategory').value = ex.category || 'cylinder';
        $('#exType').value = ex.type || 'fill';
        $('#exContent').value = ex.content || '';
        $('#exSolution').value = ex.solution || '';

        if(ex.type === 'choice'){
          choiceBox.hidden = false;
          fillBox.hidden = true;
          if(ex.choices){
            ['A', 'B', 'C', 'D'].forEach((k, idx) => {
              const ch = ex.choices.find(c => c.key === k);
              const inp = $(`#choice${k}`);
              if(inp) inp.value = ch ? ch.text : '';
            });
          }
          const rad = $(`input[name="correctChoice"][value="${ex.correctChoice || 'A'}"]`);
          if(rad) rad.checked = true;
        } else {
          choiceBox.hidden = true;
          fillBox.hidden = false;
          $('#exAnswer').value = ex.answer || '';
          $('#exUnit').value = ex.unit || '';
        }

        if(ex.image){
          currentImageData = ex.image;
          imgPreview.hidden = false;
          imgPreview.innerHTML = `<img src="${ex.image}" alt="Preview">`;
        }
      }
    } else {
      modalTitle.textContent = 'Soạn & Giao bài tập mới';
      idField.value = '';
      choiceBox.hidden = true;
      fillBox.hidden = false;
    }

    teacherDialog.showModal();
    document.body.style.overflow = 'hidden';
  }

  function closeTeacherForm(){
    if(!teacherDialog) return;
    teacherDialog.close();
    document.body.style.overflow = '';
  }

  // Handle Type Change (Fill vs Choice)
  if(typeSelect){
    typeSelect.onchange = () => {
      const isChoice = typeSelect.value === 'choice';
      choiceBox.hidden = !isChoice;
      fillBox.hidden = isChoice;
    };
  }

  // Handle Image File Upload (Convert to Base64 Data URL)
  if(imgFileInput){
    imgFileInput.onchange = e => {
      const file = e.target.files[0];
      if(file){
        const reader = new FileReader();
        reader.onload = ev => {
          currentImageData = ev.target.result;
          if(imgPreview){
            imgPreview.hidden = false;
            imgPreview.innerHTML = `<img src="${currentImageData}" alt="Ảnh tải lên">`;
          }
        };
        reader.readAsDataURL(file);
      }
    };
  }

  // Handle Image URL paste
  if(imgUrlInput){
    imgUrlInput.oninput = e => {
      const url = e.target.value.trim();
      if(url){
        currentImageData = url;
        if(imgPreview){
          imgPreview.hidden = false;
          imgPreview.innerHTML = `<img src="${url}" alt="Ảnh đề bài" onerror="this.parentElement.hidden=true;">`;
        }
      }
    };
  }

  // Form Submit (Save Exercise)
  if(teacherForm){
    teacherForm.onsubmit = e => {
      e.preventDefault();

      const editId = $('#editExerciseId').value;
      const title = $('#exTitle').value.trim();
      const cat = $('#exCategory').value;
      const type = $('#exType').value;
      const content = $('#exContent').value.trim();
      const solution = $('#exSolution').value.trim();

      const catNames = {
        cylinder: 'Hình trụ',
        cone: 'Hình nón',
        sphere: 'Hình cầu',
        box: 'Hình hộp chữ nhật',
        pyramid: 'Hình chóp tứ giác'
      };

      const newEx = {
        id: editId || 'ex_user_' + Date.now(),
        title,
        category: cat,
        categoryName: catNames[cat] || 'Toán 9',
        type,
        content,
        image: currentImageData || '',
        solution,
        createdAt: new Date().toISOString().split('T')[0]
      };

      if(type === 'choice'){
        newEx.choices = [
          { key: 'A', text: $('#choiceA').value.trim() || 'Lựa chọn A' },
          { key: 'B', text: $('#choiceB').value.trim() || 'Lựa chọn B' },
          { key: 'C', text: $('#choiceC').value.trim() || 'Lựa chọn C' },
          { key: 'D', text: $('#choiceD').value.trim() || 'Lựa chọn D' }
        ];
        const rad = $('input[name="correctChoice"]:checked');
        newEx.correctChoice = rad ? rad.value : 'A';
      } else {
        newEx.answer = $('#exAnswer').value.trim();
        newEx.unit = $('#exUnit').value.trim();
      }

      let list = getExercises();
      if(editId){
        const idx = list.findIndex(item => item.id === editId);
        if(idx !== -1) list[idx] = newEx;
      } else {
        list.unshift(newEx);
      }

      saveExercises(list);
      closeTeacherForm();
      renderExerciseList();
    };
  }

  // Bind Buttons & Events
  const openTeacherBtn = $('#openTeacherModal');
  if(openTeacherBtn) openTeacherBtn.onclick = () => openTeacherForm();

  const closeTeacherBtn = $('#closeTeacherModal');
  if(closeTeacherBtn) closeTeacherBtn.onclick = closeTeacherForm;

  const cancelTeacherBtn = $('#cancelTeacherModal');
  if(cancelTeacherBtn) cancelTeacherBtn.onclick = closeTeacherForm;

  // Filter Chips Click
  $$('.filter-chip').forEach(btn => {
    btn.onclick = () => {
      $$('.filter-chip').forEach(b => b.classList.toggle('active', b === btn));
      currentFilter = btn.dataset.filter || 'all';
      renderExerciseList();
    };
  });

  // Reset Default Exercises
  const resetBtn = $('#resetDefaultExercises');
  if(resetBtn){
    resetBtn.onclick = () => {
      if(confirm('Khôi phục danh sách 4 bài tập thực tế chuẩn SGK mẫu? (Các bài tập tự thêm sẽ được đặt lại)')){
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(PROGRESS_KEY);
        renderExerciseList();
      }
    };
  }

  // AI Suggest Button
  const aiSuggestBtn = $('#practiceAiSuggestBtn');
  if(aiSuggestBtn){
    aiSuggestBtn.onclick = () => {
      const prompt = 'Xin chào Trợ lý AI! Hãy gợi ý cho tôi 2 bài toán thực tế mới cho học sinh lớp 9 về Hình trụ, Hình nón hoặc Hình cầu (Toán 9 GDPT 2018). Mỗi bài gồm: Đề bài thực tế hấp dẫn, số liệu đo lường cụ thể, và lời giải từng bước để giáo viên đưa vào mục Luyện tập.';
      window.location.href = 'ai-assistant.html?q=' + encodeURIComponent(prompt);
    };
  }

  // --------------------------------------------------------------------------
  // BƯỚC 3: XUẤT VÀ NHẬP GÓI BÀI TẬP (.JSON) DÀNH CHO GIÁO VIÊN
  // --------------------------------------------------------------------------
  function showToast(msg){
    let toast = $('#mathlabToast');
    if(!toast){
      toast = document.createElement('div');
      toast.id = 'mathlabToast';
      toast.style.cssText = 'position:fixed;bottom:25px;right:25px;background:#0c6f61;color:#fff;padding:12px 20px;border-radius:10px;font-size:14px;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,0.25);z-index:99999;transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);display:flex;align-items:center;gap:8px;pointer-events:none;';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="font-size:16px;">✓</span> ${msg}`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
    }, 3500);
  }

  const exportBtn = $('#exportExercisesBtn');
  if(exportBtn){
    exportBtn.onclick = () => {
      const list = getExercises();
      if(!list || list.length === 0){
        alert('Hiện chưa có bài tập nào để xuất!');
        return;
      }
      const dataStr = JSON.stringify(list, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const dateStr = new Date().toISOString().slice(0, 10);
      link.download = `MathLab_NganHang_BaiTap_Toan9_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showToast(`Đã xuất thành công gói ${list.length} bài tập ra tệp JSON!`);
    };
  }

  const importBtn = $('#importExercisesBtn');
  const importInput = $('#importExercisesInput');
  if(importBtn && importInput){
    importBtn.onclick = () => {
      importInput.value = '';
      importInput.click();
    };

    importInput.onchange = (e) => {
      const file = e.target.files && e.target.files[0];
      if(!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if(!Array.isArray(imported) || imported.length === 0){
            alert('Tệp JSON không hợp lệ: Cần chứa danh sách mảng các bài tập.');
            return;
          }
          const validItems = imported.filter(item => item && (item.title || item.content));
          if(validItems.length === 0){
            alert('Không tìm thấy bài tập hợp lệ trong tệp.');
            return;
          }

          const currentList = getExercises();
          const shouldAppend = confirm(`Tìm thấy ${validItems.length} bài tập trong tệp.\n\nNhấn [OK] để THÊM VÀO danh sách hiện tại (${currentList.length} bài cũ).\nNhấn [Cancel] để HỦY BỎ thao tác.`);
          
          if(shouldAppend){
            const existingIds = new Set(currentList.map(x => x.id));
            validItems.forEach(item => {
              if(!item.id || existingIds.has(item.id)){
                item.id = 'ex_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
              }
              existingIds.add(item.id);
            });
            const finalList = [...currentList, ...validItems];
            saveExercises(finalList);
            renderExerciseList();
            showToast(`Đã nạp thêm ${validItems.length} bài tập thành công (Tổng: ${finalList.length} bài)!`);
          }
        } catch(err){
          console.error(err);
          alert('Lỗi đọc tệp JSON: Vui lòng kiểm tra định dạng tệp!');
        }
      };
      reader.readAsText(file, 'utf-8');
    };
  }

  // Auto-init on load
  window.addEventListener('DOMContentLoaded', () => {
    renderExerciseList();
  });

  // If script executes after DOMContentLoaded
  if(document.readyState === 'interactive' || document.readyState === 'complete'){
    renderExerciseList();
  }

  // Expose for external access
  window.MathLabPractice = {
    render: renderExerciseList,
    openTeacherForm
  };
})();
