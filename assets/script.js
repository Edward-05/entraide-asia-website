// Entraide nonprofit template — shared interactions

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
    });
  }

  // Mobile dropdown toggle (tap the caret icon to expand submenu)
  document.querySelectorAll('.nav-item > a').forEach((link) => {
    const caret = link.querySelector('.caret');
    if (!caret) return;
    link.addEventListener('click', (e) => {
      if (window.innerWidth > 980) return;
      e.preventDefault();
      link.closest('.nav-item').classList.toggle('is-open');
    });
  });

  // Language switcher (click/tap to open; closes on outside click)
  document.querySelectorAll('.lang-toggle').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      document.querySelectorAll('.lang-switch.is-open').forEach((el) => {
        if (el !== btn.closest('.lang-switch')) el.classList.remove('is-open');
      });
      btn.closest('.lang-switch').classList.toggle('is-open');
    });
  });
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.lang-switch.is-open').forEach((el) => {
      if (!el.contains(e.target)) el.classList.remove('is-open');
    });
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Filter tabs (Causes / Projects / Resources)
  const tabGroups = document.querySelectorAll('.filter-tabs');
  tabGroups.forEach((group) => {
    const buttons = group.querySelectorAll('button');
    const target = document.querySelector(group.dataset.target);
    if (!target) return;
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        target.querySelectorAll('[data-category]').forEach((card) => {
          const show = filter === 'all' || card.dataset.category === filter;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  });

  // Contact form: gửi qua FormSubmit (AJAX) tới email Christophe, hiện lời cảm ơn khi thành công
  const form = document.querySelector('#contact-form');
  if (form) {
    const lang = document.documentElement.lang || 'en';
    const msg = {
      en: { sending: 'Sending…', error: 'Sorry, the message could not be sent. Please try again or email us directly.' },
      fr: { sending: 'Envoi…', error: "Désolé, le message n'a pas pu être envoyé. Réessayez ou écrivez-nous directement par e-mail." },
      vi: { sending: 'Đang gửi…', error: 'Rất tiếc, tin nhắn chưa gửi được. Vui lòng thử lại hoặc gửi email trực tiếp cho chúng tôi.' },
      th: { sending: 'กำลังส่ง…', error: 'ขออภัย ส่งข้อความไม่สำเร็จ กรุณาลองอีกครั้งหรืออีเมลถึงเราโดยตรง' }
    }[lang] || { sending: 'Sending…', error: 'Could not send. Please try again.' };
    const thanks = document.querySelector('#form-thanks');
    const again = document.querySelector('#form-again');
    let errBox = document.createElement('p');
    errBox.setAttribute('role', 'alert');
    errBox.style.cssText = 'color:#b3261e;margin:10px 0 0;font-size:.9rem;display:none';
    form.appendChild(errBox);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.querySelector('[name="_honey"]').value) return; // bot
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = msg.sending; btn.disabled = true; errBox.style.display = 'none';
      try {
        const res = await fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === 'false' || data.success === false) throw new Error('send failed');
        form.hidden = true;
        if (thanks) { thanks.hidden = false; thanks.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        form.reset();
      } catch (err) {
        errBox.textContent = msg.error; errBox.style.display = 'block';
      } finally {
        btn.textContent = original; btn.disabled = false;
      }
    });
    if (again) again.addEventListener('click', () => { thanks.hidden = true; form.hidden = false; });
  }
});

/* Hero slideshow: đổi ảnh mỗi data-interval ms (mặc định 3000), fade ease-out (CSS) */
(function () {
  document.querySelectorAll('.hero-slides').forEach(function (box) {
    var imgs = box.querySelectorAll('img');
    if (imgs.length < 2) return;
    var i = 0, ms = parseInt(box.getAttribute('data-interval'), 10) || 3000;
    setInterval(function () {
      imgs[i].classList.remove('is-active');
      i = (i + 1) % imgs.length;
      imgs[i].classList.add('is-active');
    }, ms);
  });
})();

/* ===== Chống chữ cô đơn: nối 2 từ cuối của mỗi đoạn/tiêu đề bằng khoảng trắng không ngắt =====
   Tắt: xoá khối này. Chỉnh phạm vi: sửa selector bên dưới. */
(function(){
  function fix(root){
    var els=root.querySelectorAll('p,h1,h2,h3,h4,figcaption,.eyebrow,.card-link');
    els.forEach(function(el){
      var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),n,last=null;
      while((n=w.nextNode())){ if(n.textContent.trim()) last=n; }
      if(!last) return;
      if(el.textContent.trim().split(/\s+/).length<4) return;
      var t=last.textContent.replace(/\s+$/,''), tail=last.textContent.slice(t.length);
      var i=t.lastIndexOf(' ');
      if(i>0) last.textContent=t.slice(0,i)+' '+t.slice(i+1)+tail;
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){fix(document)}); else fix(document);
})();
