/**
 * zip 与 Base64 文本互转
 *
 * 用法:
 *   node zip2text.js encode <file.zip> [output.txt]   # zip → base64 文本
 *   node zip2text.js decode <file.txt> [output.zip]   # base64 文本 → zip
 *
 * 示例:
 *   node zip2text.js encode backup.zip                # 生成 backup.zip.txt
 *   node zip2text.js encode backup.zip out.txt        # 生成 out.txt
 *   node zip2text.js decode backup.zip.txt            # 还原为 backup.zip
 *   node zip2text.js decode out.txt restored.zip      # 还原为 restored.zip
 */

const fs = require('fs');
const path = require('path');

const [,, cmd, inputPath, outputPath] = process.argv;

if (!cmd || !inputPath) {
  console.log('用法:');
  console.log('  node zip2text.js encode <file.zip> [output.txt]');
  console.log('  node zip2text.js decode <file.txt> [output.zip]');
  process.exit(1);
}

if (!fs.existsSync(inputPath)) {
  console.error('文件不存在:', inputPath);
  process.exit(1);
}

if (cmd === 'encode') {
  const buf = fs.readFileSync(inputPath);
  const text = buf.toString('base64');
  const out = outputPath || inputPath + '.txt';
  fs.writeFileSync(out, text, 'utf8');
  console.log('完成: %s (%d bytes) → %s (%d chars)', inputPath, buf.length, out, text.length);

} else if (cmd === 'decode') {
  const text = fs.readFileSync(inputPath, 'utf8').trim();
  const buf = Buffer.from(text, 'base64');
  let out = outputPath || inputPath.replace(/\.txt$/, '') || 'output.zip';
  if (fs.existsSync(out) && fs.statSync(out).isDirectory()) {
    out = out + '.zip';
  }
  fs.writeFileSync(out, buf);
  console.log('完成: %s (%d chars) → %s (%d bytes)', inputPath, text.length, out, buf.length);

} else {
  console.error('未知命令:', cmd, '(请使用 encode 或 decode)');
  process.exit(1);
}
