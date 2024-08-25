// @ts-check
/// <reference path="paths.js" />

/**
 * @template T
 * @param {Array<T>} arr
 * @param {T} item
 * @returns {T | null}
 */
function remove(arr, item) {
  const index = arr.indexOf(item);
  if (index > -1) {
    arr.splice(index, 1);
    return item;
  }
  return null;
}

/**
 * @param {String} imageData
 * @returns {Promise<String>}
 */
async function compressImage(imageData) {
  const img = new Image()
  img.src = imageData

  // We need to wait for browser to load the image
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (ctx) {
        // Match aspect ratio between canvas and image
        // Make it double for sharpness
        canvas.width = img.width * (TIER_HEIGHT / img.height) * 2
        canvas.height = TIER_HEIGHT * 2

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const result = canvas.toDataURL('image/jpeg', 0.8)

        resolve(result)
      } else {
        reject('canvas ctx is null')
      }
    }
  })
}

/**
 * @param {HTMLElement?} node
 * @returns {Tier?}
 */
function findItems(node) {
  for (let tier of state.tierlist) {
    if (tier.node === node) return tier
  }
  if (state.tray.node === node) return state.tray
  else return null
}

/** @param {DragEvent} e */
function drop(e) {
  if (state.dragged && (e.target instanceof HTMLElement)) {
    if (!state.dragged.node.parentElement) throw new Error()
    const sourceTier = findItems(state.dragged.node.parentElement)
    const targetTier = findItems(e.target)

    if (sourceTier && targetTier) {
      remove(sourceTier.items, state.dragged)
      targetTier.items.push(state.dragged)

      saveState(state)
      e.target.appendChild(state.dragged.node)
    }
  }
  state.dragged = null
}

function resetState() {
  for (let tier of state.tierlist) {
    state.tray.items.push(...tier.items)
    tier.items.splice(0, tier.items.length)
  }

  saveState(state)
  renderUI()
}

function clearState() {
  localStorage.clear()
  renderUI()
}

/** @param {State} state */
function saveState(state) {
  localStorage.setItem('state', JSON.stringify(state))
}

/** @returns {State} */
function loadState() {
  return JSON.parse(localStorage.getItem('state') || 'null') || {
    tierlist: [
      { name: 'S', color: 'var(--S)', node: null, items: [] },
      { name: 'A', color: 'var(--A)', node: null, items: [] },
      { name: 'B', color: 'var(--B)', node: null, items: [] },
      { name: 'C', color: 'var(--C)', node: null, items: [] },
      { name: 'D', color: 'var(--D)', node: null, items: [] },
      { name: 'E', color: 'var(--E)', node: null, items: [] },
      { name: 'F', color: 'var(--F)', node: null, items: [] },
    ],
    tray: { node: null, items: [] }
  }
}