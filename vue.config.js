module.exports = {
  publicPath: "/hssb/",

  pwa: {
    name: 'HS Scholar Bowl',
    themeColor: '#8B0000',
    msTileColor: '#8B0000',
    manifestOptions: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      background_color: '#8B0000'
    },
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js',
    }
  }
}