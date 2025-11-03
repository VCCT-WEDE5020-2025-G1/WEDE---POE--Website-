// Notification System
function showNotification(message, type = "success") {
  try {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>
        <span class="notification-message">${message}</span>
      </div>
      <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `

    document.body.appendChild(notification)

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.classList.add("notification-fade-out")
        setTimeout(() => notification.remove(), 300)
      }
    }, 5000)
  } catch (error) {
    console.error("[v0] Error showing notification:", error)
    // Fallback to alert if notification system fails
    alert(message)
  }
}

// Form validation helper functions
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function validatePhone(phone) {
  const re = /^[+]?[1-9][\d]{0,15}$/
  return re.test(phone.replace(/\s/g, ""))
}

function validateRequired(value) {
  return value && value.trim().length > 0
}

function showFieldError(input, message) {
  try {
    // Remove existing error
    const existingError = input.parentElement.querySelector(".field-error")
    if (existingError) {
      existingError.remove()
    }

    // Add error styling
    input.classList.add("input-error")

    // Create error message
    const errorDiv = document.createElement("div")
    errorDiv.className = "field-error"
    errorDiv.textContent = message
    input.parentElement.appendChild(errorDiv)
  } catch (error) {
    console.error("[v0] Error showing field error:", error)
  }
}

function clearFieldError(input) {
  try {
    input.classList.remove("input-error")
    const errorDiv = input.parentElement.querySelector(".field-error")
    if (errorDiv) {
      errorDiv.remove()
    }
  } catch (error) {
    console.error("[v0] Error clearing field error:", error)
  }
}

// Loading state helper
function setLoadingState(button, isLoading) {
  try {
    if (isLoading) {
      button.dataset.originalText = button.textContent
      button.textContent = "Loading..."
      button.disabled = true
      button.classList.add("btn-loading")
    } else {
      button.textContent = button.dataset.originalText || button.textContent
      button.disabled = false
      button.classList.remove("btn-loading")
    }
  } catch (error) {
    console.error("[v0] Error setting loading state:", error)
  }
}

// Mobile Navigation
document.addEventListener("DOMContentLoaded", () => {
  try {
    const hamburger = document.querySelector(".hamburger")
    const navMenu = document.querySelector(".nav-menu")

    if (hamburger && navMenu) {
      hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active")
        hamburger.classList.toggle("active")
      })
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (navMenu) navMenu.classList.remove("active")
        if (hamburger) hamburger.classList.remove("active")
      })
    })
  } catch (error) {
    console.error("[v0] Error initializing mobile navigation:", error)
  }
})

// Animated Counter for Impact Stats
function animateCounter(element, target) {
  try {
    let current = 0
    const increment = target / 100
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      element.textContent = Math.floor(current).toLocaleString()
    }, 20)
  } catch (error) {
    console.error("[v0] Error animating counter:", error)
    // Fallback: just show the target number
    element.textContent = target.toLocaleString()
  }
}

// Initialize counters when they come into view
const observerOptions = {
  threshold: 0.5,
  rootMargin: "0px 0px -100px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      try {
        const statNumbers = entry.target.querySelectorAll(".stat-number")
        statNumbers.forEach((stat) => {
          const target = Number.parseInt(stat.getAttribute("data-target"))
          if (!isNaN(target)) {
            animateCounter(stat, target)
          }
        })
        observer.unobserve(entry.target)
      } catch (error) {
        console.error("[v0] Error in intersection observer:", error)
      }
    }
  })
}, observerOptions)

const impactTracker = document.querySelector(".impact-tracker")
if (impactTracker) {
  observer.observe(impactTracker)
}

// Donation Form Functionality
document.addEventListener("DOMContentLoaded", () => {
  try {
    // Donation tabs
    const tabBtns = document.querySelectorAll(".tab-btn")
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        tabBtns.forEach((b) => b.classList.remove("active"))
        this.classList.add("active")
      })
    })

    // Amount buttons
    const amountBtns = document.querySelectorAll(".amount-btn")
    const customAmount = document.querySelector(".custom-amount")
    const amountInput = document.querySelector("#amount")

    amountBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        amountBtns.forEach((b) => b.classList.remove("active"))
        this.classList.add("active")

        if (this.classList.contains("custom")) {
          if (customAmount) {
            customAmount.style.display = "block"
            customAmount.focus()
          }
        } else {
          if (customAmount) customAmount.style.display = "none"
          const amount = this.getAttribute("data-amount")
          if (amountInput) {
            amountInput.value = amount
          }
        }
      })
    })

    if (customAmount) {
      customAmount.addEventListener("input", function () {
        if (amountInput) {
          amountInput.value = this.value
        }
      })
    }

    const donationForm = document.querySelector(".donation-form")
    if (donationForm) {
      donationForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        try {
          const submitBtn = donationForm.querySelector('button[type="submit"]')
          const amountValue = amountInput?.value

          // Validate amount
          if (!amountValue || Number.parseFloat(amountValue) <= 0) {
            showNotification("Please select or enter a valid donation amount", "error")
            return
          }

          // Validate email
          const emailInput = donationForm.querySelector('input[type="email"]')
          if (emailInput && !validateEmail(emailInput.value)) {
            showFieldError(emailInput, "Please enter a valid email address")
            showNotification("Please check your email address", "error")
            return
          }

          setLoadingState(submitBtn, true)

          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1500))

          setLoadingState(submitBtn, false)
          showNotification(
            `Thank you for your donation of R${Number.parseFloat(amountValue).toFixed(2)}! This is a demo - no actual payment was processed.`,
            "success",
          )
          donationForm.reset()
        } catch (error) {
          console.error("[v0] Donation form error:", error)
          showNotification("An error occurred. Please try again later.", "error")
          const submitBtn = donationForm.querySelector('button[type="submit"]')
          if (submitBtn) setLoadingState(submitBtn, false)
        }
      })
    }
  } catch (error) {
    console.error("[v0] Error initializing donation form:", error)
  }
})

// Volunteer Form Multi-step
document.addEventListener("DOMContentLoaded", () => {
  try {
    const volunteerForm = document.querySelector(".volunteer-form")
    if (!volunteerForm) return

    const steps = document.querySelectorAll(".form-step")
    const progressSteps = document.querySelectorAll(".progress-step")
    const nextBtns = document.querySelectorAll(".next-step")
    const prevBtns = document.querySelectorAll(".prev-step")
    let currentStep = 1

    function showStep(stepNumber) {
      try {
        steps.forEach((step) => step.classList.remove("active"))
        progressSteps.forEach((step) => step.classList.remove("active"))

        const targetStep = document.querySelector(`[data-step="${stepNumber}"]`)
        if (targetStep) {
          targetStep.classList.add("active")
        }

        if (progressSteps[stepNumber - 1]) {
          progressSteps[stepNumber - 1].classList.add("active")
        }

        // Mark previous steps as completed
        for (let i = 0; i < stepNumber - 1; i++) {
          if (progressSteps[i]) {
            progressSteps[i].classList.add("completed")
          }
        }
      } catch (error) {
        console.error("[v0] Error showing step:", error)
      }
    }

    function validateCurrentStep() {
      try {
        const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`)
        if (!currentStepElement) return true

        const requiredInputs = currentStepElement.querySelectorAll("[required]")
        let isValid = true

        requiredInputs.forEach((input) => {
          clearFieldError(input)

          if (input.type === "email") {
            if (!validateEmail(input.value)) {
              showFieldError(input, "Please enter a valid email address")
              isValid = false
            }
          } else if (input.type === "tel") {
            if (!validatePhone(input.value)) {
              showFieldError(input, "Please enter a valid phone number")
              isValid = false
            }
          } else if (!validateRequired(input.value)) {
            showFieldError(input, "This field is required")
            isValid = false
          }
        })

        return isValid
      } catch (error) {
        console.error("[v0] Error validating step:", error)
        return true // Allow progression if validation fails
      }
    }

    nextBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!validateCurrentStep()) {
          showNotification("Please fill in all required fields correctly", "error")
          return
        }

        if (currentStep < 3) {
          currentStep++
          showStep(currentStep)

          if (currentStep === 3) {
            updateSummary()
          }
        }
      })
    })

    prevBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (currentStep > 1) {
          currentStep--
          showStep(currentStep)
        }
      })
    })

    function updateSummary() {
      try {
        const firstName = document.querySelector("#firstName")?.value || ""
        const lastName = document.querySelector("#lastName")?.value || ""
        const email = document.querySelector("#email")?.value || ""
        const role = document.querySelector("#role")?.value || ""
        const availability = Array.from(document.querySelectorAll('input[name="availability"]:checked'))
          .map((cb) => cb.value)
          .join(", ")

        const summaryContent = document.querySelector("#summary-content")
        if (summaryContent) {
          summaryContent.innerHTML = `
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Preferred Role:</strong> ${role}</p>
            <p><strong>Availability:</strong> ${availability || "Not specified"}</p>
          `
        }
      } catch (error) {
        console.error("[v0] Error updating summary:", error)
      }
    }

    // Apply buttons for specific roles
    const applyBtns = document.querySelectorAll(".apply-btn")
    applyBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const role = this.getAttribute("data-role")
        const roleSelect = document.querySelector("#role")
        if (roleSelect && role) {
          roleSelect.value = role
        }
        const signupSection = document.querySelector("#signup")
        if (signupSection) {
          signupSection.scrollIntoView({ behavior: "smooth" })
        }
      })
    })

    volunteerForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      try {
        const submitBtn = volunteerForm.querySelector('button[type="submit"]')
        setLoadingState(submitBtn, true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setLoadingState(submitBtn, false)
        showNotification("Thank you for your volunteer application! We will contact you soon.", "success")
        volunteerForm.reset()
        currentStep = 1
        showStep(currentStep)
      } catch (error) {
        console.error("[v0] Volunteer form error:", error)
        showNotification("An error occurred submitting your application. Please try again.", "error")
        const submitBtn = volunteerForm.querySelector('button[type="submit"]')
        if (submitBtn) setLoadingState(submitBtn, false)
      }
    })
  } catch (error) {
    console.error("[v0] Error initializing volunteer form:", error)
  }
})

