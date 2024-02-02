import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// init Swiper:
const swiper = new Swiper('.swiper', {
  modules: [Navigation, Pagination],
  loop: true,
  slidesPerView: 1,
  spaceBetween: 16,
  grabCursor: true,

  breakpoints: {
    768: {
      slidesPerView: 2,
    },
    1280: {
      slidesPerView: 3,
    },
  },

  pagination: {
    el: '.swiper-pagination',
    bulletClass: 'pagination__bullet',
    bulletActiveClass: 'pagination__bullet--active',
    clickable: true,
  },

  navigation: {
    nextEl: '.button__slider.button-next',
    prevEl: '.button__slider.button-prev',
  },
});

export default swiper;
