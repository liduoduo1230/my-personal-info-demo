const noDefaultProofText = "单个文件最大 30M。";

const chinaPublicHolidays2026 = new Set([
  "2026-01-01", "2026-01-02", "2026-01-03",
  "2026-02-15", "2026-02-16", "2026-02-17", "2026-02-18", "2026-02-19", "2026-02-20", "2026-02-21", "2026-02-22", "2026-02-23",
  "2026-04-04", "2026-04-05", "2026-04-06",
  "2026-05-01", "2026-05-02", "2026-05-03", "2026-05-04", "2026-05-05",
  "2026-06-19", "2026-06-20", "2026-06-21",
  "2026-09-25", "2026-09-26", "2026-09-27",
  "2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04", "2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08"
]);

const chinaAdjustedWorkdays2026 = new Set([
  "2026-02-14", "2026-02-28", "2026-05-09", "2026-09-20", "2026-10-10"
]);

const fixedWorkSchedule = {
  start: "09:00",
  lunchStart: "12:00",
  lunchEnd: "13:00",
  end: "18:00",
  dailyHours: 8
};

const timeOptions = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"
];

const leaveWorkTimeOptions = {
  start: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
  end: ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
};

const dateOnlyLeaveTypes = new Set(["丧假", "产假"]);

const leaveRules = [
  { name: "年假", quotaKey: "annual", requiresQuota: true, proof: "", memo: "按中国工作日历计算请假时长；固定工时制工作时间为 09:00-18:00，中间 12:00-13:00 休息。" },
  { name: "额外福利年假", quotaKey: "extraAnnual", requiresQuota: true, proof: "", memo: "使用前需确认福利年假额度已生效。" },
  { name: "带薪病假", quotaKey: "paidSick", requiresQuota: true, proof: "多天的带薪病假需要病假单或多天就医记录。", memo: "多天申请请同步上传医疗证明。" },
  { name: "特别奖励假", quotaKey: "reward", requiresQuota: true, proof: "请按奖励假来源补充证明。", memo: "额度由 EHR 或业务系统生成后可申请。" },
  { name: "育儿假一胎", quotaKey: "parentingOne", requiresQuota: true, proof: "首次申请育儿假需上传宝宝出生证明。", memo: "育儿假为资格审批后生成额度。首次申请需提交宝宝出生证明，请假时长小于等于 10 天才能提交；审批通过后生成 10 天育儿假额度，并扣除本次申请时长。再次申请只能使用剩余额度。", grantOnFirstApproval: true, firstGrantTotal: 10, qualificationDateLabel: "宝宝出生日期", attachmentName: "宝宝出生证明.jpg" },
  { name: "育儿假二胎", quotaKey: "parentingTwo", requiresQuota: true, proof: "首次申请育儿假需上传宝宝出生证明。", memo: "育儿假为资格审批后生成额度。首次申请需提交宝宝出生证明，请假时长小于等于 10 天才能提交；审批通过后生成 10 天育儿假额度，并扣除本次申请时长。再次申请只能使用剩余额度。", grantOnFirstApproval: true, firstGrantTotal: 10, qualificationDateLabel: "宝宝出生日期", attachmentName: "宝宝出生证明.jpg" },
  { name: "育儿假三胎", quotaKey: "parentingThree", requiresQuota: true, proof: "首次申请育儿假需上传宝宝出生证明。", memo: "育儿假为资格审批后生成额度。首次申请需提交宝宝出生证明，请假时长小于等于 10 天才能提交；审批通过后生成 10 天育儿假额度，并扣除本次申请时长。再次申请只能使用剩余额度。", grantOnFirstApproval: true, firstGrantTotal: 10, qualificationDateLabel: "宝宝出生日期", attachmentName: "宝宝出生证明.jpg" },
  { name: "事假", quotaKey: null, requiresQuota: false, proof: "", memo: "" },
  { name: "病假", quotaKey: null, requiresQuota: false, proof: "多天的病假请提供病假单或就医记录。", memo: "多天申请请同步上传医疗证明。" },
  { name: "婚假", quotaKey: "marriage", requiresQuota: true, proof: "首次申请婚假需上传结婚登记证等相关材料。", memo: "婚假为资格审批后生成额度。首次申请需提交相关材料，请假时长小于等于 10 天才能提交；审批通过后生成 10 天婚假额度，并扣除本次申请时长。再次申请只能使用剩余额度。", grantOnFirstApproval: true, firstGrantTotal: 10, qualificationDateLabel: "结婚日期", attachmentName: "结婚登记证.jpg" },
  { name: "产假", quotaKey: null, requiresQuota: false, proof: "产假请提交医院预产期证明及结婚证。", memo: "请按产假审批要求填写预计休假周期。" },
  { name: "产检假", quotaKey: null, requiresQuota: false, proof: "产检假需要提供医院的预约证明。", memo: "按中国工作日历和固定工时制工作时间计算请假时长。" },
  { name: "陪护假", quotaKey: "care", requiresQuota: true, proof: "首次申请陪护假需上传宝宝出生证明。", memo: "陪护假为资格审批后生成额度。首次申请需提交宝宝出生证明，请假时长小于等于 10 天才能提交；审批通过后生成 10 天陪护假额度，并扣除本次申请时长。再次申请只能使用剩余额度。", grantOnFirstApproval: true, firstGrantTotal: 10, qualificationDateLabel: "宝宝出生日期", attachmentName: "宝宝出生证明.jpg" },
  { name: "工伤假", quotaKey: null, requiresQuota: false, proof: "请提供工伤认定或相关证明。", memo: "请在事由中说明工伤认定进度。" },
  { name: "丧假", quotaKey: null, requiresQuota: false, proof: "请提供相关证明。", memo: "请在事由中说明亲属关系。" }
];

const quotas = {
  annual: { label: "年假", total: 8, used: 2, pending: 0, unit: "天", leaveType: "年假" },
  extraAnnual: { label: "额外福利年假", total: 2, used: 0, pending: 0, unit: "天", leaveType: "额外福利年假" },
  paidSick: { label: "带薪病假", total: 3, used: 1, pending: 0, unit: "天", leaveType: "带薪病假" },
  reward: { label: "特别奖励假", total: 0, used: 0, pending: 0, unit: "天", leaveType: "特别奖励假" },
  comp: { label: "调休", total: 16, used: 0, pending: 0, unit: "小时", requestType: "comp" }
};

const overtimeRequirements = [
  "伙伴应在加班前三个工作日邮件申请，说明加班事由及加班工作内容，经部门负责人审批同意，抄送条线负责人后，方可申请加班。",
  "申请时需同步附上与加班时间匹配的考勤记录及邮件审批记录。",
  "加班申请不接受事后补卡。",
  "根据组织与人才中心发布的加班制度，日常加班予以调休，法定节假日加班，予以加班费。",
  "伙伴每月加班时间总计不得超过 36 小时。"
];

const holidayOvertimeRequirements = [
  "此流程仅限于国家法定节假日加班申请使用。",
  "法定节假日加班，予以加班费。",
  "法定节假日加班0.5天起。",
  "法定节假日加班应在当月发起并归档。",
  "伙伴应在加班前三个工作日邮件申请，说明加班事由及加班工作内容，经部门负责人审批同意，抄送条线负责人后，方可申请加班。",
  "申请时需同步附上与加班时间匹配的考勤记录及邮件审批记录。",
  "法定节假日加班申请不接受事后补卡。"
];

const requestConfigs = {
  leave: { title: "请假申请", subtitle: "Leave application", titleValue: "请假申请-呈语-2026-08-24", reasonLabel: "请假事由", totalLabel: "合计（天）", unit: "天", showLeaveType: true, proof: "", memo: "" },
  comp: { title: "调休申请", subtitle: "Compensatory leave application", titleValue: "调休申请-呈语-2026-08-24", reasonLabel: "调休事由", totalLabel: "统计时间（小时）", unit: "小时", showLeaveType: false, proof: "如审批要求可补充加班记录。", memo: "调休按固定工时制工作时间计算：09:00-18:00，中间 12:00-13:00 休息；非中国工作日不计入调休时长。" },
  overtime: { title: "加班申请", subtitle: "Overtime application", titleValue: "加班申请-呈语-2026-08-24", reasonLabel: "加班事项", totalLabel: "总计（小时）", unit: "小时", showLeaveType: false, proof: "需上传与加班时间匹配的考勤记录及邮件审批记录。", memo: overtimeRequirements },
  holidayOvertime: { title: "节假日加班申请", subtitle: "Holiday overtime application", titleValue: "节假日加班申请-呈语-2026-08-24", reasonLabel: "加班原因", totalLabel: "总计（小时）", unit: "小时", showLeaveType: false, proof: "需上传与加班时间匹配的考勤记录及邮件审批记录。", memo: holidayOvertimeRequirements }
};