// Events Calendar
document.addEventListener("DOMContentLoaded", () => {
  try {
    const calendar = document.querySelector("#calendar")
    if (!calendar) return

    const currentMonthElement = document.querySelector("#currentMonth")
    const prevBtn = document.querySelector("#prevMonth")
    const nextBtn = document.querySelector("#nextMonth")

    const currentDate = new Date()
    const events = {
      "2025-03-15": "Community Fundraising Walk",
      "2025-03-22": "Volunteer Appreciation Dinner",
      "2025-04-05": "Skills Workshop: Job Readiness",
    }

    function generateCalendar(year, month) {
      try {
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()

        calendar.innerHTML = ""

        // Add day headers
        const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        dayHeaders.forEach((day) => {
          const dayHeader = document.createElement("div")
          dayHeader.className = "calendar-day-header"
          dayHeader.textContent = day
          dayHeader.style.fontWeight = "bold"
          dayHeader.style.backgroundColor = "var(--secondary-color)"
          dayHeader.style.color = "var(--white)"
          calendar.appendChild(dayHeader)
        })

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
          const emptyDay = document.createElement("div")
          emptyDay.className = "calendar-day empty"
          calendar.appendChild(emptyDay)
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
          const dayElement = document.createElement("div")
          dayElement.className = "calendar-day"
          dayElement.textContent = day

          const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
          if (events[dateString]) {
            dayElement.classList.add("has-event")
            dayElement.title = events[dateString]
          }

          calendar.appendChild(dayElement)
        }

        if (currentMonthElement) {
          currentMonthElement.textContent = `${firstDay.toLocaleString("default", { month: "long" })} ${year}`
        }
      } catch (error) {
        console.error("[v0] Error generating calendar:", error)
        showNotification("Error loading calendar", "error")
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1)
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth())
      })
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1)
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth())
      })
    }

    // Initialize calendar
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth())
  } catch (error) {
    console.error("[v0] Error initializing calendar:", error)
  }
})

