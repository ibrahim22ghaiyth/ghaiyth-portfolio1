const $ = (s) => document.querySelector(s);
const state = { settings: null, current: "dashboard", debtFilter: "", lang: "ar" };

const I18N = {
  ar: {
    "app.name": "قسّطها", "app.tagline": "دفتر الديون والأقساط",
    "nav.dashboard": "الملخّص", "nav.debts": "الديون", "nav.contacts": "الجهات", "nav.settings": "الإعدادات",
    "dash.title": "دفتر الحساب", "dash.subtitle": "نظرة سريعة على كل اللي عليك وإلك.",
    "dash.overdue": "متأخّرة", "dash.dueMonth": "مستحقّة هذا الشهر",
    "filter.all": "الكل", "filter.owedToMe": "إلي (ديون لي)", "filter.iOwe": "عليّ (ديون عليّ)",
    "debt.new": "+ دين جديد", "debt.contact": "الجهة", "debt.title": "العنوان (شنو الدين؟)",
    "debt.titlePh": "مثال: تلفزيون، سلفة، بضاعة", "debt.total": "المبلغ الكلي (دينار)", "debt.count": "عدد الأقساط",
    "debt.direction": "الاتجاه", "debt.dirToMe": "إلي (الفلوس راح تجيني)", "debt.dirIOwe": "عليّ (آني لازم أدفع)",
    "debt.startDate": "تاريخ أول قسط", "debt.note": "ملاحظة", "debt.create": "إنشاء وجدولة الأقساط",
    "contact.new": "+ جهة جديدة", "contact.name": "الاسم", "contact.search": "دوّر باسم أو رقم...",
    "set.ownerName": "اسمك", "set.bizName": "اسم المحل/العمل", "set.phone": "رقم الهاتف", "set.currency": "العملة", "set.save": "حفظ",
    "cancel": "إلغاء", "close": "إغلاق", "opt": "اختياري",
    "footer": "قسّطها · صُنع بالعراق — Ibrahim Ghaiyth",
    "k.owedToMe": "إلي (ديون راح تجيني)", "k.iOwe": "عليّ (ديون لازم أدفعها)", "k.net": "الصافي",
    "k.activeDebts": "دين فعّال", "k.overdueInst": "قسط متأخّر", "k.inYourFavor": "بصالحك", "k.againstYou": "عليك",
    "noOverdue": "ما أكو متأخرات 👌", "noDue": "ما أكو أقساط مستحقّة هالشهر", "noDebts": "ما أكو ديون. اضغط «دين جديد» لتبدي.",
    "noContacts": "ما أكو جهات بعد.", "noPhone": "بلا رقم",
    "dir.me": "إلي", "dir.owe": "عليّ", "st.settled": "مسدّد", "st.overdue": "متأخّر",
    "inst.no": "#", "inst.due": "الاستحقاق", "inst.amount": "المبلغ", "inst.paid": "مدفوع", "inst.status": "الحالة",
    "inst.pay": "دفع", "ist.paid": "مدفوع", "ist.pending": "معلّق", "ist.partial": "جزئي",
    "d.total": "الكلي", "d.remaining": "متبقّي", "d.paidLabel": "مدفوع", "d.installmentsCount": "قسط",
    "d.delete": "حذف الدين", "d.confirmDelete": "متأكد تريد تحذف الدين وكل أقساطه؟",
    "pay.prompt": "مبلغ الدفعة (المتبقّي على القسط: ", "pay.bad": "مبلغ غير صحيح",
    "t.debtCreated": "تم إنشاء الدين وجدولة الأقساط", "t.contactAdded": "تمت إضافة الجهة",
    "t.paid": "تم تسجيل الدفعة", "t.deleted": "تم حذف الدين", "t.settingsSaved": "تم حفظ الإعدادات",
    "addContactFirst": "— أضف جهة أولاً —"
  },
  en: {
    "app.name": "Qassitha", "app.tagline": "Debt & installment ledger",
    "nav.dashboard": "Summary", "nav.debts": "Debts", "nav.contacts": "Contacts", "nav.settings": "Settings",
    "dash.title": "The Ledger", "dash.subtitle": "A quick look at what you owe and what's owed to you.",
    "dash.overdue": "Overdue", "dash.dueMonth": "Due this month",
    "filter.all": "All", "filter.owedToMe": "Owed to me", "filter.iOwe": "I owe",
    "debt.new": "+ New debt", "debt.contact": "Contact", "debt.title": "Title (what is it?)",
    "debt.titlePh": "e.g. TV, loan, goods", "debt.total": "Total amount (IQD)", "debt.count": "Installments",
    "debt.direction": "Direction", "debt.dirToMe": "Owed to me (money coming in)", "debt.dirIOwe": "I owe (I must pay)",
    "debt.startDate": "First installment date", "debt.note": "Note", "debt.create": "Create & schedule",
    "contact.new": "+ New contact", "contact.name": "Name", "contact.search": "Search by name or phone...",
    "set.ownerName": "Your name", "set.bizName": "Business name", "set.phone": "Phone", "set.currency": "Currency", "set.save": "Save",
    "cancel": "Cancel", "close": "Close", "opt": "Optional",
    "footer": "Qassitha · Made in Iraq — Ibrahim Ghaiyth",
    "k.owedToMe": "Owed to me (incoming)", "k.iOwe": "I owe (to pay)", "k.net": "Net balance",
    "k.activeDebts": "active debts", "k.overdueInst": "overdue installments", "k.inYourFavor": "in your favor", "k.againstYou": "against you",
    "noOverdue": "No overdue payments 👌", "noDue": "Nothing due this month", "noDebts": "No debts yet. Tap \"New debt\" to start.",
    "noContacts": "No contacts yet.", "noPhone": "No phone",
    "dir.me": "Owed to me", "dir.owe": "I owe", "st.settled": "Settled", "st.overdue": "Overdue",
    "inst.no": "#", "inst.due": "Due", "inst.amount": "Amount", "inst.paid": "Paid", "inst.status": "Status",
    "inst.pay": "Pay", "ist.paid": "Paid", "ist.pending": "Pending", "ist.partial": "Partial",
    "d.total": "Total", "d.remaining": "Remaining", "d.paidLabel": "Paid", "d.installmentsCount": "installments",
    "d.delete": "Delete debt", "d.confirmDelete": "Delete this debt and all its installments?",
    "pay.prompt": "Payment amount (remaining on installment: ", "pay.bad": "Invalid amount",
    "t.debtCreated": "Debt created and installments scheduled", "t.contactAdded": "Contact added",
    "t.paid": "Payment recorded", "t.deleted": "Debt deleted", "t.settingsSaved": "Settings saved",
    "addContactFirst": "— add a contact first —"
  }
};

