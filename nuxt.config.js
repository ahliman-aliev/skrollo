module.exports = {
  mode: "universal",
  performance: {
    gzip: false
  },
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "Skrollo",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [
      { rel: "icon", type: "image/png", href: "/icon.png" },
      { rel: "stylesheet", href: "/bootstrap/css/bootstrap.css" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Open+Sans&display=swap"
      }
      // { rel: 'stylesheet', href: '/css/style.css' }
    ],
    script: [
      { src: "/bootstrap/js/bootstrap.js" },
      {
        src:
          "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js"
      },
      { src: "https://code.jquery.com/jquery-3.3.1.slim.min.js" },
      { src: "https://kit.fontawesome.com/a9348fbdc8.js"}
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/disqus",
    "~/plugins/clickoutside",
    "~/plugins/masonry",
    "~/plugins/vuevisual",
    "~/plugins/moment",
    '~/plugins/validate',
    { src: "~/plugins/google", mode: "client" },
    { src: "~/plugins/lazyyoutube", mode: "client" },
    { src: "~/plugins/infinite-scroll", mode: "client" },
    { src: "~/plugins/scrollvue", mode: "client" }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    "bootstrap-vue/nuxt",
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    // '@nuxtjs/auth',
    "@nuxtjs/pwa",
    // Doc: https://github.com/nuxt-community/dotenv-module
    "@nuxtjs/dotenv",
    ["@nuxtjs/google-tag-manager", { id: "GTM-PZXPNQQ" }],   
    ['nuxt-segment-analytics', { id: "pxMoUTeFVkBpwmcbxaehUJVMb8weALFD", useRouter: true }]
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    // baseURL: process.env.API_URI || "http://localhost:3000/"
    // baseURL: process.env.API_BASE || 'http://localhost:5000',
    proxy: true
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  serverMiddleware: [
    '~/server/body',
    '~/server/session',
    '~/server/csrf',
    '~/server/auth',
    '~/server/api'
  ],
};
