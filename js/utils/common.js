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
