// 批量修改字段
<template>
  <div v-loading="loading" class="d-flex">
    <div class="left-list flex-shrink-0">
      <el-table :data="items" class="g-table" border stripe row-key="id">
        <el-table-column label="SPU/SKU">
          <template slot-scope="{row,$index}">
            <el-tooltip :content="row.productName.slice(0,100)" placement="right">
              <div class="text-truncate remove-code">
                <el-button icon="el-icon-close" type="text" title="移除" @click="$emit('remove',$index)" />
                {{ row.productCode }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="flex-grow-1">
      <div v-if="checked.length===0" class="text-muted text-center" style="margin-top:15rem">提示：请在右侧选择需要修改的字段</div>
      <el-form ref="form" :model="form" :rules="rules" size="mini" class="form-col" label-width="150px">
        <el-row>
          <component :is="formItems[item.component]" v-for="item of checked" :key="getKey(item.prop)" :form="form" v-bind="item" />
        </el-row>
        <el-row v-show="checked.length>0" class="mb-2">
          <el-col class="text-center">
            <el-button type="primary" size="mini" @click="submit">保存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="right-list flex-shrink-0">
      <div class="mb-2">
        <el-button size="mini" type="primary" @click="$emit('change-tab',0)">批量修改属性</el-button>
      </div>
      <div class="border-bottom lh-lg mb-2 d-flex justify-content-between">
        <span class="fw-bold">待选字段：</span>
        <el-checkbox v-model="all" :indeterminate="indeterminate" @change="checkedAll">{{ all?'反选':'全选' }}</el-checkbox>
      </div>
      <el-checkbox-group v-model="checked">
        <div v-for="item in fields" :key="getKey(item.prop)" class="my-1">
          <el-checkbox :label="item">{{ item.label }}</el-checkbox>
        </div>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
import formItems from '../formItems/index'
import { fields } from './data'
import { saveSxuFields } from '@/api/batchModifySPUSKU'

export default {
  props: {
    items: Array
  },
  data() {
    return {
      loading: false,
      fields,
      formItems,
      checked: [],
      form: {},
      all: false,
      rules: {}
    }
  },
  computed: {
    indeterminate() {
      return this.checked.length > 0 && this.checked.length !== this.fields.length
    }
  },
  watch: {
    checked(val) {
      this.all = val.length > 0 && val.length === this.fields.length
      val.forEach(item => {
        if (
          this.exsitProperty(this.form, item.prop) ||
          (Array.isArray(item.prop) && this.exsitProperty(this.form, item.prop[0]))
        ) return

        if (this.form[item.prop] === undefined) {
          if (typeof item.default === 'function') {
            item.default((key, val) => {
              this.$set(this.form, key, val)
            })
          } else {
            this.$set(this.form, item.prop, item.default || '')
            if (item.component === 'editor') {
              this.$set(this.form, '__' + item.prop, item.default || '')
            }
          }
        }
      })

      for (const key in this.form) {
        // editor存储的 __prop 属性的判断
        const key2 = key.replace(/^__/, '')

        if (!val.some(item => Array.isArray(item.prop) ? item.prop.includes(key2) : item.prop === key2)) {
          delete this.form[key]
        }
      }
    }
  },
  methods: {
    exsitProperty(obj, propName) {
      return Object.prototype.hasOwnProperty.call(obj, propName)
    },
    getKey(prop) {
      return Array.isArray(prop) ? prop.join() : prop
    },
    checkedAll() {
      this.checked = this.all ? [...this.fields] : []
    },
    submit() {
      if (this.items.length === 0) return this.$message.error('没有可提交的SPU/SKU')

      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {}

          for (const key in this.form) {
            if (!/^__/.test(key)) {
              params[key] = this.form[key]
            }
          }

          params.productIds = this.items.map(({ id, productCode, type }) => {
            return { id, productCode, type }
          })

          this.loading = true
          saveSxuFields(params).then(res => {
            this.$emit('updated')
            this.$message.success(res.msg)
          }).finally(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.left-list {
  width: 140px;
  margin-right: 10px;
  border-right: 1px #eee solid;
  padding-right: 10px;
}
.right-list {
  width: 160px;
  margin-left: 10px;
  border-left: 1px #eee solid;
  padding-left: 10px;
}
</style>
