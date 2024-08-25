'use strict'

const tray = document.getElementById('tray').firstElementChild

// drag targets
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('dragstart', dragstart)
})

// drop targets
document.querySelectorAll('.tier').forEach(box => {
  box.addEventListener('dragover', e => e.preventDefault())
  box.addEventListener('drop', drop)
})

document.addEventListener('paste', paste)