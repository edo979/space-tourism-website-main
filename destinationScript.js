// when clicked for first time load data
// set content
const tabListEl = document.querySelector('[role="tablist"]')

let currentTab = 0
init()

async function init() {
  const data = await getContent('destinations')

  setContent(data)
}

async function setActiveTab(clickedTab) {
  Array.from(tabListEl.children).forEach((tab) => {
    tab.setAttribute('aria-selected', false)
    tab.setAttribute('tabindex', '-1')
  })

  clickedTab.setAttribute('aria-selected', true)
  clickedTab.setAttribute('tabindex', '0')
}

async function getContent(contentCategory) {
  try {
    const response = await fetch('assets/data.json')

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    const data = await response.json()

    return data[contentCategory]
  } catch (error) {
    console.log(`error: ${error}`)
  }
}

function setContent(data) {
  setTabsName(data.map((destination) => destination.name))
  setEventListeners()
}

function setTabsName(names) {
  let tabsName = ''

  names.forEach((name, i) => {
    tabsName += `<button
      aria-selected="${i == 0 ? true : false}"
      role="tab"
      aria-controls="${name.toLowerCase()}-tab"
      tabindex="${i == 0 ? '0' : '-1'}"
    >
      ${name}
    </button>`
  })

  tabListEl.innerHTML = tabsName
}

function setEventListeners() {
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

  Array.from(tabListEl.children).forEach((tab, i) =>
    tab.addEventListener('click', (e) => {
      currentTab = i
      setActiveTab(e.target)
    })
  )
}
