import postApi from './api/postAPI'
import { initPostForm } from './utils'

// create function handleSubmitForm
// gọi api thì phải async , await. try catch
async function handleSubmitForm(formValues) {
  console.log('submit', formValues)
  // kiểm tra xem đó là add hay edit
  // cách 1 : dựa vào search params trên url
  // cách 2 : dựa vào formValues.id, nếu có id thì là edit, không có là add // thực hiện cách 2
  try {
    let savePost = null

    savePost = formValues.id ? await postApi.update(formValues) : await postApi.add(formValues)

    // hiển thị thông báo thành công add hay edit
    // redirect tới trang detail post
    window.location.assign(`/post-detail.html?id=${savePost.id}`)
  } catch (error) {
    console.log('failed to save post', error)
  }
}

;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')

    const defaultValue = Boolean(postId)
      ? await postApi.getById(postId)
      : {
          author: '',
          description: '',
          imageUrl: '',
          title: '',
        }

    initPostForm({
      formId: 'postForm',
      defaultValue,
      onSubmit: handleSubmitForm,
    })
  } catch (error) {
    console.log('failed to fetch post data', error)
  }
})()
