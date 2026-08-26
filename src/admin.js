import { createInitialState, submitSection as submitDomainSection, submitRecord } from './domain.js';
import { listReviewRequests, decideReview, nextPendingId, formatDocumentNo } from './review-domain.js';

const KEY = 'atour-personal-info-demo-v10-admin';
const root = document.querySelector('#admin-app');
const manualReviewRequests = '身份证信息、户口信息、银行卡信息、教育信息';
const fieldNames = {
  alias: '花名', name: '姓名', gender: '性别', phone: '联系电话', email: '个人邮箱', socialSecurityLocation: '社保缴纳地',
  idType: '证件类型', idNo: '证件号码', birthDate: '出生日期', ethnicity: '民族', nativePlace: '籍贯', address: '现居住地址',
  maritalStatus: '婚姻状况', politicalStatus: '政治面貌', householdType: '户口性质', householdAddress: '户口地址', sourceFamilyId: '来源家庭成员',
  school: '学校名称', degree: '学历', major: '专业', graduation: '毕业时间', startDate: '开始时间', endDate: '结束时间',
  highestDegree: '是否最高学历', degreeCertificate: '学位证书', diplomaCertificate: '学历证书', otherAttachments: '其他附件',
  relation: '关系', company: '公司名称', role: '职位', period: '任职时间', certificateName: '证书名称', certificateType: '证书类型',
  acquiredAt: '获得时间', expiresAt: '到期时间', bank: '开户银行', cardNo: '银行卡号'
};
const operationLabel = { none: '已有记录', add: '本次新增', edit: '本次修改', delete: '本次删除' };

let state = load();
let selectedId = null;
let selectedEducationRecordId = null;
let rejecting = false;
let filters = { query: '', module: 'all', operation: 'all', status: 'pending' };

function submitSection(state, key, data, attachments) {
  const requiredAttachments = key === 'bank' && !attachments.length ? [{ name: '银行卡.jpg', slot: 'bank-card' }] : attachments;
  return submitDomainSection(state, key, data, requiredAttachments);
}

function seed() {
  let s = createInitialState();
  const basic = s.sections.basic.approvedData;
  s = submitSection(s, 'basic', { ...basic, idNo: '310101199708129999', nativePlace: '浙江杭州' }, [
    { name: '身份证正面.jpg', slot: 'id-front' },
    { name: '身份证反面.jpg', slot: 'id-back' }
  ]);
  s.manualReviewRequests = [{
    id: 'manual:household', kind: 'manual', sectionKey: 'basic', module: '户口信息', operation: 'modify', operationName: '修改', submittedAt: new Date(Date.now() - 1000).toISOString(), status: 'pending', employee: null,
    originalData: { householdType: basic.householdType, householdAddress: basic.householdAddress },
    requestedData: { householdType: '居民家庭户', householdAddress: '浙江省杭州市西湖区文三路 88 号' },
    attachments: [{ name: '户口信息附件.jpg', slot: 'household-attachment' }]
  }];
  s = submitSection(s, 'bank', { bank: '招商银行', city: '上海市', branch: '上海徐家汇支行', cardNo: '6225 **** **** 8899', attachment: '银行卡.jpg' }, []);
  s = submitRecord(s, 'education', 'edit', {
    id: 'e1', startDate: '2014-09-01', endDate: '2018-06-30', school: '华东师范大学', degree: '硕士', major: '人力资源管理', highestDegree: '是',
    degreeCertificate: '学位证书-硕士.pdf', diplomaCertificate: '学历证书-硕士.pdf', otherAttachments: '学信网验证报告.pdf'
  }, 'e1', [{ name: '学历证明.pdf' }]);
  return s;
}

function load() { try { const saved = JSON.parse(localStorage.getItem(KEY)); return saved?.sections ? saved : seed(); } catch { return seed(); } }
function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
function esc(v = '') { return String(v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]); }
function fmt(v) { return v ? new Date(v).toLocaleString('zh-CN', { hour12: false }) : '-'; }
function all() { return listReviewRequests(state); }
function filtered() { return all().filter(r => (filters.status === 'all' || r.status === filters.status) && (filters.module === 'all' || r.sectionKey === filters.module) && (filters.operation === 'all' || r.operation === filters.operation) && (!filters.query || `${r.employee.name}${r.employee.alias}`.includes(filters.query))); }
function labelStatus(s) { return s === 'pending' ? '待审核' : s === 'approved' ? '已通过' : '已退回'; }
function counts() { const a = all(); return { pending: a.filter(x => x.status === 'pending').length, approved: a.filter(x => x.status === 'approved').length, rejected: a.filter(x => x.status === 'rejected').length }; }

