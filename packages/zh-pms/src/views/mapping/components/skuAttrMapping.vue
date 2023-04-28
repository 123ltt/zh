<template>
  <el-card v-loading="loading || submitting" class="border card-mapping">
    <div slot="header" class="fw-bold">{{ title }}</div>
    <div v-if="errorMsg" class="text-center my-3 text-danger">{{ errorMsg }}</div>
    <template v-else>
      <div class="d-flex align-items-center">
        <span class="flex-shrink-0">{{ title }}类目</span>
        <el-input v-model="categoryName" size="mini" readonly class="mx-2" />
        <SelectList placement="left" :items="unusedPlatformAttrs" @select="onSelectPlatformAttr">
          <el-button size="mini" type="primary">添加属性</el-button>
        </SelectList>
      </div>
      <template v-if="!loading">
        <div class="mt-2">
          <el-table :data="skuList" class="g-table" border stripe size="small">
            <el-table-column label="SKU" width="120">
              <template v-slot="{row}">
                {{ row.skuCode }}
              </template>
            </el-table-column>

            <el-table-column v-for="item in headers"
                             :key="item.code"
                             width="160"
                             align="center"
            >
              <template #header>
                <!-- 平台类目下的属性 -->
                <div>
                  <span>{{ item.label }}</span>
                  <!-- <el-button icon="el-icon-close" type="text" @click="onRemove(item)" /> -->
                </div>
                <!-- sku的属性列表 -->
                <el-select v-model="item.pmsAttrId" size="mini" class="ms-2">
                  <el-option v-for="option in pmsAttrs"
                             :key="option.prop"
                             :label="option.label"
                             :value="option.prop"
                  />
                </el-select>
              </template>

              <template v-slot="{row}">
                <InputType v-if="item.pmsAttrId"
                           :value="item[skuPrefix+row.skuCode].attrValue"
                           :type="item.inputType"
                           :items="item.valueList"
                           @change="(value,inputType)=>onInputTypeChange(value,inputType,item,row)"
                           @remove="onInputTypeRemove(item,row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="text-center">
          <el-button class="my-2" size="mini" type="primary" @click="onSave">保存</el-button>
        </div>
      </template>
    </template>
  </el-card>
</template>

<script>
import { getPlatformAttrs, savePlatformAttrsBySku, getPlatformAttrsMappedBySku } from '@/api/attrMapping'
import SelectList from './selectList.vue'
import InputType from './inputType.vue'
import { deepClone } from '@/util/util'

