const fs = require('fs').promises
const path = require('path')

async function fileExist(filepath) {
  try {
    const stat = await fs.stat(filepath)
    return stat.isFile()
  } catch (err) {
    return false
  }
}

async function getMdContent(mdFile) {
  if (await fileExist(mdFile)) {
    const content = await fs.readFile(mdFile, 'utf-8')
    return ' - ' + content.trim().match(/# (.+)/)[1]
  }
  return ''
}

function toUpperCamelCase(str = '') {
  return str.split('-').map(el => el.replace(/^(\w)/, $1 => $1.toUpperCase())).join('')
}

;(async() => {
  const contents = []
  const rootDir = path.join(__dirname, '..')

  // global
  contents.push('# 全局组件')
  const globalDir = path.join(rootDir, 'src/components/global')
  for (const item of await fs.readdir(globalDir)) {
    const componentName = 'G' + toUpperCamelCase(item)
    const title = await getMdContent(path.join(globalDir, item, 'README.md'))
    contents.push(`- [${componentName}组件](src/components/global/${item}) ${title}`)
  }

  // import
  contents.push('\n\n# 手动引入组件')
  const importDir = path.join(rootDir, 'src/components/import')
  for (const item of await fs.readdir(importDir)) {
    if (item === 'upload') {
      for (const el of ['file', 'image']) {
        const componentName = 'Upload' + toUpperCamelCase(el)
        const title = await getMdContent(path.join(importDir, item, el, 'README.md'))
        contents.push(`- [${componentName}组件](src/components/import/${item}/${el}) ${title}`)
      }
    } else {
      const componentName = toUpperCamelCase(item)
      const title = await getMdContent(path.join(importDir, item, 'README.md'))
      contents.push(`- [${componentName}组件](src/components/import/${item}) ${title}`)
    }
  }

  await fs.writeFile(path.join(rootDir, 'README.md'), contents.join('\n'))
})()
