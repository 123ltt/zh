// 规格和类目属性信息
<template>
  <el-form ref="form"
           v-loading="loading"
           :model="form"
           class="form-col"
           size="mini"
           :disabled="disabled"
           :class="{'form-readonly':disabled}"
           label-width="140px"
           @submit.native.prevent
  >
    <el-card>
      <div slot="header" class="fw-bolder py-2">规格属性列表</div>
      <display-field-group v-model="specificationValues" :items="specificationList" uid-field="fieldId" @change="fieldChange" />
    </el-card>
    <el-card>
      <div slot="header" class="fw-bolder d-flex justify-content-between align-items-center">
        <span>类目属性列表</span>
        <el-button icon="el-icon-plus" size="mini" @click.native="addAttr($event,9,'categoryList')">添加类目属性</el-button>
      </div>
      <display-field-group v-model="categoryValues"
                           :items="categoryList"
                           uid-field="fieldId"
                           :show-remove="showRemoveHandler"
                           @change="fieldChange"
                           @remove="data=>onRemove(data,'categoryList')"
      />
    </el-card>
    <el-card>
      <div slot="header" class="fw-bolder d-flex justify-content-between align-items-center">
        <span>扩展属性列表</span>
        <el-button icon="el-icon-plus" size="mini" @click.native="addAttr($event,8,'extensionList')">添加扩展属性</el-button>
      </div>
      <display-field-group v-model="extensionValues"
                           :items="extensionList"
                           uid-field="fieldId"
                           :show-remove="showRemoveHandler"
                           @change="fieldChange"
                           @remove="data=>onRemove(data,'extensionList')"
      />
    </el-card>
    <div v-if="!disabled" class="text-center">
      <el-button :loading="submitting" type="primary" size="small" native-type="submit" @click="submit">保存</el-button>
    </div>
  </el-form>
</template>

<script>
import { saveSpecificationAndCategory } from '@/api/info'
import DisplayFieldGroup from '@/components/display-field-group/index.vue'
import ConfigureProps from '../configureProps.vue'
import { querryModifyAttr } from '@/api/propertyManagement'

export default {
  components: { DisplayFieldGroup },
  inject: ['addInfo'],
  props: {
    formData: Object,
    readonly: Boolean
  },
  data() {
    const { specificationList = [], categoryList = [], extensionList = [] } = this.formData
    return {
      form: {},
      specificationList,
      categoryList,
      extensionList,

      // 存储初始化时的ID，以便保存时可以找出哪些属性被删除
      specificationInitIds: this.getAttrIds(specificationList),
      categoryInitIds: this.getAttrIds(categoryList),
      extensionInitIds: this.getAttrIds(extensionList),

      specificationValues: [],
      categoryValues: [],
      extensionValues: [],
      submitting: false,
      loading: false
    }
  },
  computed: {
    disabled() {
      return this.readonly || this.formData.ifCanUpdate === false
    }
  },
  methods: {
    getAttrIds(arr) {
      return arr.map(item => item.attributeId)
    },
    fieldChange(obj) {
      this.form = Object.assign({}, this.form, obj)
    },
    onRemove(data, fieldName) {
      // 移除属性时，需手动移除对应的list中的项
      this[fieldName] = this[fieldName].filter(item => {
        if (Array.isArray(data)) {
          return !data.some(el => el.attributeId === item.attributeId)
        } else {
          return item.attributeId !== data.attributeId
        }
      })
    },
    submit() {
      if (this.submitting) return
      this.$refs.form.validate(valid => {
        if (valid) {
          // 获取移除的属性
          const removedAttrIdList = []
          this.categoryInitIds.forEach(id => {
            if (!this.categoryValues.some(item => item.attributeId === id)) {
              removedAttrIdList.push(id)
            }
          })
          this.extensionInitIds.forEach(id => {
            if (!this.extensionValues.some(item => item.attributeId === id)) {
              removedAttrIdList.push(id)
            }
          })

          this.submitting = true
          saveSpecificationAndCategory({
            productId: this.formData.id,
            attrIdList: [...new Set(removedAttrIdList)],
            lstAttr: [...this.specificationValues, ...this.categoryValues, ...this.extensionValues]
          }).then(res => {
            // 保存成功后重新缓存当前的id
            this.categoryInitIds = this.getAttrIds(this.categoryList)
            this.extensionInitIds = this.getAttrIds(this.extensionList)

            this.$message.success(res.msg)
          }).finally(() => {
            this.submitting = false
          })
        }
      })
    },
    addAttr(ev, attrType, listFieldName) {
      const relationList = []
      this[listFieldName].forEach(item => {
        // 过滤重复的属性（多字段属性）
        if (!relationList.some(el => el.attrId === item.attributeId)) {
          relationList.push({
            attrId: item.attributeId,
            attrName: item.attrName,
            attrType: item.attrType
          })
        }
      })
      this.$modal({
        title: ev.target.textContent,
        component: ConfigureProps,
        data: {
          relationList,
          myData: { id: this.addInfo.id },
          attrType,
          type: this.addInfo.itype + 1 // src/views/pms/addInfo/index.vue 与 src/views/pms/configureProps.vue 中的type
        },
        width: '900px',
        callback: (status, attrIds) => {
          if (status) {
            this.doChanged(attrIds, listFieldName)
          }
        }
      })
    },
    // 处理属性变更
    doChanged(attrIds, listFieldName) {
      const added = []
      const removed = []

      // 获取删除的属性
      this[listFieldName].forEach(item => {
        if (!attrIds.includes(item.attributeId)) {
          removed.push(item.attributeId)
        }
      })

      // 获取新增的属性
      attrIds.forEach(item => {
        if (!this[listFieldName].some(el => el.attributeId === item)) {
          added.push(item)
        }
      })

      this.loading = true
      querryModifyAttr(added).then(res => {
        const addedAttrs = (res.data || []).map(item => {
          item.fieldId = item.id
          return item
        })
        const kept = this[listFieldName].filter(item => !removed.includes(item.attributeId))
        kept.push(...addedAttrs)
        this[listFieldName] = kept

        // 新增的数据 保存到 formData 中，确保下次切换到该页面时数据仍在
        this.formData[listFieldName].push(...addedAttrs)
      }).finally(() => {
        this.loading = false
      })
    },
    showRemoveHandler(data) {
      return [undefined, 3].includes(data.source)
    }
  }
}
</script>
