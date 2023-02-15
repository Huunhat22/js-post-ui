// using toask js
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

export const toask = {
  success(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',

      style: {
        background: 'linear-gradient(to right, #4caf50, #81c784)',
      },
    }).showToast()
  },
  error(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',

      style: {
        background: 'linear-gradient(to right, #f44336, #e57373)',
      },
    }).showToast()
  },
  info(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',

      style: {
        background: 'linear-gradient(to right, #2196f3, #64b5f6)',
      },
    }).showToast()
  },
}
