import axios from 'axios'
axios.defaults.baseURL = 'https://i.weread.qq.com'

function getUid (cookie) {
  let uid
  cookie.split(';').forEach(ele => {
    let [key, value] = ele.trim().split('=')
    if (key === 'wr_vid') {
      uid = Number(value)
    }
  })
  return uid
}

const headers = {
  Host: 'i.weread.qq.com',
  Connection: 'keep-alive',
  'Upgrade-Insecure-Requests': 1,
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
}

axios.interceptors.request.use(
  function (config) {
    return {
      ...config,
      headers: headers
    }
  },
  function (error) {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // if no data
    // if ('synckey' in response.data && !response.data.synckey) {
    //   return Promise.reject('no data available')
    // }
    return response.data
  },
  function (error) {
    const { response } = error
    if (response) {
      console.log(response.statusText, response.data && response.data.errmsg)
      return Promise.reject(response.data)
    } else {
      console.log('something wrong')
    }
    // return Promise.reject(error.response);
  }
)
// 获取某本书你的全部笔记
export const get_bookmarklist = bookId => {
  return axios({
    method: 'get',
    url: '/book/bookmarklist',
    params: {
      bookId
    }
  })
}
// 获取某一本书的热门划线
export const get_bestbookmarks = bookId => {
  return axios({
    method: 'get',
    url: '/book/bestbookmarks',
    params: {
      bookId
    }
  })
}
// 获取书架上的书籍列表
export const get_bookshelf = (cookie) => {
  return axios({
    method: 'get',
    url: '/shelf/friendCommon',
    params: {
      userVid: getUid(cookie)
    }
  })
}
// 获取你的所有有笔记本书单
export const get_notebooklist = () => {
  return axios({
    method: 'get',
    url: '/user/notebooks'
  })
}
// 获取某本书的详情
export const get_bookinfo = bookId => {
  return axios({
    method: 'get',
    url: '/book/info',
    params: {
      bookId
    }
  })
}

// 获取某本书的批注
export const get_reviewlist = (params, cookie) => {
  return axios({
    method: 'get',
    url: '/web/review/list',
    baseURL: 'https://weread.qq.com',
    params: {
      userVid: getUid(cookie),
      ...params
    }
  })
}
