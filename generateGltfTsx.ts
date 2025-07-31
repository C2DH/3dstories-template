/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs/promises'
import path from 'path'
import { GLTFLoader, DRACOLoader } from 'three-stdlib'
import { LoadingManager } from 'three'
import { createRequire } from 'module'
const { parse } = createRequire(import.meta.url)('gltfjsx')

const manager = new LoadingManager()
const gltfLoader = new GLTFLoader()
const dracoloader = new DRACOLoader()

dracoloader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
gltfLoader.setDRACOLoader(dracoloader)
// Disable workers to avoid `Worker is not defined` error:
dracoloader.setWorkerLimit(0)
// polifills
import { EventEmitter } from 'events'

class ProgressEvent extends Event {
  lengthComputable: boolean
  loaded: number
  total: number

  constructor(
    type: string,
    eventInitDict: { lengthComputable: boolean; loaded: number; total: number }
  ) {
    super(type)
    this.lengthComputable = eventInitDict.lengthComputable
    this.loaded = eventInitDict.loaded
    this.total = eventInitDict.total
  }
}

;(global as any).self = global
;(global as any).ProgressEvent = ProgressEvent
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// gltfLoader.load(url, (gltf) => {
//   const jsx = parse(gltf, optionalConfig)
// })

import chalk from 'chalk'

const rainbowTitle = (text: string) => {
  const colors = [
    chalk.bgRed,
    chalk.bgYellow,
    chalk.bgGreen,
    chalk.bgCyan,
    chalk.bgBlue,
    chalk.bgMagenta,
  ]
  return text
    .split('')
    .map((char, i) => colors[i % colors.length](char))
    .join('')
}

console.log('\n', rainbowTitle('GLTF TO TSX'), '\n')
// Helper to load a glTF file and return parsed result
const loadAndParse = async (filePath: string): Promise<string> => {
  const buffer = await fs.readFile(filePath)
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  )

  return new Promise((resolve, reject) => {
    gltfLoader.parse(
      arrayBuffer as ArrayBuffer,
      path.dirname(filePath),
      async (gltf) => {
        const jsx = await parse(gltf)
        resolve(jsx)
      },
      reject
    )
  })
}

// Main runner
const run = async () => {
  const modelsDir = path.resolve(__dirname, './models')
  const outputDir = path.resolve(__dirname, './models')

  await fs.mkdir(outputDir, { recursive: true })

  const files = await fs.readdir(modelsDir)

  for (const file of files) {
    console.log(`Processing file: ${file}`)
    if (file.endsWith('.glb')) {
      const fullPath = path.join(modelsDir, file)
      console.log(`Processing ${file}...`)

      try {
        const jsx = await loadAndParse(fullPath)
        const outputPath = path.join(outputDir, file.replace('.glb', '.tsx'))

        await fs.writeFile(outputPath, jsx, 'utf8')
        console.log(`✅ Saved: ${outputPath}`)
      } catch (err) {
        console.error(`❌ Failed to process ${file}:`, err)
      }
    }
  }
}

run()
