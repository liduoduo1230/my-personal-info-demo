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
  for (const copy of ['待审核', '已通过', '已退回', '姓名 / 花名', '信息模块', '操作类型', '单据号', '退回', '通过', '下一条待审核']) {
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

test('bank review fields use Chinese labels', async () => {
  const app = await load('src/admin.js');
  for (const pair of ['city: \'开户城市\'', 'branch: \'开户支行\'', 'attachment: \'银行卡\'']) {
    assert.match(app, new RegExp(pair));
  }
});

test('drawer includes avatar and image preview', async () => {
  const app = await load('src/admin.js');
  assert.match(app, /class="review-avatar"/);
  assert.match(app, /class="image-preview"/);
  assert.match(app, /<img/);
});

test('attachments do not render previous values', async () => {
  const app = await load('src/admin.js');
  const materialsFn = app.match(/function materials\(files = \[\]\) \{[\s\S]*?\n\}/)?.[0] || '';
  assert.doesNotMatch(materialsFn, /修改前/);
  assert.doesNotMatch(materialsFn, /oldValue|original/);
});

test('drawer summary displays approval status', async () => {
  const app = await load('src/admin.js');
  assert.match(app, /审批状态：\$\{labelStatus\(r\.status\)\}/);
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

test('education drawer renders full education review context', async () => {
  const app = await load('src/admin.js');
  assert.match(app, /educationRecordList/);
  assert.match(app, /educationRecordDetail/);
  assert.match(app, /relatedRecords/);
  assert.match(app, /reviewOperation/);
});

test('education field labels cover certificates and highest degree', async () => {
  const app = await load('src/admin.js');
  for (const key of ['highestDegree', 'degreeCertificate', 'diplomaCertificate', 'otherAttachments']) {
    assert.match(app, new RegExp(`${key}:`));
  }
});

test('education review uses selectable record list and avoids duplicate materials block', async () => {
  const app = await load('src/admin.js');
  assert.match(app, /educationRecordList/);
  assert.match(app, /educationRecordDetail/);
  assert.match(app, /data-education-record/);
  assert.match(app, /selectedEducationRecordId/);
  assert.doesNotMatch(app, /<h3>\u8bc1\u660e\u6750\u6599<\/h3>\$\{materials\(r\)\}/);
});

test('education review hides unchanged labels and moves certificates to attachments', async () => {
  const app = await load('src/admin.js');
  assert.match(app, /educationOperationLabel/);
  assert.doesNotMatch(app, /operationLabel\[item\.reviewOperation\] \|\| '已有记录'/);
  assert.match(app, /educationDataRows/);
  assert.match(app, /educationAttachments/);
  assert.match(app, /degreeCertificate/);
  assert.match(app, /diplomaCertificate/);
  assert.match(app, /otherAttachments/);
});

test('drawer title uses alias module and application date', async () => {
  const app = await load('src/admin.js');
  assert.match(app, /function applicationTitle/);
  assert.match(app, /<h2>\$\{applicationTitle\(r\)\}<\/h2>/);
  assert.doesNotMatch(app, /<h2>审核详情<\/h2>/);
});

test('admin seeded review page includes required sample request categories', async () => {
  const app = await load('src/admin.js');
  for (const copy of ['\u8eab\u4efd\u8bc1\u4fe1\u606f', '\u6237\u53e3\u4fe1\u606f', '\u94f6\u884c\u5361\u4fe1\u606f', '\u6559\u80b2\u4fe1\u606f']) {
    assert.match(app, new RegExp(copy));
  }
  assert.match(app, /manualReviewRequests/);
});
