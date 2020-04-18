const TITLE = 'zooness card | 名刺背景'
const DESCRIPTION =
    'Zoomの背景として使える名刺画像が作れます。効率的なリモートコミュニケーションを！'
const ogimg = './assets/img/default.png'
module.exports = {
    mode: 'universal',

    server: {
        host: '0.0.0.0',
    },

    buefy: {
        materialDesignIconsHRef: 'https://cdn.materialdesignicons.com/3.5.95/css/materialdesignicons.min.css',
    },

    /*
     ** Headers of the page
     */
    head: {
        title: TITLE,
        htmlAttrs: {
            lang: 'ja',
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            {
                name: 'google-site-verification',
                content: '_-HvhB5GiHtwT79ip4cX_1Ts6oSl5XeJ2fsAJhW9POc',
            },
            {
                hid: 'description',
                name: 'description',
                content: DESCRIPTION,
            },
            {
                name: 'theme-color',
                content: '#FCDB00',
            },
            {
                property: 'og:site_name',
                content: TITLE,
            },
            {
                hid: 'og:title',
                name: 'og:title',
                content: TITLE,
            },
            {
                hid: 'og:description',
                name: 'og:description',
                content: DESCRIPTION,
            },
            {
                property: 'og:image',
                content: ogimg,
            },
            {
                name: 'twitter:card',
                content: 'summary_large_image',
            },
            {
                name: 'twitter:image',
                content: ogimg,
            },
        ],
        link: [
            { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css?family=Lato:300,700|Noto+Sans+JP:300,700',
            },
        ],
    },

    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#fff' },

    /*
     ** Global CSS
     */

    /*
     ** Plugins to load before mounting the App
     */
    plugins: [],

    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        // '@nuxtjs/axios',
        // Doc: https://buefy.github.io/#/documentation
        ['nuxt-buefy', { css: false }],
        // '@nuxtjs/pwa',
        '@nuxtjs/style-resources',
    ],
    styleResources: {
        scss: ['~/assets/style.scss'],
    },
    /*
     ** Axios module configuration
     */
    axios: {
        // See https://github.com/nuxt-community/axios-module#options
    },

    /*
     ** Build configuration
     */
    build: {
        /*
         ** You can extend webpack config here
         */
        extend(config, ctx) {

            const svgRule = config.module.rules.find((rule) => rule.test.test('.svg'))
            svgRule.test = /\.(png|jpe?g|gif|webp)$/i

            config.module.rules.push({
                test: /\.svg$/,
                loader: 'vue-svg-loader',
            })
        },
    },
}
