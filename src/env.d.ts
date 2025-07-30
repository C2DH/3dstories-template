interface ImportMetaEnv {
  readonly PUBLIC_VERSION: string
  readonly PUBLIC_GIT_COMMIT_SHA: string
  readonly PUBLIC_GIT_REMOTE: string
  readonly PUBLIC_GIT_BRANCH: string
  readonly PUBLIC_GIT_TAG: string
  readonly PUBLIC_BUILD_DATE: string
  readonly PUBLIC_BASE: string
  readonly PUBLIC_SITE_URL: string
  readonly PUBLIC_SITE_NAME: string
  readonly PUBLIC_SITE_DESCRIPTION: string
  readonly I18N_LANGUAGES: string
  readonly I18N_DEFAULT_LOCALE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