const t = (key) => (I18N[state.lang] && I18N[state.lang][key]) || I18N.ar[key] || key;

function applyLang(lang) {
  state.lang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  const btn = $("#langToggle");
  if (btn) btn.textContent = lang === "ar" ? "EN" : "ع";
  // أعد تحميل العرض الحالي حتى يُترجم المحتوى الديناميكي
  switchView(state.current);
}

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2400);
}

function money(v) {
  const cur = state.settings?.currency || "IQD";
  return `${Number(v || 0).toLocaleString("en-US")} ${cur}`;
}

async function api(path, opt = {}) {
  const r = await fetch(path, { headers: { "Content-Type": "application/json" }, ...opt });
  const j = await r.json();
  if (!j.success) throw new Error(j.error || "صار خطأ");
  return j.data;
}

const dirLabel = (d) => (d === "i_owe" ? t("dir.owe") : t("dir.me"));
const methodLabel = { cash: "نقد", zaincash: "زين كاش", asiahawala: "آسيا حوالة", transfer: "تحويل" };
const instStatusLabel = () => ({ paid: t("ist.paid"), pending: t("ist.pending"), partial: t("ist.partial") });

function switchView(key) {
  state.current = key;
  document.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("active", b.dataset.view === key));
  document.querySelectorAll(".view").forEach((v) => v.classList.toggle("active", v.id === `view-${key}`));
  if (key === "dashboard") loadDashboard();
  else if (key === "debts") loadDebts();
  else if (key === "contacts") loadContacts();
  else if (key === "settings") loadSettings();
}

