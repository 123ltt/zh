
/**
 * 表格勾选
 * @param {object} options
 * @param {string} options.ref GTable的ref名称
 * @param {string} options.checkedFiled 存储已勾选的项，对应data里面的字段
 * @param {string} [options.cbMethodName] 重构插入到 `this[options.checkedFiled]`中的数据（必须return新的数据）
 * @param {string} [options.emitName] 勾选发生变化时emit事件（未传入参数则不会emit事件）
 * @param {string} [options.uidField] 列表中唯一值字段名。默认`id`
 */
export default function(options) {
  const { ref, checkedFiled, cbMethodName, emitName, uidField = 'id' } = options
  if (!ref || !checkedFiled) throw new Error('缺少必要的参数')

  return {
    methods: {
      // 勾选
      // 用在GTable的 select 和 select-all 事件
      _onSelect(checkedList = [], row) {
        // 单个勾选
        if (row) {
          // 勾选
          if (checkedList.includes(row)) {
            this[checkedFiled].push(cbMethodName ? this[cbMethodName](row) : row)
          } else {
            // 取消勾选
            this[checkedFiled] = this[checkedFiled].filter(item => {
              return item[uidField] !== row[uidField]
            })
          }
        } else {
          // 不管全选还是反选，都将list中的项全部从checked中移除
          const rest = this[checkedFiled].filter(item => {
            // 过滤掉所有在 checked 中的 list
            return this.$refs[ref].tableList.findIndex(el => el[uidField] === item[uidField]) === -1
          })

          // 如果是全选，则将list中的项全部插入checked中
          if (checkedList.length > 0) {
            rest.push(...checkedList.map(item => cbMethodName ? this[cbMethodName](item) : item))
          }

          this[checkedFiled] = rest
        }
        emitName && this.$emit(emitName, this[checkedFiled])
      },
      // 处理勾选（根据已勾选的记录处理list列表勾选状态）(处理切换分页的勾选状态的回显)
      // 用在GTable的 rendered 事件
      _onToggleRowSelection(list = []) {
        this[checkedFiled].forEach(el => {
          const d = list.find(item => item[uidField] === el[uidField])
          d && this.$refs[ref].tableRef.toggleRowSelection(d, true)
        })
      },
      // 移除勾选项
      _unselect(row) {
        const $this = this.$refs[ref]
        const i = $this.tableList.findIndex(item => item[uidField] === row[uidField])
        if (i > -1) {
          $this.tableRef.toggleRowSelection($this.tableList[i], false)
        }

        const checkedIndex = this[checkedFiled].findIndex(item => item[uidField] === row[uidField])
        this[checkedFiled].splice(checkedIndex, 1)
        emitName && this.$emit(emitName, this[checkedFiled])
      },
      // 取消全部勾选
      _unselectall() {
        const $this = this.$refs[ref]

        $this.tableList.forEach(item => {
          $this.tableRef.toggleRowSelection(item, false)
        })
        this[checkedFiled] = []
        emitName && this.$emit(emitName, this[checkedFiled])
      }
    }
  }
}
