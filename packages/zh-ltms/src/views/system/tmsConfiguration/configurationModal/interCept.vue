<template>
  <el-form ref="table" label-width="100px" size="mini" :rules="rules" :model="formData">
    <el-row :gutter="10">
      <el-col :span="23">
        <el-form-item prop="name" label="规则名称：">
          <el-input v-model.trim="formData.name" clearable placeholder="请输入规则名称" />
        </el-form-item>
      </el-col>

    </el-row>
    <el-row :gutter="10" style="padding:0 5% 0 105px;">
      <el-table :data="formData.details" border size="mini" class=" g-table g-table-dense">

        <el-table-column label="属性项" align="center">
          <span>包裹属性</span>
        </el-table-column>
        <el-table-column label="匹配条件" align="center">
          <span>包含</span>
        </el-table-column>

        <el-table-column label="属性选择" width="300px" align="center">
          <template slot-scope="slot">
            <el-cascader v-model="slot.row.propertyList"
                         :options="getPropertyList"
                         size="mini"
                         :props="options"
                         clearable
                         filterable
                         collapse-tags
                         style="width:100%"
                         @change="getCascader(slot)"
            />

          </template>
        </el-table-column>
        <el-table-column width="100" align="center">
          <template slot="header">
            <i class="el-icon-circle-plus icon-color" @click="addPeek" />
          </template>
          <template slot-scope="scope">
            <i class="el-icon-remove icon-del" @click="delPeek(scope.$index)" />
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <p />
    <el-row :gutter="10">
      <el-col :span="23" style="margin:15px 5% 0 0">
        <el-form-item prop="remark" label="备注：">
          <el-input v-model.trim="formData.remark"
                    placeholder="请输入"
                    :autosize="{ minRows: 2, maxRows: 3}"
                    show-word-limit
                    type="textarea"
                    maxlength="200"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <div style="text-align:right;margin-right:3.5rem">
      <el-button type="primary" size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" @click="saveBtn">保存</el-button>
    </div>
  </el-form>