function render() {
  const c = counts();
  const rows = filtered().map(r => `<tr><td>${formatDocumentNo(r.id)}</td><td><strong>${r.employee.alias}</strong>（${r.employee.name}）</td><td>${r.employee.role}</td><td>${r.employee.department}</td><td>${r.module}</td><td>${r.operationName}</td><td>${fmt(r.submittedAt)}</td><td><span class="tag ${r.status}">${labelStatus(r.status)}</span></td><td>${r.reviewer || '-'}</td><td>${fmt(r.reviewedAt)}</td><td><button class="table-action" data-id="${r.id}">${r.status === 'pending' ? '审核' : '查看'}</button></td></tr>`).join('');
  root.innerHTML = `<div class="topbar"><span class="brand-mark">ATOUR</span><span>亚朵集团 · 人力资源管理平台</span></div><div class="layout"><aside class="sidebar"><div class="menu">员工信息审核</div></aside><main class="main"><div class="container"><section class="admin-landscape-banner"><div><span class="eyebrow">PERSONNEL REVIEW</span><h1>员工信息审核</h1><p>统一处理员工资料新增、修改和删除申请</p></div></section><div class="stats"><div class="stat">待审核<strong>${c.pending}</strong></div><div class="stat">已通过<strong>${c.approved}</strong></div><div class="stat">已退回<strong>${c.rejected}</strong></div></div><section class="review-workbench-card"><div class="filters"><input data-filter="query" placeholder="姓名 / 花名"><select data-filter="module"><option value="all">信息模块</option><option value="basic">身份证信息 / 户口信息</option><option value="education">教育信息</option><option value="bank">银行卡信息</option></select><select data-filter="operation"><option value="all">操作类型</option><option value="add">新增</option><option value="modify">修改</option><option value="delete">删除</option></select><select data-filter="status"><option value="pending">待审核</option><option value="approved">已通过</option><option value="rejected">已退回</option><option value="all">全部状态</option></select></div><div class="table-wrap">${rows ? `<table><thead><tr><th>单据号</th><th>花名（本名）</th><th>岗位</th><th>部门</th><th>信息模块</th><th>操作类型</th><th>提交时间</th><th>审核状态</th><th>审核人</th><th>审核时间</th><th>操作</th></tr></thead><tbody>${rows}</tbody></table>` : '<div class="empty">暂无申请</div>'}</div></section></div></main></div>${selectedId ? drawer() : ''}`;
}

function valueRows(originalData = {}, requestedData = {}, operation = 'modify') {
  const keys = new Set([...Object.keys(originalData || {}), ...Object.keys(requestedData || {})]);
  keys.delete('id');
  return [...keys].map(key => {
    const oldValue = originalData?.[key];
    const value = operation === 'delete' ? oldValue : requestedData?.[key];
    return `<div class="field-review"><span>${fieldNames[key] || key}</span><strong>${esc(Array.isArray(value) ? value.join('、') : value ?? '-')}</strong>${operation === 'modify' && String(oldValue ?? '') !== String(value ?? '') ? `<small>修改前：${esc(Array.isArray(oldValue) ? oldValue.join('、') : oldValue ?? '-')}</small>` : ''}</div>`;
  }).join('');
}

function materials(files = []) {
  if (!files.length) return '<div class="file">未上传附件</div>';
  return files.map(file => /\.(jpg|jpeg|png|webp)$/i.test(file.name)
    ? `<figure class="image-preview"><img alt="${esc(file.name)}" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='520' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23ede7e2'/%3E%3Ctext x='50%25' y='48%25' text-anchor='middle' font-size='22' fill='%233b3431'%3E附件预览%3C/text%3E%3Ctext x='50%25' y='60%25' text-anchor='middle' font-size='14' fill='%23646a73'%3E${encodeURIComponent(file.name)}%3C/text%3E%3C/svg%3E"><figcaption>${esc(file.name)}</figcaption></figure>`
    : `<div class="file">${esc(file.name)}</div>`).join('');
}

function educationRecordList(r) {
  if (r.sectionKey !== 'education' || !r.relatedRecords?.length) return '';
  if (!selectedEducationRecordId || !r.relatedRecords.some(item => item.id === selectedEducationRecordId)) {
    const target = r.relatedRecords.find(item => item.reviewOperation !== 'none') || r.relatedRecords[0];
    selectedEducationRecordId = target?.id || null;
  }
  const rows = r.relatedRecords.map(item => `<button type="button" class="education-record-item ${item.id === selectedEducationRecordId ? 'active' : ''}" data-education-record="${esc(item.id)}"><span class="operation-mark ${item.reviewOperation}">${operationLabel[item.reviewOperation] || '已有记录'}</span><strong>${esc(item.school || '-')}</strong><small>${esc(item.startDate || '-')} - ${esc(item.endDate || item.graduation || '-')} · ${esc(item.degree || '-')} · ${esc(item.major || '-')}</small></button>`).join('');
  return `<section class="block review-detail-card education-record-list"><h3>全部教育记录</h3><div class="education-record-grid">${rows}</div></section>`;
}

