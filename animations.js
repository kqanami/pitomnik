import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  // GSAP Parallax & Scroll Animations
  const heroMid = document.getElementById('heroMid');
  const heroFront = document.getElementById('heroFront');

  // Parallax layers
  if(heroMid && heroFront) {
      gsap.to(heroMid, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
      
      gsap.to(heroFront, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
  }

  // Reveal Animations
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => {
    gsap.fromTo(el, 
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });
}
