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
  const container = document.createElement('div')
  container.classList.add('tier')

  if (tier.name && tier.color) {
    const labelNode = container.appendChild(document.createElement('label'))
    labelNode.innerText = tier.name
    labelNode.style.backgroundColor = tier.color
  }
  const itemsNode = container.appendChild(document.createElement('div'))
  itemsNode.classList.add('items')
  tier.node = itemsNode

  for (let item of tier.items) {
    item.node = itemsNode.appendChild(createImage(item))
  }

  itemsNode.addEventListener('dragover', e => e.preventDefault())
  itemsNode.addEventListener('drop', drop)

  return container
}

function renderUI() {
  state = loadState()

  const tierlist = document.getElementById('tierlist')
  const tray = document.getElementById('tray')
  const trash = document.getElementById('trash')
  if (!tierlist || !tray || !trash) throw new Error()

  tierlist.replaceChildren(...state.tierlist.map(tier => createTier(tier)))
  tray.replaceChildren(createTier(state.tray))

  trash.addEventListener('dragover', e => e.preventDefault())
  trash.addEventListener('drop', dropTrash)
}

document.addEventListener('paste', async () => {
  const clipboardItems = await navigator.clipboard.read()
  for (let item of clipboardItems) {
    for (let type of item.types) {
      if (type.startsWith('image/')) {
        const blob = await item.getType(type)
        await handleClipboardImage(blob)
      }
    }
  }
})
