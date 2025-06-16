// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  devServer: {
    port: 5175,
  },
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ['shadcn-nuxt', '@pinia/nuxt', '@sidebase/nuxt-auth'],
  auth: {
    isEnabled: true,
    baseURL: 'http://localhost:3000/api/auth',
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
        cookieDomain: 'localhost',
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