// Event Details Modal
document.addEventListener("DOMContentLoaded", () => {
  try {
    const modal = document.querySelector("#eventModal")
    const eventBtns = document.querySelectorAll(".event-btn")
    const closeBtn = document.querySelector(".close")

    if (!modal) return

    const eventDetails = {
      walk: {
        title: "Community Fundraising Walk",
        date: "March 15, 2025",
        time: "9:00 AM - 12:00 PM",
        location: "Sea Point Promenade",
        description:
          "Join us for a scenic 5km walk along the beautiful Sea Point Promenade. Registration includes a t-shirt, refreshments, and the satisfaction of supporting a great cause.",
        registration: "R50 per person",
        contact: "events@haven.org.za",
      },
      dinner: {
        title: "Volunteer Appreciation Dinner",
        date: "March 22, 2025",
        time: "6:00 PM - 9:00 PM",
        location: "The Haven Main Shelter",
        description:
          "A special evening to celebrate our incredible volunteers. Enjoy dinner, hear impact stories, and connect with fellow volunteers.",
        registration: "Invitation only",
        contact: "volunteer@haven.org.za",
      },
      workshop: {
        title: "Skills Workshop: Job Readiness",
        date: "April 5, 2025",
        time: "2:00 PM - 4:00 PM",
        location: "Community Center",
        description:
          "Free workshop covering resume writing, interview skills, and job search strategies. Open to residents and community members.",
        registration: "Free - RSVP required",
        contact: "programs@haven.org.za",
      },
    }

    eventBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        try {
          const eventKey = this.getAttribute("data-event")
          const event = eventDetails[eventKey]

          if (event) {
            const eventDetailsElement = document.querySelector("#eventDetails")
            if (eventDetailsElement) {
              eventDetailsElement.innerHTML = `
                <h2>${event.title}</h2>
                <p><strong>Date:</strong> ${event.date}</p>
                <p><strong>Time:</strong> ${event.time}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p><strong>Description:</strong> ${event.description}</p>
                <p><strong>Registration:</strong> ${event.registration}</p>
                <p><strong>Contact:</strong> ${event.contact}</p>
                <button class="btn btn-primary" onclick="showNotification('Registration functionality would be implemented here', 'info')">Register Now</button>
              `
            }
            modal.style.display = "block"
          }
        } catch (error) {
          console.error("[v0] Error showing event details:", error)
          showNotification("Error loading event details", "error")
        }
      })
    })

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modal.style.display = "none"
      })
    }

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none"
      }
    })
  } catch (error) {
    console.error("[v0] Error initializing event modal:", error)
  }
})

