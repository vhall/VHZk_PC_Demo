const isProd = process.env.NODE_ENV === 'production'
module.exports = {
  cssSourceMap: !isProd,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
