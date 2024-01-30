function mobileNav() {
  // Mobile nav button
  const navBtn = document.querySelector('.mobile-nav-btn');
  // Mobile nav container
  const nav = document.querySelector('.mobile-nav');
  // Mobile btn > icon
  const menuIcon = document.querySelector('.nav-icon');

  const toggleMenu = () => {
    const isMenuOpen = navBtn.getAttribute('aria-expanded') === 'true' || false;
    navBtn.setAttribute('aria-expanded', !isMenuOpen);
    nav.classList.toggle('mobile-nav--open');
    menuIcon.classList.toggle('nav-icon--active');

    nav.querySelectorAll('.mobile-nav__link').forEach(link => {
      link.addEventListener('click', () => {
        navBtn.setAttribute('aria-expanded', isMenuOpen);
        nav.classList.remove('mobile-nav--open');
        menuIcon.classList.remove('nav-icon--active');
        bodyScrollLock.enableBodyScroll(document.body);
      });
    });

    //Prevent document scrolling when mobileMenu is open
    const scrollLockMethod = !isMenuOpen ? 'disableBodyScroll' : 'enableBodyScroll';
    bodyScrollLock[scrollLockMethod](document.body);
  };

  navBtn.addEventListener('click', toggleMenu);

  // Close the mobile menu on wider screens if the device orientation changes
  window.matchMedia('(min-width: 768px)').addEventListener('change', e => {
    if (!e.matches) return;
    nav.classList.remove('mobile-nav--open');
    navBtn.setAttribute('aria-expanded', false);
    bodyScrollLock.enableBodyScroll(document.body);
  });
}

export default mobileNav;
