// TODO: get rid of global variables
const TIER_HEIGHT = 87
let dragged = undefined

function spawnImage(image) {
  const img = document.createElement('img')
  img.addEventListener('dragstart', dragstart)

  img.src = image
  tray.appendChild(img)
}

async function compressImage(image) {
  const img = new Image()
  img.src = image

  // We need to wait for browser to load the image
  return new Promise(resolve => {
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      // Match aspect ratio between canvas and image
      // Make it double for sharpness
      canvas.width = img.width * (TIER_HEIGHT / img.height) * 2
      canvas.height = TIER_HEIGHT * 2

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const result = canvas.toDataURL('image/jpeg', 0.8)

      resolve(result)
    }
  })
}

////////////////////
// Event handlers //
////////////////////
function dragstart(e) {
  dragged = e.target
}

function drop(e) {
  if (e.target.classList.contains('tier')) {
    e.target.appendChild(dragged)
  }
  dragged = undefined
}

async function paste() {
  const clipboardContents = await navigator.clipboard.read()
  for (const item of clipboardContents) {
    if (!item.types.includes('image/png')) return

    const blob = await item.getType('image/png')
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    // TODO: display a loading indicator for loading big images
    reader.onloadend = async () => {
      spawnImage(await compressImage(reader.result))
      saveState()
    }
  }
}

///////////////////////////
// LocalStorage handlers //
///////////////////////////
function saveState() {
  const imgs = document.querySelectorAll('img')

  if (imgs.length > 0) {
    const images = [...imgs].map(img => img.src)

    localStorage.setItem('images', JSON.stringify(images))
  }
}

function loadState() {
  const images = JSON.parse(localStorage.getItem('images'))

  if (images) {
    for (let image of images) {
      spawnImage(image)
    }
  }
}