const myRequests = [
  { code: "L202608250018", name: "请假申请-呈语-2026-08-25", type: "请假", category: "带薪病假", start: "2026-08-25 10:00", end: "2026-08-26 18:00", total: "2天", status: "审批中", node: "HR 审核", nodeName: "HR 审核", approver: "沐阳（王敏）", approverPosition: "HRBP", submitTime: "2026-08-25 09:12", progress: ["提交申请", "直属主管通过", "HR 审核中"] },
  { code: "C202608240021", name: "调休申请-呈语-2026-08-27", type: "调休", category: "调休", start: "2026-08-27 10:00", end: "2026-08-27 18:00", total: "8小时", status: "审批通过", node: "流程归档", submitTime: "2026-08-24 18:20", progress: ["提交申请", "直属主管通过", "HR 通过", "流程归档"] },
  { code: "O202608230009", name: "加班申请-呈语-2026-08-23", type: "加班", category: "加班", start: "2026-08-23 19:00", end: "2026-08-23 22:00", total: "3小时", status: "审批拒绝", node: "流程终止", rejecter: "景初（赵磊）", rejecterPosition: "部门负责人", submitTime: "2026-08-23 14:06", rejectReason: "未提前三个工作日提交邮件审批记录，不符合加班申请要求。", progress: ["提交申请", "直属主管拒绝"] },
  { code: "H202608170012", name: "节假日加班申请-呈语-2026-08-17", type: "节假日加班", category: "节假日加班", start: "2026-08-17 10:00", end: "2026-08-17 18:00", total: "8小时", status: "已撤回", node: "流程终止", submitTime: "2026-08-17 08:40", progress: ["提交申请", "申请人撤回"] }
];

const requestSubmissionDetails = {
  L202608250018: {
    applicant: "呈语（李群）",
    department: "数智科技中心 / 集团管理数字化 / 集团管理产品",
    position: "高级产品经理",
    tag: "总部伙伴",
    reason: "身体不适，需要休息两天，已同步项目安排。",
    attachments: ["病假单.jpg"]
  },
  C202608240021: {
    applicant: "呈语（李群）",
    department: "数智科技中心 / 集团管理数字化 / 集团管理产品",
    position: "高级产品经理",
    tag: "总部伙伴",
    reason: "使用已审批加班时长进行调休。",
    attachments: ["加班审批记录.pdf"]
  },
  O202608230009: {
    applicant: "呈语（李群）",
    department: "数智科技中心 / 集团管理数字化 / 集团管理产品",
    position: "高级产品经理",
    tag: "总部伙伴",
    reason: "项目上线支持，加班完成发布前检查。",
    attachments: ["考勤记录.png", "邮件审批记录.eml"]
  },
  H202608170012: {
    applicant: "呈语（李群）",
    department: "数智科技中心 / 集团管理数字化 / 集团管理产品",
    position: "高级产品经理",
    tag: "总部伙伴",
    reason: "国庆期间客户项目保障。",
    attachments: ["考勤记录.png", "邮件审批记录.eml"]
  }
};

const requestApprovalRecords = {
  L202608250018: [
    { approvalRecordNode: "提交申请", approvalRecordApprover: "呈语（李群）", approvalRecordResult: "已提交", approvalRecordOpinion: "提交请假申请", approvalRecordTime: "2026-08-25 09:12" },
    { approvalRecordNode: "直属主管审批", approvalRecordApprover: "沐阳（王敏）", approvalRecordResult: "审批通过", approvalRecordOpinion: "同意，请做好工作交接", approvalRecordTime: "2026-08-25 10:26" },
    { approvalRecordNode: "HR 审核", approvalRecordApprover: "沐阳（王敏）", approvalRecordResult: "审批中", approvalRecordOpinion: "待审核", approvalRecordTime: "2026-08-25 10:28" }
  ],
  C202608240021: [
    { approvalRecordNode: "提交申请", approvalRecordApprover: "呈语（李群）", approvalRecordResult: "已提交", approvalRecordOpinion: "提交调休申请", approvalRecordTime: "2026-08-24 18:20" },
    { approvalRecordNode: "直属主管审批", approvalRecordApprover: "沐阳（王敏）", approvalRecordResult: "审批通过", approvalRecordOpinion: "同意调休", approvalRecordTime: "2026-08-24 18:44" },
    { approvalRecordNode: "HR 审核", approvalRecordApprover: "夏禾（陈雪）", approvalRecordResult: "审批通过", approvalRecordOpinion: "资料核验通过", approvalRecordTime: "2026-08-25 09:06" }
  ],
  O202608230009: [
    { approvalRecordNode: "提交申请", approvalRecordApprover: "呈语（李群）", approvalRecordResult: "已提交", approvalRecordOpinion: "提交加班申请", approvalRecordTime: "2026-08-23 14:06" },
    { approvalRecordNode: "部门负责人审批", approvalRecordApprover: "景初（赵磊）", approvalRecordResult: "审批拒绝", approvalRecordOpinion: "未提前三个工作日提交邮件审批记录", approvalRecordTime: "2026-08-23 15:12" }
  ],
  H202608170012: [
    { approvalRecordNode: "提交申请", approvalRecordApprover: "呈语（李群）", approvalRecordResult: "已提交", approvalRecordOpinion: "提交节假日加班申请", approvalRecordTime: "2026-08-17 08:40" },
    { approvalRecordNode: "申请人撤回", approvalRecordApprover: "呈语（李群）", approvalRecordResult: "已撤回", approvalRecordOpinion: "申请人主动撤回", approvalRecordTime: "2026-08-17 09:02" }
  ]
};

let currentRequest = "leave";
let overtimeSegments = [];
const qualificationDialogConfirmed = {};
const qualificationAttachmentUploaded = {};
const savedQualificationMaterials = {};

const elements = {
  homePage: document.querySelector("#homePage"),
  applyPage: document.querySelector("#applyPage"),
  requestDetailPage: document.querySelector("#requestDetailPage"),
  requestDetailPageTitle: document.querySelector("#requestDetailPageTitle"),
  requestDetailPageBody: document.querySelector("#requestDetailPageBody"),
  approvalPage: document.querySelector("#approvalPage"),
  approvalList: document.querySelector("#approvalList"),
  approvalMenuBtn: document.querySelector("#approvalMenuBtn"),
  backFromApprovalBtn: document.querySelector("#backFromApprovalBtn"),
  backFromRequestDetailBtn: document.querySelector("#backFromRequestDetailBtn"),
  approvalTabs: document.querySelectorAll("[data-approval-tab]"),
  submitBar: document.querySelector("#submitBar"),
  entryButtons: document.querySelectorAll(".type-tile[data-request]"),
  backHomeBtn: document.querySelector("#backHomeBtn"),
  formTitle: document.querySelector("#formTitle"),
  formSubtitle: document.querySelector("#formSubtitle"),
  titleInput: document.querySelector("#titleInput"),
  leaveTypeField: document.querySelector("#leaveTypeField"),
  leaveTypeSelect: document.querySelector("#leaveTypeSelect"),
  selectedQuotaCard: document.querySelector("#selectedQuotaCard"),
  selectedQuotaName: document.querySelector("#selectedQuotaName"),
  quotaTotal: document.querySelector("#quotaTotal"),
  quotaRemaining: document.querySelector("#quotaRemaining"),
  quotaPending: document.querySelector("#quotaPending"),
  quotaUsed: document.querySelector("#quotaUsed"),
  reasonLabel: document.querySelector("#reasonLabel"),
  totalLabel: document.querySelector("#totalLabel"),
  totalInput: document.querySelector("#totalInput"),
  leavePeriodCard: document.querySelector("#leavePeriodCard"),
  leaveStartDate: document.querySelector("#leaveStartDate"),
  leaveStartPeriod: document.querySelector("#leaveStartPeriod"),
  leaveEndDate: document.querySelector("#leaveEndDate"),
  leaveEndPeriod: document.querySelector("#leaveEndPeriod"),
  startDate: document.querySelector("#startDate"),
  startTime: document.querySelector("#startTime"),
  endDate: document.querySelector("#endDate"),
  endTime: document.querySelector("#endTime"),
  timeCard: document.querySelector(".time-card"),
  overtimeSegmentsCard: document.querySelector("#overtimeSegmentsCard"),
  overtimeSegmentsTitle: document.querySelector("#overtimeSegmentsTitle"),
  overtimeSegmentsList: document.querySelector("#overtimeSegmentsList"),
  addOvertimeSegmentBtn: document.querySelector("#addOvertimeSegmentBtn"),
  attendanceRecordsCard: document.querySelector("#attendanceRecordsCard"),
  attendanceRecordsList: document.querySelector("#attendanceRecordsList"),
  banner: document.querySelector("#validationBanner"),
  attachmentText: document.querySelector("#attachmentText"),
  quotaList: document.querySelector("#quotaList"),
  requirementCard: document.querySelector("#requirementCard"),
  requirementTitle: document.querySelector("#requirementTitle"),
  memoRule: document.querySelector("#memoRule"),
  homeRequestList: document.querySelector("#homeRequestList"),
  footerTotal: document.querySelector("#footerTotal"),
  submitBtn: document.querySelector("#submitBtn"),
  uploadAttachmentBtn: document.querySelector("#uploadAttachmentBtn"),
  qualificationInfoFields: document.querySelector("#qualificationInfoFields"),
  qualificationDateLabel: document.querySelector("#qualificationDateLabel"),
  qualificationDateInput: document.querySelector("#qualificationDateInput"),
  marriageDialog: document.querySelector("#marriageDialog"),
  marriageDialogTitle: document.querySelector("#marriageDialogTitle"),
  qualificationDialogText: document.querySelector("#qualificationDialogText"),
  confirmMarriageDialogBtn: document.querySelector("#confirmMarriageDialogBtn"),
  requestDetailDialog: document.querySelector("#requestDetailDialog"),
  requestDetailTitle: document.querySelector("#requestDetailTitle"),
  requestDetailBody: document.querySelector("#requestDetailBody"),
  requestDetailActions: document.querySelector("#requestDetailActions"),
  closeRequestDetailBtn: document.querySelector("#closeRequestDetailBtn"),
  toast: document.querySelector("#toast")
};

