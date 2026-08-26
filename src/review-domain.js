import { resolveSection, resolveRecord } from './domain.js';

const employee = { alias: '小满', name: '张晓雨', department: '人力资源中心', role: '员工关系专员', level: 'P5' };
const labels = { basic: '身份证信息', education: '教育信息', family: '家庭信息', work: '工作履历', certificate: '证书信息', bank: '银行卡信息', emergency: '紧急联系人' };
const operationName = { add: '新增', edit: '修改', delete: '删除', modify: '修改' };
const identityFields = ['name', 'gender', 'idType', 'idNo', 'birthDate', 'ethnicity', 'nativePlace'];

export function formatDocumentNo(id) {
  let hash = 0;
  for (const char of String(id)) hash = (hash * 31 + char.charCodeAt(0)) % 1000000;
  return `PI-${String(hash).padStart(6, '0')}`;
}

function oldRecord(section, request) { return section.approvedData.find(item => item.id === request.recordId) || null; }
function pick(data, fields) { return Object.fromEntries(fields.filter(field => data && field in data).map(field => [field, data[field]])); }
function reviewData(sectionKey, data) { return sectionKey === 'basic' ? pick(data, identityFields) : data; }

function relatedRecords(sectionKey, section, request) {
  if (sectionKey !== 'education') return [];
  const records = section.approvedData.map(record => {
    const isTarget = record.id === request.recordId;
    const requestedData = isTarget && request.operation !== 'delete' ? request.draft : record;
    return {
      ...requestedData,
      id: record.id,
      reviewOperation: isTarget ? request.operation : 'none',
      originalData: record,
      requestedData: isTarget && request.operation !== 'delete' ? request.draft : record,
      attachments: isTarget ? request.attachments || [] : []
    };
  });
  if (request.operation === 'add') records.push({ ...request.draft, reviewOperation: 'add', originalData: null, requestedData: request.draft, attachments: request.attachments || [] });
  return records;
}

export function listReviewRequests(state) {
  const pending = [];
  for (const request of state.manualReviewRequests || []) pending.push({ ...request, employee: request.employee || employee });
  for (const [sectionKey, section] of Object.entries(state.sections)) {
    if (section.status === 'pending') pending.push({ id: `section:${sectionKey}`, kind: 'section', sectionKey, module: labels[sectionKey], operation: 'modify', operationName: '修改', submittedAt: section.submittedAt, status: 'pending', employee, originalData: reviewData(sectionKey, section.approvedData), requestedData: reviewData(sectionKey, section.pendingData), attachments: section.pendingAttachments || [] });
    for (const request of section.recordRequests || []) pending.push({ id: `record:${sectionKey}:${request.requestId}`, kind: 'record', sectionKey, requestId: request.requestId, module: labels[sectionKey], operation: request.operation === 'edit' ? 'modify' : request.operation, operationName: operationName[request.operation], submittedAt: request.submittedAt, status: 'pending', employee, originalData: request.operation === 'add' ? null : oldRecord(section, request), requestedData: request.operation === 'delete' ? null : request.draft, relatedRecords: relatedRecords(sectionKey, section, request), attachments: request.attachments || [] });
  }
  const history = (state.reviewHistory || []).map(item => ({ ...item, employee, module: labels[item.sectionKey], operationName: operationName[item.operation] || '修改' }));
  return [...pending, ...history].sort((a, b) => String(b.submittedAt).localeCompare(String(a.submittedAt)));
}

export function decideReview(state, id, decision, reason = '') {
  if (decision === 'rejected' && !reason.trim()) throw new Error('请填写驳回原因');
  const request = listReviewRequests(state).find(item => item.id === id && item.status === 'pending');
  if (!request) throw new Error('申请已撤回或处理');
  let next = state;
  if (request.kind === 'manual') {
    next = structuredClone(state);
    next.manualReviewRequests = (next.manualReviewRequests || []).filter(item => item.id !== id);
  } else {
    next = request.kind === 'section' ? resolveSection(state, request.sectionKey, decision, reason) : resolveRecord(state, request.sectionKey, request.requestId, decision);
  }
  next.reviewHistory ||= [];
  next.reviewHistory.unshift({ ...request, status: decision, decision, reason, reviewer: '林知夏', reviewedAt: new Date().toISOString() });
  return { state: next, request };
}

export function nextPendingId(state, currentId = '') {
  return listReviewRequests(state).find(item => item.status === 'pending' && item.id !== currentId)?.id || null;
}
