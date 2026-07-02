const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.jsx')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const replacements = [
  { from: /\btext-white\b/g, to: 'text-slate-900' },
  { from: /\bbg-slate-950\b/g, to: 'bg-slate-50' },
  { from: /\bbg-slate-900\b/g, to: 'bg-white' },
  { from: /\bbg-slate-800\b/g, to: 'bg-slate-50' },
  { from: /\bbg-slate-700\b/g, to: 'bg-slate-100' },
  { from: /\bbg-slate-600\b/g, to: 'bg-slate-200' },
  { from: /\btext-slate-400\b/g, to: 'text-slate-600' },
  { from: /\btext-slate-300\b/g, to: 'text-slate-700' },
  { from: /\bborder-slate-800\b/g, to: 'border-slate-200' },
  { from: /\bborder-slate-700\b/g, to: 'border-slate-300' },
  { from: /\bgray-900\b/g, to: 'gray-50' }, // in case
];

const files = walkSync(path.join(__dirname, 'src'));
let changedFilesCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  replacements.forEach(rep => {
    content = content.replace(rep.from, rep.to);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    changedFilesCount++;
  }
});

console.log(`Migration complete. Changed ${changedFilesCount} files.`);
