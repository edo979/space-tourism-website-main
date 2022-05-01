const navBtn = document.querySelector('[aria-controls="primary-navigation"]'),
  navListEl = document.getElementById('primary-navigation')

navBtn.addEventListener('click', (e) => {
  navListEl.classList.toggle('colapsed')
})
