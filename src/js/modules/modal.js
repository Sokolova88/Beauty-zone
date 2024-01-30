// Script to open and close a modal window
function modal() {
  const openModalBtn = document.querySelectorAll('.js__modal-open');
  const closeModalBtn = document.querySelector('.js__modal-close');
  const modal = document.querySelector('.js__backdrop');

  openModalBtn.forEach(btn => {
    btn.addEventListener('click', toggleModal);
  });

  closeModalBtn.addEventListener('click', toggleModal);
  modal.addEventListener('click', closeBackdropClick);

  function toggleModal() {
    document.body.classList.toggle('modal-open');
    modal.classList.toggle('backdrop--hidden');
  }

  function closeBackdropClick(e) {
    if (e.target.classList.contains('backdrop')) {
      document.body.classList.remove('modal-open');
      modal.classList.add('backdrop--hidden');
    }
  }
}

export default modal;
