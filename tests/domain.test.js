import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, submitSection } from '../src/domain.js';
test('new employee fields exist in initial data', () => { const state = createInitialState(); assert.ok('socialSecurityLocation' in state.sections.basic.approvedData); assert.ok('marriageDate' in state.sections.basic.approvedData); assert.ok('nativePlace' in state.sections.basic.approvedData); assert.ok('highestDegree' in state.sections.education.approvedData[0]); });
test('household and identity material rules apply', () => { const state = createInitialState(); assert.throws(() => submitSection(state, 'basic', { ...state.sections.basic.approvedData, marriageDate: '2026-01-01' }), /\u6237\u53e3\u672c/); assert.throws(() => submitSection(state, 'basic', { ...state.sections.basic.approvedData, nativePlace: '\u5317\u4eac' }, [{ slot: 'id-front' }]), /\u8eab\u4efd\u8bc1/); });
