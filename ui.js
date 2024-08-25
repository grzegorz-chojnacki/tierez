// @ts-check
/// <reference path="paths.js" />

/**
 * @param {Item} item
 * @returns {HTMLImageElement}
 */
function createImage(item) {
  const img = document.createElement('img')
  img.src = item.data
  img.addEventListener('dragstart', () => { state.dragged = item })
  return img
}

/**
 * @param {Tier} tier
 * @returns {HTMLDivElement}
 */
function createTier(tier) {
  const tierNode = document.createElement('div')
  tierNode.classList.add('tier')

  if (tier.name && tier.color) {
    const labelNode = tierNode.appendChild(document.createElement('label'))
    labelNode.innerText = tier.name
    labelNode.style.backgroundColor = tier.color
  }

  for (let item of tier.items) {
    item.node = tierNode.appendChild(createImage(item))
  }

  tierNode.addEventListener('dragover', e => e.preventDefault())
  tierNode.addEventListener('drop', drop)

  return tierNode
}

/**
 * @param {State} state
 * @returns {HTMLElement[]}
 */
function createTierlist(state) {
  return state.tierlist.map(tier => {
    tier.node = createTier(tier)
    return tier.node
  })
}

/**
 * @param {State} state
 * @returns {HTMLDivElement}
 */
function createTray(state) {
  state.tray.node = createTier({
    name: '',
    color: '',
    // TODO: fix this mess
    node: /** @type {HTMLImageElement} */(/** @type {unknown} */(null)),
    items: state.tray.items
  })
  return state.tray.node
}

function renderUI() {
  state = loadState()

  const tierlist = document.getElementById('tierlist')
  const tray = document.getElementById('tray')
  if (!tierlist || !tray) throw new Error()

  tierlist.replaceChildren(...createTierlist(state))
  tray.replaceChildren(createTray(state))
}

// TODO: Add handling of files
document.addEventListener('paste', async () => {
  const clipboardItems = await navigator.clipboard.read()
  for (const item of clipboardItems) {
    for (let type of item.types) {
      if (type.startsWith('image/')) {
        // TODO: Rewrite to use ObjectURLs in img src
        const blob = await item.getType(type)
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        // TODO: display a loading indicator for loading big images
        reader.onloadend = async () => {
          // TODO: fix this mess
          const item = {
            data: await compressImage(/** @type {string} */(reader.result)),
            node: /** @type {HTMLImageElement} */(/** @type {unknown} */(null))
          }

          item.node = createImage(item)
          state.tray.items.push(item)
          state.tray.node.appendChild(item.node)
          saveState(state)
        }
      }
    }
  }
})
