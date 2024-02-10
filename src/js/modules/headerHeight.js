function headerHeight() {
  const { height: headerHeight } = document.querySelector('.header').getBoundingClientRect();
  document.body.style.paddingTop = `${headerHeight}px`;
  console.log(document.body.style.paddingTop);
}

export default headerHeight;
