import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const load = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('admin entrypoint loads desktop review assets', async () => {
  const html = await load('admin.html');
  assert.match(html, /员工信息审核/);
  assert.match(html, /src\/admin\.js/);
  assert.match(html, /src\/admin\.css/);
});

test('review workbench includes stats filters table drawer and whole-request actions', async () => {
  const app = await load('src/admin.js');
  for (const copy of ['待审核', '已通过', '已退回', '姓名 / 花名', '信息模块', '操作类型', '单据号', '审核详情', '退回', '通过', '下一条待审核']) {
    assert.match(app, new RegExp(copy));
  }
});

test('desktop styling contains 1400px container and right drawer', async () => {
  const css = `${await load('src/admin.css')}\n${await load('src/admin-enhancements.css')}`;
  assert.match(css, /max-width:\s*1400px/);
  assert.match(css, /\.drawer/);
  assert.match(css, /right:\s*0/);
});

test('review list and drawer use required Chinese labels and actions', async () => {
  const app = await load('src/admin.js');
  for (const copy of ['单据号', '花名（本名）', '岗位', '部门', '信息模块', '操作类型', '提交时间', '审核状态', '操作', '审核人', '审核时间', '修改前', '新增', '删除', '修改', '通过', '退回', '审核', '查看']) {
    assert.match(app, new RegExp(copy));
  }
  assert.match(app, /fieldNames/);
  assert.match(app, /fieldNames\[key\]/);
});

test('drawer includes avatar and image preview', async () => {
  const app = await load('src/admin.js');
  assert.match(app, /class="review-avatar"/);
  assert.match(app, /class="image-preview"/);
  assert.match(app, /<img/);
});

test('list renders simplified PI document numbers', async () => {
  const app = await load('src/admin.js');
  assert.match(app, /formatDocumentNo/);
  assert.doesNotMatch(app, /replaceAll\(':','-'\)/);
});

test('drawer keeps operation tag inline and rejection controls together', async () => {
  const app = await load('src/admin.js');
  const css = await load('src/admin-enhancements.css');
  assert.match(app, /application-section-title/);
  assert.match(app, /<h3>\$\{r\.module\}<\/h3><span class="operation-mark/);
  assert.doesNotMatch(app, /<h3>申请内容<\/h3>/);
  assert.match(app, /reject-actions/);
  assert.match(css, /\.application-section-title[^}]*display:flex/);
  assert.match(css, /white-space:\s*nowrap/);
});

test('original values in review details are not struck through', async () => {
  const css = await load('src/admin-enhancements.css');
  assert.match(css, /\.field-review>small\{text-decoration:\s*none\}/);
});

test('admin uses landscape workbench and employee summary cards', async () => {
  const app = await load('src/admin.js');
  const css = `${await load('src/admin.css')}\n${await load('src/admin-enhancements.css')}`;
  for (const className of ['admin-landscape-banner', 'review-workbench-card', 'employee-summary-card']) {
    assert.match(app, new RegExp(className));
    assert.match(css, new RegExp(`\\.${className}`));
  }
});
