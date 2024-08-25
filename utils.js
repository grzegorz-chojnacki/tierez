let dragged = undefined

// Event handlers
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
    spawnImage(blob)
  }
}

function spawnImage(blob) {
  const image = document.createElement('img')
  image.addEventListener('dragstart', dragstart)
  image.src = URL.createObjectURL(blob)

  tray.appendChild(image)
}
