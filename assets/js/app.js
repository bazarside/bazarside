/**
 * BazarSide Studio — Production UI Script
 * Handles: theme toggle, mobile nav, sticky header, scroll reveal, form submission
 */

// ════════════════════════════════════════════════════════════════════════════
// THEME TOGGLE
// ════════════════════════════════════════════════════════════════════════════

const THEME_KEY = 'bazarside-theme'
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const savedTheme = localStorage.getItem(THEME_KEY)

const theme = savedTheme || (prefersDark ? null : 'light')

function applyTheme(t) {
  if (t === 'light') {
    document.documentElement.setAttribute('data-theme', 'light')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

// Apply on load
applyTheme(theme)

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.theme-toggle')
  if (!toggle) return

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme')
    const next = current === 'light' ? null : 'light'

    applyTheme(next)
    localStorage.setItem(THEME_KEY, next === 'light' ? 'light' : 'dark')
  })
})

// ════════════════════════════════════════════════════════════════════════════
// MOBILE NAVIGATION
// ════════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  const drawer = document.querySelector('[data-drawer]')
  const toggles = document.querySelectorAll('[data-burger]')

  if (!drawer || !toggles.length) return

  const open = () => drawer.classList.add('is-open')
  const close = () => drawer.classList.remove('is-open')

  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      drawer.classList.toggle('is-open')
    })
  })

  // Close on link click
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', close)
  })

  // Close on escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close()
  })
})

// ════════════════════════════════════════════════════════════════════════════
// STICKY HEADER
// ════════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('[data-sticky]')
  if (!header) return

  const observer = new IntersectionObserver(
    ([e]) => {
      header.classList.toggle('is-stuck', e.intersectionRatio < 1)
    },
    { threshold: [1] }
  )

  const dummy = document.createElement('div')
  dummy.style.height = '1px'
  header.parentNode.insertBefore(dummy, header)
  observer.observe(dummy)
})

// ════════════════════════════════════════════════════════════════════════════
// SCROLL REVEAL (Intersection Observer)
// ════════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('[data-reveal]')
  if (!revealElements.length) return

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  )

  revealElements.forEach(el => observer.observe(el))
})

// ════════════════════════════════════════════════════════════════════════════
// PORTFOLIO FILTER
// ════════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filters button')
  const works = document.querySelectorAll('[data-work]')

  if (!filterBtns.length || !works.length) return

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter')

      // Update button states
      filterBtns.forEach(b => b.setAttribute('aria-pressed', 'false'))
      btn.setAttribute('aria-pressed', 'true')

      // Filter works
      works.forEach(work => {
        const tags = work.getAttribute('data-work').split(' ')
        const match = filter === 'all' || tags.includes(filter)
        work.style.display = match ? '' : 'none'
      })
    })
  })
})

// ════════════════════════════════════════════════════════════════════════════
// CONTACT FORM HANDLING
// ════════════════════════════════════════════════════════════════════════════