// FAQ Accordion
document.addEventListener("DOMContentLoaded", () => {
  try {
    const faqQuestions = document.querySelectorAll(".faq-question")

    faqQuestions.forEach((question) => {
      question.addEventListener("click", function () {
        try {
          const answer = this.nextElementSibling
          if (!answer) return

          const isActive = answer.classList.contains("active")

          // Close all other answers
          document.querySelectorAll(".faq-answer").forEach((a) => {
            a.classList.remove("active")
          })

          // Toggle current answer
          if (!isActive) {
            answer.classList.add("active")
          }
        } catch (error) {
          console.error("[v0] Error toggling FAQ:", error)
        }
      })
    })
  } catch (error) {
    console.error("[v0] Error initializing FAQ:", error)
  }
})

// Newsletter Form
document.addEventListener("DOMContentLoaded", () => {
  try {
    const newsletterForms = document.querySelectorAll(".newsletter-form")

    newsletterForms.forEach((form) => {
      form.addEventListener("submit", async function (e) {
        e.preventDefault()

        try {
          const emailInput = this.querySelector('input[type="email"]')
          const submitBtn = this.querySelector('button[type="submit"]')

          if (!emailInput) return

          // Clear previous errors
          clearFieldError(emailInput)

          // Validate email
          if (!validateEmail(emailInput.value)) {
            showFieldError(emailInput, "Please enter a valid email address")
            showNotification("Please enter a valid email address", "error")
            return
          }

          setLoadingState(submitBtn, true)

          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))

          setLoadingState(submitBtn, false)
          showNotification("Thank you for subscribing to our newsletter!", "success")
          this.reset()
        } catch (error) {
          console.error("[v0] Newsletter form error:", error)
          showNotification("An error occurred. Please try again later.", "error")
          const submitBtn = this.querySelector('button[type="submit"]')
          if (submitBtn) setLoadingState(submitBtn, false)
        }
      })
    })
  } catch (error) {
    console.error("[v0] Error initializing newsletter forms:", error)
  }
})

