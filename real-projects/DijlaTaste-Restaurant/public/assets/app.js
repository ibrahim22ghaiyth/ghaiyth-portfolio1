const state = {
  lang: localStorage.getItem("dt_lang") || "ar",
  settings: {},
  categories: [],
  products: [],
  selectedCategory: 0,
  search: "",
  cart: JSON.parse(localStorage.getItem("dt_cart") || "[]")
};

const i18n = {
  ar: {
    "nav.menu":"المنيو","nav.order":"الطلب","nav.contact":"تواصل","nav.admin":"الإدارة",
    "cart.title":"السلة","hero.badge":"منيو مطعم فعلي · SQLite · عربي/إنكليزي",
    "hero.title":"تجربة طلب مطعم كاملة بتصميم يليق بالمطاعم.","hero.browse":"استعرض الأطباق","hero.share":"نسخ رابط المنيو",
    "hero.noteTitle":"اختيارات اليوم","hero.note":"كباب عراقي، دولمة، ليمون نعناع، وكنافة قشطة.",
    "facts.hours":"أوقات العمل","facts.phone":"الحجز والطلبات","facts.delivery":"توصيل",
    "menu.kicker":"الأقسام والأطباق","menu.title":"منيو دجلة وتنور",
    "order.kicker":"طلب مباشر","order.title":"أضف الأطباق للسلة وأرسل الطلب للمطعم.","order.desc":"الطلب ينحفظ داخل قاعدة SQLite ويظهر مباشرة في لوحة الإدارة بدون تسجيل دخول.","order.openCart":"افتح السلة",
    "cart.heading":"طلبك","cart.delivery":"توصيل","cart.pickup":"استلام","cart.subtotal":"المجموع","cart.deliveryFee":"التوصيل","cart.tax":"الضريبة","cart.total":"الإجمالي","cart.submit":"إرسال الطلب",
    "cart.payTitle":"طريقة الدفع","cart.payCash":"نقد عند الاستلام","cart.payZain":"زين كاش","cart.payAsia":"آسيا حوالة",
    all:"الكل", add:"إضافة", unavailable:"غير متوفر", featured:"مميز", vegetarian:"نباتي", spicy:"حار", calories:"سعرة", empty:"لا توجد أطباق مطابقة.", sent:"تم إرسال الطلب", added:"تمت الإضافة للسلة", copied:"تم نسخ الرابط"
  },
  en: {
    "nav.menu":"Menu","nav.order":"Order","nav.contact":"Contact","nav.admin":"Admin",
    "cart.title":"Cart","hero.badge":"Real restaurant app · SQLite · Arabic/English",
    "hero.title":"A complete restaurant ordering experience with a proper dining design.","hero.browse":"Browse dishes","hero.share":"Copy menu link",
    "hero.noteTitle":"Today’s picks","hero.note":"Iraqi kebab, dolma, mint lemonade, and cream kunafa.",
    "facts.hours":"Opening hours","facts.phone":"Reservations & orders","facts.delivery":"Delivery",
    "menu.kicker":"Categories & dishes","menu.title":"Dijla & Tanoor Menu",
    "order.kicker":"Direct ordering","order.title":"Add dishes to the cart and send the order to the restaurant.","order.desc":"Orders are stored in SQLite and appear directly in the admin panel without login.","order.openCart":"Open cart",
    "cart.heading":"Your order","cart.delivery":"Delivery","cart.pickup":"Pickup","cart.subtotal":"Subtotal","cart.deliveryFee":"Delivery","cart.tax":"Tax","cart.total":"Total","cart.submit":"Send order",
    "cart.payTitle":"Payment method","cart.payCash":"Cash on delivery","cart.payZain":"ZainCash","cart.payAsia":"Asia Hawala",
    all:"All", add:"Add", unavailable:"Unavailable", featured:"Featured", vegetarian:"Vegetarian", spicy:"Spicy", calories:"cal", empty:"No matching dishes.", sent:"Order sent", added:"Added to cart", copied:"Link copied"
  }
};

const $ = s => document.querySelector(s);
function text(key){ return i18n[state.lang][key] || key; }
function field(obj, base){ return state.lang === "ar" ? obj[`${base}_ar`] : obj[`${base}_en`]; }
function money(v){ return `${Number(v||0).toLocaleString("en-US")} ${state.settings.currency || "IQD"}`; }
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2200); }
async function api(path,opt={}){ const r=await fetch(path,{headers:{"Content-Type":"application/json"},...opt}); const j=await r.json(); if(!j.success) throw new Error(j.error||"Error"); return j.data; }

