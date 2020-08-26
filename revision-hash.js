const fs = require('fs');
const revisionHash = require('rev-hash');
const replace = require('replace-in-file');

const map = {};
const dir = './dist/src/js';
const files = fs.readdirSync(dir);

files.forEach((file) => {
  if (file.endsWith('.js')) {
    const hash = revisionHash(fs.readFileSync(`${dir}/${file}`));
    map[file] = hash;
    fs.renameSync(
      `${dir}/${file}`,
      `${dir}/${file.replace('.js', `.${hash}.js`)}`
    );
  }
});

replace.sync({
  files: [
    `${dir}/*.js`,
    './dist/index.html',
  ],
  from: /[A-Za-z]+\.js/gi,
  to: (match) => {
    if (map[match]) {
      return match.replace('.js', `.${map[match]}.js`);
    }
    return match;
  },
});


