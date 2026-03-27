// ดึง projects จาก API
async function loadProjects() {
  const res = await fetch('/api/projects')
  const projects = await res.json()
  const grid = document.getElementById('projects-grid')
  grid.innerHTML = ''
  if (!projects.length) {
    grid.innerHTML = '<p style="color:var(--gray)">No projects yet.</p>'
    return
  }
projects.forEach(p => {
    const videoContent = p.image_url 
      ? `<video src="${p.image_url}" class="card-img" controls muted loop style="width:100%; object-fit: cover;"></video>` 
      : `<div class="card-img" style="background:#333; display:flex; align-items:center; justify-content:center;">No Video</div>`;

    grid.innerHTML += `
      <div class="card">
        <div class="card-media-container">
          ${videoContent}
        </div>
        <div class="card-body">
          <h3 class="card-title">${p.title}</h3>
          <p class="card-desc">${p.description || ''}</p>
          <div class="card-links">
            ${p.github_url ? `<a href="${p.github_url}" target="_blank" class="card-link">GitHub</a>` : ''}
            ${p.live_url ? `<a href="${p.live_url}" target="_blank" class="card-link">Live Demo</a>` : ''}
          </div>
        </div>
      </div>`
})
}

// ดึง other works จาก API
async function loadOtherWorks() {
  const res = await fetch('/api/other-works')
  const works = await res.json()
  const grid = document.getElementById('other-grid')
  grid.innerHTML = ''
  if (!works.length) {
    grid.innerHTML = '<p style="color:var(--gray)">No works yet.</p>'
    return
  }
  works.forEach(w => {
    const card = document.createElement('div')
    card.className = 'card'
    const fileSection = w.file_url ? `
      <iframe src="${w.file_url}" width="100%" height="400px" style="border-radius:8px;border:none;margin-top:8px;"></iframe>
      <div class="card-links" style="margin-top:12px;">
        <a href="${w.file_url}" target="_blank" rel="noopener noreferrer" class="card-btn-open">🔗 Open</a>
        <a href="${w.file_url}" download="${w.title || 'file'}" class="card-btn-download">⬇ Download</a>
      </div>` : ''
    card.innerHTML = `<div class="card-body"><h3 class="card-title">${w.title}</h3><p class="card-desc">${w.description || ''}</p>${fileSection}</div>`
    grid.appendChild(card)
  })
}

// --- ส่วนที่แก้ไข: ดึง skills แบบแยกหมวดหมู่และโชว์ Icon ---
async function loadSkills() {
  try {
    const res = await fetch('/api/skills');
    const skills = await res.json();
    const list = document.getElementById('skills-container');

    if (!list || !skills.length) return;
    list.innerHTML = '';

    const grouped = skills.reduce((acc, skill) => {
      const cat = skill.category || 'General';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    }, {});

    for (const category in grouped) {
      const categoryWrapper = document.createElement('div');
      categoryWrapper.style.cssText = "width: 100%; margin-bottom: 24px;";
      categoryWrapper.innerHTML = `
        <p style="margin-bottom: 10px; color: var(--black); font-weight: 400; font-size: 16px;">${category}</p>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${grouped[category].map(s => `
                <div class="skill-item-simple" style="display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.03); padding: 6px 14px; border-radius: 20px; border: 1px solid rgba(0,0,0,0.02);">
                    ${s.icon_url ? `<img src="${s.icon_url}" style="width:16px; height:16px; object-fit:contain; opacity: 0.9;">` : ''}
                    <div style="display: flex; flex-direction: column; line-height: 1.2;">
                        <span style="font-weight: 400; font-size: 13px; color: var(--black);">${s.name}</span>
                        ${s.level ? `<small style="font-size: 10px; color: var(--gray);">${s.level}</small>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
      `;
      list.appendChild(categoryWrapper);
    }
  } catch (err) {
    console.error('Error loading skills:', err);
  }
}

// จัดการ Modal และ Event ต่างๆ
document.addEventListener('DOMContentLoaded', () => {
  loadProjects()
  loadOtherWorks()
  loadSkills()

  // Tab switching
  document.querySelectorAll('.about-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.about-tab-btn').forEach(b => b.classList.remove('active'))
      document.querySelectorAll('.about-tab-panel').forEach(p => p.classList.remove('active'))
      btn.classList.add('active')
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active')
    })
  })

  const modal = document.getElementById("certModal")
  const modalImg = document.getElementById("modalImg")
  const captionText = document.getElementById("caption")
  const closeModal = document.querySelector(".close-modal")

  // จัดการรูป Certificate
  document.querySelectorAll('.cert-img').forEach(img => {
    img.onclick = function() {
      modal.style.display = "block"
      modalImg.src = this.src
      captionText.innerHTML = this.alt
    }
  })

  // ปิด Modal
  if (closeModal) {
    closeModal.onclick = () => modal.style.display = "none"
  }
  window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none"
  }

  // ส่งฟอร์ม Contact
  const contactForm = document.getElementById('contactForm')
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      const submitBtn = document.getElementById('submitBtn')
      const formStatus = document.getElementById('formStatus')

      submitBtn.textContent = 'Sending...'
      submitBtn.disabled = true

      const body = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
      }

      try {
        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })

        if (res.ok) {
          formStatus.textContent = "Message sent! I'll get back to you soon."
          formStatus.style.color = "#34C759"
          contactForm.reset()
        } else {
          throw new Error()
        }
      } catch (err) {
        formStatus.style.color = '#FF453A'
        formStatus.textContent = 'Something went wrong. Please try again.'
      } finally {
        submitBtn.textContent = 'Send Message'
        submitBtn.disabled = false
      }
    })
  }
})