// ===== الملخّص =====
async function loadDashboard() {
  const d = await api("/api/dashboard");
  const k = d.kpis;
  $("#balanceCards").innerHTML = `
    <div class="bal me"><small>${t("k.owedToMe")}</small><b>${money(k.owedToMe)}</b><div class="sub">${k.activeDebts} ${t("k.activeDebts")}</div></div>
    <div class="bal owe"><small>${t("k.iOwe")}</small><b>${money(k.iOwe)}</b><div class="sub">${k.overdueCount} ${t("k.overdueInst")}</div></div>
    <div class="bal net"><small>${t("k.net")}</small><b>${money(k.net)}</b><div class="sub">${k.net >= 0 ? t("k.inYourFavor") : t("k.againstYou")}</div></div>`;

  $("#overdueList").innerHTML = d.overdue.length
    ? d.overdue.map((i) => `<div class="lrow late">
        <div><div class="who">${i.contact_name}</div><div class="meta">${i.title} · ${dirLabel(i.direction)} · ${i.due_date}</div></div>
        <div class="amt">${money(i.amount - i.paid_amount)}</div></div>`).join("")
    : `<div class="empty">${t("noOverdue")}</div>`;

  $("#dueList").innerHTML = d.dueThisMonth.length
    ? d.dueThisMonth.map((i) => `<div class="lrow">
        <div><div class="who">${i.contact_name}</div><div class="meta">${i.title} · ${i.due_date}</div></div>
        <div class="amt">${money(i.amount - i.paid_amount)}</div></div>`).join("")
    : `<div class="empty">${t("noDue")}</div>`;
}

// ===== الديون =====
async function loadDebts() {
  const q = state.debtFilter ? `?direction=${state.debtFilter}` : "";
  const debts = await api(`/api/debts${q}`);
  $("#debtsList").innerHTML = debts.length
    ? debts.map(debtCard).join("")
    : `<div class="empty">${t("noDebts")}</div>`;
  document.querySelectorAll("[data-debt]").forEach((el) => (el.onclick = () => openDetail(Number(el.dataset.debt))));
}

function debtCard(d) {
  const pct = d.total_amount ? Math.min(100, Math.round((d.paid / d.total_amount) * 100)) : 0;
  const tagClass = d.status === "settled" ? "settled" : d.status === "overdue" ? "overdue" : d.direction === "i_owe" ? "owe" : "me";
  const tagText = d.status === "settled" ? t("st.settled") : d.status === "overdue" ? t("st.overdue") : dirLabel(d.direction);
  return `<article class="debt" data-debt="${d.id}">
    <div class="top">
      <div><div class="title">${d.title}</div><div class="contact">${d.contact_name} · ${d.installments_count} ${t("d.installmentsCount")}</div></div>
      <span class="tag ${tagClass}">${tagText}</span>
    </div>
    <div class="progress"><i style="width:${pct}%"></i></div>
    <div class="nums"><span>${t("d.paidLabel")} <b>${money(d.paid)}</b></span><span>${t("d.remaining")} <b>${money(d.remaining)}</b></span></div>
  </article>`;
}

// ===== تفاصيل الدين + الدفع =====
async function openDetail(id) {
  const d = await api(`/api/debts/${id}`);
  $("#detailContent").innerHTML = `
    <h2>${d.title}</h2>
    <p style="color:var(--muted);margin-bottom:6px">${d.contact_name} ${d.contact_phone ? "· " + d.contact_phone : ""} · ${dirLabel(d.direction)}</p>
    <p style="font-weight:800">${t("d.total")} ${money(d.total_amount)} · ${t("d.remaining")} ${money(d.remaining)}</p>
    <table class="inst-table">
      <thead><tr><th>${t("inst.no")}</th><th>${t("inst.due")}</th><th>${t("inst.amount")}</th><th>${t("inst.paid")}</th><th>${t("inst.status")}</th><th></th></tr></thead>
      <tbody>
        ${d.installments.map((i) => `<tr>
          <td>${i.seq}</td><td>${i.due_date}</td><td>${money(i.amount)}</td><td>${money(i.paid_amount)}</td>
          <td><span class="ist ${i.status}">${instStatusLabel()[i.status]}</span></td>
          <td>${i.status !== "paid" ? `<button class="btn primary small" data-pay="${i.id}" data-rem="${i.amount - i.paid_amount}">${t("inst.pay")}</button>` : "✓"}</td>
        </tr>`).join("")}
      </tbody>
    </table>
    <button class="btn ghost small" id="deleteDebt" data-id="${d.id}" style="margin-top:14px;color:var(--red)">${t("d.delete")}</button>`;

  document.querySelectorAll("[data-pay]").forEach((b) => (b.onclick = () => payInstallment(Number(b.dataset.pay), Number(b.dataset.rem), id)));
  $("#deleteDebt").onclick = async (e) => {
    if (!confirm(t("d.confirmDelete"))) return;
    await api(`/api/debts/${e.target.dataset.id}`, { method: "DELETE" });
    $("#detailDialog").close();
    toast(t("t.deleted"));
    loadDebts();
  };
  $("#detailDialog").showModal();
}

