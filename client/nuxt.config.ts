// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  devServer: {
    port: 5176,
  },
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ['shadcn-nuxt', '@pinia/nuxt', '@sidebase/nuxt-auth'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL,
    },
  },
  auth: {
    isEnabled: true,
    baseURL: process.env.NUXT_PUBLIC_API_BASE_URL + '/auth',
    provider: {
      type: 'local',
      pages: {
        login: '/login',
      },
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signOut: { path: '/logout', method: 'post' },
        signUp: { path: '/register', method: 'post' },
        getSession: { path: '/session', method: 'get' },
      },
      token: {
        signInResponseTokenPointer: '/token',
        type: 'Bearer',
        cookieName: 'auth.token',
        headerName: 'Authorization',
        maxAgeInSeconds: 60 * 60 * 24,
        sameSiteAttribute: 'strict',
        cookieDomain:
          process.env.NODE_ENV === 'production'
            ? process.env.COOKIE_DOMAIN
            : 'localhost',
        secureCookieAttribute: true,
        httpOnlyCookieAttribute: false,
      },
      session: {
        dataType: {
          user: {
            id: 'string',
            name: 'string',
            surname: 'string',
            email: 'string',
            phone: 'string',
          },
        },
        dataResponsePointer: '/',
      },
    },
    sessionRefresh: {
      enablePeriodically: false,
      enableOnWindowFocus: true,
    },
    globalAppMiddleware: {
      isEnabled: true,
      addDefaultCallbackUrl: false,
    },
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },
});