function getRemaining(key) {
  const quota = quotas[key];
  if (!quota) return Infinity;
  return quota.total - quota.used - quota.pending;
}

function formatAmount(value, unit) {
  return `${value}${unit}`;
}

function renderLeaveOptions() {
  elements.leaveTypeSelect.innerHTML = leaveRules.map((rule) => `<option value="${rule.name}">${rule.name}</option>`).join("");
  elements.leaveTypeSelect.value = "产检假";
}

function renderQuotas() {
  elements.quotaList.innerHTML = Object.entries(quotas)
    .filter(([key]) => getRemaining(key) > 0)
    .map(([key, quota]) => {
      const remaining = getRemaining(key);
      return `
        <button class="quota-item ${remaining <= 0 ? "disabled" : ""}" type="button" data-quota="${key}">
          <span>
            <strong>${quota.label}</strong>
            <small>总数 ${formatAmount(quota.total, quota.unit)} / 剩余 ${formatAmount(remaining, quota.unit)} / 审批中 ${formatAmount(quota.pending, quota.unit)} / 已用 ${formatAmount(quota.used, quota.unit)}</small>
          </span>
          <em>${formatAmount(remaining, quota.unit)}</em>
        </button>
      `;
    })
    .join("");
}

function selectedLeaveRule() {
  return leaveRules.find((rule) => rule.name === elements.leaveTypeSelect.value) || leaveRules[0];
}

function isQualificationLeave(rule) {
  return Boolean(rule.grantOnFirstApproval && rule.quotaKey);
}

function isDateOnlyLeave(rule = selectedLeaveRule()) {
  return dateOnlyLeaveTypes.has(rule.name);
}

function isSameDateRange() {
  return elements.startDate.value === elements.endDate.value;
}

function hasQualificationQuota(rule) {
  return Boolean(rule.quotaKey && quotas[rule.quotaKey]);
}

function uploadedQualificationMaterial(rule) {
  return Boolean(qualificationAttachmentUploaded[rule.quotaKey]);
}

function showQualificationDialog(rule) {
  elements.marriageDialogTitle.textContent = `首次申请${rule.name}`;
  elements.qualificationDialogText.textContent = `首次申请${rule.name}，请提交相关材料，审批通过后将生成${rule.firstGrantTotal}天${rule.name}额度，并扣除本次申请时长。`;
  elements.marriageDialog.classList.remove("is-hidden");
}

function hideQualificationDialog() {
  elements.marriageDialog.classList.add("is-hidden");
}

function updateSelectedQuota(rule) {
  if (!rule.quotaKey) {
    elements.selectedQuotaCard.classList.add("is-hidden");
    return;
  }

  const quota = quotas[rule.quotaKey];
  if (!quota) {
    elements.selectedQuotaCard.classList.add("is-hidden");
    return;
  }
  elements.selectedQuotaName.textContent = quota.label;
  elements.quotaTotal.textContent = formatAmount(quota.total, quota.unit);
  elements.quotaRemaining.textContent = formatAmount(getRemaining(rule.quotaKey), quota.unit);
  elements.quotaPending.textContent = formatAmount(quota.pending, quota.unit);
  elements.quotaUsed.textContent = formatAmount(quota.used, quota.unit);
  elements.selectedQuotaCard.classList.remove("is-hidden");
}

function setBanner(message, tone = "info") {
  elements.banner.className = `validation-banner show ${tone}`;
  elements.banner.textContent = message;
}

function hideBanner() {
  elements.banner.className = "validation-banner";
  elements.banner.textContent = "";
}

function setRequirement(title, memo) {
  const hasMemo = Array.isArray(memo) ? memo.length > 0 : Boolean(memo);
  if (!hasMemo) {
    elements.requirementCard.classList.add("is-hidden");
    elements.memoRule.innerHTML = "";
    return;
  }
  elements.requirementTitle.textContent = title;
  elements.memoRule.innerHTML = Array.isArray(memo)
    ? `<ol class="requirement-list">${memo.map((item) => `<li>${item}</li>`).join("")}</ol>`
    : memo;
  elements.requirementCard.classList.remove("is-hidden");
}

function showPage(page) {
  const isApply = page === "apply";
  const isRequestDetail = page === "requestDetail";
  const isApproval = page === "approval";
  elements.homePage.classList.toggle("active-page", page === "home");
  elements.applyPage.classList.toggle("active-page", isApply);
  elements.requestDetailPage.classList.toggle("active-page", isRequestDetail);
  elements.approvalPage.classList.toggle("active-page", isApproval);
  elements.submitBar.classList.toggle("is-hidden", !isApply);
  window.scrollTo({ top: 0, behavior: "instant" });
}

function requestStatusClass(status) {
  if (status === "审批通过") return "green";
  if (status === "审批拒绝") return "danger";
  if (status === "已撤回" || status === "已取消") return "muted";
  return "warning";
}