async function payInstallment(instId, remaining, debtId) {
  const input = prompt(`${t("pay.prompt")}${remaining.toLocaleString("en-US")}):`, String(remaining));
  if (input === null) return;
  const amount = Math.round(Number(input) || 0);
  if (amount <= 0) return toast(t("pay.bad"));
  try {
    await api("/api/payments", { method: "POST", body: JSON.stringify({ installment_id: instId, amount }) });
    toast(t("t.paid"));
    $("#detailDialog").close();
    openDetail(debtId);
  } catch (e) {
    toast(e.message);
  }
}

// ===== الجهات =====
async function loadContacts(q = "") {
  const rows = await api(`/api/contacts${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  $("#contactsList").innerHTML = rows.length
    ? rows.map((c) => `<div class="contact-card"><b>${c.name}</b><small>${c.phone || t("noPhone")}</small>${c.note ? `<small>${c.note}</small>` : ""}</div>`).join("")
    : `<div class="empty">${t("noContacts")}</div>`;
}

async function fillContactSelect() {
  const rows = await api("/api/contacts");
  $("#debtContactSelect").innerHTML = rows.length
    ? rows.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")
    : `<option value="">${t("addContactFirst")}</option>`;
}

// ===== الإعدادات =====
async function loadSettings() {
  const s = await api("/api/settings");
  state.settings = s;
  const f = $("#settingsForm");
  f.owner_name.value = s.owner_name || "";
  f.business_name.value = s.business_name || "";
  f.phone.value = s.phone || "";
  f.currency.value = s.currency || "IQD";
}

// ===== الأحداث =====
document.querySelectorAll(".tabs button").forEach((b) => (b.onclick = () => switchView(b.dataset.view)));
document.querySelectorAll("[data-filter]").forEach((b) => (b.onclick = () => {
  state.debtFilter = b.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach((x) => x.classList.toggle("active", x === b));
  loadDebts();
}));

$("#newDebtBtn").onclick = async () => {
  await fillContactSelect();
  $("#debtForm").reset();
  $("#debtForm").start_date.value = new Date().toISOString().slice(0, 10);
  $("#debtDialog").showModal();
};
$("#debtForm").onsubmit = async (e) => {
  if (e.submitter?.value === "cancel") return;
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  try {
    await api("/api/debts", { method: "POST", body: JSON.stringify(data) });
    $("#debtDialog").close();
    toast(t("t.debtCreated"));
    switchView("debts");
  } catch (err) {
    toast(err.message);
  }
};

$("#newContactBtn").onclick = () => { $("#contactForm").reset(); $("#contactDialog").showModal(); };
$("#contactForm").onsubmit = async (e) => {
  if (e.submitter?.value === "cancel") return;
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  try {
    await api("/api/contacts", { method: "POST", body: JSON.stringify(data) });
    $("#contactDialog").close();
    toast(t("t.contactAdded"));
    loadContacts();
  } catch (err) {
    toast(err.message);
  }
};

$("#contactSearch").oninput = (e) => loadContacts(e.target.value);
$("#closeDetail").onclick = () => $("#detailDialog").close();
$("#langToggle").onclick = () => applyLang(state.lang === "ar" ? "en" : "ar");
$("#settingsForm").onsubmit = async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  state.settings = await api("/api/settings", { method: "PUT", body: JSON.stringify(data) });
  $("#bizName").textContent = state.settings.business_name || t("app.tagline");
  toast(t("t.settingsSaved"));
};

// إقلاع
(async function init() {
  try {
    state.settings = await api("/api/settings");
  } catch (e) { /* الإعدادات تُحمّل لاحقاً */ }
  applyLang("ar");
  if (state.settings && state.settings.business_name) $("#bizName").textContent = state.settings.business_name;
})();
