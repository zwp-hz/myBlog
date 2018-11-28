import qs from 'qs'

export default function({ $axios, redirect }) {
  $axios.onRequest(config => {
    config.baseURL = process.env.baseUrl
    config.timeout = '10000'

    if (config.method === 'post') {
      config.data = qs.stringify(config.data)
    }
  })

  $axios.onResponse(res => {
    return res.data
  })

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 404) {
      redirect('/404')
    }
  })
}
