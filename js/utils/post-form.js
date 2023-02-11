import { setBackgroundImage, setValueInputForm } from './common'

// create function setFormValue
function setFormValues(form, defaultValue) {
  // set value for input element
  setValueInputForm(form, '[name="title"]', defaultValue.title)
  setValueInputForm(form, '[name="author"]', defaultValue.author)
  setValueInputForm(form, '[name="description"]', defaultValue.description)
  setValueInputForm(form, '[name="imageUrl"]', defaultValue.imageUrl)

  // set background image
  setBackgroundImage(document, '#postHeroImage', defaultValue?.imageUrl)
}

// create function  get form values
function getFormValues(form) {
  // cách 1 : sử dụng vòng lặp qua các name input
  const formValues = {}
  // ;['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //   // tìm element của từng name
  //   const field = form.querySelector(`[name="${name}"]`)
  //   if (field) formValues[name] = field.value
  // })

  // cách 2: sử dụng FormData
  const data = new FormData(form)
  for (const [key, value] of data) {
    formValues[key] = value
  }
  return formValues
}

export function initPostForm({ formId, defaultValue, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  // set form value
  setFormValues(form, defaultValue)

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const formValues = getFormValues(form)
    console.log(formValues)
  })
}
