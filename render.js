// Рендер index.html в MP4 1080x1920, 30 fps: node render.js
const { chromium } = require('playwright');
const { spawn } = require('child_process');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + __dirname + '/index.html?render');
  await p.waitForTimeout(1500);
  const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', '30', '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', 'asiaplus_30s.mp4'], { stdio: ['pipe', 'ignore', 'inherit'] });
  for (let f = 0; f < 900; f++) {
    await p.evaluate(t => seek(t), f / 30);
    ff.stdin.write(await p.screenshot({ type: 'jpeg', quality: 92 }));
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
})();
