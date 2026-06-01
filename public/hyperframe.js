/*
  LUMINARA Sovereign HyperFrame — shared template
  Single 5s canvas loop, silent, no audio, no external libs.
  Injected at top of <body> on every page.
  Honors existing LUMINARA design tokens (#2dd4bf cyan, #a855f7 purple, #f59e0b gold).
  Subject string + glyph driven by data-* attributes on the host <div>.
*/
(function () {
  function init() {
    var host = document.querySelector('[data-luminara-hyperframe]');
    if (!host) return;
    var label = host.getAttribute('data-hf-label') || 'LUMINARA';
    var glyph = host.getAttribute('data-hf-glyph') || '◆';
    var accent = host.getAttribute('data-hf-accent') || '#2dd4bf';
    var w = 1920, h = 320; // thin banner — sits at top of page
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var canvas = document.createElement('canvas');
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.cssText = 'width:100%;height:auto;display:block;background:#06060e;';
    host.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    var start = performance.now();
    var loop = 5000; // 5s

    function frame(now) {
      var t = ((now - start) % loop) / loop; // 0..1
      // background
      ctx.fillStyle = '#06060e';
      ctx.fillRect(0, 0, w, h);
      // gradient sweep
      var grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0,    'rgba(45,212,191,0.0)');
      grad.addColorStop(0.5,  'rgba(168,85,247,0.10)');
      grad.addColorStop(1,    'rgba(45,212,191,0.0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      // scan lines
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      for (var y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1);
      // central glyph — pulses
      var pulse = 0.85 + 0.15 * Math.sin(t * Math.PI * 2);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.font = (140 * pulse) + 'px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = accent;
      ctx.shadowColor = accent; ctx.shadowBlur = 40 * pulse;
      ctx.fillText(glyph, 0, 0);
      ctx.restore();
      // sweeping horizontal line
      var ly = (t * h * 1.4) - h * 0.2;
      ctx.fillStyle = accent;
      ctx.shadowColor = accent; ctx.shadowBlur = 12;
      ctx.fillRect(0, ly, w, 1);
      // label
      ctx.shadowBlur = 0;
      ctx.font = '600 22px "Outfit", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(label, w / 2, h - 30);
      // bracket frames
      ctx.strokeStyle = 'rgba(45,212,191,0.35)';
      ctx.lineWidth = 1;
      ctx.strokeRect(20, 20, 60, 40); // tl
      ctx.strokeRect(w - 80, 20, 60, 40); // tr
      // corner ticks
      ctx.beginPath();
      ctx.moveTo(20, h - 20); ctx.lineTo(80, h - 20);
      ctx.moveTo(w - 80, h - 20); ctx.lineTo(w - 20, h - 20);
      ctx.stroke();
      // progress dot row
      for (var i = 0; i < 24; i++) {
        var dx = 60 + i * (w - 120) / 23;
        var lit = (i / 24) < t;
        ctx.fillStyle = lit ? accent : 'rgba(255,255,255,0.08)';
        ctx.fillRect(dx - 1, 28, 2, 8);
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
