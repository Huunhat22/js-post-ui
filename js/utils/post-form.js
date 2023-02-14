import { setBackgroundImage, setTextContent, setValueInputForm } from './common'
import * as yup from 'yup'
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

// sử dụng Yup để validate
function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('please enter title'),
    author: yup
      .string()
      .required('please enter author')
      .test(
        'at-least-two-words',
        'please enter at least two words',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
  })
}

// create function set field errors
function setFieldErrors(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`)
  if (element) {
    element.setCustomValidity(error)
    // set textcontent cho class="invalid-feedback"
    setTextContent(element.parentElement, '.invalid-feedback', error)
  }
}

// create function validatePostForm
async function validatePostForm(form, formValues) {
  try {
    // reset privious errors
    ;['title', 'author'].forEach((name) => setFieldErrors(form, name, ''))

    const schema = getPostSchema()
    await schema.validate(formValues, { abortEarly: false })
  } catch (error) {
    console.log(error.name)
    console.log(error.inner)

    // cờ đánh dấu, để lấy ra mã lỗi đầu tiên
    const errorLog = {}
    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path
        // bỏ qua nếu mã lỗi đó,nếu mã lỗi đó đã được log ra
        if (errorLog[name]) continue

        // setFieldError và đánh dấu lỗi
        setFieldErrors(form, name, validationError.message)
        errorLog[name] = true
        console.log(errorLog)
      }
    }
  }

  // add validated class in element
  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')
  return isValid
}

export function initPostForm({ formId, defaultValue, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  // set form value
  setFormValues(form, defaultValue)

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const formValues = getFormValues(form)

    // hàm validatePostForm này trả về giá trị true hoặc false, Nếu là false thì đang có lỗi, khi submit thì sẽ ko làm gì.
    if (!validatePostForm(form, formValues)) return
  })
}