</template>
<script>
import { getProperty } from '@/api/property'
import { AddProperty, UpdateProperty } from '@/api/interCept'
import { deepClone } from '@/util/util'
export default {
  props: {
    rows: Object,
    type: String
  },
  data() {
    return {
      flag: false,
      formData: {
        details: [],
        condition: 1
      },
      options: {
        value: 'id',
        label: 'propertyName',
        multiple: true,
        disabled: 'disabled'
      },
      getPropertyList: [],
      getPropertyListOne: [],
      conditionList: [
        { value: 2, label: '不匹配' }
      ],
      conditionalList: [
        { value: 1, label: '或者' }
      ],
      rules: {
        name: [
          { required: true, message: '渠道名称不能为空', trigger: ['blur'] }
        ]
      },
      cacheData: '[]'
    }
  },
  mounted() {
    this.getState()
  },
  methods: {
    getCascader(slot) {
      const val = slot.row.propertyList
      if (val.length) {
        const result = val.map(item => {
          return item[item.length - 1]
        })
        this.$set(this.formData.details[slot.$index], 'propertyIds', result)
      }
      const arrIds = val.map(item => {
        item = item.join('_')
        return item
      })
      this.$set(this.formData.details[slot.$index], 'propertyPathIds', arrIds)
    },
    getCascaderOne(slot) {
      if (!slot.row.propertyList.length) {
        slot.row.propertyOneList = []
        return this.$message.warning('请先选择前一个属性')
      }
      const val = slot.row.propertyOneList
      if (val.length) {
        const result = val.map(item => {
          return item[item.length - 1]
        })
        this.$set(this.formData.details[slot.$index], 'anotherIds', result)
      }
      const arrIds = val.map(item => {
        item = item.join('_')
        return item
      })
      this.$set(this.formData.details[slot.$index], 'anotherPathIds', arrIds)
      // 分割线
      const arr = slot.row.propertyList.map(item => {
        return item[item.length - 1]
      })
      const spArr = this.formData.details[slot.$index].propertyOneList.map((item, i) => {
        item.forEach(i => {
          arr.forEach(ids => {
            if (i === ids) {
              this.flag = true
              item = item.splice(i, 1)
            }
          })
        })
        return item
      })
      if (this.flag) this.$message.error('当前节点重复，无法选中')
      this.flag = false
      this.$set(this.formData.details[slot.$index], 'propertyOneList', spArr)
      // 分割线
      this.getPropertyListOne = this.getRecursion(JSON.parse(this.cacheData), this.formData.details[slot.$index].propertyList)
    },
    // 初始加载获取树节点
    getState() {
      getProperty().then(res => {
        this.getPropertyList = this.deleteChildren(res.data)
        this.cacheData = JSON.stringify(this.getPropertyList)
        this.getPropertyListOne = JSON.parse(this.cacheData)
        if (this.type === 'edit') this.getEditData(this.rows)
      })
    },
    // 编辑渲染数据
    getEditData(rows) {
      rows.details.map(its => {
        const res = its.propertyPathIds.map(item => {
          item = item.split('_')
          return item.map(i => {
            if (/^\d{1,5}$/.test(i)) {
              i = Number(i)
            }
            return i
          })
        })
        this.$set(its, 'propertyList', res)
      })
      this.formData = rows
    },
    getRecursion(datas, propertyListIds) {
      const ids = deepClone(propertyListIds)
      if (!ids.length) {
        const changeFalse = function(data) {
          data.forEach(item => {
            if (item.children) {
              item.disabled = false
              changeFalse(item.children, ids)
            } else {
              item.disabled = false
            }
          })
        }
        changeFalse(datas)
      }
      const addDisabled = function(data, ids) {
        data.some(item => {
          if (item.id === ids[0]) {
            ids.shift()
            if (ids.length === 0) {
              item.disabled = true
            } else if (Array.isArray(item.children)) {
              addDisabled(item.children, ids)
            }
            return true
          }
        })
      }

      function parentDisabled(data, p = []) {
        data.forEach(item => {
          if (item.disabled) return
          if (!Array.isArray(item.children)) return

          const arr = item.children.filter(el => el.disabled)
          if (arr.length > 0 && arr.length === item.children.length) {
            item.disabled = true
            p.reverse().forEach(el => {
              if (Array.isArray(el.children)) {
                const arr = el.children.filter(e => e.disabled)
                if (arr.length > 0 && arr.length === el.children.length) {
                  el.disabled = true
                }
              }
            })
          } else {
            parentDisabled(item.children, p.concat(item))
          }
        })
      }

      ids.forEach(item => {
        // 遍历当前节点
        addDisabled(datas, item)
      })
      parentDisabled(datas)
      return datas
    },

    // 新增数据
    addPeek() {
      const length = this.formData.details.length - 1
      const item = { propertyList: [], condition: 2, propertyOneList: [] }
      if (length < 0) {
        this.formData.details.push(item)
        return
      }
      if (!this.formData.details[length].propertyList.length) {
        this.$message.warning('请填写完信息再添加新信息')
        return
      }
      this.formData.details.push(item)
    },
    delPeek(i) {
      this.formData.details.splice(i, 1)
    },

    // 删除arr列表中索引的children为空
    deleteChildren(arr) {
      const childs = arr
      for (let i = 0; i < arr.length; i++) {
        if (childs[i].children && childs[i].children.length) {
          this.deleteChildren(childs[i].children)
        } else {
          delete childs[i].children
        }
      }
      return arr
    },
    cancel() {
      this.$parent.$emit('close', false)
    },
    saveBtn() {
      this.$refs.table.validate(valid => {
        if (valid) {
          const result = this.formData.details.map((item, i) => {
            if (item.propertyList.length === 0) {
              return true
            }
            return false
          })
          if (result.includes(true)) {
            return this.$message.error('请选择物流属性')
          }
          const ct = this.type === 'add' ? AddProperty(this.formData) : UpdateProperty(this.formData)

          ct.then(res => {
            this.$message.success(res.msg)
            this.$parent.$emit('close', true)
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.icon-color{
  font-size: 24px;
  color: dodgerblue;
}
.icon-del{
  font-size: 24px;
  color: #F56C6C;
}
::v-deep .el-cascader__search-input{
  margin:0;
  min-width:0px;
  width:0px;
  flex:0;
}
::v-deep .el-cascader__tags .el-tag{
  margin-left:3px;
  max-width: 80%;
}
</style>
