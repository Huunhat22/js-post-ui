import postApi from './api/postAPI'
import { initPostForm } from './utils'
;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')

    const defaultValue = Boolean(postApi)
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
      onSubmit: (formValues) => {
        console.log('submit', formValues)
      },
    })
  } catch (error) {
    console.log('failed to fetch post data', error)
  }
})()
