const withTM = require('next-transpile-modules')([
  'recoil-outside',
  'recoil'
])
/** @type {import('next').NextConfig} */
const path = require('path')

module.exports = withTM({
  reactStrictMode: true,
  sassOptions: {
    includePaths: [
      path.join(__dirname, 'components'),
      path.join(__dirname, 'styles'),
    ],
  },
})