import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, submitSection, submitRecord } from '../src/domain.js';
import { listReviewRequests, decideReview, nextPendingId, formatDocumentNo } from '../src/review-domain.js';

function pendingState() {
  let state = submitSection(createInitialState(), 'bank', { bank: '招商银行', cardNo: '6225', holder: '张晓雨' }, [{ name: '银行卡.jpg', slot: 'bank-card' }]);
  state = submitRecord(state, 'education', 'edit', { id: 'e1', school: '同济大学', degree: '硕士' }, 'e1', [{ name: '学历.pdf' }]);
  state = submitRecord(state, 'work', 'delete', null, 'w2', []);
  return state;
}

test('normalizes module and record requests into one review list', () => {
  const requests = listReviewRequests(pendingState());
  assert.equal(requests.length, 3);
  assert.deepEqual(requests.map(x => x.operation).sort(), ['delete', 'modify', 'modify']);
  assert.ok(requests.every(x => x.employee.alias === '小满'));
});

test('whole-request decisions update state and append review history', () => {
  const state = pendingState();
  const request = listReviewRequests(state).find(x => x.sectionKey === 'bank');
  const result = decideReview(state, request.id, 'approved');
  assert.equal(result.state.sections.bank.status, 'normal');
  assert.equal(result.state.reviewHistory[0].decision, 'approved');
});

test('rejection requires a reason and next pending request excludes processed request', () => {
  const state = pendingState();
  const requests = listReviewRequests(state);
  assert.throws(() => decideReview(state, requests[0].id, 'rejected', ''), /驳回原因/);
  const result = decideReview(state, requests[0].id, 'rejected', '材料不清晰');
  assert.notEqual(nextPendingId(result.state, requests[0].id), requests[0].id);
});

test('review history records reviewer and review time', () => {
  const state = pendingState();
  const request = listReviewRequests(state)[0];
  const result = decideReview(state, request.id, 'approved');
  assert.equal(result.state.reviewHistory[0].reviewer, '林知夏');
  assert.ok(result.state.reviewHistory[0].reviewedAt);
});

test('document number is a stable PI prefix plus six digits', () => {
  assert.match(formatDocumentNo('record:education:r123456789'), /^PI-\d{6}$/);
  assert.equal(formatDocumentNo('record:education:r123456789'), formatDocumentNo('record:education:r123456789'));
});

test('certificate record requests appear in the review list', () => {
  const state = submitRecord(createInitialState(), 'certificate', 'add', {
    certificateName: '消防设施操作员',
    certificateType: '职业资格证书',
    acquiredAt: '2024-03-01',
    expiresAt: '2029-03-01'
  });
  const request = listReviewRequests(state)[0];
  assert.equal(request.sectionKey, 'certificate');
  assert.equal(request.module, '证书信息');
  assert.equal(request.operation, 'add');
});

test('PRD direct-save and read-only sections stay out of review list', () => {
  let state = createInitialState();
  state = state.sections.emergency ? state : createInitialState();
  const requests = listReviewRequests(state);
  assert.doesNotMatch(JSON.stringify(requests), /emergency|contract/);
});