function applyLanguage(){
  document.documentElement.lang=state.lang;
  document.documentElement.dir=state.lang==="ar"?"rtl":"ltr";
  $("#langBtn").textContent=state.lang==="ar"?"EN":"AR";
  document.querySelectorAll("[data-i18n]").forEach(el=>el.textContent=text(el.dataset.i18n));
  document.querySelectorAll("[data-placeholder-ar]").forEach(el=>el.placeholder=state.lang==="ar"?el.dataset.placeholderAr:el.dataset.placeholderEn);
  renderSettings(); renderCategories(); renderProducts(); renderCart();
}

function renderSettings(){
  const s=state.settings;
  document.title=field(s,"restaurant_name") || "Restaurant";
  document.querySelectorAll('[data-field="restaurant_name"]').forEach(el=>el.textContent=field(s,"restaurant_name"));
  document.querySelectorAll('[data-field="slogan"]').forEach(el=>el.textContent=field(s,"slogan"));
  document.querySelectorAll('[data-field="description"]').forEach(el=>el.textContent=field(s,"description"));
  document.querySelectorAll('[data-field="open_hours"]').forEach(el=>el.textContent=field(s,"open_hours"));
  document.querySelectorAll('[data-field="phone"]').forEach(el=>el.textContent=s.phone);
  document.querySelectorAll('[data-field="address"]').forEach(el=>el.textContent=field(s,"address"));
  document.querySelectorAll('[data-field="email"]').forEach(el=>el.textContent=s.email);
  $("#deliveryFact").textContent=money(s.delivery_fee);
  $("#whatsappLink").href=`https://wa.me/${String(s.whatsapp||"").replace(/\D/g,"")}`;
  $("#instagramLink").href=s.instagram || "#";
  $("#facebookLink").href=s.facebook || "#";
}

function foodIcon(p){
  const n = `${p.name_ar} ${p.name_en}`.toLowerCase();
  if(n.includes("kebab")||n.includes("كباب")||n.includes("grill")||n.includes("مشاوي")) return "🔥";
  if(n.includes("tea")||n.includes("شاي")||n.includes("lemon")||n.includes("ليمون")||n.includes("ayran")||n.includes("لبن")) return "🥤";
  if(n.includes("kunafa")||n.includes("كنافة")||n.includes("محلبية")) return "🍮";
  if(n.includes("dolma")||n.includes("دولمة")) return "🍲";
  if(n.includes("sandwich")||n.includes("ساندويش")) return "🥙";
  if(n.includes("tabbouleh")||n.includes("تبولة")||n.includes("hummus")||n.includes("حمص")) return "🥗";
  return "🍽️";
}

function renderCategories(){
  const box=$("#categories");
  box.innerHTML=`<button class="category-btn ${state.selectedCategory===0?"active":""}" data-cat="0">✨ ${text("all")}</button>`+
    state.categories.map(c=>`<button class="category-btn ${state.selectedCategory===c.id?"active":""}" data-cat="${c.id}">${c.icon} ${field(c,"name")}</button>`).join("");
  box.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{state.selectedCategory=Number(b.dataset.cat);renderCategories();renderProducts();});
}

