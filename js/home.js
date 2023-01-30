import axiosClient from './api/axiosClient'
import postApi from './api/postAPI'
import { setTextContent, setMaxLengthTitle } from './utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

// to use fromNow function
dayjs.extend(relativeTime)

// create function liElement
function createLiElement(post) {
  if (!post) return

  // nếu sợ bị lỗi trong quá trình tạo liElement thì sử dụng try catch
  // tìm và clone template
  // update title, description, author..
  const postTemplate = document.getElementById('postTemplate')
  if (!postTemplate) return

  const liElement = postTemplate.content.firstElementChild.cloneNode(true)
  if (!liElement) return

  // const titleElement = liElement.querySelector('[data-id="title"')
  // if (titleElement) titleElement.textContent = post.title

  // const authorElement = liElement.querySelector('[data-id="author"')
  // if (authorElement) authorElement.textContent = post.author

  // const descriptionElement = liElement.querySelector('[data-id="description"')
  // if (descriptionElement) descriptionElement.textContent = post.description

  // sử dụng hàm để hạn chế việc lặp lại
  setTextContent(liElement, '[data-id="title"]', post.title)
  setTextContent(liElement, '[data-id="author"]', post.author)
  setTextContent(liElement, '[data-id="description"]', setMaxLengthTitle(100, post.description))

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl

    // nếu mà không có thumbnail thì sẽ trickger sự kiện error để lấy thumbnail mặc định
    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=Placeholder Image'
    })
  }
  // dayjs
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`)
  // console.log('fromNow', dayjs(post.updatedAt).fromNow())

  return liElement
}

// create function render post list
function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return

  const ulElement = document.getElementById('postList')
  if (!ulElement) return

  // duyệt data và tạo thẻ liElement
  postList.forEach((post) => {
    const liElement = createLiElement(post)
    ulElement.appendChild(liElement)
  })
}

// create function render pagination
function renderPagination(pagination) {
  const ulPagination = document.getElementById('Pagination')
  if (!pagination || !ulPagination) return

  // calc totalPages
  const { _limit, _page, _totalRows } = pagination
  const totalPages = Math.ceil(_totalRows / _limit)

  // save page and totalPages in ulPagination
  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages

  // check if enable/disable previous/next links
  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled')
  else ulPagination.firstElementChild?.classList.remove('disabled')

  // check if enable/disable previous/next links
  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled')
  else ulPagination.lastElementChild?.classList.remove('disabled')
}

// create function handlePreElement click
function handlePreElement(event) {
  event.preventDefault()
  console.log('previous Click')
}

// create function handleNextElement click
function handleNextElement(event) {
  event.preventDefault()
  console.log('next Click')
}

// create function handleFilterChange
function handleFilterChange(filterName, filterValue) {
  // update query params into URL
  const url = new URL(window.location)
  url.searchParams.set(filterName, filterValue)
  history.pushState({}, '', url)

  // fetch Api
  // re-rendener Post list
}

function initPagination() {
  const ulPagination = document.getElementById('Pagination')
  if (!ulPagination) return

  const preElement = ulPagination.firstElementChild?.firstElementChild
  const nextElement = ulPagination.lastElementChild?.lastElementChild

  if (preElement) {
    preElement.addEventListener('click', handlePreElement)
  }

  if (nextElement) {
    nextElement.addEventListener('click', handleNextElement)
  }
}

// create function initURL
function initURL() {
  // create init query params
  const url = new URL(window.location)

  // update search params if needed
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

  history.pushState({}, '', url)
}

;(async () => {
  try {
    initPagination()
    initURL()
    // const queryParmas = {
    //   _page: 1,
    //   _limit: 6,
    // }

    // get queryParams in URL search
    const queryParmas = new URLSearchParams(window.location.search)

    // set default query params when not exit params

    const { data, pagination } = await postApi.getAll(queryParmas)

    // function renderPostList
    renderPostList(data)

    // function render pagination
    renderPagination(pagination)

    // console.log(data, pagination)
  } catch (error) {
    console.log('getAll failed', error)
  }
})()
