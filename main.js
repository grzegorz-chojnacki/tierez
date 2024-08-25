'use strict'

const tray = document.getElementById('tray').firstElementChild

// Drop targets
document.querySelectorAll('.tier').forEach(box => {
  box.addEventListener('dragover', e => e.preventDefault())
  box.addEventListener('drop', drop)
})

document.addEventListener('paste', paste)

loadState()