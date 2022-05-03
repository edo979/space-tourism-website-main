// when clicked for first time load data
// set content
const tabListEl = document.querySelector('[role="tablist"]')

let currentTab = 0
const tabCount = tabListEl.childElementCount

tabListEl.addEventListener('keydown', (e) => {
  if (e.keyCode === 37 || e.keyCode === 39) {
    const keyRight = 39 // keyLeft = 37

    tabListEl.children[currentTab].setAttribute('tabindex', '-1')

    if (e.keyCode == keyRight) {
      currentTab++
      if (currentTab >= tabCount) {
        currentTab = 0
      }
    } else {
      currentTab--
      if (currentTab < 0) {
        currentTab = tabCount - 1
      }
    }

    tabListEl.children[currentTab].setAttribute('tabindex', '0')
    tabListEl.children[currentTab].focus()
  }
})