function educationRecordDetail(r) {
  if (r.sectionKey !== 'education' || !r.relatedRecords?.length) return '';
  const item = r.relatedRecords.find(record => record.id === selectedEducationRecordId) || r.relatedRecords[0];
  const original = item.reviewOperation === 'add' ? null : (item.originalData || item);
  const requested = item.reviewOperation === 'delete' ? null : (item.requestedData || item);
  return `<section class="block review-detail-card"><div class="application-section-title"><h3>提交信息</h3><span class="operation-mark ${item.reviewOperation}">${operationLabel[item.reviewOperation] || '已有记录'}</span></div><div class="data-box">${valueRows(original, requested, item.reviewOperation === 'edit' ? 'modify' : item.reviewOperation)}</div><h3>附件</h3>${materials(item.attachments || [])}</section>`;
}

function normalDetail(r) {
  return `<section class="block review-detail-card"><div class="application-section-title"><h3>${r.module}</h3><span class="operation-mark ${r.operation}">${r.operationName}</span></div><div class="data-box">${valueRows(r.originalData, r.requestedData, r.operation)}</div><h3>附件</h3>${materials(r.attachments || [])}</section>`;
}

function drawerContent(r) {
  if (r.sectionKey === 'education') return `${educationRecordList(r)}${educationRecordDetail(r)}`;
  return normalDetail(r);
}

function drawer() {
  const r = all().find(x => x.id === selectedId);
  if (!r) return '';
  return `<div class="mask" data-action="close"></div><aside class="drawer"><div class="drawer-head"><h2>审核详情</h2><button class="close" data-action="close">×</button></div><div class="drawer-body"><div class="employee employee-summary-card"><div class="review-avatar">满</div><div><strong>${r.employee.alias}（${r.employee.name}）</strong><div class="meta"><span>部门：${r.employee.department}</span><span>岗位：${r.employee.role}</span><span>提交时间：${fmt(r.submittedAt)}</span></div></div></div>${drawerContent(r)}${r.status !== 'pending' ? `<section class="block audit-result"><h3>审核结果</h3><p>审核人：${r.reviewer} 审核时间：${fmt(r.reviewedAt)}</p>${r.reason ? `<p>退回原因：${r.reason}</p>` : ''}</section>` : ''}${rejecting ? '<div class="reject-box"><strong>退回原因</strong><textarea id="reason" placeholder="请输入明确的退回原因"></textarea><div class="reject-actions"><button class="btn" data-action="cancel-reject">取消</button><button class="btn danger" data-action="confirm-reject">确认退回</button></div></div>' : ''}</div>${r.status === 'pending' ? `<footer class="drawer-foot">${rejecting ? '' : '<button class="btn danger" data-action="reject">退回</button><button class="btn primary" data-action="approve">通过</button>'}</footer>` : ''}</aside>`;
}

function toast(msg) { document.body.insertAdjacentHTML('beforeend', `<div class="toast">${msg}</div>`); setTimeout(() => document.querySelector('.toast')?.remove(), 1800); }
function decide(decision, reason = '') { if (!confirm(decision === 'approved' ? '确认通过该申请吗？' : '确认退回该申请吗？')) return; try { const current = selectedId; state = decideReview(state, current, decision, reason).state; save(); selectedId = nextPendingId(state, current); selectedEducationRecordId = null; rejecting = false; render(); toast(selectedId ? '已处理，已打开下一条待审核' : '已处理，待审核申请已处理完'); } catch (e) { toast(e.message); } }

root.addEventListener('click', e => {
  const educationRecord = e.target.closest('[data-education-record]');
  if (educationRecord) { selectedEducationRecordId = educationRecord.dataset.educationRecord; render(); return; }
  const open = e.target.closest('[data-id]');
  if (open) { selectedId = open.dataset.id; selectedEducationRecordId = null; rejecting = false; render(); return; }
  const b = e.target.closest('[data-action]');
  if (!b) return;
  const a = b.dataset.action;
  if (a === 'close') { selectedId = null; selectedEducationRecordId = null; rejecting = false; render(); }
  if (a === 'approve') decide('approved');
  if (a === 'reject') { rejecting = true; render(); }
  if (a === 'cancel-reject') { rejecting = false; render(); }
  if (a === 'confirm-reject') decide('rejected', document.querySelector('#reason')?.value || '');
});
root.addEventListener('input', e => { if (e.target.dataset.filter) { filters[e.target.dataset.filter] = e.target.value; render(); } });
root.addEventListener('change', e => { if (e.target.dataset.filter) { filters[e.target.dataset.filter] = e.target.value; render(); } });
render();
