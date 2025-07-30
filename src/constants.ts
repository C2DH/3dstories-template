/**
 * List of available languages for internationalization (i18n)
 * example: ['en', 'fr', 'de']
 * This list can be configured via the environment variable I18N_LANGUAGES.
 */
export const AvailableLanguages =
  typeof import.meta !== 'undefined' && import.meta.env?.I18N_LANGUAGES
    ? import.meta.env?.I18N_LANGUAGES.split(',')
    : (['en'] as const)

export type AvailableLanguage = (typeof AvailableLanguages)[number]

export const DefaultLanguage: string =
  typeof import.meta !== 'undefined' && import.meta.env?.I18N_DEFAULT_LOCALE
    ? import.meta.env?.I18N_DEFAULT_LOCALE
    : 'en'

export const Basename: string =
  typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_BASE
    ? import.meta.env?.PUBLIC_BASE
    : ''

export const CanonicalUrl =
  typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_SITE_URL
    ? import.meta.env?.PUBLIC_SITE_URL
    : 'http://localhost:4321/'

export const SiteName =
  typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_SITE_NAME
    ? import.meta.env?.PUBLIC_SITE_NAME
    : '3D Stories Template'

export const SiteDescription =
  typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_SITE_DESCRIPTION
    ? import.meta.env?.PUBLIC_SITE_DESCRIPTION
    : 'A template for creating 3D stories with Astro and Three.js'
