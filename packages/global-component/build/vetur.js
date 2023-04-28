const Fs = require('fs')
const Path = require('path')
const babel = require('@babel/core')
const VueTemplateCompiler = require('vue-template-compiler')

const special = ['src/components/global/table/columnHeader.vue']

class Vetur {
  root = process.cwd()

  async build() {
    const vueFiles = await this.getGlobalComponents()
    const list = []
    for (const item of vueFiles) {
      list.push(...await this.parseVueFile(item))
    }
    await this.makefile(list)
  }

  async makefile(arr = []) {
    const tags = {}
    const attributes = {}
    arr.forEach(item => {
      tags[item.name] = {
        attributes: item.attrs.map(el => el.name),
        description: item.description
      }
      item.attrs.forEach(el => {
        attributes[item.name + '/' + el.name] = {
          description: el.description
        }
      })
    })
    await Fs.promises.writeFile(Path.join(this.root, 'vetur/tags.json'), JSON.stringify(tags, null, 2), 'utf8')
    await Fs.promises.writeFile(Path.join(this.root, 'vetur/attributes.json'), JSON.stringify(attributes, null, 2), 'utf8')
  }

  async getGlobalComponents() {
    const globalPath = Path.join(this.root, 'src/components/global')
    const files = await this.readdir(globalPath)
    return files
      .filter(item => /\/index\.vue$/i.test(item))
      .concat(...special.map(item => Path.join(this.root, item)))
  }

  async parseVueFile(filepath) {
    const code = await Fs.promises.readFile(filepath, 'utf8')
    const output = VueTemplateCompiler.parseComponent(code, { pad: 'line' })
    const ast = await babel.parseAsync(output.script.content, {
      sourceType: 'module',
      filename: 'test'
    })
    const info = []
    babel.traverse(ast, {
      ExportDefaultDeclaration: (path) => {
        path.container.forEach(item => {
          if (item.type === 'ExportDefaultDeclaration') {
            const itemInfo = {
              description: this.getComments(item),
              attrs: []
            }
            item.declaration.properties.forEach(node => {
              if (node.key.type === 'Identifier') {
                if (node.key.name === 'name' && node.value.type === 'StringLiteral') {
                  itemInfo.name = this.toKebabCase(node.value.value)
                } else if (node.key.name === 'props') {
                  // props 直接为数组形式
                  if (node.value.type === 'ArrayExpression') {
                    node.value.elements.forEach(el => {
                      if (el.type === 'StringLiteral') {
                        itemInfo.attrs.push({
                          name: el.value,
                          description: ''
                        })
                      }
                    })
                  } else if (node.value.type === 'ObjectExpression') {
                    // props 为对象形式
                    node.value.properties.forEach(node => {
                      if (node.key.type === 'Identifier') {
                        let t = ''
                        const types = this.getTypes(node)
                        if (types.length > 0) {
                          t = '类型：`' + this.getTypes(node).join(' | ') + '`。'
                        }
                        itemInfo.attrs.push({
                          name: node.key.name,
                          description: t + this.getComments(node)
                        })
                      }
                    })
                  }
                }
              }
            })
            info.push(itemInfo)
          }
        })
      }
    })
    return info
  }

  getTypes(node, types = []) {
    switch (node.value.type) {
      case 'ArrayExpression':
        node.value.elements.forEach(e => {
          if (e.type === 'Identifier') types.push(e.name)
        })
        break
      case 'Identifier':
        types.push(node.value.name)
        break
      case 'ObjectExpression':
        node.value.properties.forEach(e => {
          if (e.key.name === 'type') {
            this.getTypes(e, types)
          }
        })
        break
    }
    return types
  }

  getComments(node) {
    // CommentBlock, CommentLine
    return (node.leadingComments || []).map(item => item.value.trim()).filter(Boolean).join('\n')
  }

  toKebabCase(str = '') {
    const arr = str.split('')
    return arr.map((item, index) => {
      let prefix = ''
      if (index > 0 && /^[A-Z]$/.test(item) && arr[index - 1] !== '-') {
        prefix = '-'
      }
      return prefix + item.toLowerCase()
    }).join('')
  }

  async readdir(dirpath) {
    const getPathType = p => Fs.promises.stat(p).then(state => state.isDirectory() ? 1 : 2).catch(() => 0) // 0不存在，1文件夹，2文件

    const files = []
    const recursion = async(d) => {
      const t = await getPathType(d)
      if (t === 2) {
        files.push(d)
      } else if (t === 1) {
        const results = await Fs.promises.readdir(d)
        for (const item of results) {
          await recursion(Path.join(d, item))
        }
      }
    }

    await recursion(dirpath)
    return files
  }
}

new Vetur().build()