// Smooth Scrolling for Anchor Links
document.addEventListener("DOMContentLoaded", () => {
  try {
    const anchorLinks = document.querySelectorAll('a[href^="#"]')

    anchorLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        try {
          const href = this.getAttribute("href")
          if (!href || href === "#") return

          e.preventDefault()
          const targetId = href.substring(1)
          const targetElement = document.getElementById(targetId)

          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
        } catch (error) {
          console.error("[v0] Error with smooth scroll:", error)
        }
      })
    })
  } catch (error) {
    console.error("[v0] Error initializing smooth scroll:", error)
  }
})

// Map Pin Interactions
document.addEventListener("DOMContentLoaded", () => {
  try {
    const mapPins = document.querySelectorAll(".pin")

    mapPins.forEach((pin) => {
      pin.addEventListener("click", function () {
        try {
          const shelterName = this.getAttribute("data-shelter")
          if (shelterName) {
            showNotification(`${shelterName} Shelter - Contact us for more information about this location.`, "info")
          }
        } catch (error) {
          console.error("[v0] Error showing pin info:", error)
        }
      })
    })
  } catch (error) {
    console.error("[v0] Error initializing map pins:", error)
  }
})

document.addEventListener("DOMContentLoaded", () => {
  try {
    const emailInputs = document.querySelectorAll('input[type="email"]')
    const phoneInputs = document.querySelectorAll('input[type="tel"]')

    emailInputs.forEach((input) => {
      input.addEventListener("blur", function () {
        clearFieldError(this)
        if (this.value && !validateEmail(this.value)) {
          showFieldError(this, "Please enter a valid email address")
        }
      })

      input.addEventListener("input", function () {
        if (this.classList.contains("input-error")) {
          clearFieldError(this)
        }
      })
    })

    phoneInputs.forEach((input) => {
      input.addEventListener("blur", function () {
        clearFieldError(this)
        if (this.value && !validatePhone(this.value)) {
          showFieldError(this, "Please enter a valid phone number")
        }
      })

      input.addEventListener("input", function () {
        if (this.classList.contains("input-error")) {
          clearFieldError(this)
        }
      })
    })
  } catch (error) {
    console.error("[v0] Error initializing form validation:", error)
  }
})

// Loading States for Forms
function showLoading(button) {
  const originalText = button.textContent
  button.textContent = "Loading..."
  button.disabled = true

  setTimeout(() => {
    button.textContent = originalText
    button.disabled = false
  }, 2000)
}

// Add loading states to form submissions
document.addEventListener("DOMContentLoaded", () => {
  const submitButtons = document.querySelectorAll('button[type="submit"]')

  submitButtons.forEach((button) => {
    button.addEventListener("click", function () {
      if (this.form && this.form.checkValidity()) {
        showLoading(this)
      }
    })
  })
})

// Scroll Progress Indicator
document.addEventListener("DOMContentLoaded", () => {
  try {
    const scrollProgress = document.getElementById("scrollProgress")

    if (scrollProgress) {
      window.addEventListener("scroll", () => {
        try {
          const scrollTop = window.pageYOffset
          const docHeight = document.body.scrollHeight - window.innerHeight
          const scrollPercent = (scrollTop / docHeight) * 100
          scrollProgress.style.width = scrollPercent + "%"
        } catch (error) {
          console.error("[v0] Error updating scroll progress:", error)
        }
      })
    }
  } catch (error) {
    console.error("[v0] Error initializing scroll progress:", error)
  }
})