function getDateTimeValue(value) {
  const normalized = value.replace(" ", "T");
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function canWithdrawRequest(item) {
  if (item.status === "审批中") return true;
  const approvedStatuses = ["审批通过", "审批完成"];
  const startTime = getDateTimeValue(item.start);
  const now = new Date("2026-08-24T09:00:00");
  return approvedStatuses.includes(item.status) && startTime && startTime > now;
}

function withdrawRequest(code) {
  const request = myRequests.find((item) => item.code === code);
  if (!request || !canWithdrawRequest(request)) {
    showToast("当前单据不支持撤回。");
    return;
  }
  request.status = "已取消";
  request.node = "流程终止";
  request.nodeName = "流程终止";
  request.progress = [...(request.progress || []), "申请人撤回，单据已取消"];
  renderHomeRequests();
  openRequestDetail(code);
  showToast("已撤回，单据状态更新为已取消。");
}

function closeRequestDetail() {
  elements.requestDetailDialog.classList.add("is-hidden");
}

function renderProgress(progress = []) {
  return progress.length
    ? `<ol class="detail-progress">${progress.map((item) => `<li>${item}</li>`).join("")}</ol>`
    : "<p>暂无审批记录</p>";
}

function renderRequestAttachments(code) {
  const attachments = requestSubmissionDetails[code]?.attachments || [];
  return `
    <section class="detail-section">
      <h3>附件</h3>
      <div class="detail-attachments">
        ${attachments.length ? attachments.map((name) => `<div class="detail-attachment"><span>附件</span><strong>${name}</strong></div>`).join("") : "<p>未上传附件</p>"}
      </div>
    </section>
  `;
}

function renderApprovalRecords(code) {
  const records = requestApprovalRecords[code] || [];
  return `
    <section class="detail-section">
      <h3>审批记录</h3>
      <div class="approval-record-list">
        ${records.length ? records.map((record) => `
          <article class="approval-record">
            <div class="approval-record-head">
              <strong>${record.approvalRecordNode}</strong>
              <em class="request-status ${requestStatusClass(record.approvalRecordResult)}">${record.approvalRecordResult}</em>
            </div>
            <div class="approval-record-fields">
              <div><span>节点名称</span><strong>${record.approvalRecordNode}</strong></div>
              <div><span>审批结果</span><strong>${record.approvalRecordResult}</strong></div>
              <div><span>审批人</span><strong>${record.approvalRecordApprover}</strong></div>
              <div><span>审批意见</span><strong>${record.approvalRecordOpinion}</strong></div>
              <div><span>时间</span><strong>${record.approvalRecordTime}</strong></div>
            </div>
          </article>
        `).join("") : "<p>暂无审批记录</p>"}
      </div>
    </section>
  `;
}

function openRequestDetail(code) {
  const item = myRequests.find((request) => request.code === code);
  if (!item) return;

  const details = requestSubmissionDetails[code] || {};
  elements.requestDetailPageTitle.textContent = item.name;
  elements.requestDetailPageBody.innerHTML = `
    <div class="detail-status-row">
      <span class="request-status ${requestStatusClass(item.status)}">${item.status}</span>
      <strong>${item.code}</strong>
    </div>
    <div class="detail-fields">
      <div><span>申请人</span><strong>${details.applicant || "呈语（李群）"}</strong></div>
      <div><span>部门</span><strong>${details.department || "数智科技中心"}</strong></div>
      <div><span>岗位</span><strong>${details.position || "高级产品经理"}</strong></div>
      <div><span>标签</span><strong>${details.tag || "总部伙伴"}</strong></div>
      <div><span>单据名称</span><strong>${item.name}</strong></div>
      <div><span>申请类型</span><strong>${item.type}</strong></div>
      <div><span>假期类型</span><strong>${item.category}</strong></div>
      <div><span>开始时间</span><strong>${item.start}</strong></div>
      <div><span>结束时间</span><strong>${item.end}</strong></div>
      <div><span>时长</span><strong>${item.total}</strong></div>
      <div><span>提交时间</span><strong>${item.submitTime}</strong></div>
      <div><span>提交人</span><strong>${details.applicant || "呈语（李群）"}</strong></div>
      <div class="detail-field-wide"><span>请假事由</span><strong>${details.reason || item.reason || "未填写"}</strong></div>
    </div>
    ${item.status === "审批拒绝" && item.rejectReason ? `<div class="reject-reason"><span>拒绝理由</span><strong>${item.rejectReason}</strong></div>` : ""}
    ${renderRequestAttachments(code)}
    ${renderApprovalRecords(code)}
  `;
  showPage("requestDetail");
}

let activeApprovalTab = "leave";
let activeApprovalCode = "";

const approvalRequests = [
  { ...myRequests[0], type: "leave", name: "请假申请-呈语-2026-08-25", category: "带薪病假", applicant: "呈语（李群）", submitter: "呈语（李群）" },
  { ...myRequests[1], type: "comp", name: "调休申请-呈语-2026-08-27", category: "调休", applicant: "呈语（李群）", submitter: "呈语（李群）" },
  { ...myRequests[2], type: "overtime", name: "加班申请-呈语-2026-08-23", category: "加班", applicant: "呈语（李群）", submitter: "呈语（李群）" },
  { code: "H202608260006", name: "节假日加班申请-林川-2026-08-26", type: "overtime", category: "节假日加班", start: "2026-10-01 上午", end: "2026-10-01 下午", total: "8小时", status: "审批中", node: "部门负责人审批", nodeName: "部门负责人审批", applicant: "林川（周林）", submitter: "林川（周林）", approver: "景初（赵磊）", approverPosition: "部门负责人", submitTime: "2026-08-26 16:08", reason: "国庆期间客户项目保障", progress: ["提交申请"] }
];

function approvalTabLabel(tab) {
  return tab === "leave" ? "请假" : tab === "comp" ? "调休" : "加班";
}

function renderApprovalList() {
  const items = approvalRequests.filter((item) => item.type === activeApprovalTab);
  elements.approvalTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.approvalTab === activeApprovalTab));
  elements.approvalList.innerHTML = items.length ? items.map((item) => `
    <article class="approval-item" data-approval-code="${item.code}">
      <div class="approval-item-head">
        <div><strong>${item.name}</strong><span>${item.code}</span></div>
        <em class="request-status ${requestStatusClass(item.status)}">${item.status}</em>
      </div>
      <div class="approval-item-grid">
        <div><span>申请人</span><strong>${item.applicant}</strong></div>
        <div><span>${activeApprovalTab === "leave" ? "假期类型" : "类型"}</span><strong>${item.category}</strong></div>
        <div><span>开始时间</span><strong>${item.start}</strong></div>
        <div><span>结束时间</span><strong>${item.end}</strong></div>
        <div><span>总时长</span><strong>${item.total}</strong></div>
        <div><span>提交时间</span><strong>${item.submitTime}</strong></div>
      </div>
      <div class="approval-item-footer"><span>当前节点：${item.node}</span><span>提交人：${item.submitter}</span></div>
    </article>
  `).join("") : `<div class="empty-state">暂无${approvalTabLabel(activeApprovalTab)}审批单据</div>`;
}

function openApprovalDetail(code) {
  const item = approvalRequests.find((request) => request.code === code);
  if (!item) return;
  activeApprovalCode = code;
  elements.requestDetailTitle.textContent = item.name;
  elements.requestDetailBody.innerHTML = `
    <div class="detail-status-row">
      <span class="request-status ${requestStatusClass(item.status)}">${item.status}</span>
      <strong>${item.code}</strong>
    </div>
    <div class="detail-fields">
      <div><span>申请人</span><strong>${item.applicant}</strong></div>
      <div><span>单据名称</span><strong>${item.name}</strong></div>
      <div><span>类型</span><strong>${item.category}</strong></div>
      <div><span>开始时间</span><strong>${item.start}</strong></div>
      <div><span>结束时间</span><strong>${item.end}</strong></div>
      <div><span>总时长</span><strong>${item.total}</strong></div>
      <div><span>请假事由</span><strong>${item.reason || "项目工作安排"}</strong></div>
    </div>
    <section class="detail-section"><h3>审批记录</h3>${renderProgress(item.progress)}</section>
    <div class="approval-review-actions">
      <button class="secondary-button" type="button" data-approval-action="reject">审批拒绝</button>
      <button class="primary-button" type="button" data-approval-action="approve">审批通过</button>
    </div>
  `;
  elements.requestDetailActions.innerHTML = "";
  elements.requestDetailDialog.classList.remove("is-hidden");
}

function handleApprovalAction(action) {
  const item = approvalRequests.find((request) => request.code === activeApprovalCode);
  if (!item) return;
  item.status = action === "approve" ? "审批通过" : "审批拒绝";
  item.node = "流程归档";
  item.progress = [...(item.progress || []), action === "approve" ? "HR 审批通过" : "HR 审批拒绝"];
  closeRequestDetail();
  renderApprovalList();
  showToast(action === "approve" ? "审批通过。" : "已拒绝该申请。");
}

function renderHomeRequests() {
  const sortedRequests = [...myRequests].sort((a, b) => b.submitTime.localeCompare(a.submitTime));
  elements.homeRequestList.innerHTML = sortedRequests.map((item) => `
    <article class="home-request-item" data-request-code="${item.code}">
      <div class="home-request-head">
        <div>
          <strong>${item.name}</strong>
          <span>申请日期 ${item.submitTime.slice(0, 10)}</span>
        </div>
        <em class="request-status ${requestStatusClass(item.status)}">${item.status}</em>
      </div>
      <div class="home-request-meta">
        <div><span>假期类型</span><strong>${item.category}</strong></div>
        <div><span>开始时间</span><strong>${item.start}</strong></div>
        <div><span>结束时间</span><strong>${item.end}</strong></div>
        <div><span>时长</span><strong>${item.total}</strong></div>
      </div>
      ${item.status === "审批中" ? `
        <div class="approval-summary compact">
          <strong>${item.nodeName || item.node}</strong>
          <span>${item.approver} · ${item.approverPosition}</span>
        </div>
      ` : ""}
      ${item.status === "审批拒绝" ? `
        <div class="approval-summary compact">
          <strong>${item.node}</strong>
          <span>${item.rejecter} · ${item.rejecterPosition}</span>
        </div>
      ` : ""}
      ${item.status === "审批拒绝" && item.rejectReason ? `<div class="reject-reason"><span>拒绝理由</span><strong>${item.rejectReason}</strong></div>` : ""}
    </article>
  `).join("");
}

function updateFooterTotal(config) {
  elements.footerTotal.textContent = formatAmount(elements.totalInput.value || 0, config.unit);
}

