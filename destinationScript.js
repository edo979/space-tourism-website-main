const tabListEl = document.querySelector('[role="tablist"]'),
  context = tabListEl.dataset.context

let currentTab = 0,
  data = {} // for specific page (use html data- attribute and context variable)

init()

async function init() {
  data = await getContent(context)

  setContent()
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

function setContent() {
  setTabsName(data.map((content) => content.name))
  setTabContent(data[currentTab])
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

function setTabContent(tabData) {
  const tabPanel = document.querySelector('[role="tabpanel"]'),
    tabPicture = document.querySelector('picture'),
    template = getTemplate(context)

  tabPanel.id = `${tabData.name.toLowerCase()}-tab`

  tabPanel.innerHTML = template(tabData)

  tabPicture.innerHTML = `
    <source srcset=${tabData.images.webp} type="image/webp" />
    <img src=${tabData.images.png} alt="the ${tabData.name}" />
  `
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

  Array.from(tabListEl.children).forEach((tab, i, tabs) =>
    tab.addEventListener('click', (e) => {
      currentTab = i

      tabs.forEach((tab) => {
        tab.setAttribute('aria-selected', false)
        tab.setAttribute('tabindex', '-1')
      })

      e.target.setAttribute('aria-selected', true)
      e.target.setAttribute('tabindex', '0')

      setTabContent(data[currentTab])
    })
  )
}

function getTemplate(context) {
  switch (context) {
    case 'destinations':
      return (data) => ` 
          <h2>${data.name}</h2>
          <p>
          ${data.description}
          </p>

          <div class="destination_meta flex">
            <div>
              <h3>Avg. distance</h3>
              <p>${data.distance}</p>
            </div>

            <div>
              <h3>Est. travel time</h3>
              <p>${data.travel}</p>
            </div>
          </div>
        `
    case 'crew':
      return (data) => `
        <h2>${data.role}</h2>
        <p>${data.name}</p>
        <p>${data.bio}</p>
      `

    default:
      return '<p>Error on server</p>'
  }
}
