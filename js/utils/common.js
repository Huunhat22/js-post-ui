// function to set content for element
export function setTextContent(parent, selector, text) {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (element) element.textContent = text
}

// function to set max length title of element
export function setMaxLengthTitle(maxLength, text) {
  if (text.length <= maxLength) return text

  return `${text.slice(0, maxLength - 1)}…`
}

// function to set value for input form
export function setValueInputForm(parent, selector, value) {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (element) element.value = value
}

// function to set value for input form
export function setBackgroundImage(parent, selector, imageUrl) {
  if (!parent) return

  const element = parent.querySelector(selector)

  if (element) element.style.backgroundImage = `url("${imageUrl}")`
}

// create function randomNumber
export function randomNumber(n) {
  if (n <= 0) return -1

  const number = Math.random() * n
  return Math.round(number)
}