// Header Scroll Effect
document.addEventListener("DOMContentLoaded", () => {
  try {
    const header = document.querySelector(".header")

    if (header) {
      window.addEventListener("scroll", () => {
        try {
          if (window.scrollY > 100) {
            header.classList.add("scrolled")
          } else {
            header.classList.remove("scrolled")
          }
        } catch (error) {
          console.error("[v0] Error updating header:", error)
        }
      })
    }
  } catch (error) {
    console.error("[v0] Error initializing header scroll effect:", error)
  }
})

// Intersection Observer for Animations
document.addEventListener("DOMContentLoaded", () => {
  try {
    const animateOnScroll = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            try {
              entry.target.style.animationPlayState = "running"
              entry.target.classList.add("animate")
            } catch (error) {
              console.error("[v0] Error animating element:", error)
            }
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll("h1, h2, h3, .help-card, .story-card, .stat")
    elementsToAnimate.forEach((el) => {
      el.style.animationPlayState = "paused"
      animateOnScroll.observe(el)
    })
  } catch (error) {
    console.error("[v0] Error initializing scroll animations:", error)
  }
})

// Parallax Effect for Hero Section
document.addEventListener("DOMContentLoaded", () => {
  try {
    const heroImage = document.querySelector(".hero-image")

    if (heroImage) {
      window.addEventListener("scroll", () => {
        try {
          const scrolled = window.pageYOffset
          const rate = scrolled * -0.5
          heroImage.style.transform = `scale(1.1) translateY(${rate}px)`
        } catch (error) {
          console.error("[v0] Error with parallax effect:", error)
        }
      })
    }
  } catch (error) {
    console.error("[v0] Error initializing parallax effect:", error)
  }
})

// Enhanced Button Interactions
document.addEventListener("DOMContentLoaded", () => {
  try {
    const buttons = document.querySelectorAll(".btn")

    buttons.forEach((button) => {
      button.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-3px) scale(1.05)"
      })

      button.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0) scale(1)"
      })

      button.addEventListener("mousedown", function () {
        this.style.transform = "translateY(-1px) scale(0.98)"
      })

      button.addEventListener("mouseup", function () {
        this.style.transform = "translateY(-3px) scale(1.05)"
      })
    })
  } catch (error) {
    console.error("[v0] Error initializing button interactions:", error)
  }
})

// Card Tilt Effect
document.addEventListener("DOMContentLoaded", () => {
  try {
    const cards = document.querySelectorAll(".help-card, .story-card, .stat")

    cards.forEach((card) => {
      card.addEventListener("mousemove", function (e) {
        try {
          const rect = this.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top

          const centerX = rect.width / 2
          const centerY = rect.height / 2

          const rotateX = (y - centerY) / 10
          const rotateY = (centerX - x) / 10

          this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`
        } catch (error) {
          console.error("[v0] Error with card tilt:", error)
        }
      })

      card.addEventListener("mouseleave", function () {
        this.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)"
      })
    })
  } catch (error) {
    console.error("[v0] Error initializing card tilt effect:", error)
  }
})

// Smooth Reveal Animations
document.addEventListener("DOMContentLoaded", () => {
  try {
    const revealElements = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
          }
        })
      },
      {
        threshold: 0.15,
      },
    )

    const elementsToReveal = document.querySelectorAll(".help-card, .about-content, .shelter-info, .story-content")
    elementsToReveal.forEach((el) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(30px)"
      el.style.transition = "all 0.8s ease"
      revealElements.observe(el)
    })

    // Add revealed class styles
    const style = document.createElement("style")
    style.textContent = `
    .revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `
    document.head.appendChild(style)
  } catch (error) {
    console.error("[v0] Error initializing reveal animations:", error)
  }
})