export default {
  name: 'SkuAttrMapping',
  components: { SelectList, InputType },
  props: {
    title: String,
    // pms类目id
    pmsCategoryId: String,
    // 平台code
    platformCode: String,
    // 站点code
    siteCode: [String, Object], // 可能为null
    /** @type {ZHKJ.VueProps<{id:string; skuCode:string; spuCode:string; title:string; [attrId:string]:string}[]>} */
    skuList: Array,
    /** @type {{prop:string; label:string;}[]} */
    pmsAttrs: Array
  },
  data() {
    return {
      skuPrefix: '__SKU__', // 自定义前缀，方便后续从对象中过滤出SKU的配置值
      loading: true,
      submitting: false, // 是否正在保存中
      pcCode: '', // 平台类目code
      categoryName: '', // 平台类目名称
      headers: [],
      platformAttrs: [], // 平台类目下所有的属性
      submitData: [], // 将要提交的数据（目前接口是全量更新，所以不管已设置的值有没有修改都需要传入）
      cacheSkus: [], // 缓存当前已有的sku，使得下次skuList变化时能获取到新增或减少的sku
      errorMsg: ''
    }
  },
  computed: {
    unusedPlatformAttrs() {
      return this.platformAttrs.filter(item => !item.used)
    }
  },
  watch: {
    // SkuListWithAttr组件 添加或移除 属性时，更新已选的pms属性
    pmsAttrs(pmsAttrs) {
      this.headers.forEach(item => {
        if (!pmsAttrs.some(el => el.prop === item.pmsAttrId)) {
          item.pmsAttrId = ''
          // 同时清空sku的配置
          Object.keys(item).forEach(k => {
            if (k.startsWith(this.skuPrefix)) {
              item[k] = {}
            }
          })
        }
      })
    },
    skuList(skuList) {
      // 得到新增的sku，并只更新新增的sku
      const skus = skuList.map(item => item.skuCode)
      if (skus.length > this.cacheSkus.length) {
        this.loading = true
        const newSkus = skus.filter(item => !this.cacheSkus.some(el => el === item))
        this.updateData(newSkus)
        this.cacheSkus.push(...newSkus)
      }
    }
  },
  created() {
    this.cacheSkus = this.skuList.map(item => item.skuCode)
    this.getData()
  },
  methods: {
    // 还原最新默认值
    reset() {
      this.loading = true
      this.submitting = false
      this.headers = []
      this.platformAttrs = []
      this.submitData = []
      this.getData()
    },
    // 获取已映射的关系
    getMapped(skuCodes) {
      if (skuCodes.length === 0) return Promise.resolve([])
      return getPlatformAttrsMappedBySku({
        categoryId: this.pmsCategoryId,
        productSkus: skuCodes,
        platformCode: this.platformCode,
        siteCode: this.siteCode
      }).then(res => res.data).catch(() => [])
    },
    getData() {
      const skuCodes = this.skuList.map(item => item.skuCode)
      const p = [
        this.getMapped(skuCodes),
        // 获取平台属性列表等信息
        getPlatformAttrs({
          categoryId: this.pmsCategoryId,
          platformCode: this.platformCode,
          siteCode: this.siteCode,
          needAttributeValue: true
        }).catch(err => {
          this.errorMsg = err.message
          return null
        })
      ]

      Promise.all(p).then(([mappedList, attrsInfo]) => {
        if (!attrsInfo) return
        this.categoryName = attrsInfo.pcCategoryNamePath
        this.pcCode = attrsInfo.pcCode

        this.platformAttrs = attrsInfo.publishAttr.map(item => {
          const d = mappedList.find(el => el.publishAttrCode === item.code)

          // 根据当前的平台类目属性 获取 已绑定的sku code 与 平台类目属性值 的对应关系
          const skuCodeToPlatformAttrValue = {}
          this.skuList.forEach(el => {
            skuCodeToPlatformAttrValue[this.skuPrefix + el.skuCode] = {
              attrValue: ''
            }
          })
          mappedList.forEach(el => {
            if (el.publishAttrCode === item.code) {
              skuCodeToPlatformAttrValue[this.skuPrefix + el.productSku] = {
                id: el.id,
                attrValue: JSON.parse(el.publishAttrValue)
              }
            }
          })

          const data = {
            ...skuCodeToPlatformAttrValue, // 将已绑定的sku合并到对象中
            savedItemId: d ? d.id : null,
            label: item.attributeName,
            code: item.code, // 平台类目属性code（具有该数据的唯一性）
            inputType: item.attributeValueType || 'check_box',
            valueList: (item.attributeValues || []).map(item => {
              let attrLabel = item.attributeValue
              try {
                attrLabel = JSON.parse(attrLabel).zh
              } catch (err) {}
              return {
                code: item.attributeValueCode,
                label: attrLabel
              }
            }), // 属性取值列表
            pmsAttrId: d ? d.attrId : '', // pmsAttrId, 回显 类目属性 绑定的 pms属性
            used: !!d // 用于记录该属性是否被使用
          }

          if (d) {
            this.headers.push(deepClone(data))
          }

          // 备份原始数据（不要随意更改raw中的数据）
          data.raw = deepClone(data)

          return data
        })
      }).finally(() => {
        this.loading = false
      })
    },
    // 增量更新数据
    updateData(newSkus) {
      this.getMapped(newSkus).then(mappedList => {
        this.platformAttrs.forEach(item => {
          const skuCodeToPlatformAttrValue = {}
          newSkus.forEach(el => {
            const k = this.skuPrefix + el
            const d = mappedList.find(m => m.publishAttrCode === item.code)
            if (d) {
              skuCodeToPlatformAttrValue[k] = {
                id: d.id,
                attrValue: JSON.parse(d.publishAttrValue)
              }
            } else {
              skuCodeToPlatformAttrValue[k] = { attrValue: '' }
            }
          })
          Object.assign(item, skuCodeToPlatformAttrValue)
          Object.assign(item.raw, skuCodeToPlatformAttrValue)

          const headerItem = this.headers.find(h => h.code === item.code)
          if (headerItem) {
            Object.assign(headerItem, skuCodeToPlatformAttrValue)
          }
        })
      }).finally(() => {
        this.loading = false
      })
    },
    onSelectPlatformAttr(data, status) {
      data.used = status
      if (status) {
        const obj = {}

        // 如果存在回显值，但在pmsAttrs中不存在，则清空回显的值
        if (data.pmsAttrId) {
          if (!this.pmsAttrs.some(item => item.prop === data.pmsAttrId)) {
            obj.pmsAttrId = ''
            Object.keys(data.raw).forEach(k => {
              if (k.startsWith(this.skuPrefix)) {
                obj[k] = { attrValue: '' }
              }
            })
          }
        }
        this.headers.push(Object.assign(deepClone(data.raw), obj))
      } else {
        const index = this.headers.findIndex(item => item.code === data.code)
        this.headers.splice(index, 1)
      }
    },
    onRemove(itemData) {
      this.platformAttrs.some(item => {
        if (item.code === itemData.code) {
          item.used = false
          return true
        }
      })

      const index = this.headers.findIndex(item => item === itemData)
      this.headers.splice(index, 1)
      this.submitData = this.submitData.filter(item => {
        return item.publishAttrCode !== itemData.code
      })
    },
    /**
     * data 平台属性 选择的值
     * inputType 平台属性 的取值类型(查看inputType组件)
     * headerItem 当前操作列的数据
     * row 当前操作行的数据
     */
    onInputTypeChange(data, inputType, headerItem, row) {
      const k = this.skuPrefix + row.skuCode
      headerItem[k].attrValue = data // 保存设置的平台属性值
      const d = {
        id: headerItem[k].id, // 编辑有值，新增为undefined
        attrId: headerItem.pmsAttrId, // pms的attrId
        categoryId: this.pmsCategoryId,
        pcCode: this.pcCode,
        platformCode: this.platformCode,
        siteCode: this.siteCode || '',
        productSku: row.skuCode,
        productSpu: row.spuCode,
        publishAttrCode: headerItem.code,
        publishAttrValue: JSON.stringify(data)
      }

      const index = this.submitData.findIndex(item => {
        return item.productSku === d.productSku && item.publishAttrCode === d.publishAttrCode
      })

      if (index > -1) {
        this.submitData.splice(index, 1, d)
      } else {
        this.submitData.push(d)
      }
    },
    onInputTypeRemove(headerItem, row) {
      const index = this.submitData.findIndex(item => {
        return item.publishAttrCode === headerItem.code && item.productSku === row.skuCode
      })
      if (index > -1) this.submitData.splice(index, 1)
    },
    onSave() {
      if (this.submitData.length === 0) return this.$message.error('没有可保存的内容')

      this.submitting = true
      savePlatformAttrsBySku(this.submitData).then(res => {
        this.reset()
        this.$message.success(res.msg)
      }).finally(() => {
        this.submitting = false
      })
    }
  }
}
</script>
