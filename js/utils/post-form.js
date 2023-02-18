import { randomNumber, setBackgroundImage, setTextContent, setValueInputForm } from './common'
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
    // imageUrl: yup.required('please random image background'),
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
    // console.log(error.name)
    // console.log(error.inner)

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
        // console.log(errorLog)
      }
    }
  }

  // add validated class in element
  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')
  return isValid
}

// create function showSubmitForm
function showSubmitForm(form) {
  const elementSave = form.querySelector('[name="save"]')
  if (!elementSave) return

  elementSave.disabled = true
  elementSave.textContent = 'Saving...'
}

// create function hideSubmitForm
function hideSubmitForm(form) {
  const elementSave = form.querySelector('[name="save"]')
  if (!elementSave) return

  elementSave.disabled = false
  elementSave.textContent = 'Save'
}

// create function randomBackground
function initRandomImage(form) {
  const buttonRandom = document.getElementById('postChangeImage')
  if (!buttonRandom) return

  buttonRandom.addEventListener('click', () => {
    //tạo imageURL
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`

    //set background bằng imageURL, và cho inputHiden
    setValueInputForm(form, '[name="imageUrl"]', imageUrl)

    // set background image
    setBackgroundImage(document, '#postHeroImage', imageUrl)
  })
}

// create function renderImageSourceControl
function renderImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll('[data-id="imageSource"]')
  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue
  })
}

// create function initRadioImageSource, hàm này có chức năng ẩn hiện các control tương ứng của khi chọn radio
function initRadioImageSource(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]')
  radioList.forEach((radio) => {
    radio.addEventListener('change', (event) => renderImageSourceControl(form, event.target.value))
  })
}

// create function initUploadImage , hàm này có chức năng lấy hình ảnh từ input và set vào background
function initUploadImage(form) {
  const uploadImage = form.querySelector('[name="image"]')
  uploadImage.addEventListener('change', (event) => {
    const file = event.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setBackgroundImage(document, '#postHeroImage', imageUrl)
    }
  })
}

export function initPostForm({ formId, defaultValue, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  // set form value
  setFormValues(form, defaultValue)

  let isSubmiting = false

  // init events
  initRandomImage(form)
  initRadioImageSource(form)
  initUploadImage(form)

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    // phần kiểm tra này dùng để ngăn chặn việc click nhiều lần
    if (isSubmiting) return

    showSubmitForm(form)
    isSubmiting = true

    const formValues = getFormValues(form)

    // trường hợp edit post thì sẽ lấy id từ defaultValue gán vào formValues
    formValues.id = defaultValue.id

    // hàm validatePostForm này trả về giá trị true hoặc false, Nếu là false thì đang có lỗi, khi submit thì sẽ ko làm gì.
    // lý do hàm callback lại sử dụng async await
    // hàm validatePostForm trả về promise, mà promise là truethy. Mà phủ định của truethy là false. nên nó luôn return (không làm gì)
    // if (!validatePostForm(form, formValues)) return
    const isValid = await validatePostForm(form, formValues)
    if (isValid) await onSubmit?.(formValues)

    // lý do phải thêm await vào là vì hàm callBack của onSubmit là hàm async và phải để cho nó chạy xong thì mới chạy tiếp hàm hideSubmitForm
    hideSubmitForm(form)
    isSubmiting = false
  })
}
