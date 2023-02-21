import postApi from './api/postAPI'
import { initPagination, initSearch, renderPostList, renderPagination, toask } from './utils'

// create function handleFilterChange
async function handleFilterChange(filterName, filterValue) {
  // vì khi fetch api thì sẽ có khả năng gây lỗi, nên sẽ sử dụng try catch
  try {
    // update query params into URL
    const url = new URL(window.location)
    // url.searchParams.set(filterName, filterValue)

    // bài cuối : nếu có filterName được truyền thì mình mới set giá trị cho URL
    if (filterName) url.searchParams.set(filterName, filterValue)

    // bài 246: reset page khi có filter input
    if (filterName === 'title_like') url.searchParams.set('_page', 1)

    history.pushState({}, '', url)

    // fetch Api
    // re-rendener Post list
    const { data, pagination } = await postApi.getAll(url.searchParams)

    // function renderPostList
    renderPostList('postList', data)

    // function render pagination
    renderPagination('Pagination', pagination)
  } catch (error) {
    console.log('faild to fetch post list', error)
  }
}

function registerPostDeleteEvent() {
  document.addEventListener('post-delete', async (event) => {
    // call api to api remove
    // fetch api to reload
    try {
      // sử dụng confirm
      const post = event.detail
      const message = `Are you sure to remove "${post.title}"?`
      if (window.confirm(message)) {
        await postApi.remove(post.id)
        await handleFilterChange()

        toask.success('Remove post successfully!')
      }
    } catch (error) {
      console.log('faild to remove this post', error)
      toask.error(error.message)
    }
  })
}

;(async () => {
  try {
    // create init query params
    const url = new URL(window.location)

    // update search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

    history.pushState({}, '', url)
    const queryParams = url.searchParams

    // create function registerPostDeleteEvent
    registerPostDeleteEvent()

    // khởi tạo giá trị ban đầu cho phần phân trang
    initPagination({
      elementId: 'Pagination',
      defaultParams: queryParams,
      onChange: (page) => {
        handleFilterChange('_page', page)
      },
    })

    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => {
        handleFilterChange('title_like', value)
      },
    })

    // khởi tạo giá trị ban dầu cho url
    // initURL()

    // const queryParams1 = {
    //   _page: 1,
    //   _limit: 6,
    // }

    // get queryParams in URL search
    // const queryParmas = new URLSearchParams(window.location.search)

    // set default query params when not exit params

    const { data, pagination } = await postApi.getAll(queryParams)
    // console.log(data)
    // function renderPostList
    renderPostList('postList', data)

    // function render pagination
    renderPagination('Pagination', pagination)

    console.log('pagination', pagination)
  } catch (error) {
    console.log('getAll failed', error)
  }
})()
