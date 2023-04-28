// 平台属性映射PMS属性
<template>
  <el-card class="border attr-to-attr">
    <div slot="header" class="d-flex justify-content-between align-items-center">
      <b>{{ title }}</b>
      <el-button v-if="useRemove"
                 type="text"
                 icon="el-icon-close"
                 size="mini"
                 class="ms-3"
                 title="移除该平台/站点"
                 @click="$emit('remove', params)"
      />
    </div>
    <div v-if="status===0" class="text-center text-muted">加载数据失败</div>
    <div v-else v-loading="loading">
      <div v-if="showCategoryName" class="mb-3 pb-2 text-muted">{{ title }}类目：<b>{{ platformNames }}</b></div>
      <el-form ref="form" size="mini" class="form-col label-ellipsis no-message">
        <el-row>
          <template v-for="item in keysList">
            <el-col v-if="checkShow(item)" :key="item.code" :span="12">
              <el-form-item :label="item.label" label-width="120px">
                <g-select v-model="item.attrId"
                          :items="valueAttrs"
                          key-field="id"
                          label-field="label"
                          value-field="id"
                          style="width:160px;"
                          @change="onGSelectChange"
                />
                <el-button icon="el-icon-minus" size="mini" class="ms-1" @click="onRemove(item)" />
              </el-form-item>
            </el-col>
          </template>
        </el-row>
        <div class="text-center mt-3">
          <el-button v-if="showSaveBtn" size="mini" type="primary" @click="onSave">保存</el-button>
          <SelectList ref="selectList"
                      :items="unusedKeysList"
                      placement="right"
                      @select="onCheck"
          >
            <el-button icon="el-icon-plus" size="mini" class="mx-1">添加属性</el-button>
          </SelectList>
        </div>
      </el-form>
    </div>
  </el-card>
</template>

<script>
/**
 * @typedef {ZHKJ.VueProps<{label:string;value:string}[]>} attrs
 */
import { getPlatformAttrs, savePlatformAttrsMapping, getPlatformAttrsMapping } from '@/api/attrMapping'
import { debounce } from '@/util/util'
import SelectList from './selectList.vue'

export default {
  name: 'AttrToAttr',
  components: { SelectList },
  props: {
    title: String,
    /** @type {ZHKJ.VueProps<{platformCode:string; siteCode:string; categoryId:string}>} */
    params: Object,
    /** @type {attrs} */
    valueAttrs: {
      type: Array
    },
    // 是否启用移除按钮（右上角移除按钮）
    useRemove: {
      type: Boolean,
      default: false
    },
    // 是否显示类目名称
    showCategoryName: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: true,
      status: 2, // 2加载中，1加载成功，0加载失败
      removedListId: [],
      keysList: [],
      keyword: '',
      unusedKeysList: [],
      showSaveBtn: false,
      currentBtn: 0,
      platformNames: ''
    }
  },
  watch: {
    params() {
      this.getData()
    },
    removedListId(val) {
      this.showSaveBtn = this.keysList.length !== this.unusedKeysList.length || val.length > 0
    }
  },
  created() {
    this.getData()

    const getUnusedList = debounce(this.getUnusedList)
    const unwatch = this.$watch(() => ({ list: this.keysList, keyword: this.keyword }), ({ list, keyword }) => {
      getUnusedList(list, keyword)
    })
    this.$once('beforeDestroy', unwatch)
  },
  methods: {
    getUnusedList(list, keyword) {
      this.unusedKeysList = list.filter(item => {
        const k = (keyword || '').trim()
        if (k) {
          return item.label.toLowerCase().includes(k.toLowerCase()) && !item.show
        }
        return !item.show
      })
      this.showSaveBtn = list.length !== this.unusedKeysList.length || this.removedListId.length > 0
    },
    getData() {
      Promise.all([
        getPlatformAttrs(this.params),
        getPlatformAttrsMapping(this.params)
      ]).then(([platformAttrs, mappingAttrs]) => {
        this.status = 1
        this.platformNames = platformAttrs.pcCategoryNamePath
        this.keysList = platformAttrs.publishAttr.map(item => {
          const d = mappingAttrs.find(el => el.publishAttrCode === item.code)
          const attrId = d ? d.attrId : ''
          return {
            show: !!attrId,
            label: item.attributeName,
            code: item.code,
            attrId,
            rawAttrId: attrId,
            id: d ? d.id : null
          }
        })
      }).catch((err) => {
        console.log(err)
        this.status = 0
      }).finally(() => {
        this.loading = false
      })
    },
    // 保存成功后重新获取映射关系并将映射关系更新到keysList
    updateMapping() {
      this.loading = true
      getPlatformAttrsMapping(this.params).then(mappingAttrs => {
        this.keysList.forEach(item => {
          if (item.show) {
            const d = mappingAttrs.find(el => el.publishAttrCode === item.code)
            if (d) {
              item.id = d.id
              item.rawAttrId = d.attrId
            }
          }
        })
      }).finally(() => {
        this.loading = false
      })
    },
    onCheck(item) {
      item.show = true
      this.getUnusedList(this.keysList, this.keyword)
      this.$nextTick(() => {
        this.$refs.selectList.updatePopper() // 重置popover的位置
      })
    },
    onRemove(item) {
      item.show = false
      // 如果删除的数据为已映射
      if (item.id) {
        this.removedListId.push(item.id)
        item.id = null
        item.attrId = ''
      }
      this.getUnusedList(this.keysList)
    },
    recursionComponent(ctx, next) {
      if (ctx.$options.name === 'GSelect') {
        const className = 'error-shadow'
        if (!ctx.value) {
          ctx.$el.classList.add(className)
        } else {
          ctx.$el.classList.remove(className)
        }
        next(!!ctx.value)
      } else {
        ctx.$children.forEach(item => this.recursionComponent(item, next))
      }
    },
    checkForm() {
      let notSetValueCount = 0
      this.recursionComponent(this.$refs.form, isEmpty => {
        if (!isEmpty) notSetValueCount++
      })
      return notSetValueCount
    },
    onGSelectChange() {
      this.$nextTick(() => this.checkForm())
    },
    onSave() {
      const arr = []
      if (this.checkForm() > 0) return this.$message.error('请完成选择')

      this.keysList.forEach(item => {
        if (item.attrId) {
          if (item.id && item.attrId && item.attrId !== item.rawAttrId) { // 编辑
            arr.push({ id: item.id, publishAttrCode: item.code, attrId: item.attrId })
          } else if (!item.id && item.attrId) { // 新增
            arr.push({ publishAttrCode: item.code, attrId: item.attrId })
          }
        }
      })

      if (arr.length > 0 || this.removedListId.length > 0) {
        // 确保 this.params 格式为 `{platformCode:string; siteCode:string; categoryId:string}`
        const data = Object.assign(
          { platformCode: '', siteCode: '', categoryId: '' },
          this.params,
          { attrBindList: arr, deleteIdList: this.removedListId }
        )
        this.loading = true
        savePlatformAttrsMapping(data).then(() => {
          this.removedListId = []
          this.updateMapping()
          this.$message.success('保存成功')
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.$message.error('没有可保存的内容')
      }
    },
    checkShow(item) {
      if (item.show) {
        switch (this.currentBtn) {
          case 0:
            return true
          case 1:
            return !!item.id
          case 2:
            return !item.id
        }
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.attr-to-attr ::v-deep {
  .el-card__header {
    padding: 2px 1rem !important;
  }
  .error-shadow input {
    box-shadow: 0 0 5px $--color-danger;
  }
}
</style>