// Where contact inquiries are delivered.
// FormSubmit.co forwards submissions to this inbox with no backend or API key.
// IMPORTANT: the FIRST time the form is submitted, FormSubmit emails this
// address an activation link — click it once to start receiving messages.
const CONTACT_EMAIL = 'info.bazarside@gmail.com'
const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/' + CONTACT_EMAIL

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form')
  if (!form) return

  form.addEventListener('submit', async e => {
    e.preventDefault()

    const status = document.getElementById('form-status')
    const btn = form.querySelector('button[type="submit"]')
    const btnText = btn.textContent

    // Gather form data
    const data = {
      name: form.querySelector('#name').value,
      email: form.querySelector('#email').value,
      company: form.querySelector('#company').value,
      phone: form.querySelector('#phone').value || '',
      project_type: form.querySelector('#project-type').value,
      message: form.querySelector('#message').value,
      timeline: (form.querySelector('#timeline') || {}).value || '',
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
      url: window.location.href,
    }

    // Validate
    if (!data.name || !data.email || !data.company || !data.project_type || !data.message) {
      showStatus(status, 'Please fill in all required fields.', 'err')
      return
    }

    // Show busy state
    btn.disabled = true
    btn.textContent = 'Sending...'
    showStatus(status, 'Sending your inquiry...', 'busy')

    try {
      // Deliver via FormSubmit.co (no backend needed on GitHub Pages).
      // These _-prefixed fields configure the email FormSubmit sends.
      const payload = {
        name: data.name,
        email: data.email,
        company: data.company,
        phone: data.phone,
        project_type: data.project_type,
        message: data.message,
        timeline: data.timeline,
        page: data.url,
        _subject: `New project inquiry from ${data.name} (${data.company})`,
        _template: 'table',
        _captcha: 'false',
        _replyto: data.email,
      }

      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Bad response ' + res.status)

      // Success
      showStatus(status, "✓ Thanks for reaching out! We'll be in touch within 24 hours.", 'ok')
      form.reset()
      btn.textContent = btnText
      btn.disabled = false

      // Clear message after 6 seconds
      setTimeout(() => {
        status.textContent = ''
        status.className = 'form__status'
      }, 6000)
    } catch (err) {
      // Network/service failure — fall back to the visitor's mail client so
      // the inquiry still reaches us.
      const subject = encodeURIComponent(`Project inquiry from ${data.name} (${data.company})`)
      const body = encodeURIComponent(
        `Name: ${data.name}\n` +
          `Email: ${data.email}\n` +
          `Company: ${data.company}\n` +
          `Phone: ${data.phone || '—'}\n` +
          `Project type: ${data.project_type}\n` +
          `Timeline: ${data.timeline || '—'}\n\n` +
          `${data.message}\n`
      )
      const mailto = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`

      showStatus(
        status,
        'We couldn’t send that automatically — opening your email app so you can reach us directly.',
        'err'
      )
      window.location.href = mailto
      btn.textContent = btnText
      btn.disabled = false
    }
  })

  function showStatus(el, msg, type) {
    el.textContent = msg
    el.className = `form__status is-${type}`
  }
})

// ════════════════════════════════════════════════════════════════════════════
// SMOOTH SCROLL & ANCHOR HASH
// ════════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Handle anchor clicks
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href')
      if (href === '#') return

      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        window.history.pushState({}, '', href)
      }
    })
  })

  // Restore scroll position on back button
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash)
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }
})

// ════════════════════════════════════════════════════════════════════════════
// PERFORMANCE: Lazy load non-critical images
// ════════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]')
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.getAttribute('data-src')
          img.removeAttribute('data-src')
          observer.unobserve(img)
        }
      })
    })
    images.forEach(img => imageObserver.observe(img))
  }
})

// ════════════════════════════════════════════════════════════════════════════
// ANALYTICS: Track page views and interactions (optional)
// ════════════════════════════════════════════════════════════════════════════

// Uncomment to add your analytics provider (GA4, Segment, etc.)
/*
window.addEventListener('DOMContentLoaded', () => {
  // Track page view
  if (window.gtag) {
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
    })
  }

  // Track clicks
  document.querySelectorAll('a[href^="http"], .btn').forEach(el => {
    el.addEventListener('click', () => {
      if (window.gtag) {
        gtag('event', 'click', {
          element: el.textContent,
          url: el.href,
        })
      }
    })
  })
})
*/

// ════════════════════════════════════════════════════════════════════════════
// UTILITY: Copy year to footer
// ════════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  const year = new Date().getFullYear()
  document.querySelectorAll('[class*="year"]').forEach(el => {
    if (el.textContent === '') {
      el.textContent = year
    }
  })
})

// ════════════════════════════════════════════════════════════════════════════
// PREFETCH: Preload critical routes for faster navigation
// ════════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  const prefetchLinks = ['contact.html']
  prefetchLinks.forEach(url => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    document.head.appendChild(link)
  })
})
