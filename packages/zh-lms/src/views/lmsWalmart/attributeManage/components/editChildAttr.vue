<template>
  <basic-container style="min-width: 0">
    <el-form ref="dialogForm" :model="form" size="mini" label-width="120px">
      <el-form-item label="平台类目" prop="categoryName">
        {{ form.categoryName }}
      </el-form-item>
      <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch" :page-show="false">
        <el-table-column slot="index" label="序号" type="index" width="50" />
        <el-table-column slot="handler" label="设为子属性" width="150px">
          <template slot-scope="{row, $index}">
            <el-checkbox v-model="row.checked" @change="(value) => changeBox(value, $index)" />
          </template>
        </el-table-column>
      </g-table>
      <div style="text-align: right">
        <el-button size="mini" @click="cancel">取消</el-button>
        <el-button type="primary" size="mini" @click="submitDialog('dialogForm')">保存</el-button>
      </div>
    </el-form>
  </basic-container>
</template>

<script>
import { deepClone } from '@/util/util'
import { getChildAttrList, updateChildAttr, getBindAttr } from '@/api/walmart/attribute'

export default {
  name: 'EditChildAttr',
  props: {
    row: Object
  },
  data() {
    return {
      headers: [
        {
          slot: true,
          slotName: 'index'
        },
        {
          label: '属性名',
          prop: 'title'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      form: {},
      categoryNameList: [],
      compareAttrs: [], // 列表接口拿到的属性
      bindAttrs: [], // 所有可配置的属性（列表展示的属性）
      filtedData: [],
      repairAttr: [],
      repairTitle: [],
      checkedTitle: []
    }
  },
  created() {
    this.form = deepClone(this.row)
    this.categoryNameList.push(this.form.categoryName)
  },
  mounted() {
    this.$refs.table.load(1, { categoryNameList: this.categoryNameList })
  },
  methods: {
    async fetch({ current, size }, categoryNameList) {
      return await getChildAttrList({ size: '9999' }, categoryNameList).then(res => {
        this.compareAttrs = res.data.records
        return getBindAttr({ categoryName: this.form.categoryName }).then(rs => {
          this.bindAttrs = rs.data
          if (this.compareAttrs.every((item) => item.title === '')) { // 如果列表接口拿到的title为空，复选框都不勾选
            this.bindAttrs.map(list => { list.checked = false })
          } else { // 如果2个接口title有相同部分，则勾选相同项
            this.compareAttrs.map(item => {
              this.bindAttrs.map(list => {
                const title = this.Trim(list.title, 'g')// 两组数据都去掉空格并转成小写进行对比
                if (item.title.toLowerCase().split(';').indexOf(title.toLowerCase()) !== -1) {
                  list.checked = true
                }
              })
            })
          }
          return {
            records: this.bindAttrs, // 列表数据
            total: 999, // 总记录数
            size: 15 // 每页最大记录数
          }
        })
      })
    },
    // 给字符串去掉前后中间所有空格
    Trim(str, isGlobal) {
      var result
      result = str.replace(/(^\s+)|(\s+$)/g, '')
      if (isGlobal.toLowerCase() === 'g') {
        result = result.replace(/\s/g, '')
      }
      return result
    },
    // 解决属性为true但不勾选的问题
    changeBox(value, index) {
      this.bindAttrs.splice(index, 1, {
        ...this.bindAttrs[index],
        checked: value
      })
    },
    cancel() {
      this.$parent.$emit('close')
    },
    submitDialog(formName) {
      this.$refs.table.tableList.forEach(item => {
        if (item.checked) {
          this.repairAttr.push(item.attributeName)
          this.repairTitle.push(item.title)
        }
      })
      this.repairAttr = deepClone(this.repairAttr.toString().split(',').join(';'))
      this.repairTitle = deepClone(this.repairAttr.toString().split(',').join(';'))

      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { categoryName, id } = this.form
          const attributeName = this.repairAttr
          const title = this.repairTitle
          updateChildAttr({ attributeName, categoryName, id, title }).then((res) => {
            this.$message.success('操作成功')
            this.$parent.$emit('close', true)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