function parseDateValue(value) {
  if (!value) return null;
  const normalized = value.includes("/") ? value.split("/").reverse().join("-") : value;
  const date = new Date(`${normalized}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function eachDate(startValue, endValue) {
  const startDate = parseDateValue(startValue);
  const endDate = parseDateValue(endValue);
  if (!startDate || !endDate || endDate < startDate) return [];

  const dates = [];
  const cursor = new Date(startDate);
  while (cursor <= endDate) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

function minutesFromTime(time) {
  const [hour, minute] = time.split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return 0;
  return hour * 60 + minute;
}

function hoursBetween(startTime, endTime) {
  return Math.max(0, (minutesFromTime(endTime) - minutesFromTime(startTime)) / 60);
}

function overlapHours(startTime, endTime, windowStart, windowEnd) {
  const start = Math.max(minutesFromTime(startTime), minutesFromTime(windowStart));
  const end = Math.min(minutesFromTime(endTime), minutesFromTime(windowEnd));
  return Math.max(0, (end - start) / 60);
}

function isChinaWorkday(date) {
  const key = formatDateKey(date);
  if (chinaPublicHolidays2026.has(key)) return false;
  if (chinaAdjustedWorkdays2026.has(key)) return true;
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

function isChinaPublicHoliday(date) {
  return chinaPublicHolidays2026.has(formatDateKey(date));
}

function calculateWorkingHoursForDay(date, startTime, endTime) {
  if (!isChinaWorkday(date)) return 0;
  const morning = overlapHours(startTime, endTime, fixedWorkSchedule.start, fixedWorkSchedule.lunchStart);
  const afternoon = overlapHours(startTime, endTime, fixedWorkSchedule.lunchEnd, fixedWorkSchedule.end);
  return morning + afternoon;
}

function calculateWorkingHours(startValue, endValue, startTime, endTime) {
  return eachDate(startValue, endValue).reduce((total, date) => total + calculateWorkingHoursForDay(date, startTime, endTime), 0);
}

function calculateBusinessLeaveDays(rule, startValue = elements.startDate.value, endValue = elements.endDate.value, startTime = elements.startTime.value, endTime = elements.endTime.value) {
  return calculateWorkingHours(startValue, endValue, startTime, endTime) / fixedWorkSchedule.dailyHours;
}

function periodIndex(period) {
  return period === "pm" ? 1 : 0;
}

function periodText(period) {
  return period === "pm" ? "下午" : "上午";
}

function calculateLeavePeriodDays(startValue = elements.leaveStartDate.value, endValue = elements.leaveEndDate.value, startPeriod = elements.leaveStartPeriod.value, endPeriod = elements.leaveEndPeriod.value) {
  const dates = eachDate(startValue, endValue).filter(isChinaWorkday);
  if (!dates.length) return 0;

  const sameDay = startValue === endValue;
  if (sameDay && periodIndex(endPeriod) < periodIndex(startPeriod)) return 0;

  return dates.reduce((total, date) => {
    const key = formatDateKey(date);
    let units = 2;
    if (key === startValue) units -= periodIndex(startPeriod);
    if (key === endValue) units -= 1 - periodIndex(endPeriod);
    return total + Math.max(0, units * 0.5);
  }, 0);
}

function calculateNaturalLeaveDays(startValue = elements.startDate.value, endValue = elements.endDate.value) {
  const dates = eachDate(startValue, endValue);
  if (!dates.length) return 0;
  return dates.length;
}

function calculateDateOnlyLeaveDays(rule = selectedLeaveRule()) {
  if (rule.name === "产假") return calculateNaturalLeaveDays(elements.leaveStartDate.value, elements.leaveEndDate.value);
  return eachDate(elements.leaveStartDate.value, elements.leaveEndDate.value).filter(isChinaWorkday).length;
}

function calculateLeaveDays(rule = selectedLeaveRule(), startValue = elements.startDate.value, endValue = elements.endDate.value, startTime = elements.startTime.value, endTime = elements.endTime.value) {
  if (currentRequest === "leave" && isDateOnlyLeave(rule)) return calculateDateOnlyLeaveDays(rule);
  if (rule.name === "产假") return calculateNaturalLeaveDays(startValue, endValue);
  if (currentRequest === "leave") return calculateLeavePeriodDays();
  return calculateBusinessLeaveDays(rule, startValue, endValue, startTime, endTime);
}

function calculateOvertimeHours(requireHoliday = false, startValue = elements.startDate.value, endValue = elements.endDate.value, startTime = elements.startTime.value, endTime = elements.endTime.value) {
  return eachDate(startValue, endValue).reduce((total, date) => {
    const holiday = isChinaPublicHoliday(date);
    if (requireHoliday && !holiday) return total;

    const requested = hoursBetween(startTime, endTime);
    const workHours = isChinaWorkday(date) ? calculateWorkingHoursForDay(date, startTime, endTime) : 0;
    const overtime = requireHoliday || !isChinaWorkday(date) ? requested : Math.max(0, requested - workHours);
    return total + Math.min(overtime, fixedWorkSchedule.dailyHours);
  }, 0);
}

function isOvertimeRequest() {
  return currentRequest === "overtime" || currentRequest === "holidayOvertime";
}

function isHolidayOvertimeRequest() {
  return currentRequest === "holidayOvertime";
}

function createOvertimeSegment(startDate, startTime, endDate, endTime) {
  return { startDate, startTime, endDate, endTime };
}

function createHolidayOvertimeSegment(startDate, startPeriod, endDate, endPeriod) {
  return { startDate, startPeriod, endDate, endPeriod };
}

function resetOvertimeSegments(type) {
  overtimeSegments = type === "holidayOvertime"
    ? [
        createHolidayOvertimeSegment("2026-10-01", "am", "2026-10-01", "pm")
      ]
    : [
        createOvertimeSegment("2026-08-29", "09:00", "2026-08-29", "12:00"),
        createOvertimeSegment("2026-08-29", "13:00", "2026-08-29", "18:00")
      ];
}

function getHolidayPeriodTime(period, point) {
  if (period === "pm") return point === "start" ? "14:00" : "18:00";
  return point === "start" ? "09:00" : "13:00";
}

function calculateHolidayOvertimePeriodHours(segment) {
  const dates = eachDate(segment.startDate, segment.endDate);
  if (!dates.length) return 0;
  if (segment.startDate === segment.endDate && periodIndex(segment.endPeriod) < periodIndex(segment.startPeriod)) return 0;

  return dates.reduce((total, date) => {
    return total + calculateHolidayOvertimeDailyHours(segment, date);
  }, 0);
}

function calculateHolidayOvertimeDailyHours(segment, date) {
  const key = formatDateKey(date);
  let units = 2;
  if (key === segment.startDate) units -= periodIndex(segment.startPeriod);
  if (key === segment.endDate) units -= 1 - periodIndex(segment.endPeriod);
  return Math.max(0, units * 4);
}

function hasHolidayOvertimeDailyLimit() {
  return overtimeSegments.some((segment) =>
    eachDate(segment.startDate, segment.endDate).some((date) =>
      calculateHolidayOvertimeDailyHours(segment, date) > fixedWorkSchedule.dailyHours
    )
  );
}

function calculateOvertimeSegmentHours(segment, requireHoliday = currentRequest === "holidayOvertime") {
  if (requireHoliday && segment.startPeriod && segment.endPeriod) return calculateHolidayOvertimePeriodHours(segment);
  return calculateOvertimeHours(requireHoliday, segment.startDate, segment.endDate, segment.startTime, segment.endTime);
}

function calculateOvertimeSegmentsTotal() {
  const requireHoliday = currentRequest === "holidayOvertime";
  return overtimeSegments.reduce((total, segment) => total + calculateOvertimeSegmentHours(segment, requireHoliday), 0);
}

function hasHolidayOvertimeSegmentOnNonHoliday() {
  return overtimeSegments.some((segment) => eachDate(segment.startDate, segment.endDate).some((date) => !isChinaPublicHoliday(date)));
}

function hasOvertimeSegmentWorkTimeOverlap() {
  return overtimeSegments.some((segment) => hasWorkdayWorkTimeOverlap(segment.startDate, segment.endDate, segment.startTime, segment.endTime));
}

function hasOvertimeSegmentOverDailyLimit() {
  return overtimeSegments.some((segment) => {
    if (segment.startPeriod && segment.endPeriod) return calculateHolidayOvertimePeriodHours(segment) > fixedWorkSchedule.dailyHours;
    return isSingleDayOvertimeOverLimit(segment.startTime, segment.endTime);
  });
}

function getSegmentEndTimeOptions(segment) {
  return timeOptions.filter((time) => minutesFromTime(time) > minutesFromTime(segment.startTime));
}

function renderTimeSelectOptions(options, selected) {
  return options.map((time) => `<option value="${time}" ${time === selected ? "selected" : ""}>${time}</option>`).join("");
}

function renderPeriodSelectOptions(selected) {
  return [
    `<option value="am" ${selected === "am" ? "selected" : ""}>上午</option>`,
    `<option value="pm" ${selected === "pm" ? "selected" : ""}>下午</option>`
  ].join("");
}

function renderHolidayDateOptions(selected) {
  const grouped = new Map();
  [...chinaPublicHolidays2026].sort().forEach((date) => {
    const month = date.slice(0, 7);
    if (!grouped.has(month)) grouped.set(month, []);
    grouped.get(month).push(date);
  });
  return [...grouped.entries()].map(([month, dates]) => {
    const monthLabel = `${month.slice(5)}月`;
    return `
    <optgroup label="${monthLabel}">
      ${dates.map((date) => `<option value="${date}" ${date === selected ? "selected" : ""}>${date}</option>`).join("")}
    </optgroup>
  `;
  }).join("");
}

function renderOvertimeDateOptions(selected) {
  const grouped = new Map();
  for (let month = 1; month <= 12; month += 1) {
    const monthKey = `2026-${String(month).padStart(2, "0")}`;
    const dates = [];
    const lastDay = new Date(2026, month, 0).getDate();
    for (let day = 1; day <= lastDay; day += 1) {
      const date = `${monthKey}-${String(day).padStart(2, "0")}`;
      dates.push(`<option value="${date}" ${date === selected ? "selected" : ""} ${isChinaPublicHoliday(parseDateValue(date)) ? "disabled" : ""}>${date}${isChinaPublicHoliday(parseDateValue(date)) ? "（法定节假日）" : ""}</option>`);
    }
    grouped.set(monthKey, dates);
  }
  return [...grouped.entries()].map(([month, dates]) => {
    const monthLabel = `${month.slice(5)}月`;
    return `
    <optgroup label="${monthLabel}">
      ${dates.join("")}
    </optgroup>
  `;
  }).join("");
}

function getAttendanceDatesFromSegments() {
  const dates = new Map();
  overtimeSegments.forEach((segment) => {
    eachDate(segment.startDate, segment.endDate).forEach((date) => {
      dates.set(formatDateKey(date), date);
    });
  });
  return [...dates.values()].sort((a, b) => a - b);
}

function calculateAttendanceWorkHours(date) {
  const key = formatDateKey(date);
  const matchedSegments = overtimeSegments.filter((segment) => eachDate(segment.startDate, segment.endDate).some((item) => formatDateKey(item) === key));
  const hours = matchedSegments.reduce((total, segment) => {
    const requireHoliday = currentRequest === "holidayOvertime";
    return total + calculateOvertimeSegmentHours(segment, requireHoliday);
  }, 0);
  return Math.floor(hours);
}

function getAttendanceRecord(date) {
  const key = formatDateKey(date);
  const holiday = isChinaPublicHoliday(date);
  const workday = isChinaWorkday(date);
  const matchedSegments = overtimeSegments.filter((segment) => eachDate(segment.startDate, segment.endDate).some((item) => formatDateKey(item) === key));
  const firstStart = matchedSegments.map((segment) => segment.startTime || getHolidayPeriodTime(segment.startPeriod, "start")).sort()[0] || fixedWorkSchedule.start;
  const lastEnd = matchedSegments.map((segment) => segment.endTime || getHolidayPeriodTime(segment.endPeriod, "end")).sort().at(-1) || fixedWorkSchedule.end;
  const workHours = calculateAttendanceWorkHours(date);

  if (holiday) return { label: "法定节假日", checkIn: firstStart, checkOut: lastEnd, workHours, source: "考勤记录" };
  if (!workday) return { label: "休息日", checkIn: firstStart, checkOut: lastEnd, workHours, source: "考勤记录" };
  return { label: "工作日", checkIn: "09:02", checkOut: lastEnd > fixedWorkSchedule.end ? lastEnd : "18:06", workHours, source: "固定工时打卡" };
}

function renderAttendanceRecordDetail(record) {
  return `
    <dl>
      <div><dt>上班打卡</dt><dd>${record.checkIn}</dd></div>
      <div><dt>下班打卡</dt><dd>${record.checkOut}</dd></div>
      <div><dt>工作时长</dt><dd>${record.workHours}小时</dd></div>
    </dl>
  `;
}

function renderAttendanceRecords() {
  const show = isOvertimeRequest() && overtimeSegments.length > 0;
  elements.attendanceRecordsCard.classList.toggle("is-hidden", !show);
  if (!show) return;

  elements.attendanceRecordsList.innerHTML = getAttendanceDatesFromSegments().map((date) => {
    const record = getAttendanceRecord(date);
    return `
      <article class="attendance-record">
        <div>
          <strong>${formatDateKey(date)}</strong>
          <span>${record.label} · ${record.source}</span>
        </div>
        ${renderAttendanceRecordDetail(record)}
      </article>
    `;
  }).join("");
}

function renderOvertimeSegments() {
  elements.overtimeSegmentsCard.classList.toggle("is-hidden", !isOvertimeRequest());
  elements.addOvertimeSegmentBtn.classList.toggle("is-hidden", isHolidayOvertimeRequest());
  elements.overtimeSegmentsTitle.textContent = isHolidayOvertimeRequest() ? "节假日加班时段" : "加班明细";
  if (!isOvertimeRequest()) {
    renderAttendanceRecords();
    return;
  }

  elements.overtimeSegmentsList.innerHTML = overtimeSegments.map((segment, index) => {
    const endOptions = isHolidayOvertimeRequest() ? [] : getSegmentEndTimeOptions(segment);
    if (!isHolidayOvertimeRequest() && !endOptions.includes(segment.endTime)) segment.endTime = endOptions[0] || "";
    const hours = calculateOvertimeSegmentHours(segment);
    const fields = isHolidayOvertimeRequest() ? `
        <div class="segment-fields">
          <label class="field compact-field">
            <span>开始日期</span>
            <select data-segment-field="startDate" data-index="${index}">${renderHolidayDateOptions(segment.startDate)}</select>
          </label>
          <label class="field compact-field">
            <span>开始时段</span>
            <select data-segment-field="startPeriod" data-index="${index}">${renderPeriodSelectOptions(segment.startPeriod)}</select>
          </label>
          <label class="field compact-field">
            <span>结束日期</span>
            <select data-segment-field="endDate" data-index="${index}">${renderHolidayDateOptions(segment.endDate)}</select>
          </label>
          <label class="field compact-field">
            <span>结束时段</span>
            <select data-segment-field="endPeriod" data-index="${index}">${renderPeriodSelectOptions(segment.endPeriod)}</select>
          </label>
        </div>
      ` : `
        <div class="segment-fields">
          <label class="field compact-field">
            <span>开始日期</span>
            <select data-segment-field="startDate" data-index="${index}">${renderOvertimeDateOptions(segment.startDate)}</select>
          </label>
          <label class="field compact-field">
            <span>开始时间</span>
            <select data-segment-field="startTime" data-index="${index}">${renderTimeSelectOptions(timeOptions.slice(0, -1), segment.startTime)}</select>
          </label>
          <label class="field compact-field">
            <span>结束日期</span>
            <select data-segment-field="endDate" data-index="${index}">${renderOvertimeDateOptions(segment.endDate)}</select>
          </label>
          <label class="field compact-field">
            <span>结束时间</span>
            <select data-segment-field="endTime" data-index="${index}">${renderTimeSelectOptions(endOptions, segment.endTime)}</select>
          </label>
        </div>
      `;
    return `
      <article class="overtime-segment" data-segment-index="${index}">
        <div class="segment-title-row">
          <strong>${isHolidayOvertimeRequest() ? "申请时段" : `记录 ${index + 1}`}</strong>
          ${!isHolidayOvertimeRequest() && overtimeSegments.length > 1 ? `<button type="button" data-segment-action="remove" data-index="${index}">删除</button>` : ""}
        </div>
        ${fields}
        <div class="segment-duration"><span>时长</span><strong>${hours}小时</strong></div>
      </article>
    `;
  }).join("");
  renderAttendanceRecords();
}

function renderLeavePeriodMode() {
  const isLeave = currentRequest === "leave";
  const dateOnly = isLeave && isDateOnlyLeave();
  elements.leavePeriodCard.classList.toggle("is-hidden", !isLeave);
  elements.leaveStartPeriod.closest(".field").classList.toggle("is-hidden", dateOnly);
  elements.leaveEndPeriod.closest(".field").classList.toggle("is-hidden", dateOnly);
  elements.timeCard.classList.toggle("is-hidden", isLeave || isOvertimeRequest());
}

function getLeaveStartText() {
  if (isDateOnlyLeave()) return elements.leaveStartDate.value;
  return `${elements.leaveStartDate.value} ${periodText(elements.leaveStartPeriod.value)}`;
}

function getLeaveEndText() {
  if (isDateOnlyLeave()) return elements.leaveEndDate.value;
  return `${elements.leaveEndDate.value} ${periodText(elements.leaveEndPeriod.value)}`;
}

function requestedHoursExcludingLunch(startTime = elements.startTime.value, endTime = elements.endTime.value) {
  const requested = hoursBetween(startTime, endTime);
  return requested - overlapHours(startTime, endTime, fixedWorkSchedule.lunchStart, fixedWorkSchedule.lunchEnd);
}

function isSingleDayOvertimeOverLimit(startTime = elements.startTime.value, endTime = elements.endTime.value) {
  return requestedHoursExcludingLunch(startTime, endTime) > fixedWorkSchedule.dailyHours;
}

function hasWorkdayWorkTimeOverlap(startValue = elements.startDate.value, endValue = elements.endDate.value, startTime = elements.startTime.value, endTime = elements.endTime.value) {
  return eachDate(startValue, endValue).some((date) => calculateWorkingHoursForDay(date, startTime, endTime) > 0);
}

function isValidDurationMultiple(value, step) {
  if (value <= 0) return false;
  const ratio = value / step;
  return Math.abs(ratio - Math.round(ratio)) < 0.0001;
}

function getMinimumDurationStep(rule = selectedLeaveRule()) {
  if (currentRequest === "leave") return 0.5;
  return 1;
}

function getStartTimeOptions() {
  return currentRequest === "leave" ? leaveWorkTimeOptions.start : timeOptions;
}

function getDurationForEndTime(endTime) {
  const rule = selectedLeaveRule();
  if (currentRequest === "leave") return calculateLeaveDays(rule, elements.startDate.value, elements.endDate.value, elements.startTime.value, endTime);
  if (currentRequest === "comp") return calculateWorkingHours(elements.startDate.value, elements.endDate.value, elements.startTime.value, endTime);
  if (currentRequest === "overtime") return calculateOvertimeHours(false, elements.startDate.value, elements.endDate.value, elements.startTime.value, endTime);
  if (currentRequest === "holidayOvertime") return calculateOvertimeHours(true, elements.startDate.value, elements.endDate.value, elements.startTime.value, endTime);
  return 0;
}

function isEndTimeSelectable(endTime) {
  const rule = selectedLeaveRule();
  if (isSameDateRange() && minutesFromTime(endTime) <= minutesFromTime(elements.startTime.value)) return false;
  if (currentRequest === "holidayOvertime" && eachDate(elements.startDate.value, elements.endDate.value).some((date) => !isChinaPublicHoliday(date))) return false;
  if (currentRequest === "overtime" && hasWorkdayWorkTimeOverlap(elements.startDate.value, elements.endDate.value, elements.startTime.value, endTime)) return false;
  if ((currentRequest === "overtime" || currentRequest === "holidayOvertime") && isSingleDayOvertimeOverLimit(elements.startTime.value, endTime)) return false;

  const duration = getDurationForEndTime(endTime);
  if (currentRequest === "leave") return duration > 0;
  return isValidDurationMultiple(duration, getMinimumDurationStep(rule));
}

function getEndTimeOptions() {
  const options = currentRequest === "leave" ? leaveWorkTimeOptions.end : timeOptions;
  return options.filter(isEndTimeSelectable);
}

function hasInvalidLeaveDurationUnit(requested) {
  return !isValidDurationMultiple(requested, 0.5);
}

function renderStartTimeOptions() {
  const previous = elements.startTime.value;
  const options = getStartTimeOptions();
  elements.startTime.innerHTML = options.map((time) => `<option value="${time}">${time}</option>`).join("");
  elements.startTime.value = options.includes(previous) ? previous : options[0];
}

function renderEndTimeOptions() {
  const previous = elements.endTime.value;
  const options = getEndTimeOptions();
  if (!options.length) {
    elements.endTime.innerHTML = '<option value="">无可选结束时间</option>';
    return;
  }

  elements.endTime.innerHTML = options.map((time) => `<option value="${time}">${time}</option>`).join("");
  elements.endTime.value = options.includes(previous) ? previous : options[0];
}

function updateAttachment(proof) {
  elements.attachmentText.textContent = proof || noDefaultProofText;
}

function updateQualificationFields(rule) {
  const showFields = currentRequest === "leave" && isQualificationLeave(rule);
  elements.qualificationInfoFields.classList.toggle("is-hidden", !showFields);
  if (!showFields) return;

  elements.qualificationDateLabel.textContent = rule.qualificationDateLabel || "资格日期";
  const quota = quotas[rule.quotaKey];
  const material = savedQualificationMaterials[rule.quotaKey] || quota?.material;
  if (quota && material) {
    elements.qualificationDateInput.value = material.qualificationDate;
    elements.qualificationDateInput.disabled = true;
    updateAttachment(`沿用首次${rule.name}申请材料：${material.attachmentName}，不允许修改。`);
    return;
  }

  elements.qualificationDateInput.disabled = false;
  const attachmentName = rule.attachmentName || "资格证明.jpg";
  updateAttachment(uploadedQualificationMaterial(rule) ? `已上传${attachmentName}。` : rule.proof);
}

function updateLeaveState(config) {
  elements.totalInput.readOnly = true;
  renderLeavePeriodMode();
  renderOvertimeSegments();
  const rule = selectedLeaveRule();
  elements.totalLabel.textContent = rule.name === "产假" ? "合计（自然日）" : "合计（工作日）";
  elements.totalInput.value = calculateLeaveDays(rule);
  const requested = Number(elements.totalInput.value || 0);
  const remaining = rule.quotaKey && quotas[rule.quotaKey] ? getRemaining(rule.quotaKey) : 0;

  updateAttachment(rule.proof);
  updateQualificationFields(rule);
  setRequirement("请假要求", rule.memo);
  updateSelectedQuota(rule);
  updateFooterTotal(config);

  if (isQualificationLeave(rule) && !hasQualificationQuota(rule)) {
    if (requested > rule.firstGrantTotal) {
      setBanner(`首次${rule.name}申请时长不能超过 ${rule.firstGrantTotal} 天。`, "danger");
      return;
    }
    if (uploadedQualificationMaterial(rule)) setBanner(`首次申请${rule.name}审批通过后生成 ${rule.firstGrantTotal} 天额度，并扣除本次 ${requested} 天。`, "warning");
    else hideBanner();
    return;
  }

  if (rule.requiresQuota && remaining <= 0) {
    if (rule.grantOnFirstApproval && !quotas[rule.quotaKey]) {
      if (requested > rule.firstGrantTotal) {
        setBanner(`首次${rule.name}申请时长不能超过 ${rule.firstGrantTotal} 天。`, "danger");
        return;
      }
      setBanner(`首次申请${rule.name}需提交相关材料；审批通过后生成 ${rule.firstGrantTotal} 天额度，并扣除本次 ${requested} 天。`, "warning");
      return;
    }
    setBanner("当前假期暂无可用额度，请等待 EHR 生成额度后再申请。", "danger");
    return;
  }

  if (rule.requiresQuota && requested > remaining) {
    if (isQualificationLeave(rule)) {
      setBanner(`${rule.name}申请天数超过可用额度，当前最多可申请 ${remaining} 天。`, "danger");
      return;
    }
    setBanner(`${rule.name}申请天数超过可用额度，当前最多可申请 ${remaining} 天。`, "danger");
    return;
  }

  if ((rule.name === "病假" || rule.name === "带薪病假") && requested > 1) {
    setBanner("多天病假需在上传附件处补充病假单或多天就医记录。", "warning");
    return;
  }

  hideBanner();
}

function updateNonLeaveState(config) {
  elements.totalInput.readOnly = true;
  renderLeavePeriodMode();
  renderOvertimeSegments();
  elements.qualificationInfoFields.classList.add("is-hidden");
  elements.selectedQuotaCard.classList.add("is-hidden");
  updateAttachment(config.proof);
  setRequirement(`${config.title.replace("申请", "")}要求`, config.memo);

  if (currentRequest === "comp") elements.totalInput.value = calculateWorkingHours(elements.startDate.value, elements.endDate.value, elements.startTime.value, elements.endTime.value);
  if (currentRequest === "overtime" || currentRequest === "holidayOvertime") elements.totalInput.value = calculateOvertimeSegmentsTotal();
  updateFooterTotal(config);

  const requested = Number(elements.totalInput.value || 0);
  if (currentRequest === "comp" && requested > getRemaining("comp")) {
    setBanner(`调休时长超过可用余额，当前最多可申请 ${getRemaining("comp")} 小时。`, "danger");
    return;
  }

  if (currentRequest === "holidayOvertime" && hasHolidayOvertimeSegmentOnNonHoliday()) {
    setBanner("法定节假日加班只能选择中国法定节假日。", "danger");
    return;
  }

  if (currentRequest === "comp" && requested < 1) {
    setBanner("调休最小时长为 1 小时。", "danger");
    return;
  }

  if (currentRequest === "overtime" && requested < 1) {
    setBanner("加班最小时长为 1 小时。", "danger");
    return;
  }

  if (currentRequest === "holidayOvertime" && requested < 4) {
    setBanner("节假日加班最小时长为 0.5 天（4小时）。", "danger");
    return;
  }

  if ((currentRequest === "overtime" || currentRequest === "holidayOvertime") && requested > 36) {
    setBanner("伙伴每月加班时间总计不得超过 36 小时。", "danger");
    return;
  }

  if (currentRequest === "overtime" && hasOvertimeSegmentWorkTimeOverlap()) {
    setBanner("固定工时制下，工作日 09:00-18:00 不能申请加班，请选择18:00后或非工作日。", "danger");
    return;
  }

  if (currentRequest === "overtime" && hasOvertimeSegmentOverDailyLimit()) {
    setBanner("单日加班最多 8 小时。", "danger");
    return;
  }

  if (currentRequest === "holidayOvertime" && hasHolidayOvertimeDailyLimit()) {
    setBanner("单日加班最多 8 小时。", "danger");
    return;
  }

  if (currentRequest === "holidayOvertime" && !document.querySelector("#reasonInput").value.trim()) {
    setBanner("法定节假日加班中加班原因必填。", "danger");
    return;
  }

  hideBanner();
}

function applyRequestType(type, leaveType) {
  currentRequest = type;
  const config = requestConfigs[type];
  renderStartTimeOptions();

  elements.formTitle.textContent = config.title;
  elements.formSubtitle.textContent = config.subtitle;
  elements.titleInput.value = config.titleValue;
  elements.reasonLabel.textContent = config.reasonLabel;
  elements.totalLabel.textContent = config.totalLabel;
  elements.leaveTypeField.classList.toggle("is-hidden", !config.showLeaveType);

  if (type === "leave") {
    if (leaveType) elements.leaveTypeSelect.value = leaveType;
    elements.leaveStartDate.value = "2026-08-24";
    elements.leaveStartPeriod.value = "am";
    elements.leaveEndDate.value = "2026-08-24";
    elements.leaveEndPeriod.value = "pm";
    const rule = selectedLeaveRule();
    if (isQualificationLeave(rule) && !hasQualificationQuota(rule) && !qualificationDialogConfirmed[rule.quotaKey]) showQualificationDialog(rule);
    renderEndTimeOptions();
    updateLeaveState(config);
  } else {
    if (type === "comp") {
      elements.startDate.value = "2026-08-24";
      elements.startTime.value = "09:00";
      elements.endDate.value = "2026-08-24";
      elements.endTime.value = "18:00";
    }
    if (type === "overtime") {
      elements.startDate.value = "2026-08-29";
      elements.startTime.value = "09:00";
      elements.endDate.value = "2026-08-29";
      elements.endTime.value = "18:00";
      resetOvertimeSegments(type);
    }
    if (type === "holidayOvertime") {
      elements.startDate.value = "2026-10-01";
      elements.startTime.value = "09:00";
      elements.endDate.value = "2026-10-01";
      elements.endTime.value = "18:00";
      resetOvertimeSegments(type);
    }
    renderEndTimeOptions();
    updateNonLeaveState(config);
  }

  showPage("apply");
}

function refreshState() {
  const config = requestConfigs[currentRequest];
  renderStartTimeOptions();
  renderEndTimeOptions();
  renderLeavePeriodMode();
  if (currentRequest === "leave") updateLeaveState(config);
  else updateNonLeaveState(config);
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.setTimeout(() => elements.toast.classList.remove("show"), 2600);
}

elements.entryButtons.forEach((button) => {
  button.addEventListener("click", () => applyRequestType(button.dataset.request));
});

elements.quotaList.addEventListener("click", (event) => {
  const item = event.target.closest(".quota-item");
  if (!item) return;

  const quota = quotas[item.dataset.quota];
  const remaining = getRemaining(item.dataset.quota);
  if (remaining <= 0) {
    showToast("当前假期暂无可用额度，请等待 EHR 生成额度后再申请。");
    return;
  }

  if (quota.requestType) applyRequestType(quota.requestType);
  else applyRequestType("leave", quota.leaveType);
});

elements.homeRequestList.addEventListener("click", (event) => {
  const item = event.target.closest("[data-request-code]");
  if (!item) return;
  openRequestDetail(item.dataset.requestCode);
});

elements.approvalMenuBtn.addEventListener("click", () => {
  activeApprovalTab = "leave";
  renderApprovalList();
  showPage("approval");
});

elements.backFromApprovalBtn.addEventListener("click", () => {
  showPage("home");
});

elements.backFromRequestDetailBtn.addEventListener("click", () => {
  showPage("home");
});

elements.approvalTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeApprovalTab = tab.dataset.approvalTab;
    renderApprovalList();
  });
});

elements.approvalList.addEventListener("click", (event) => {
  const item = event.target.closest("[data-approval-code]");
  if (!item) return;
  openApprovalDetail(item.dataset.approvalCode);
});

elements.closeRequestDetailBtn.addEventListener("click", closeRequestDetail);

elements.requestDetailDialog.addEventListener("click", (event) => {
  if (event.target === elements.requestDetailDialog) closeRequestDetail();
  const action = event.target.closest("[data-detail-action]");
  const approvalAction = event.target.closest("[data-approval-action]");
  if (action?.dataset.detailAction === "withdraw") withdrawRequest(action.dataset.code);
  if (approvalAction) handleApprovalAction(approvalAction.dataset.approvalAction);
});

function handleOvertimeSegmentChange(event) {
  const field = event.target.dataset.segmentField;
  if (!field) return;
  const index = Number(event.target.dataset.index);
  if (!overtimeSegments[index]) return;
  overtimeSegments[index][field] = event.target.value;
  if (field === "startDate") overtimeSegments[index].endDate = event.target.value;
  refreshState();
}

elements.overtimeSegmentsCard.addEventListener("input", handleOvertimeSegmentChange);
elements.overtimeSegmentsCard.addEventListener("change", handleOvertimeSegmentChange);

elements.overtimeSegmentsCard.addEventListener("click", (event) => {
  const action = event.target.closest("[data-segment-action]");
  if (!action) return;
  if (action.dataset.segmentAction === "add") {
    if (isHolidayOvertimeRequest()) return;
    const template = createOvertimeSegment("2026-08-29", "18:00", "2026-08-29", "20:00");
    overtimeSegments.push(template);
    refreshState();
  }
  if (action.dataset.segmentAction === "remove") {
    const index = Number(action.dataset.index);
    overtimeSegments.splice(index, 1);
    refreshState();
  }
});

elements.backHomeBtn.addEventListener("click", () => {
  showPage("home");
});
[elements.leaveTypeSelect, elements.totalInput, elements.leaveStartDate, elements.leaveStartPeriod, elements.leaveEndDate, elements.leaveEndPeriod, elements.startDate, elements.startTime, elements.endDate, elements.endTime, document.querySelector("#reasonInput")].forEach((control) => {
  control.addEventListener("input", () => {
    const rule = selectedLeaveRule();
    if (control === elements.leaveTypeSelect && isQualificationLeave(rule) && !hasQualificationQuota(rule) && !qualificationDialogConfirmed[rule.quotaKey]) showQualificationDialog(rule);
    refreshState();
  });
});

elements.confirmMarriageDialogBtn.addEventListener("click", () => {
  const rule = selectedLeaveRule();
  qualificationDialogConfirmed[rule.quotaKey] = true;
  hideQualificationDialog();
  elements.titleInput.value = "请假申请-呈语-2026-08-24";
  elements.leaveStartDate.value = "2026-08-24";
  elements.leaveStartPeriod.value = "am";
  elements.leaveEndDate.value = "2026-08-28";
  elements.leaveEndPeriod.value = "pm";
  elements.qualificationDateInput.value = rule.name === "婚假" ? "2026-08-20" : "2026-08-18";
  document.querySelector("#reasonInput").value = `首次申请${rule.name}，提交相关材料，申请 5 天${rule.name}。`;
  refreshState();
});

elements.uploadAttachmentBtn.addEventListener("click", () => {
  const rule = selectedLeaveRule();
  if (currentRequest === "leave" && isQualificationLeave(rule) && !hasQualificationQuota(rule)) {
    qualificationAttachmentUploaded[rule.quotaKey] = true;
    refreshState();
    showToast(`已上传${rule.attachmentName || "资格证明.jpg"}。`);
    return;
  }
  showToast("已添加模拟附件。");
});

function generateQualificationQuotaAfterApproval(rule, requested) {
  const material = {
    qualificationDate: elements.qualificationDateInput.value,
    attachmentName: rule.attachmentName || "资格证明.jpg"
  };
  savedQualificationMaterials[rule.quotaKey] = material;
  quotas[rule.quotaKey] = {
    label: rule.name,
    total: rule.firstGrantTotal,
    used: requested,
    pending: 0,
    unit: "天",
    leaveType: rule.name,
    source: "首次审批生成额度",
    material
  };
}

elements.submitBtn.addEventListener("click", () => {
  refreshState();
  if (elements.banner.classList.contains("danger")) {
    showToast("当前申请存在阻断校验，请先处理额度或时长问题。");
    return;
  }
  const rule = selectedLeaveRule();
  if (currentRequest === "leave" && hasInvalidLeaveDurationUnit(Number(elements.totalInput.value || 0))) {
    showToast("请假时长必须是0.5的倍数。");
    return;
  }
  if (currentRequest === "leave" && isQualificationLeave(rule) && !hasQualificationQuota(rule)) {
    if (!elements.qualificationDateInput.value) {
      showToast(`请先填写${rule.qualificationDateLabel || "资格日期"}。`);
      return;
    }
    if (!uploadedQualificationMaterial(rule)) {
      showToast(`请先上传${rule.attachmentName || "资格证明.jpg"}。`);
      return;
    }
    const requested = Number(elements.totalInput.value || 0);
    generateQualificationQuotaAfterApproval(rule, requested);
    myRequests.unshift({
      code: "L202608240099",
      name: "请假申请-呈语-2026-08-24",
      type: "请假",
      category: rule.name,
      start: getLeaveStartText(),
      end: getLeaveEndText(),
      total: `${requested}天`,
      status: "审批通过",
      node: "流程归档",
      submitTime: "2026-08-24 10:30",
      progress: ["提交申请", "HR 审核通过", `生成${rule.name}额度 ${rule.firstGrantTotal} 天`, `扣除本次 ${requested} 天`]
    });
    renderQuotas();
    renderHomeRequests();
    refreshState();
    showToast(`已提交首次${rule.name}申请：审批通过后生成${rule.firstGrantTotal}天额度，并扣除本次申请时长。`);
    return;
  }
  showToast("已提交模拟申请，系统将在提交后生成单号。此 demo 未连接真实 EHR。");
});

renderLeaveOptions();
renderQuotas();
renderHomeRequests();
showPage("home");
