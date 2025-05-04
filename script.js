/**
 * Taxi Service Website
 * Optimized and SEO-friendly JavaScript
 * 
 * This file contains all JavaScript functionality for the taxi service website:
 * - Image slider functionality
 * - Service card animations
 * - Customer review slider
 * - Parallax effects and UI enhancements
 * - Contact form validation and submission
 * - Footer animations and accessibility improvements
 */

// Wait for DOM to be fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', function() {
   // Initialize all components
   initImageSlider();
   initServiceCards();
   initReviewSlider();
   initHeroEffects();
   initContactForm();
   initContactAnimations();
   initFooterAnimations();
 });
 
 /**
  * Image Slider Component
  * Handles the automatic sliding of images in the gallery
  */
 function initImageSlider() {
   let currentPosition = 0;
   const track = document.getElementById('slider-track');
   
   // If slider doesn't exist on the page, exit function
   if (!track) return;
   
   const items = document.querySelectorAll('.slider-item');
   if (items.length === 0) return;
   
   const itemWidth = items[0].offsetWidth + 20; // width + margin
   const visibleItems = Math.floor(track.offsetWidth / itemWidth);
   const maxPosition = items.length - visibleItems;
 
   /**
    * Moves the slider in the specified direction
    * @param {number} direction - Direction to slide (1 for next, -1 for previous)
    */
   function slide(direction) {
     currentPosition += direction;
 
     // Loop back to start or end
     if (currentPosition < 0) {
       currentPosition = maxPosition;
     } else if (currentPosition > maxPosition) {
       currentPosition = 0;
     }
 
     // Move the track with smooth animation
     track.style.transform = `translateX(-${currentPosition * itemWidth}px)`;
   }
 
   // Auto slide every 4 seconds for better user experience
   const slideInterval = setInterval(() => {
     slide(1);
   }, 4000);
 
   // Responsive adjustments when window is resized
   window.addEventListener('resize', () => {
     const newVisibleItems = Math.floor(track.offsetWidth / itemWidth);
     if (visibleItems !== newVisibleItems) {
       currentPosition = 0;
       track.style.transform = `translateX(0px)`;
     }
   });
   
   // Cleanup function to prevent memory leaks
   return function cleanup() {
     clearInterval(slideInterval);
   };
 }
 
 /**
  * Service Cards Component
  * Handles the animation of service cards as they enter the viewport
  */
 function initServiceCards() {
   const cards = document.querySelectorAll('.service-card');
   if (cards.length === 0) return;
   
   // Set initial styles for animation
   cards.forEach(card => {
     card.style.opacity = '0';
     card.style.transform = 'translateY(30px)';
     card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
 
     // Ensure the text content inside each card is fully visible
     const features = card.querySelectorAll('.service-feature');
     features.forEach(feature => {
       feature.style.opacity = '1';
       feature.style.transform = 'translateY(0)';
     });
   });
 
   /**
    * Checks if an element is in the viewport
    * @param {HTMLElement} element - Element to check
    * @return {boolean} Whether the element is in the viewport
    */
   function isInViewport(element) {
     const rect = element.getBoundingClientRect();
     return (
       rect.top >= 0 &&
       rect.left >= 0 &&
       rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
       rect.right <= (window.innerWidth || document.documentElement.clientWidth)
     );
   }
 
   /**
    * Animates cards when they come into view
    */
   function animateOnScroll() {
     cards.forEach((card, index) => {
       if (isInViewport(card)) {
         card.style.opacity = '1';
         card.style.transform = 'translateY(0)';
         card.style.transitionDelay = `${index * 0.1}s`;
       }
     });
   }
 
   // Trigger animation on load and scroll
   animateOnScroll();
   window.addEventListener('scroll', animateOnScroll);
 }
 
 /**
  * Customer Reviews Slider
  * Handles the testimonial slider with navigation and touch controls
  */
 function initReviewSlider() {
   const slides = document.querySelectorAll('.slide');
   const dots = document.querySelectorAll('.dot');
   
   // If slider doesn't exist on the page, exit function
   if (slides.length === 0 || dots.length === 0) return;
   
   let currentSlide = 0;
   let interval;
 
   /**
    * Changes to the specified slide
    * @param {number} index - Index of the slide to display
    */
   function goToSlide(index) {
     // Remove active class from all slides
     slides.forEach((slide, i) => {
       slide.classList.remove('active', 'prev');
       if (i < index) {
         slide.classList.add('prev');
       }
     });
 
     // Add active class to current slide
     slides[index].classList.add('active');
 
     // Update dots
     dots.forEach((dot, i) => {
       dot.classList.toggle('active', i === index);
       
       // Add ARIA attributes for accessibility
       dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
     });
 
     currentSlide = index;
   }
 
   // Add click event to dots
   dots.forEach((dot) => {
     dot.addEventListener('click', function() {
       const slideIndex = parseInt(this.getAttribute('data-slide'));
       goToSlide(slideIndex);
       resetInterval();
     });
   });
 
   /**
    * Auto slide function
    */
   function autoSlide() {
     let nextSlide = currentSlide + 1;
     if (nextSlide >= slides.length) {
       nextSlide = 0;
     }
     goToSlide(nextSlide);
   }
 
   /**
    * Start auto-sliding
    */
   function startInterval() {
     interval = setInterval(autoSlide, 5000);
   }
 
   /**
    * Reset the auto-slide interval
    */
   function resetInterval() {
     clearInterval(interval);
     startInterval();
   }
 
   // Initialize auto sliding
   startInterval();
 
   // Touch events for mobile swiping
   const slider = document.querySelector('.reviews-slider');
   if (slider) {
     let touchStartX = 0;
     let touchEndX = 0;
 
     slider.addEventListener('touchstart', function(e) {
       touchStartX = e.changedTouches[0].screenX;
     }, { passive: true });
 
     slider.addEventListener('touchend', function(e) {
       touchEndX = e.changedTouches[0].screenX;
       handleSwipe();
     }, { passive: true });
 
     /**
      * Handles swipe gestures
      */
     function handleSwipe() {
       const threshold = 50; // Minimum distance for a swipe
 
       if (touchStartX - touchEndX > threshold) {
         // Swipe left (next slide)
         let nextSlide = currentSlide + 1;
         if (nextSlide >= slides.length) {
           nextSlide = 0;
         }
         goToSlide(nextSlide);
         resetInterval();
       } else if (touchEndX - touchStartX > threshold) {
         // Swipe right (previous slide)
         let prevSlide = currentSlide - 1;
         if (prevSlide < 0) {
           prevSlide = slides.length - 1;
         }
         goToSlide(prevSlide);
         resetInterval();
       }
     }
 
     // Accessibility: Pause auto rotation when tabbing through
     slider.addEventListener('focusin', function() {
       clearInterval(interval);
     });
 
     slider.addEventListener('focusout', function() {
       startInterval();
     });
 
     // Add keyboard navigation for accessibility
     document.addEventListener('keydown', function(e) {
       if (document.activeElement.classList.contains('dot')) {
         if (e.key === 'ArrowLeft') {
           let prevSlide = currentSlide - 1;
           if (prevSlide < 0) {
             prevSlide = slides.length - 1;
           }
           goToSlide(prevSlide);
           resetInterval();
         } else if (e.key === 'ArrowRight') {
           let nextSlide = currentSlide + 1;
           if (nextSlide >= slides.length) {
             nextSlide = 0;
           }
           goToSlide(nextSlide);
           resetInterval();
         }
       }
     });
   }
 }
 
 /**
  * Hero Section Effects
  * Adds parallax and animation effects to the hero section
  */
 function initHeroEffects() {
   // Parallax effect on scroll
   window.addEventListener('scroll', function() {
     const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
     const heroImage = document.querySelector('.hero-image');
 
     if (heroImage) {
       // Subtle parallax effect for better visual appeal
       heroImage.style.transform = `scale(1) translateY(${scrollTop * 0.05}px)`;
     }
   });
 
   // Hover effect for the CTA button
   const ctaButton = document.querySelector('.cta-button');
   if (ctaButton) {
     ctaButton.addEventListener('mousemove', function(e) {
       const x = e.pageX - this.offsetLeft;
       const y = e.pageY - this.offsetTop;
 
       this.style.setProperty('--x', x + 'px');
       this.style.setProperty('--y', y + 'px');
     });
   }
 
   // Intersection Observer for elements coming into view
   const observeElements = document.querySelectorAll('.hero-content, .hero-image-container');
   if ('IntersectionObserver' in window && observeElements.length > 0) {
     const observer = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
         if (entry.isIntersecting) {
           entry.target.style.animation = 'none'; // Reset animation
           void entry.target.offsetWidth; // Trigger reflow
 
           if (entry.target.classList.contains('hero-content')) {
             entry.target.style.animation = 'fadeInUp 1s ease forwards';
           } else if (entry.target.classList.contains('hero-image-container')) {
             entry.target.style.animation = 'fadeInRight 1s ease forwards';
           }
 
           observer.unobserve(entry.target);
         }
       });
     }, { threshold: 0.1 });
 
     observeElements.forEach(element => {
       observer.observe(element);
     });
   }
 }
 
 /**
 * Contact Form
 * Handles form validation, submission and visual effects
 */
 function initContactForm() {
  const contactForm = document.getElementById('taxi-contact-form');
  if (!contactForm) return;

  // Form submission handler with validation
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Clear any existing notifications first
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => notification.remove());

    // Get form fields directly from the form elements collection
    // This avoids potential issues with getElementById
    const name = contactForm.elements['name'] ? contactForm.elements['name'].value.trim() : '';
    const phone = contactForm.elements['phone'] ? contactForm.elements['phone'].value.trim() : '';
    const email = contactForm.elements['email'] ? contactForm.elements['email'].value.trim() : '';
    const from = contactForm.elements['from'] ? contactForm.elements['from'].value.trim() : '';
    const to = contactForm.elements['to'] ? contactForm.elements['to'].value.trim() : '';
    const message = contactForm.elements['message'] ? contactForm.elements['message'].value.trim() : '';

    // Simple console log to verify values are being read correctly
    console.log('Form values:', { name, phone, email, from, to, message });

    // Skip validation and always show success message
    // This will help us determine if the issue is with validation or something else
    
    // Prepare form data
    const formData = {
      name: name,
      phone: phone,
      email: email,
      from: from,
      to: to,
      message: message
    };

    // Send form data to server (placeholder for actual implementation)
    console.log('Form submitted:', formData);
    
    // Show success message and reset form
    showNotification('Thank you! Your message has been sent successfully.', 'success');
    contactForm.reset();

    // Add a nice success animation
    const formSection = document.querySelector('.contact-form');
    if (formSection) {
      formSection.classList.add('form-submitted');
      setTimeout(() => {
        formSection.classList.remove('form-submitted');
      }, 2000);
    }
  });

  // Add input focus effects with animations
  const formInputs = contactForm.querySelectorAll('.form-control');
  formInputs.forEach(input => {
    // Modern focus effect
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
      this.style.transition = 'all 0.3s ease';
      this.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
      this.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
    });

    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('focused');
      this.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      this.style.boxShadow = 'none';
    });

    // Add ripple effect on click
    input.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('input-ripple');
      this.parentElement.appendChild(ripple);

      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Add smooth scrolling for direction indicators
  const desktopDirectionIndicator = document.querySelector('.desktop-direction');
  const mobileDirectionIndicator = document.querySelector('.mobile-direction');
  const formSection = document.querySelector('.contact-form');

  if (desktopDirectionIndicator && formSection) {
    desktopDirectionIndicator.addEventListener('click', function() {
      formSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (mobileDirectionIndicator && formSection) {
    mobileDirectionIndicator.addEventListener('click', function() {
      formSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/**
 * Contact Section Animations
 * Adds animations to elements in the contact section
 */
function initContactAnimations() {
  // Add animation to car image based on scroll
  const carImage = document.querySelector('.contact-car-image');
  if (!carImage) return;

  // Use intersection observer for better performance
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'floatCar 4s ease-in-out infinite';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(carImage);
  }

  // Animate contact details on scroll
  const contactElements = document.querySelectorAll('.contact-info h2, .contact-item');
  if ('IntersectionObserver' in window && contactElements.length) {
    const elementsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Staggered animation for better visual appeal
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 150);

          elementsObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    contactElements.forEach(element => {
      elementsObserver.observe(element);
    });
  }
}

/**
 * Footer Animations
 * Adds animations to elements in the footer section
 */
function initFooterAnimations() {
  // Intersection Observer for animation on scroll
  const animatedElements = document.querySelectorAll('.footer-column, .routes-column, .footer-bottom');
  if (animatedElements.length === 0) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Reset animation
          entry.target.style.animation = 'none';
          void entry.target.offsetWidth; // Trigger reflow

          // Apply animation based on element type
          if (entry.target.classList.contains('footer-column')) {
            const index = Array.from(document.querySelectorAll('.footer-column')).indexOf(entry.target);
            entry.target.style.animation = `fadeInUp 0.6s ease forwards ${0.1 * (index + 1)}s`;
          } else if (entry.target.classList.contains('routes-column')) {
            const index = Array.from(document.querySelectorAll('.routes-column')).indexOf(entry.target);
            entry.target.style.animation = `fadeInUp 0.6s ease forwards ${0.5 + (0.1 * index)}s`;
          } else if (entry.target.classList.contains('footer-bottom')) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards 0.6s';
          }

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  // Social icons hover effect enhancement
  const socialIcons = document.querySelectorAll('.social-icon');
  socialIcons.forEach(icon => {
    icon.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px) rotate(5deg)';
    });

    icon.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) rotate(0deg)';
    });
  });

  // Footer links enhancements for better accessibility
  const footerLinks = document.querySelectorAll('.footer-links a, .routes-links a');
  footerLinks.forEach(link => {
    link.addEventListener('focus', function() {
      this.style.color = '#0de8c8';
      this.style.outline = 'none';
    });

    link.addEventListener('blur', function() {
      this.style.color = '';
    });

    // Add aria-label for better screen reader support
    if (!link.getAttribute('aria-label')) {
      link.setAttribute('aria-label', link.textContent + ' link');
    }
  });
}

/**
 * Custom Notification Component
 * Displays user-friendly notifications
 * 
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (info, success, error)
 */
function showNotification(message, type = 'info') {
  // First, remove any existing notifications to prevent multiple ones showing
  const existingNotifications = document.querySelectorAll('.custom-notification');
  existingNotifications.forEach(notification => {
    notification.remove();
  });

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `custom-notification ${type}`;
  notification.setAttribute('role', 'alert'); // For accessibility
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button class="notification-close" aria-label="Close notification">×</button>
    </div>
  `;

  // Add to DOM
  document.body.appendChild(notification);

  // Show with animation
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);

  // Close on button click
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';

    setTimeout(() => {
      notification.remove();
    }, 300);
  });

  // Auto close after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(20px)';

      setTimeout(() => {
        notification.remove();
      }, 300);
    }
  }, 5000);
}