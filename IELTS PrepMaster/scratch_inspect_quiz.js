const fs = require('fs');
const css = fs.readFileSync('master.css', 'utf8');
const lines = css.split('\n');

lines.forEach((l, i) => {
  if (l.includes('[data-theme="dark"]') && (l.includes('button') || l.includes('btn') || l.includes('Submit') || l.includes('.spelling-submit'))) {
    console.log((i+1) + ': ' + l);
  }
});
