let dragged = undefined

function spawnImage(image) {
  const img = document.createElement('img')
  img.addEventListener('dragstart', dragstart)

  console.log(image)

  img.src = image
  tray.appendChild(img)
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
    reader.onloadend = () => {
      spawnImage(reader.result)
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

    localStorage.clear()
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