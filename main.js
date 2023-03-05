import './style.css'
import javascriptLogo from './javascript.svg'
import { setupCounter } from './counter.js'
import { setupCanvas } from './game'

document.querySelector('#app').innerHTML = `
  <canvas></canvas>
  <div id="stats"></div
`

setupCanvas(document.querySelector('canvas'))
