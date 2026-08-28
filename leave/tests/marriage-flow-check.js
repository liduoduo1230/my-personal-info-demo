const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(!/firstMarriageExample/.test(app), "婚假流程不应再依赖 firstMarriageExample 双状态开关");
assert(!/applyRequestType\("leave", "婚假"/.test(app), "页面初始化不应直接打开婚假示例");
assert(/showPage\("home"\)/.test(app), "页面初始化应停留在首页");
assert(!/^\s*marriage\s*:/m.test(app), "初始额度里不应预置婚假额度");
assert(!/L202608240012/.test(app), "初始申请记录不应预置已通过婚假单据");
assert(!/首次审批后扣减/.test(app), "首次婚假申请不应显示额度模块或待扣减额度文案");
assert(/首次申请婚假，请提交结婚登记材料，审批通过后将生成10天婚假额度，并扣除本次申请时长。/.test(html), "首次婚假弹窗文案不完整");
assert(/qualificationDateInput/.test(html), "资格假表单应包含资格日期字段");
assert(/confirmMarriageDialogBtn/.test(html), "婚假首次提示应有确认按钮");
assert(!/marriageAttachmentState/.test(html), "婚假表单不应单独显示结婚登记材料待上传块");
assert(!/首次申请婚假需在上传附件处提交结婚登记材料/.test(app), "首次婚假缺附件不应显示表单红色提示");
assert(/请先上传/.test(app), "首次资格假缺附件应在提交时用轻提示阻断");
assert(/generateQualificationQuotaAfterApproval/.test(app), "首次提交后应能模拟生成资格假额度");
assert(/申请天数超过可用额度/.test(app), "第二次申请应校验剩余额度");
assert(/育儿假一胎/.test(app) && /parentingOne/.test(app), "育儿假应进入资格审批生成额度流程");
assert(/陪护假/.test(app) && /care/.test(app), "陪护假应进入资格审批生成额度流程");
assert(/育儿假一胎[\s\S]*qualificationDateLabel: "宝宝出生日期"[\s\S]*attachmentName: "宝宝出生证明.jpg"/.test(app), "育儿假应显示宝宝出生日期并提交宝宝出生证明");
assert(/陪护假[\s\S]*qualificationDateLabel: "宝宝出生日期"[\s\S]*attachmentName: "宝宝出生证明.jpg"/.test(app), "陪护假应显示宝宝出生日期并提交宝宝出生证明");
assert(/isQualificationLeave/.test(app), "婚假、育儿假和陪护假应共用资格假流程");
assert(!/familyInfoRequired/.test(app), "育儿假不应再使用单独维护家庭信息的阻断流程");
assert(/approval-summary compact/.test(app), "首页审批摘要应使用紧凑两行展示");
assert(!/审批人花名（本名）|拒绝人花名（本名）|当前节点<\/span>|节点名称<\/span>/.test(app), "首页审批摘要不应显示字段名称");
assert(/chinaPublicHolidays2026/.test(app), "应内置 2026 中国法定节假日清单");
assert(/chinaAdjustedWorkdays2026/.test(app), "应内置 2026 中国调休上班日清单");
assert(/function isChinaWorkday/.test(app), "应提供中国工作日判断");
assert(/function calculateBusinessLeaveDays/.test(app), "请假除产假应按工作日计算");
assert(/function calculateNaturalLeaveDays/.test(app), "产假应按自然日计算");
assert(/function calculateWorkingHours/.test(app), "调休应按固定工时工作时间计算");
assert(/function calculateOvertimeHours/.test(app), "加班应按非工作时间计算");
assert(/function hasWorkdayWorkTimeOverlap/.test(app), "普通加班应识别工作日工作时段重叠");
assert(/法定节假日加班只能选择中国法定节假日/.test(app), "法定节假日加班应限制中国法定节假日");
assert(/工作日 09:00-18:00 不能申请加班/.test(app), "普通加班应提示工作日工作时间不可选");
assert(/单日加班最多 8 小时/.test(app), "加班应限制一天最多 8 小时");

console.log("marriage flow assertions passed");
