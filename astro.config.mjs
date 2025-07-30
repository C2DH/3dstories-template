// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import chalk from 'chalk'
import dotenv from 'dotenv'
import tailwindcss from '@tailwindcss/vite'

console.log(
  chalk.bold(chalk.bgBlue('\n 3dstories Configuration')),
  chalk.gray('Loading environment variables...\n')
)

dotenv.config({
  path: [
    '.env',
    '.env.local',
    `.env.${process.env.NODE_ENV}`,
    `.env.${process.env.NODE_ENV}.local`,
  ],
  override: true,
})

const locales = process.env.I18N_LANGUAGES
  ? process.env.I18N_LANGUAGES.split(',')
  : ['en']
const defaultLocale = process.env.I18N_DEFAULT_LOCALE || 'en'
const base = process.env.PUBLIC_BASE || ''
console.log(chalk.gray('\nNODE_ENV '), chalk.bold(process.env.NODE_ENV))
console.log(chalk.gray('PUBLIC_BASE '), chalk.bold(base))
console.log(chalk.gray('I18N_LANGUAGES '), chalk.bold(locales.join(', ')))
console.log(chalk.gray('I18N_DEFAULT_LOCALE '), chalk.bold(defaultLocale))

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  base,
  i18n: {
    locales,
    defaultLocale,
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: { plugins: [tailwindcss()] },
})

console.log()
