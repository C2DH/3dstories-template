declare module 'gltfjsx' {
  export function parse(
    gltf: any,
    options?: {
      compress?: boolean
      draco?: boolean
      root?: string
      transforms?: boolean
      instance?: boolean
      types?: boolean
      keepNames?: boolean
      precision?: number
    }
  ): string
}
