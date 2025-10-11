

    /* ======== PREMIUM PRODUCTS (electronics-themed) ======== */
  /* ======== PREMIUM PRODUCTS (clothing-themed) ======== */
const PRODUCTS = [
  { 
  id:'prd1', 
  name:'Aurora Silk Saree', 
  price:8999, old:10999, category:'womens', 
  img:'../images/f4.jpg', 
  desc:'Handwoven pure silk saree with golden zari border.', 
  stock:12 
},

  { 
    id:'prd2', 
    name:'Zephyr Denim Jacket', 
    price:4999, old:6999, category:'mens', 
    img:'../images/f6.jpg', 
    desc:'Classic blue denim jacket with a modern slim fit.', 
    stock:8 
  },
  { 
    id:'prd3', 
    name:'Nimbus Cotton Kurta', 
    price:1999, old:2599, category:'mens', 
    img:'../images/f1.jpg', 
    desc:'Soft cotton kurta perfect for festive and casual wear.', 
    stock:24 
  },
  { 
    id:'prd4', 
    name:'Atlas Linen Shirt', 
    price:2499, old:2999, category:'mens', 
    img:'../images/f2.jpg', 
    desc:'Breathable linen shirt ideal for summer comfort.', 
    stock:11 
  },
  { 
    id:'prd5', 
    name:'Halo Leather Jacket', 
    price:8999, old:9999, category:'mens', 
    img:'../images/f3.jpg', 
    desc:'Premium brown leather jacket with soft inner lining.', 
    stock:5 
  },
  { 
    id:'prd6', 
    name:'Lumen Floral Dress', 
    price:3499, old:4499, category:'womens', 
    img:'../images/f5.jpg', 
    desc:'Elegant floral print midi dress with flared hem.', 
    stock:20 
  },
  { 
    id:'prd7', 
    name:'Voyage Hoodie', 
    price:2999, old:3799, category:'unisex', 
    img:'../images/f8.jpg', 
    desc:'Comfy cotton hoodie with front pocket and relaxed fit.', 
    stock:30 
  },
  { 
    id:'prd8', 
    name:'Aero Sports Shoes', 
    price:5999, old:7499, category:'footwear', 
    img:'../images/f7.jpg', 
    desc:'Lightweight running shoes designed for all-day comfort.', 
    stock:15 
  }
];


    /* ======== Utilities & rendering ======== */
    const productsGrid = document.getElementById('productsGrid');
    const showCount = document.getElementById('showCount');

    function formatPrice(n){ return '₹' + n.toLocaleString('en-IN'); }

    function renderProducts(list){
      productsGrid.innerHTML = '';
      showCount.textContent = list.length;
      list.forEach(p => {
        const el = document.createElement('div');
        el.className = 'panel rounded-xl overflow-hidden';
        el.innerHTML = `
          <div class="relative">
            <img src="${p.img}" alt="${p.name}" class="w-full h-48 object-cover card-img"/>
            <div class="absolute left-3 top-3 badge">${p.stock>0? p.stock+' in stock':'Out of stock'}</div>
            <button class="absolute right-3 top-3 panel px-2 py-1 text-xs" onclick="quickView('${p.id}')">Quick view</button>
          </div>
          <div class="p-3">
            <div class="text-xs text-gray-400 line-through">${formatPrice(p.old)}</div>
            <div class="flex items-center justify-between mt-1">
              <div>
                <div class="font-semibold">${p.name}</div>
                <div class="text-xs text-gray-400">${p.desc}</div>
              </div>
              <div class="text-right">
                <div class="font-semibold gold-text">${formatPrice(p.price)}</div>
                <button class="mt-2 gold-btn px-3 py-1 rounded-md text-sm" onclick="addToCart('${p.id}',1)">Add</button>
              </div>
            </div>
          </div>`;
        productsGrid.appendChild(el);
      });
    }
    renderProducts(PRODUCTS);

    /* Filters & search */
    document.getElementById('filterCategory').addEventListener('change', applyFilters);
    document.getElementById('priceFilter').addEventListener('change', applyFilters);
    document.getElementById('sortBy').addEventListener('change', applyFilters);
    document.getElementById('searchBtn').addEventListener('click', applyFilters);
    document.getElementById('siteSearch').addEventListener('keydown', (e)=>{ if(e.key==='Enter') applyFilters(); });

    function applyFilters(){
      let list = [...PRODUCTS];
      const cat = document.getElementById('filterCategory').value;
      const price = document.getElementById('priceFilter').value;
      const sort = document.getElementById('sortBy').value;
      const q = (document.getElementById('siteSearch').value || '').trim().toLowerCase();
      if(cat) list = list.filter(p=>p.category===cat);
      if(price && price!=='any'){
        if(price==='0-699') list = list.filter(p=>p.price<=699);
        if(price==='700-999') list = list.filter(p=>p.price>=700 && p.price<=999);
        if(price==='1000-9999') list = list.filter(p=>p.price>=1000);
      }
      if(q) list = list.filter(p=> (p.name+p.desc).toLowerCase().includes(q) );
      if(sort==='price-asc') list.sort((a,b)=>a.price-b.price);
      if(sort==='price-desc') list.sort((a,b)=>b.price-a.price);
      renderProducts(list);
    }

    /* ======== Quick view modal ======== */
    const quickModal = document.getElementById('quickModal');
    function quickView(id){
      const p = PRODUCTS.find(x=>x.id===id);
      if(!p) return;
      document.getElementById('quickImg').src = p.img;
      document.getElementById('quickName').textContent = p.name;
      document.getElementById('quickPrice').textContent = formatPrice(p.price);
      document.getElementById('quickOld').textContent = p.old ? formatPrice(p.old) : '';
      document.getElementById('quickStock').textContent = p.stock>0 ? p.stock + ' in stock' : 'Out of stock';
      document.getElementById('quickDesc').textContent = p.desc;
      document.getElementById('quickQty').value = 1;
      document.getElementById('quickAdd').onclick = ()=> { addToCart(p.id, Number(document.getElementById('quickQty').value)); closeQuick(); };
      openModal(quickModal);
      // focus management
      document.getElementById('quickAdd').focus();
    }
    function closeQuick(){ closeModal(quickModal); }

    /* ======== Cart (localStorage) ======== */
    const CART_KEY = 'vf_cart_v2';
    let CART = JSON.parse(localStorage.getItem(CART_KEY) || '{}');

    function saveCart(){ localStorage.setItem(CART_KEY, JSON.stringify(CART)); renderCart(); }
    function addToCart(pid, qty=1){
      CART[pid] = (CART[pid] || 0) + qty;
      if(CART[pid] <= 0) delete CART[pid];
      saveCart();
      openCart();
    }
    function removeFromCart(pid){ delete CART[pid]; saveCart(); }

    function renderCart(){
      const container = document.getElementById('cartItems'); container.innerHTML = '';
      let sub = 0, count=0;
      Object.keys(CART).forEach(pid=>{
        const p = PRODUCTS.find(x=>x.id===pid); if(!p) return;
        const qty = CART[pid];
        const item = document.createElement('div');
        item.className = 'flex items-center gap-3 border-b border-white/5 py-3';
        item.innerHTML = `
          <img src="${p.img}" class="w-16 h-16 object-cover rounded" alt="${p.name}" />
          <div class="flex-1">
            <div class="font-semibold">${p.name}</div>
            <div class="text-sm text-gray-400">${formatPrice(p.price)} × ${qty}</div>
          </div>
          <div class="text-right">
            <div class="font-semibold">${formatPrice(p.price*qty)}</div>
            <div class="mt-2 flex gap-1 justify-end">
              <button class="panel px-2" onclick="addToCart('${p.id}',-1)">−</button>
              <button class="panel px-2" onclick="addToCart('${p.id}',1)">+</button>
              <button class="panel px-2" onclick="removeFromCart('${p.id}')">Remove</button>
            </div>
          </div>`;
        container.appendChild(item);
        sub += p.price * qty; count += qty;
      });
      document.getElementById('cartSub').textContent = formatPrice(sub);
      document.getElementById('cartCount').textContent = count;
      localStorage.setItem('vf_cart_count', String(count));
    }

    // cart controls
    const cartSidebarEl = document.getElementById('cartSidebar');
    document.getElementById('openCart').addEventListener('click', ()=> { cartSidebarEl.style.transform='translateX(0)'; renderCart(); cartSidebarEl.setAttribute('aria-hidden','false'); });
    document.getElementById('closeCart').addEventListener('click', ()=> { cartSidebarEl.style.transform='translateX(100%)'; cartSidebarEl.setAttribute('aria-hidden','true'); });
    document.getElementById('clearCart').addEventListener('click', ()=> { CART={}; saveCart(); });

    document.getElementById('checkoutBtn').addEventListener('click', async ()=>{
      if(Object.keys(CART).length === 0){ alert('Your cart is empty'); return; }
      const items = Object.keys(CART).map(pid => {
        const p = PRODUCTS.find(x=>x.id===pid);
        return { productId: pid, name: p.name, unitPrice: p.price, qty: CART[pid] };
      });
      const payload = { items, subtotal: Object.keys(CART).reduce((s,k)=> s + (PRODUCTS.find(x=>x.id===k).price * CART[k]), 0) };

      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify(payload)
        });
        if(res.ok){
          const data = await res.json();
          alert('Order created: ' + (data.orderId || 'demo-order') );
          CART = {}; saveCart();
        } else {
          const err = await res.json().catch(()=>({ message:'Unknown server error' }));
          alert('Checkout error: ' + (err.message || 'Server error'));
        }
      } catch (e) {
        alert('Checkout endpoint not available — demo flow. Payload prepared for backend.');
        console.log('Checkout payload (demo):', payload);
      }
    });

    /* ======== Mobile menu toggle ======== */
    function toggleMobileMenu(){
      const el = document.getElementById('mobileMenu');
      const isHidden = el.classList.contains('hidden');
      if(isHidden){
        el.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      } else {
        el.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    }
    document.getElementById('menuBtn').addEventListener('click', toggleMobileMenu);

    /* ======== Collections menu click outside hide ======== */
    document.getElementById('collectionsBtn')?.addEventListener('click', ()=> document.getElementById('collectionsMenu').classList.toggle('hidden'));
    document.addEventListener('click', (e)=> {
      const cm = document.getElementById('collectionsMenu'), btn = document.getElementById('collectionsBtn');
      const menu = document.getElementById('mobileMenu'), mbtn = document.getElementById('menuBtn');
      if(cm && btn && !btn.contains(e.target) && !cm.contains(e.target)) cm.classList.add('hidden');
      if(menu && mbtn && !mbtn.contains(e.target) && !menu.contains(e.target) && !menu.classList.contains('hidden')) { /* no-op - menu closed via overlay */ }
    });

    /* ======== Auth modal (Login/Signup/Forgot) ======== */
    const authModal = document.getElementById('authModal');
    const authInner = document.getElementById('authInner');

    document.getElementById('loginTop')?.addEventListener('click', ()=> openAuth('login'));

    function openAuth(mode='login'){
      authModal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
      authModal.setAttribute('aria-hidden','false');
      if(mode==='login'){
        authInner.innerHTML = loginHTML();
        const loginForm = document.getElementById('loginFormPop');
        loginForm.addEventListener('submit', async (e)=> {
          e.preventDefault();
          const email = document.getElementById('popEmail').value.trim().toLowerCase();
          const pw = document.getElementById('popPw').value;
          if(!email || !pw){ alert('Please enter email & password'); return; }

          try {
            const res = await fetch('/api/login', {
              method:'POST',
              headers:{ 'Content-Type':'application/json' },
              body: JSON.stringify({ email, password: pw })
            });
            if(res.ok){
              const data = await res.json();
              if(data.token) localStorage.setItem('vf_token', data.token);
              alert('Login successful');
              closeAuth();
            } else {
              const err = await res.json().catch(()=>({ message:'Login failed' }));
              alert('Login error: ' + (err.message || 'Invalid credentials'));
            }
          } catch (err) {
            alert('Login endpoint not available — demo mode.');
            console.log('Login payload:', { email, password: pw });
          }
        });
        document.getElementById('showLoginPw')?.addEventListener('click', ()=> togglePw('popPw','showLoginPw'));
        document.getElementById('toSignupFromLogin')?.addEventListener('click', ()=> { openAuth('signup'); });
        document.getElementById('toForgotFromLogin')?.addEventListener('click', ()=> { openAuth('forgot'); });
        document.getElementById('popEmail')?.focus();
      } else if(mode==='signup'){
        authInner.innerHTML = signupHTML();
        const signupForm = document.getElementById('signupFormPop');
        signupForm.addEventListener('submit', async (e)=> {
          e.preventDefault();
          const name = document.getElementById('popName').value.trim();
          const email = document.getElementById('popEmailS').value.trim().toLowerCase();
          const mobile = document.getElementById('popMobile').value.trim();
          const pw = document.getElementById('popPwS').value;
          const pw2 = document.getElementById('popPwS2').value;
          if(name.length < 2){ alert('Enter full name'); return; }
          if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ alert('Invalid email'); return; }
          if(!/^[0-9]{10}$/.test(mobile)){ alert('Mobile must be 10 digits'); return; }
          if(pw.length < 8){ alert('Password must be at least 8 characters'); return; }
          if(pw !== pw2){ alert('Passwords do not match'); return; }

          try {
            const res = await fetch('/api/signup', {
              method:'POST',
              headers:{ 'Content-Type':'application/json' },
              body: JSON.stringify({ name, email, mobile, password: pw })
            });
            if(res.ok){
              const data = await res.json();
              alert('Account created: ' + (data.userId || 'demo-id'));
              closeAuth();
            } else {
              const err = await res.json().catch(()=>({ message:'Signup failed' }));
              alert('Signup error: ' + (err.message || 'Unable to create account'));
            }
          } catch (err) {
            alert('Signup endpoint not available — demo mode.');
            console.log('Signup payload:', { name, email, mobile, password: pw });
          }
        });
        document.getElementById('showSignupPw')?.addEventListener('click', ()=> togglePw('popPwS','showSignupPw'));
        document.getElementById('showSignupPw2')?.addEventListener('click', ()=> togglePw('popPwS2','showSignupPw2'));
        document.getElementById('toLoginFromSignup')?.addEventListener('click', ()=> { openAuth('login'); });
        document.getElementById('popName')?.focus();
      } else if(mode==='forgot'){
        authInner.innerHTML = forgotHTML();
        const forgotForm = document.getElementById('forgotFormPop');
        forgotForm.addEventListener('submit', async (e)=> {
          e.preventDefault();
          const email = document.getElementById('popForgotEmail').value.trim();
          if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return alert('Enter valid email');

          try {
            const res = await fetch('/api/forgot', {
              method:'POST',
              headers:{ 'Content-Type':'application/json' },
              body: JSON.stringify({ email })
            });
            if(res.ok){
              alert('Password reset link sent (check email).');
              closeAuth();
            } else {
              const err = await res.json().catch(()=>({ message:'Error sending reset link' }));
              alert('Error: ' + (err.message || 'Unable to send reset link'));
            }
          } catch (err) {
            alert('Forgot-password endpoint not available — demo mode.');
            console.log('Forgot payload:', { email });
          }
        });
        document.getElementById('toLoginFromForgot')?.addEventListener('click', ()=> { openAuth('login'); });
        document.getElementById('popForgotEmail')?.focus();
      }
    }
    function closeAuth(){ authModal.classList.add('hidden'); authInner.innerHTML = ''; document.body.classList.remove('overflow-hidden'); authModal.setAttribute('aria-hidden','true'); }
    function togglePw(id, btnId){ const el = document.getElementById(id); if(!el) return; el.type = el.type==='password' ? 'text' : 'password'; const b = document.getElementById(btnId); if(b) b.textContent = el.type==='password' ? 'Show' : 'Hide'; }

    function loginHTML(){ return `
      <h3 class="text-xl font-semibold mb-2">Sign in</h3>
      <form id="loginFormPop" class="grid gap-3">
        <input id="popEmail" type="email" class="p-3 rounded-md bg-transparent border border-white/10" placeholder="Email" required />
        <div class="relative">
          <input id="popPw" type="password" class="p-3 rounded-md bg-transparent border border-white/10 w-full" placeholder="Password" required />
          <button type="button" id="showLoginPw" class="absolute right-3 top-3 text-sm text-gray-300">Show</button>
        </div>
        <button class="gold-btn py-2 rounded-md">Sign In</button>
      </form>
      <div class="text-sm mt-2 flex justify-between">
        <button id="toSignupFromLogin" class="text-[var(--gold)] underline">Create account</button>
        <button id="toForgotFromLogin" class="text-gray-400 underline">Forgot?</button>
      </div>
    `;}

    function signupHTML(){ return `
      <h3 class="text-xl font-semibold mb-2">Create account</h3>
      <form id="signupFormPop" class="grid gap-3">
        <input id="popName" class="p-3 rounded-md bg-transparent border border-white/10" placeholder="Full name" required />
        <input id="popEmailS" type="email" class="p-3 rounded-md bg-transparent border border-white/10" placeholder="Email" required />
        <input id="popMobile" class="p-3 rounded-md bg-transparent border border-white/10" placeholder="Mobile number (10 digits)" required />
        <div class="relative">
          <input id="popPwS" type="password" class="p-3 rounded-md bg-transparent border border-white/10 w-full" placeholder="Password (min 8 chars)" required />
          <button type="button" id="showSignupPw" class="absolute right-3 top-3 text-sm text-gray-300">Show</button>
        </div>
        <div class="relative">
          <input id="popPwS2" type="password" class="p-3 rounded-md bg-transparent border border-white/10 w-full" placeholder="Confirm password" required />
          <button type="button" id="showSignupPw2" class="absolute right-3 top-3 text-sm text-gray-300">Show</button>
        </div>
        <button class="gold-btn py-2 rounded-md">Create Account</button>
      </form>
      <div class="text-sm mt-2">
        <button id="toLoginFromSignup" class="text-gray-400 underline">Already have an account? Sign in</button>
      </div>
    `;}

    function forgotHTML(){ return `
      <h3 class="text-xl font-semibold mb-2">Reset password</h3>
      <form id="forgotFormPop" class="grid gap-3">
        <input id="popForgotEmail" type="email" class="p-3 rounded-md bg-transparent border border-white/10" placeholder="Registered email" required />
        <button class="gold-btn py-2 rounded-md">Send Reset Link</button>
      </form>
      <div class="text-sm mt-2">
        <button id="toLoginFromForgot" class="text-gray-400 underline">Back to sign in</button>
      </div>
    `;}

    /* ======== Contact form handling ======== */
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const name = document.getElementById('contact_name').value.trim();
      const email = document.getElementById('contact_email').value.trim();
      const mobile = document.getElementById('contact_mobile').value.trim();
      const msg = document.getElementById('contact_msg').value.trim();
      if(!name || !email || !msg) return alert('Please fill required fields.');
      if(mobile && !/^[0-9]{10}$/.test(mobile)) return alert('Mobile must be 10 digits.');

      const payload = { name, email, mobile, message: msg };

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify(payload)
        });
        if(res.ok){
          document.getElementById('contactNotice').classList.remove('hidden');
          setTimeout(()=> { document.getElementById('contactNotice').classList.add('hidden'); contactForm.reset(); }, 2500);
        } else {
          const err = await res.json().catch(()=>({ message:'Server error' }));
          alert('Error: ' + (err.message || 'Unable to send message'));
        }
      } catch (err) {
        alert('Contact endpoint not available. Demo mode — message logged to console.');
        console.log('Contact payload (demo):', payload);
        document.getElementById('contactNotice').classList.remove('hidden');
        setTimeout(()=> { document.getElementById('contactNotice').classList.add('hidden'); contactForm.reset(); }, 2000);
      }
    });
    document.getElementById('contactClear').addEventListener('click', ()=> contactForm.reset());

    /* ======== Track Order modal handlers (mobile-friendly) ======== */
    const trackModal = document.getElementById('trackModal');
    const closeTrackBtn = document.getElementById('closeTrack');

    // open track from desktop header
    document.getElementById('trackBtn')?.addEventListener('click', ()=> {
      openTrack();
    });

    // open track from mobile menu
    function openTrackMobile(){
      toggleMobileMenu(); // close mobile menu
      openTrack();
    }

    function openTrack(){
      trackModal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
      trackModal.setAttribute('aria-hidden','false');
      document.getElementById('trackOrderId').focus();
    }

    closeTrackBtn.addEventListener('click', () => {
      trackModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
      trackModal.setAttribute('aria-hidden','true');
    });

    document.getElementById('trackForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('trackOrderId').value.trim();
      const email = document.getElementById('trackEmail').value.trim();
      if(!id || !email) return alert('Please enter order ID and email.');
      try {
        const res = await fetch(`/api/track/${encodeURIComponent(id)}`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email })});
        if(res.ok){
          const data = await res.json();
          alert('Track info: ' + (data.status || 'Processing'));
          trackModal.classList.add('hidden');
        } else {
          const err = await res.json().catch(()=>({message:'Unable to fetch tracking info'}));
          alert('Error: ' + (err.message || 'Server error'));
        }
      } catch(err){
        alert('Track endpoint not available — demo mode.');
        console.log('Track payload (demo):', { id, email });
      } finally { document.body.classList.remove('overflow-hidden'); trackModal.setAttribute('aria-hidden','true'); }
    });

    /* ======== Reflection effect for desktop ======== */
    const reflect = document.getElementById('reflect');
    let lastMove = 0;
    function moveReflect(x,y){
      reflect.style.left = x + 'px';
      reflect.style.top = y + 'px';
      reflect.style.opacity = 0.28;
      reflect.style.transform = 'translate(-50%, -50%) scale(1)';
    }

    if(window.matchMedia && window.matchMedia('(pointer:fine)').matches){
      window.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if(now - lastMove < 12) return;
        lastMove = now;
        const x = e.clientX;
        const y = e.clientY - 40;
        moveReflect(x,y);
      });
      window.addEventListener('mouseleave', ()=> { reflect.style.opacity = 0; });
    } else {
      reflect.style.left = '60%';
      reflect.style.top = '8%';
      reflect.style.opacity = 0.16;
    }

    /* ======== Newsletter handler ======== */
    document.getElementById('newsletterForm').addEventListener('submit', async (e)=>{
      e.preventDefault();
      const email = document.getElementById('newsletterEmail').value.trim();
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return alert('Enter a valid email.');
      try {
        const res = await fetch('/api/newsletter', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ email })});
        if(res.ok){ alert('Subscribed — check your email.'); document.getElementById('newsletterForm').reset(); }
        else { alert('Subscription failed.'); }
      } catch(err){
        alert('Newsletter endpoint not available — demo mode.'); console.log('Newsletter payload:', { email }); document.getElementById('newsletterForm').reset();
      }
    });

    /* ======== Generic modal open/close helpers (ensures mobile-friendly behavior) ======== */
    function openModal(modalEl){
      modalEl.classList.remove('hidden');
      modalEl.setAttribute('aria-hidden','false');
      document.body.classList.add('overflow-hidden');
      trapFocus(modalEl);
    }
    function closeModal(modalEl){
      modalEl.classList.add('hidden');
      modalEl.setAttribute('aria-hidden','true');
      document.body.classList.remove('overflow-hidden');
    }

    /* ======== Small UX helpers ======== */
    window.addEventListener('load', ()=> {
      document.getElementById('cartCount').textContent = localStorage.getItem('vf_cart_count') || '0';
      renderCart();
    });

    /* ======== Accessibility: trap focus simple implementation ======== */
    function trapFocus(modalEl){
      const focusable = modalEl.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
      if(!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length-1];
      function keyHandler(e){
        if(e.key !== 'Tab') return;
        if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
        else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
      }
      modalEl.addEventListener('keydown', keyHandler);
      // remove listener when modal closed
      const observer = new MutationObserver(()=> {
        if(modalEl.classList.contains('hidden')){ modalEl.removeEventListener('keydown', keyHandler); observer.disconnect(); }
      });
      observer.observe(modalEl, { attributes:true, attributeFilter:['class'] });
    }

    /* ======== Logo fallback ======== */
    function logoFallback(){
      return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="%23D4AF37"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-family="Playfair Display" font-size="36" fill="%230b0b0b">VF</text></svg>';
    }
    (function ensureLogo(){ const logo = document.getElementById('brandLogo'); logo.onerror = ()=> { logo.src = logoFallback(); }; })();

    /* ======== Utility: open cart programmatically (used after add) ======== */
    function openCart(){
      cartSidebarEl.style.transform='translateX(0)';
      cartSidebarEl.setAttribute('aria-hidden','false');
      renderCart();
    }

