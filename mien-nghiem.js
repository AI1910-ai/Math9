/**
 * Miền nghiệm & Khảo sát Cực trị Hàm Mục Tiêu Oxy
 * Dành cho học tập & giảng dạy Toán THCS/THPT (GDPT 2018)
 */

(() => {
  const $ = (s) => document.querySelector(s);
  const canvas = $('#lpCanvas');
  const ctx = canvas.getContext('2d');

  // DOM Elements
  const presetSelect = $('#lpPresetSelect');
  const ineqListEl = $('#lpIneqList');
  const addIneqBtn = $('#lpAddIneq');
  const objAInput = $('#lpObjA');
  const objBInput = $('#lpObjB');
  const calcBtn = $('#lpCalcBtn');
  const targetToggle = $('#lpTargetToggle');
  const fInput = $('#lpFInput');
  const fSlider = $('#lpFSlider');
  const btnMinBound = $('#lpBtnMinBound');
  const btnMaxBound = $('#lpBtnMaxBound');
  const fitViewBtn = $('#lpFitView');
  const resetViewBtn = $('#lpResetView');
  const toggleGridBtn = $('#lpToggleGrid');
  const downloadPngBtn = $('#lpDownloadPng');
  const askAiBtn = $('#lpAskAiBtn');

  // Results DOM
  const vertexCountEl = $('#lpVertexCount');
  const minValEl = $('#lpMinVal');
  const minLocEl = $('#lpMinLoc');
  const maxValEl = $('#lpMaxVal');
  const maxLocEl = $('#lpMaxLoc');
  const tableHeadObj = $('#lpTableHeadObj');
  const tableBody = $('#lpTableBody');

  // State
  let showGrid = true;
  let view = {
    centerX: 4,
    centerY: 3,
    scale: 44, // pixels per math unit
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    viewStartX: 0,
    viewStartY: 0
  };

  let draggingLine = false;

  // Preset Configurations
  const PRESETS = {
    standard: {
      name: "Bài toán chuẩn (Theo ảnh mẫu)",
      ineqs: [
        { a: 1, b: 0, op: '>=', c: 0 },
        { a: 0, b: 1, op: '>=', c: 0 },
        { a: 2, b: 1, op: '<=', c: 8 },
        { a: 1, b: 1, op: '<=', c: 6 }
      ],
      obj: { a: 2, b: 5 },
      targetF: 15
    },
    tailor: {
      name: "Bài toán thực tế: Xưởng may áo & quần",
      ineqs: [
        { a: 1, b: 0, op: '>=', c: 0 },
        { a: 0, b: 1, op: '>=', c: 0 },
        { a: 2, b: 1, op: '<=', c: 10 },
        { a: 1, b: 2, op: '<=', c: 8 }
      ],
      obj: { a: 40, b: 30 },
      targetF: 160
    },
    nutrition: {
      name: "Bài toán dinh dưỡng: Khẩu phần ăn tối ưu",
      ineqs: [
        { a: 1, b: 0, op: '>=', c: 0 },
        { a: 0, b: 1, op: '>=', c: 0 },
        { a: 1, b: 1, op: '>=', c: 4 },
        { a: 2, b: 1, op: '>=', c: 5 },
        { a: 1, b: 3, op: '<=', c: 12 }
      ],
      obj: { a: 3, b: 2 },
      targetF: 9
    },
    triangle: {
      name: "Miền nghiệm tam giác (3 ràng buộc)",
      ineqs: [
        { a: 0, b: 1, op: '>=', c: 0 },
        { a: 1, b: -1, op: '<=', c: 2 },
        { a: 1, b: 2, op: '<=', c: 8 }
      ],
      obj: { a: 3, b: -2 },
      targetF: 4
    }
  };

  let currentIneqs = JSON.parse(JSON.stringify(PRESETS.standard.ineqs));
  let currentObj = { ...PRESETS.standard.obj };
  let currentTargetF = PRESETS.standard.targetF;
  let currentVertices = [];
  let currentFeasiblePoly = [];
  let currentExtrema = { min: 0, minVertices: [], max: 0, maxVertices: [] };

  // Responsive Canvas Fit
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  window.addEventListener('resize', resizeCanvas);

  // Coordinate Conversion
  function toScreen(x, y) {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const sx = w / 2 + (x - view.centerX) * view.scale;
    const sy = h / 2 - (y - view.centerY) * view.scale;
    return { x: sx, y: sy };
  }

  function toWorld(sx, sy) {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const wx = view.centerX + (sx - w / 2) / view.scale;
    const wy = view.centerY - (sy - h / 2) / view.scale;
    return { x: wx, y: wy };
  }

  // Linear Programming / Half-plane intersection
  const BOUND = 40;

  function clipPolygonWithHalfPlane(poly, a, b, c) {
    // Keep side: a*x + b*y <= c
    const res = [];
    if (poly.length === 0) return res;

    function isInside(p) {
      return (a * p.x + b * p.y) <= c + 1e-7;
    }

    function lineIntersect(p1, p2) {
      const denom = a * (p2.x - p1.x) + b * (p2.y - p1.y);
      if (Math.abs(denom) < 1e-9) return p1;
      const t = (c - (a * p1.x + b * p1.y)) / denom;
      return {
        x: p1.x + t * (p2.x - p1.x),
        y: p1.y + t * (p2.y - p1.y)
      };
    }

    for (let i = 0; i < poly.length; i++) {
      const cur = poly[i];
      const prev = poly[(i + poly.length - 1) % poly.length];

      const curIn = isInside(cur);
      const prevIn = isInside(prev);

      if (curIn) {
        if (!prevIn) {
          res.push(lineIntersect(prev, cur));
        }
        res.push(cur);
      } else if (prevIn) {
        res.push(lineIntersect(prev, cur));
      }
    }
    return res;
  }

  function solveFeasibleRegion(ineqs) {
    // Initial large bounding box
    let poly = [
      { x: -BOUND, y: -BOUND },
      { x: BOUND, y: -BOUND },
      { x: BOUND, y: BOUND },
      { x: -BOUND, y: BOUND }
    ];

    for (const ineq of ineqs) {
      let a = ineq.a;
      let b = ineq.b;
      let c = ineq.c;
      if (ineq.op.includes('>')) {
        // Reverse to <=
        a = -a;
        b = -b;
        c = -c;
      }
      poly = clipPolygonWithHalfPlane(poly, a, b, c);
      if (poly.length === 0) break;
    }

    // Filter duplicate / close vertices
    const clean = [];
    for (const p of poly) {
      if (!clean.some(q => Math.hypot(p.x - q.x, p.y - q.y) < 1e-4)) {
        clean.push({
          x: Math.abs(p.x) < 1e-5 ? 0 : Math.round(p.x * 1000) / 1000,
          y: Math.abs(p.y) < 1e-5 ? 0 : Math.round(p.y * 1000) / 1000
        });
      }
    }

    // Filter true vertices (not on the virtual large boundary)
    const trueVertices = clean.filter(p =>
      Math.abs(p.x) < BOUND - 0.5 && Math.abs(p.y) < BOUND - 0.5
    );

    // Sort true vertices counter-clockwise around center or from origin
    if (trueVertices.length > 2) {
      const cx = trueVertices.reduce((s, p) => s + p.x, 0) / trueVertices.length;
      const cy = trueVertices.reduce((s, p) => s + p.y, 0) / trueVertices.length;
      trueVertices.sort((p1, p2) => Math.atan2(p1.y - cy, p1.x - cx) - Math.atan2(p2.y - cy, p2.x - cx));

      // Put bottom-leftmost vertex as A
      let bestIdx = 0;
      let minScore = Infinity;
      trueVertices.forEach((p, i) => {
        const score = p.y * 1000 + p.x;
        if (score < minScore) {
          minScore = score;
          bestIdx = i;
        }
      });
      const rotated = [...trueVertices.slice(bestIdx), ...trueVertices.slice(0, bestIdx)];
      trueVertices.length = 0;
      trueVertices.push(...rotated);
    }

    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    trueVertices.forEach((p, idx) => {
      p.label = labels[idx % labels.length];
    });

    return { poly: clean, vertices: trueVertices };
  }

  function calculateExtrema() {
    const { a, b } = currentObj;
    if (currentVertices.length === 0) {
      currentExtrema = { min: 0, minVertices: [], max: 0, maxVertices: [] };
      return;
    }

    let minVal = Infinity;
    let maxVal = -Infinity;

    currentVertices.forEach(p => {
      const val = Math.round((a * p.x + b * p.y) * 1000) / 1000;
      p.val = val;
      if (val < minVal) minVal = val;
      if (val > maxVal) maxVal = val;
    });

    const minVertices = currentVertices.filter(p => Math.abs(p.val - minVal) < 1e-4);
    const maxVertices = currentVertices.filter(p => Math.abs(p.val - maxVal) < 1e-4);

    currentExtrema = {
      min: minVal,
      minVertices,
      max: maxVal,
      maxVertices
    };

    // Update Slider Bounds
    const span = Math.max(10, maxVal - minVal);
    const sMin = Math.floor(minVal - span * 0.15);
    const sMax = Math.ceil(maxVal + span * 0.15);
    fSlider.min = sMin;
    fSlider.max = sMax;
    fSlider.step = span > 50 ? '1' : '0.5';

    if (currentTargetF < sMin || currentTargetF > sMax) {
      currentTargetF = Math.round((minVal + maxVal) / 2);
    }
    fSlider.value = currentTargetF;
    fInput.value = currentTargetF;
  }

  // Render Table & Cards
  function renderSurveyUI() {
    const { a, b } = currentObj;
    const objText = `${a !== 1 ? (a === -1 ? '-' : a) : ''}x ${b >= 0 ? '+ ' + (b === 1 ? '' : b) : '- ' + (b === -1 ? '' : Math.abs(b))}y`;
    tableHeadObj.textContent = `F = ${objText}`;

    vertexCountEl.textContent = `${currentVertices.length} đỉnh`;

    if (currentVertices.length === 0) {
      minValEl.textContent = '—';
      minLocEl.textContent = 'Không có đỉnh';
      maxValEl.textContent = '—';
      maxLocEl.textContent = 'Không có đỉnh';
      tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--muted);padding:24px;">Miền nghiệm rỗng hoặc không bị chặn.</td></tr>`;
      return;
    }

    minValEl.textContent = currentExtrema.min;
    minLocEl.textContent = `Đạt tại ${currentExtrema.minVertices.map(p => p.label).join(', ')}.`;

    maxValEl.textContent = currentExtrema.max;
    maxLocEl.textContent = `Đạt tại ${currentExtrema.maxVertices.map(p => p.label).join(', ')}.`;

    tableBody.innerHTML = currentVertices.map(p => {
      let badge = '<span class="lp-badge normal">—</span>';
      if (currentExtrema.minVertices.includes(p)) {
        badge = '<span class="lp-badge min">Nhỏ nhất</span>';
      } else if (currentExtrema.maxVertices.includes(p)) {
        badge = '<span class="lp-badge max">Lớn nhất</span>';
      }

      return `
        <tr>
          <td><b style="color:var(--green);font-size:14px;">${p.label}</b></td>
          <td>(${p.x}; ${p.y})</td>
          <td><b>${p.val}</b></td>
          <td>${badge}</td>
        </tr>
      `;
    }).join('');
  }

  // Draw Hatching Pattern (Phần bị loại: nét mảnh và mờ dịu mắt)
  function createHatchCanvas() {
    const ptnCanvas = document.createElement('canvas');
    ptnCanvas.width = 16;
    ptnCanvas.height = 16;
    const pctx = ptnCanvas.getContext('2d');
    pctx.strokeStyle = 'rgba(148, 163, 184, 0.42)';
    pctx.lineWidth = 0.75;
    pctx.beginPath();
    pctx.moveTo(0, 16);
    pctx.lineTo(16, 0);
    pctx.moveTo(-4, 4);
    pctx.lineTo(4, -4);
    pctx.moveTo(12, 20);
    pctx.lineTo(20, 12);
    pctx.stroke();
    return ctx.createPattern(ptnCanvas, 'repeat');
  }

  // Canvas Drawing Routine
  function draw() {
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    ctx.clearRect(0, 0, W, H);

    // 1. Grid & Numbers
    if (showGrid) {
      drawGrid(W, H);
    }

    // 2. Hatched Discarded Regions (Chỉ gạch chéo phần bị loại, KHÔNG gạch vào miền nghiệm)
    drawHatchedRegions(W, H);

    // 3. Feasible Polygon (Miền nghiệm: Chỉ có màu xanh thuần khiết, sạch sẽ)
    if (currentFeasiblePoly && currentFeasiblePoly.length >= 3) {
      ctx.save();
      ctx.beginPath();
      const first = toScreen(currentFeasiblePoly[0].x, currentFeasiblePoly[0].y);
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < currentFeasiblePoly.length; i++) {
        const pt = toScreen(currentFeasiblePoly[i].x, currentFeasiblePoly[i].y);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();

      // Nền trắng chắn triệt để mọi nét bên dưới
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Lớp màu xanh ngọc miền nghiệm rõ ràng, không bị lẫn bất kỳ gạch chéo nào
      ctx.fillStyle = 'rgba(83, 194, 170, 0.48)';
      ctx.fill();

      // Viền miền nghiệm xanh đậm
      ctx.strokeStyle = '#126b5b';
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.restore();
    }

    // 4. Boundary Lines
    drawBoundaryLines(W, H);

    // 5. Target Line F(x, y) = F
    if (targetToggle.checked) {
      drawTargetLine(W, H);
    }

    // 6. Coordinate Axes Ox, Oy
    drawAxes(W, H);

    // 7. Vertices A, B, C, D...
    drawVertices();
  }

  function drawGrid(W, H) {
    const step = view.scale >= 30 ? 1 : (view.scale >= 15 ? 2 : 5);
    const minW = toWorld(0, H);
    const maxW = toWorld(W, 0);

    const startX = Math.floor(minW.x / step) * step;
    const endX = Math.ceil(maxW.x / step) * step;
    const startY = Math.floor(minW.y / step) * step;
    const endY = Math.ceil(maxW.y / step) * step;

    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let x = startX; x <= endX; x += step) {
      const s = toScreen(x, 0);
      ctx.moveTo(s.x, 0);
      ctx.lineTo(s.x, H);
    }
    for (let y = startY; y <= endY; y += step) {
      const s = toScreen(0, y);
      ctx.moveTo(0, s.y);
      ctx.lineTo(W, s.y);
    }
    ctx.stroke();

    // Axis tick numbers
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 11px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const origin = toScreen(0, 0);
    const originY = Math.max(16, Math.min(H - 20, origin.y));
    const originX = Math.max(20, Math.min(W - 20, origin.x));

    for (let x = startX; x <= endX; x += step) {
      if (Math.abs(x) < 1e-4) continue;
      const s = toScreen(x, 0);
      ctx.fillText(x, s.x, originY + 4);
    }

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let y = startY; y <= endY; y += step) {
      if (Math.abs(y) < 1e-4) continue;
      const s = toScreen(0, y);
      ctx.fillText(y, originX - 6, s.y);
    }
  }

  function drawAxes(W, H) {
    const origin = toScreen(0, 0);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.6;
    ctx.beginPath();

    // X axis
    ctx.moveTo(0, origin.y);
    ctx.lineTo(W, origin.y);

    // Y axis
    ctx.moveTo(origin.x, H);
    ctx.lineTo(origin.x, 0);
    ctx.stroke();

    // Arrows
    ctx.fillStyle = '#334155';
    // X arrow
    ctx.beginPath();
    ctx.moveTo(W - 10, origin.y - 4);
    ctx.lineTo(W, origin.y);
    ctx.lineTo(W - 10, origin.y + 4);
    ctx.fill();

    // Y arrow
    ctx.beginPath();
    ctx.moveTo(origin.x - 4, 10);
    ctx.lineTo(origin.x, 0);
    ctx.lineTo(origin.x + 4, 10);
    ctx.fill();

    // Axis Labels
    ctx.font = 'italic 700 14px Georgia, serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText('x', W - 14, origin.y + 16);
    ctx.fillText('y', origin.x + 14, 14);

    // Origin Label
    ctx.fillText('O', origin.x - 12, origin.y + 14);
  }

  function drawHatchedRegions(W, H) {
    if (!currentFeasiblePoly || currentFeasiblePoly.length < 3) return;

    // Chỉ vẽ gạch chéo ra bên ngoài miền nghiệm bằng quy tắc evenodd
    const hatchPattern = createHatchCanvas();
    ctx.save();
    ctx.beginPath();
    // 1. Toàn bộ khung canvas
    ctx.rect(0, 0, W, H);

    // 2. Viền đa giác miền nghiệm (lặp thuận chiều)
    const first = toScreen(currentFeasiblePoly[0].x, currentFeasiblePoly[0].y);
    ctx.moveTo(first.x, first.y);
    for (let i = 1; i < currentFeasiblePoly.length; i++) {
      const pt = toScreen(currentFeasiblePoly[i].x, currentFeasiblePoly[i].y);
      ctx.lineTo(pt.x, pt.y);
    }
    ctx.closePath();

    // Dùng 'evenodd' đảm bảo 100% bên trong đa giác có số lần giao cắt chẵn => Không bao giờ bị gạch chéo
    ctx.fillStyle = hatchPattern;
    ctx.fill('evenodd');
    ctx.restore();
  }

  function drawBoundaryLines(W, H) {
    const minW = toWorld(0, H);
    const maxW = toWorld(W, 0);

    for (const ineq of currentIneqs) {
      const { a, b, c, op } = ineq;
      const isStrict = op === '<' || op === '>';

      // Find two endpoints of the line ax + by = c crossing the screen
      let p1 = null, p2 = null;

      if (Math.abs(b) > 1e-6) {
        // Line not vertical: calculate y at minW.x and maxW.x
        const yLeft = (c - a * minW.x) / b;
        const yRight = (c - a * maxW.x) / b;
        p1 = toScreen(minW.x, yLeft);
        p2 = toScreen(maxW.x, yRight);
      } else if (Math.abs(a) > 1e-6) {
        // Vertical line: x = c/a
        const x = c / a;
        p1 = toScreen(x, minW.y);
        p2 = toScreen(x, maxW.y);
      }

      if (p1 && p2) {
        ctx.save();
        ctx.strokeStyle = '#1e3a34';
        ctx.lineWidth = 1.8;
        if (isStrict) {
          ctx.setLineDash([6, 5]);
        } else {
          ctx.setLineDash([]);
        }
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  function drawTargetLine(W, H) {
    const { a, b } = currentObj;
    const c = currentTargetF;
    const minW = toWorld(0, H);
    const maxW = toWorld(W, 0);

    let p1 = null, p2 = null;
    if (Math.abs(b) > 1e-6) {
      const yLeft = (c - a * minW.x) / b;
      const yRight = (c - a * maxW.x) / b;
      p1 = toScreen(minW.x, yLeft);
      p2 = toScreen(maxW.x, yRight);
    } else if (Math.abs(a) > 1e-6) {
      const x = c / a;
      p1 = toScreen(x, minW.y);
      p2 = toScreen(x, maxW.y);
    }

    if (p1 && p2) {
      ctx.save();
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      // Label on the orange line
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      const clampedX = Math.max(60, Math.min(W - 80, midX));
      const clampedY = Math.max(30, Math.min(H - 30, midY));

      ctx.fillStyle = '#ea580c';
      ctx.font = '700 12px Inter, system-ui, sans-serif';
      ctx.shadowColor = 'rgba(255,255,255,0.9)';
      ctx.shadowBlur = 4;
      ctx.fillText(`F = ${c}`, clampedX + 8, clampedY - 8);
      ctx.restore();
    }
  }

  function drawVertices() {
    if (!currentVertices || currentVertices.length === 0) return;

    // Tính tâm đa giác để hướng nhãn ra ngoài miền nghiệm
    const cx = currentVertices.reduce((sum, p) => sum + p.x, 0) / currentVertices.length;
    const cy = currentVertices.reduce((sum, p) => sum + p.y, 0) / currentVertices.length;

    currentVertices.forEach(p => {
      const s = toScreen(p.x, p.y);

      // Điểm tròn đỉnh
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#126b5b';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Hướng đẩy nhãn ra ngoài miền nghiệm
      let vx = p.x - cx;
      let vy = p.y - cy;
      const dist = Math.hypot(vx, vy) || 1;
      vx /= dist;
      vy /= dist;

      // Trong Canvas Y hướng xuống
      const labelDist = 26;
      let labelX = s.x + vx * labelDist;
      let labelY = s.y - vy * labelDist;

      // Góc tại gốc O
      if (Math.abs(p.x) < 1e-4 && Math.abs(p.y) < 1e-4) {
        labelX = s.x - 28;
        labelY = s.y + 20;
      }

      const fullText = `${p.label}(${p.x}; ${p.y})`;
      ctx.font = '700 12px "Be Vietnam Pro", system-ui, sans-serif';
      const textMetrics = ctx.measureText(fullText);
      const textW = textMetrics.width;
      const textH = 14;

      // Vẽ badge nền trắng mềm mại chống đè số
      const padX = 6;
      const padY = 3;
      const boxX = labelX - textW / 2 - padX;
      const boxY = labelY - textH / 2 - padY;
      const boxW = textW + padX * 2;
      const boxH = textH + padY * 2;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.strokeStyle = '#c8ded8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(boxX, boxY, boxW, boxH, 4);
      } else {
        ctx.rect(boxX, boxY, boxW, boxH);
      }
      ctx.fill();
      ctx.stroke();

      // Nhãn chữ
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#0f766e';
      ctx.font = '800 12px "Be Vietnam Pro", system-ui, sans-serif';
      ctx.fillText(p.label, boxX + padX, labelY);

      const letterW = ctx.measureText(p.label).width;
      ctx.fillStyle = '#475569';
      ctx.font = '600 11px Inter, system-ui, sans-serif';
      ctx.fillText(`(${p.x}; ${p.y})`, boxX + padX + letterW + 2, labelY);

      ctx.restore();
    });
  }

  // User Inequation UI
  function renderIneqRows() {
    ineqListEl.innerHTML = currentIneqs.map((ineq, i) => `
      <div class="lp-ineq-row" data-index="${i}">
        <input type="number" step="any" class="ineq-a" value="${ineq.a}" title="Hệ số của x">
        <span>x +</span>
        <input type="number" step="any" class="ineq-b" value="${ineq.b}" title="Hệ số của y">
        <span>y</span>
        <select class="ineq-op">
          <option value="<=" ${ineq.op === '<=' ? 'selected' : ''}>≤</option>
          <option value=">=" ${ineq.op === '>=' ? 'selected' : ''}>≥</option>
          <option value="<" ${ineq.op === '<' ? 'selected' : ''}>&lt;</option>
          <option value=">" ${ineq.op === '>' ? 'selected' : ''}>&gt;</option>
        </select>
        <input type="number" step="any" class="ineq-c" value="${ineq.c}" title="Hệ số tự do">
        <button type="button" class="lp-del-btn" title="Xóa bất phương trình" data-index="${i}">×</button>
      </div>
    `).join('');

    // Attach listeners
    ineqListEl.querySelectorAll('.lp-del-btn').forEach(btn => {
      btn.onclick = () => {
        const idx = +btn.dataset.index;
        currentIneqs.splice(idx, 1);
        renderIneqRows();
        recalculate();
      };
    });

    ineqListEl.querySelectorAll('input, select').forEach(el => {
      el.onchange = syncIneqsFromInputs;
    });
  }

  function syncIneqsFromInputs() {
    const rows = ineqListEl.querySelectorAll('.lp-ineq-row');
    currentIneqs = Array.from(rows).map(row => ({
      a: parseFloat(row.querySelector('.ineq-a').value) || 0,
      b: parseFloat(row.querySelector('.ineq-b').value) || 0,
      op: row.querySelector('.ineq-op').value,
      c: parseFloat(row.querySelector('.ineq-c').value) || 0
    }));
    recalculate();
  }

  addIneqBtn.onclick = () => {
    currentIneqs.push({ a: 1, b: 1, op: '<=', c: 10 });
    renderIneqRows();
    recalculate();
  };

  // Re-run solver
  function recalculate() {
    currentObj.a = parseFloat(objAInput.value) || 0;
    currentObj.b = parseFloat(objBInput.value) || 0;

    const res = solveFeasibleRegion(currentIneqs);
    currentFeasiblePoly = res.poly;
    currentVertices = res.vertices;

    calculateExtrema();
    renderSurveyUI();
    draw();
  }

  calcBtn.onclick = recalculate;

  // Presets dropdown
  presetSelect.onchange = () => {
    const key = presetSelect.value;
    if (PRESETS[key]) {
      const p = PRESETS[key];
      currentIneqs = JSON.parse(JSON.stringify(p.ineqs));
      currentObj = { ...p.obj };
      objAInput.value = p.obj.a;
      objBInput.value = p.obj.b;
      currentTargetF = p.targetF;
      fSlider.value = p.targetF;
      fInput.value = p.targetF;
      renderIneqRows();
      recalculate();
      autoFitView();
    }
  };

  // Target line controls
  targetToggle.onchange = draw;

  fSlider.oninput = () => {
    currentTargetF = parseFloat(fSlider.value);
    fInput.value = currentTargetF;
    draw();
  };

  fInput.oninput = () => {
    currentTargetF = parseFloat(fInput.value) || 0;
    fSlider.value = currentTargetF;
    draw();
  };

  btnMinBound.onclick = () => {
    currentTargetF = currentExtrema.min;
    fSlider.value = currentTargetF;
    fInput.value = currentTargetF;
    draw();
  };

  btnMaxBound.onclick = () => {
    currentTargetF = currentExtrema.max;
    fSlider.value = currentTargetF;
    fInput.value = currentTargetF;
    draw();
  };

  // Fit & Reset View
  function autoFitView() {
    if (currentVertices.length === 0) {
      view.centerX = 4;
      view.centerY = 3;
      view.scale = 44;
      draw();
      return;
    }

    const minX = Math.min(0, ...currentVertices.map(p => p.x));
    const maxX = Math.max(6, ...currentVertices.map(p => p.x));
    const minY = Math.min(0, ...currentVertices.map(p => p.y));
    const maxY = Math.max(6, ...currentVertices.map(p => p.y));

    view.centerX = (minX + maxX) / 2;
    view.centerY = (minY + maxY) / 2;

    const spanX = Math.max(8, (maxX - minX) * 1.5);
    const spanY = Math.max(8, (maxY - minY) * 1.5);

    const scaleX = canvas.clientWidth / spanX;
    const scaleY = canvas.clientHeight / spanY;
    view.scale = Math.max(16, Math.min(65, Math.min(scaleX, scaleY)));
    draw();
  }

  fitViewBtn.onclick = autoFitView;

  resetViewBtn.onclick = () => {
    view.centerX = 4;
    view.centerY = 3;
    view.scale = 44;
    draw();
  };

  toggleGridBtn.onclick = () => {
    showGrid = !showGrid;
    toggleGridBtn.textContent = showGrid ? 'Tắt lưới' : 'Bật lưới';
    draw();
  };

  // Dragging & Zooming Canvas
  canvas.addEventListener('pointerdown', e => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const world = toWorld(sx, sy);

    // Check if clicked near target line
    const { a, b } = currentObj;
    const currentValAtMouse = a * world.x + b * world.y;
    const norm = Math.hypot(a, b);
    const distToLine = Math.abs(currentValAtMouse - currentTargetF) / (norm || 1) * view.scale;

    if (targetToggle.checked && distToLine < 14) {
      draggingLine = true;
      canvas.setPointerCapture(e.pointerId);
      return;
    }

    // Otherwise pan
    view.isDragging = true;
    view.dragStartX = e.clientX;
    view.dragStartY = e.clientY;
    view.viewStartX = view.centerX;
    view.viewStartY = view.centerY;
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener('pointermove', e => {
    if (draggingLine) {
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const world = toWorld(sx, sy);
      const { a, b } = currentObj;
      const newF = Math.round((a * world.x + b * world.y) * 2) / 2;
      currentTargetF = newF;
      fSlider.value = newF;
      fInput.value = newF;
      draw();
      return;
    }

    if (!view.isDragging) return;
    const dx = e.clientX - view.dragStartX;
    const dy = e.clientY - view.dragStartY;
    view.centerX = view.viewStartX - dx / view.scale;
    view.centerY = view.viewStartY + dy / view.scale;
    draw();
  });

  function stopDrag() {
    view.isDragging = false;
    draggingLine = false;
  }

  canvas.addEventListener('pointerup', stopDrag);
  canvas.addEventListener('pointercancel', stopDrag);

  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 0.89;
    view.scale = Math.max(10, Math.min(180, view.scale * factor));
    draw();
  }, { passive: false });

  // Ask AI integration
  askAiBtn.onclick = () => {
    const ineqStrs = currentIneqs.map(i => `${i.a}x + ${i.b}y ${i.op} ${i.c}`).join('; ');
    const objStr = `F(x, y) = ${currentObj.a}x + ${currentObj.b}y`;
    const prompt = `Hãy giải chi tiết bài toán tìm giá trị lớn nhất và nhỏ nhất của biểu thức ${objStr} trên miền nghiệm của hệ bất phương trình: { ${ineqStrs} }. Nêu rõ các bước vẽ miền nghiệm, tìm tọa độ các đỉnh và tính giá trị của F tại các đỉnh theo chuẩn SGK.`;
    window.location.href = `ai-assistant.html?prompt=${encodeURIComponent(prompt)}`;
  };

  // Download High-Res PNG
  downloadPngBtn.onclick = () => {
    const link = document.createElement('a');
    link.download = 'mien-nghiem-cuc-tri.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Init
  renderIneqRows();
  resizeCanvas();
  recalculate();
})();