function renderProducts(){
  let list=state.products.slice();
  if(state.selectedCategory) list=list.filter(p=>p.category_id===state.selectedCategory);
  if(state.search){ const q=state.search.toLowerCase(); list=list.filter(p=>`${p.name_ar} ${p.name_en} ${p.description_ar} ${p.description_en}`.toLowerCase().includes(q)); }
  $("#products").innerHTML=list.map(p=>`
    <article class="product-card">
      <div class="food-visual">
          ${p.image_url
            ? `<img src="${p.image_url}" alt="${field(p,"name")}" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove(); this.parentElement.classList.add('image-fallback'); this.parentElement.dataset.icon='${foodIcon(p)}';">`
            : `<span class="food-icon">${foodIcon(p)}</span>`}
        </div>
      <div class="product-body">
        <h3>${field(p,"name")}</h3>
        <p>${field(p,"description")||""}</p>
        <div class="tags">
          ${p.featured?`<span>⭐ ${text("featured")}</span>`:""}
          ${p.vegetarian?`<span>🌿 ${text("vegetarian")}</span>`:""}
          ${p.spicy_level?`<span>🌶 ${text("spicy")} ${p.spicy_level}</span>`:""}
          ${p.calories?`<span>${p.calories} ${text("calories")}</span>`:""}
          <span>${state.lang==="ar"?p.prep_time_ar:p.prep_time_en}</span>
        </div>
        <div class="product-foot">
          <b class="price">${money(p.price)}</b>
          <button class="add" data-add="${p.id}" ${p.available?"":"disabled"}>${p.available?text("add"):text("unavailable")}</button>
        </div>
      </div>
    </article>`).join("") || `<p>${text("empty")}</p>`;
  document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>addToCart(Number(b.dataset.add)));
}

function addToCart(id){
  const p=state.products.find(x=>x.id===id); if(!p)return;
  const item=state.cart.find(i=>i.product_id===id);
  if(item)item.qty++; else state.cart.push({product_id:p.id, qty:1, price:p.price, name_ar:p.name_ar, name_en:p.name_en});
  saveCart(); toast(text("added"));
}
function saveCart(){ localStorage.setItem("dt_cart",JSON.stringify(state.cart)); renderCart(); }
function totals(){
  const subtotal=state.cart.reduce((s,i)=>s+i.price*i.qty,0);
  const type=new FormData($("#orderForm")).get("order_type")||"delivery";
  const delivery=type==="delivery"?Number(state.settings.delivery_fee||0):0;
  const tax=Math.round(subtotal*(Number(state.settings.tax_percent||0)/100));
  return {subtotal,delivery,tax,total:subtotal+delivery+tax};
}
function renderCart(){
  $("#cartCount").textContent=state.cart.reduce((s,i)=>s+i.qty,0);
  $("#cartItems").innerHTML=state.cart.map(i=>`<div class="cart-item"><div><b>${state.lang==="ar"?i.name_ar:i.name_en}</b><p>${money(i.price)} × ${i.qty}</p></div><div class="qty"><button type="button" data-dec="${i.product_id}">-</button><b>${i.qty}</b><button type="button" data-inc="${i.product_id}">+</button></div></div>`).join("") || `<p>${state.lang==="ar"?"السلة فارغة":"Cart is empty"}</p>`;
  document.querySelectorAll("[data-inc]").forEach(b=>b.onclick=()=>qty(Number(b.dataset.inc),1));
  document.querySelectorAll("[data-dec]").forEach(b=>b.onclick=()=>qty(Number(b.dataset.dec),-1));
  const t=totals(); $("#subtotalText").textContent=money(t.subtotal); $("#deliveryText").textContent=money(t.delivery); $("#taxText").textContent=money(t.tax); $("#totalText").textContent=money(t.total);
}
function qty(id,d){ const item=state.cart.find(i=>i.product_id===id); if(!item)return; item.qty+=d; if(item.qty<=0)state.cart=state.cart.filter(i=>i.product_id!==id); saveCart(); }

async function submitOrder(e){
  e.preventDefault();
  if(!state.cart.length)return toast(state.lang==="ar"?"السلة فارغة":"Cart is empty");
  const data=Object.fromEntries(new FormData(e.target).entries());
  data.items=state.cart.map(i=>({product_id:i.product_id, qty:i.qty}));
  try{ const order=await api("/api/public/orders",{method:"POST",body:JSON.stringify(data)}); state.cart=[]; saveCart(); e.target.reset(); $("#drawer").classList.remove("open"); toast(`${text("sent")} #${order.id}`); }
  catch(err){ toast(err.message); }
}

async function init(){
  const data=await api("/api/public/bootstrap");
  state.settings=data.settings; state.categories=data.categories; state.products=data.products;
  applyLanguage();
  $("#langBtn").onclick=()=>{state.lang=state.lang==="ar"?"en":"ar";localStorage.setItem("dt_lang",state.lang);applyLanguage();};
  $("#searchInput").oninput=e=>{state.search=e.target.value;renderProducts();};
  $("#cartBtn").onclick=()=>$("#drawer").classList.add("open");
  $("#openCart2").onclick=()=>$("#drawer").classList.add("open");
  $("#closeCart").onclick=()=>$("#drawer").classList.remove("open");
  $("#orderForm").addEventListener("input",renderCart);
  $("#orderForm").addEventListener("submit",submitOrder);
  $("#shareBtn").onclick=async()=>{await navigator.clipboard.writeText(location.href);toast(text("copied"));};
}
init().catch(e=>toast(e.message));
