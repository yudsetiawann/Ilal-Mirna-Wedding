document.addEventListener("DOMContentLoaded", () => {
  // 1. SETUP VARIABEL
  const cover = document.getElementById("opening-cover");
  const main = document.getElementById("main-content");
  const btnOpen = document.getElementById("btn-open");
  const musicBtn = document.getElementById("music-btn");
  const bgMusic = document.getElementById("bg-music");
  const guestName = new URLSearchParams(window.location.search).get("to");

  // Set Nama Tamu
  if (guestName) {
    document.getElementById("guest-name").textContent = decodeURIComponent(guestName);
  }

  // 2. BUKA UNDANGAN (Transisi Smooth)
  btnOpen.addEventListener("click", () => {
    cover.style.opacity = "0";
    setTimeout(() => {
      cover.style.transform = "translateY(-100%)";
    }, 500);

    main.classList.remove("hidden");
    setTimeout(() => {
      main.style.opacity = "1";
      initObserver();

      // Play Musik
      bgMusic
        .play()
        .then(() => {
          musicBtn.classList.remove("hidden");
        })
        .catch(() => {
          musicBtn.classList.remove("hidden");
          musicBtn.innerHTML = '<i class="fas fa-play"></i>';
          musicBtn.classList.remove("animate-spin-slow");
        });
    }, 800);
  });

  // 3. KONTROL MUSIK
  let isPlaying = true;
  musicBtn.addEventListener("click", () => {
    if (isPlaying) {
      bgMusic.pause();
      musicBtn.innerHTML = '<i class="fas fa-play opacity-50"></i>';
      musicBtn.classList.remove("animate-spin-slow");
    } else {
      bgMusic.play();
      musicBtn.innerHTML = '<i class="fas fa-music"></i>';
      musicBtn.classList.add("animate-spin-slow");
    }
    isPlaying = !isPlaying;
  });

  // 4. ANIMASI SCROLL (Intersection Observer)
  function initObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 },
    );

    document.querySelectorAll(".fade-in-up").forEach((el) => observer.observe(el));
  }

  // 5. COUNTDOWN (Desain Minimalis Modern)
  const targetDate = new Date("March 24, 2026 08:00:00").getTime();
  setInterval(() => {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff < 0) return;

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    // Desain Countdown Kotak Rounded Bersih
    const itemClass = "flex flex-col items-center justify-center bg-white w-20 h-24 md:w-24 md:h-28 rounded-2xl shadow-soft border border-gray-50";
    const numClass = "text-3xl md:text-4xl font-display font-bold text-denim-dark";
    const labelClass = "text-[10px] uppercase font-semibold text-muted-rose mt-2 tracking-wider";

    document.getElementById("countdown").innerHTML = `
      <div class="${itemClass}"><span class="${numClass}">${d}</span><span class="${labelClass}">Hari</span></div>
      <div class="${itemClass}"><span class="${numClass}">${h}</span><span class="${labelClass}">Jam</span></div>
      <div class="${itemClass}"><span class="${numClass}">${m}</span><span class="${labelClass}">Menit</span></div>
    `;
  }, 1000);

  // 6. CLIPBOARD COPY
  window.copyToClipboard = (id, val) => {
    navigator.clipboard.writeText(val).then(() => {
      const toast = document.getElementById("toast");
      toast.classList.remove("opacity-0", "-translate-y-10");
      setTimeout(() => toast.classList.add("opacity-0", "-translate-y-10"), 2500);
    });
  };

  // 7. WISHES SYSTEM (Updated Fix)
  const wishesList = document.getElementById("wishes-list");
  const form = document.getElementById("wishes-form");
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyOgtwuFp8fj2vM4dVvyPTOHiM7yNgZu1n4vz3s_uSEIs8zOzNIdRZjhJi7vVU_JlIxZg/exec";

  const addWishToDom = (name, msg, date = "Baru saja") => {
    const div = document.createElement("div");

    // PERBAIKAN DI SINI:
    // Hapus class 'fade-in-up' agar elemen tidak hidden (opacity 0) saat pertama muncul.
    // Kita ganti dengan animasi CSS sederhana jika mau, atau biarkan plain.
    // Di sini saya tambahkan class 'visible' manual dan tetap pakai 'fade-in-up' biar transisinya jalan.

    div.className = "p-6 bg-white rounded-[2rem] shadow-sm border border-gray-100 mb-4 fade-in-up";

    div.innerHTML = `
        <div class="flex justify-between items-center mb-3">
           <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-denim-muted/10 rounded-full flex items-center justify-center text-denim-dark font-display font-bold">
                    ${name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h4 class="font-bold text-denim-dark text-base">${name}</h4>
                    <span class="text-[11px] text-gray-400 font-main">${date}</span>
                </div>
           </div>
        </div>
        <p class="text-gray-600 font-main text-sm leading-relaxed pl-[52px] relative before:content-['“'] before:absolute before:left-8 before:text-3xl before:text-gray-200 before:-top-2">
            ${msg}
        </p>
     `;

    wishesList.prepend(div);

    // TRIK PENTING:
    // Beri jeda 10ms, lalu paksa tambahkan class 'visible' agar opacity berubah jadi 1
    setTimeout(() => {
      div.classList.add("visible");
    }, 10);
  };

  // Load Initial
  fetch(SCRIPT_URL)
    .then((r) => r.json())
    .then((data) => {
      wishesList.innerHTML = "";
      if (data.length) data.forEach((d) => addWishToDom(d.name, d.message, d.date));
      else wishesList.innerHTML = '<div class="text-center p-8 bg-cream-bg rounded-[2rem] border border-dashed border-denim-muted/30"><p class="text-gray-500 text-sm font-medium">Jadilah yang pertama mengirim doa.</p></div>';
    })
    .catch(() => {
      addWishToDom("Arif & Bella", "Selamat berbahagia Mirna & Ilal! Semoga menjadi keluarga yang sakinah mawaddah warahmah. Aamiin.");
      addWishToDom("Siti Aminah", "Happy Wedding! Lancar sampai hari H yaa, cantik banget ilustrasinya <3");
    });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector("button");
    const name = document.getElementById("sender-name").value;
    const msg = document.getElementById("sender-message").value;

    const originalText = btn.innerHTML;
    btn.textContent = "Mengirim...";
    btn.disabled = true;
    btn.classList.add("opacity-70");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("message", msg);

    fetch(SCRIPT_URL, { method: "POST", body: formData })
      .then(() => {
        addWishToDom(name, msg);
        form.reset();
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.classList.remove("opacity-70");
      })
      .catch((err) => {
        console.error(err);
        addWishToDom(name, msg);
        form.reset();
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.classList.remove("opacity-70");
      });
  });
});
