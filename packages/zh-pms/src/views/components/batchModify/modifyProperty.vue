// 修改属性
<template>
  <div v-loading="loading">
    <div class="mb-2 d-flex justify-content-between">
      <div>
        <el-button-group size="mini">
          <el-button :type="tabindex===0?'primary':''" size="mini" @click="tabChange(0)">自选SPU/SKU</el-button>
          <el-button :type="tabindex===1?'primary':''" size="mini" @click="tabChange(1)">按类目</el-button>
        </el-button-group>
      </div>
      <div class="d-flex">
        <el-button v-if="tabindex===0" size="mini" type="primary" @click="addSxu">添加SPU/SKU</el-button>
        <CategoryCascader v-else v-model="categoryIds" show-all-levels :multiple="false" check-strictly class="mx-2" />
        <el-button v-if="list.length>0" size="mini" type="primary" @click="$emit('change-tab',1)">批量修改字段</el-button>
        <el-button v-if="list.length>0" size="mini" type="primary" @click="addAttr">添加属性</el-button>
      </div>
    </div>
    <el-table ref="table" :data="list" class="g-table w-100" stripe border row-key="id">
      <el-table-column label="SPU/SKU" prop="productCode" width="100" fixed>
        <template slot-scope="{row,$index}">
          <div class="text-truncate remove-code">
            <el-button icon="el-icon-close" type="text" title="移除" @click="removeRow($index)" />
            {{ row.productCode }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="中文名称" prop="productName" show-overflow-tooltip fixed />

      <el-table-column v-for="(item,index) in headers" :key="item.key" :prop="item.prop" :width="item.width">
        <!-- 这里不能使用slot="header"，不然插槽里面不会更新，必须使用 v-slot:header -->
        <template #header>
          {{ item.label }}
          <el-tooltip v-if="item.showRemove" content="点击移除该列" placement="top" :disabled="index>0">
            <i class="el-icon-close header-btn" @click="removeColumn(item.prop)" />
          </el-tooltip>
          <el-tooltip v-if="item.showLock" placement="top" :disabled="index>0">
            <pre slot="content" class="m-0 lh-sm">{{ getLockTip(item.lock) }}</pre>
            <i class="header-btn" :class="getLockClass(item.lock)" @click="item.lock=!item.lock" />
          </el-tooltip>
        </template>

        <template slot-scope="{row}">
          <template v-if="inputs[item.prop]">
            <el-input v-for="el in inputs[item.prop]"
                      :key="el.prop"
                      v-model="row[el.prop]"
                      v-input.number.positive
                      size="mini"
                      class="w-input"
                      :placeholder="el.placeholder"
                      @blur="onBlurRemoveTip"
                      @input="onSyncInput(item.lock,el.prop,row[el.prop])"
            />
          </template>
          <template v-else-if="row.type===2&&exsitProperty(row,item.prop)">
            <g-select v-model="row[item.prop]"
                      :items="attrsMapping[item.prop]"
                      key-field="code"
                      label-field="value"
                      value-field="code"
                      @change="onSyncInput(item.lock,item.prop,row[item.prop])"
            />
          </template>
        </template>
      </el-table-column>
      <div slot="empty">
        <div v-if="categoryIds">暂无数据</div>
        <div v-else>🙂提示：请点击右上角的<b class="mx-2 text-warning">{{ ['添加SPU/SKU','选择类目框'][tabindex] }}</b>{{ ['按钮添加数据','选择需要修改的类目'][tabindex] }}</div>
      </div>
    </el-table>
    <div class="text-center my-2">
      <el-button size="mini" type="primary" :disabled="list.length===0||loading||headers.length===0" @click="submit">保存</el-button>
      <el-button v-if="totalPage>pageindex" size="mini" @click="onNextPage">下一页</el-button>
      <el-button v-if="list.length>0" size="mini" @click="onClear">清空</el-button>
    </div>
  </div>
</template>

<script>
/**
 * @typedef {{value:string;valueEn:string;code:string}} AttrItem 规格属性取值列表项
 */
import selectSxuPanel from './selectSxuPanel/index.vue'
import selectAttrPanel from './selectAttrPanel/index.vue'
import { getSxuAttrs, saveSxuAttrs, getSxuList } from '@/api/batchModifySPUSKU'
import { logisticsAttrs, logisticsAttrsMappingProp } from './data'
import CategoryCascader from '@/components/category-cascader/index.vue'

const errorTip = 'error-tip'
export default {
  components: { CategoryCascader },
  data() {
    return {
      loading: false,
      list: [],
      headers: [],
      inputs: {
        weight: [{ placeholder: '重量', prop: 'packWeight' }],
        size: [
          { placeholder: '长', prop: 'sizeLongPack' },
          { placeholder: '宽', prop: 'sizeWidthPack' },
          { placeholder: '高', prop: 'sizeHeightPack' }
        ]
      },
      /**
       * 存储规格属性取值列表
       * @type {{[key:string]: AttrItem[]}}
       */
      attrsMapping: {},
      cacheCheckedSxu: [], // 缓存已勾选的 sxu
      cacheCheckedAttr: [], // 缓存已勾选的 规格属性
      tabindex: 0,
      categoryIds: '',
      pageindex: 1, // 按类目 的页码
      totalPage: 0, // 按类目 总页数
      currentPageIsSaved: false // 记录 按类目 当前列表是否进行保存
    }
  },
  watch: {
    list(list) {
      this.$emit('change', list)
    },
    categoryIds(ids) {
      this.resetData()
      if (ids) this.getSxuByCategory([ids])
    }
  },
  created() {
    this.initHeaders()
  },
  methods: {
    resetData() {
      this.list = []
      this.cacheCheckedSxu = []
      this.pageindex = 1
      this.totalPage = 0
      this.currentPageIsSaved = false
      this.initHeaders()
    },
    initHeaders() {
      // 默认显示物流属性
      this.headers = logisticsAttrs.map(item => this.itemDataAddProperty({ label: item.attrName, prop: item.fieldId }))
      this.cacheCheckedAttr = [...logisticsAttrs]
    },
    itemDataAddProperty(data = {}, remove = true, lock = true) {
      return Object.assign(
        {
          width: { weight: 130, size: 180 }[data.prop] || 160,
          key: String(Math.random()).slice(2) // 作为for循坏用的key. 不能使用prop做为key，使用prop会导致 initHeaders() 后不会更新
        },
        data,
        remove ? { showRemove: true, remove: false } : undefined,
        lock ? { showLock: true, lock: false } : undefined
      )
    },
    tabChange(tabindex) {
      this.tabindex = tabindex
      this.resetData()
      this.categoryIds = ''
    },
    getLockClass(status) {
      return [
        'el-icon-' + (status ? 'lock' : 'unlock'),
        status ? 'text-danger' : ''
      ]
    },
    getLockTip(status) {
      return status ? '点击解锁\n解锁后只会修改当前内容' : '点击锁定\n锁定后当前列会同步修改内容'
    },
    removeColumn(prop) {
      this.headers = this.headers.filter(item => item.prop !== prop)
      // 移除列表中相应的字段属性
      this.list.forEach(item => {
        const m = logisticsAttrsMappingProp[prop]
        if (m) {
          m.forEach(el => delete item[el])
        } else {
          delete item[prop]
        }
      })
      // 移除缓存中相应的规格属性
      this.cacheCheckedAttr = this.cacheCheckedAttr.filter(item => item.fieldId !== prop)
    },
    removeRow(index) {
      const deleted = this.list.splice(index, 1)
      this.cacheCheckedSxu = this.cacheCheckedSxu.filter(item => item.id !== deleted[0].id)
    },
    // 删除物流属性（如果物流属性被移除）
    getWillDelLogisticsFields() {
      const willDeleteLogisticsFields = []
      Object.keys(logisticsAttrsMappingProp).forEach(item => {
        if (this.headers.every(el => el.prop !== item)) {
          willDeleteLogisticsFields.push(...logisticsAttrsMappingProp[item])
        }
      })
      return willDeleteLogisticsFields
    },
    getSxuByCategory(categoryIds) {
      this.loading = true
      getSxuList({ current: this.pageindex, size: 13 }, { categoryIds, isBatchUpdated: 0 }).then(res => {
        const records = res.data.records
        this.totalPage = res.data.pages
        const params = records.map(item => {
          return {
            id: item.id,
            type: item.type,
            productCode: item.productCode,
            attrIdFieldIds: []
          }
        })
        if (params.length > 0) {
          getSxuAttrs(params).then(list => {
            this.flatAttrsToObj(list)
            this.list = list
          })
        }
      }).finally(() => {
        this.loading = false
      })
    },
    addSxu() {
      this.$modal({
        title: '选择待批量修改的SPU/SKU',
        component: selectSxuPanel,
        width: '960px',
        data: { hasChecked: this.cacheCheckedSxu },
        callback: (status, data, originCheckedData) => {
          if (!status) return
          this.cacheCheckedSxu = originCheckedData
          if (data.length === 0) {
            this.list = []
            return
          }

          // 查询条件用的字段
          const attrIdFieldIds = []
          const params = []

          this.cacheCheckedAttr.forEach(({ fieldId, attrId }) => {
            if (!logisticsAttrsMappingProp[fieldId]) {
              attrIdFieldIds.push({ fieldId, attrId })
            }
          })

          // 保留未移除的sxu
          const restList = []
          this.list.forEach(item => {
            if (data.some(el => item.id === el.id)) {
              restList.push(item)
            }
          })

          // 过滤出新增的sxu
          data.forEach(item => {
            if (this.list.length === 0 || this.list.every(el => el.id !== item.id)) {
              params.push(Object.assign({}, item, { attrIdFieldIds }))
            }
          })

          if (params.length === 0) {
            this.list = restList
          } else {
            getSxuAttrs(params).then(res => {
              this.flatAttrsToObj(res)
              const willDelFields = this.getWillDelLogisticsFields()
              if (willDelFields.length > 0) {
                res.forEach(item => {
                  willDelFields.forEach(el => delete item[el])
                })
              }

              this.list = restList.concat(res)
            })
          }
        }
      })
    },
    addAttr() {
      const productInfo = []
      const usedFieldIds = []

      this.list.forEach(({ id, type, productCode }) => {
        // 只有sku才可以添加规格属性
        if (type === 2) productInfo.push({ id, type, productCode })
      })

      this.headers.forEach(item => {
        if (logisticsAttrs.every(el => el.fieldId !== item.prop)) {
          usedFieldIds.push(item.prop)
        }
      })

      this.$modal({
        title: '选择待批量修改的属性<small class="fs-6 fw-normal text-muted">（部分的物流属性和所有规格属性集合）</small>',
        component: selectAttrPanel,
        width: '960px',
        data: { productInfo, hasChecked: this.cacheCheckedAttr },
        callback: (status, data) => {
          if (status) {
            this.cacheCheckedAttr = data
            this.updateColumnAndRow(data)
          }
        }
      })
    },
    /**
     * 更新 列（规格属性） 和  行（每条数据）
     * @param {{attrId:string;fieldId:string;attrName:string;attrs:AttrItem[]}[]} data
     */
    updateColumnAndRow(data) {
      const newProperty = [] // 新增的规格属性
      const removedProperty = [] // 删除的属性
      const attrIdFieldIds = [] // 查询条件用的字段

      data.forEach(item => {
        this.attrsMapping[item.fieldId] = item.attrs

        // 新增的属性
        if (this.headers.every(el => el.prop !== item.fieldId)) {
          newProperty.push(this.itemDataAddProperty({ label: item.attrName, prop: item.fieldId }))

          if (!logisticsAttrsMappingProp[item.fieldId]) {
            attrIdFieldIds.push({
              fieldId: item.fieldId,
              attrId: item.attrId
            })
          }
        }
      })

      // 移除去掉勾选的规格属性（即保留还剩下的规格属性，剩下的不需要查询接口）
      const keepProperty = this.headers.filter(item => {
        const exist = data.some(el => el.fieldId === item.prop)
        if (!exist) removedProperty.push(item)
        return exist
      })
      // #TODO 需要考虑一下删除数据能否公用代码（有3处地方）
      if (removedProperty.length > 0) {
        this.list.forEach(item => {
          removedProperty.forEach(el => {
            const m = logisticsAttrsMappingProp[el.prop]
            if (m) {
              m.forEach(e => delete item[e])
            } else {
              delete item[el.prop]
            }
          })
        })
      }

      // 没有新增属性则不需要请求接口
      if (newProperty.length === 0) {
        this.headers = keepProperty
        return
      }

      const params = this.list.map(({ id, type, productCode }) => {
        const d = { id, type, productCode }
        if (type === 2) {
          d.attrIdFieldIds = attrIdFieldIds // 后端说不通，所以每个sku都传入相同的 attrIdFieldIds 字段
        }
        return d
      })

      getSxuAttrs(params).then(res => {
        this.flatAttrsToObj(res)

        this.headers = keepProperty.concat(newProperty)
        this.list = res.map(item => {
          const one = this.list.find(el => el.id === item.id)

          // 删除列表中 已被删除的属性 字段
          for (const key in one) {
            if (/^\d+$/.test(key)) {
              if (!this.headers.some(el => el.prop === key)) {
                delete one[key]
              }
            }
          }
          this.getWillDelLogisticsFields().forEach(el => {
            delete one[el]
            delete item[el]
          })
          return Object.assign(item, one)
        })
      })
    },
    // 将规格属性平铺到对象中，以规格属性字段id为key
    flatAttrsToObj(res) {
      res.forEach(item => {
        if (Array.isArray(item.specAttrValueInfos)) {
          item.specAttrValueInfos.forEach(el => {
            let val = ''
            try {
              const v = JSON.parse(el.attrValue)
              val = Array.isArray(v) ? v[0] : v
            } catch (err) {}
            item[el.fieldId] = val
          })
          item.specAttrValueInfos.length = 0
          delete item.specAttrValueInfos
        }
      })
      return res
    },
    onBlurRemoveTip(e) {
      e.target.parentElement.classList.remove(errorTip)
    },
    // 递归校验输入框的值是否为空
    validate() {
      let status = true
      const recursion = ref => {
        if (['GSelect', 'ElInput'].includes(ref.$options.name)) {
          const v = ref.value
          if (v === null || v === undefined || String(v).trim() === '') {
            status = false
            ref.$el.classList.add(errorTip)
          } else {
            ref.$el.classList.remove(errorTip)
          }
          return
        }
        if (Array.isArray(ref.$children)) {
          ref.$children.forEach(recursion)
        }
      }
      recursion(this)
      return status
    },
    submit() {
      if (!this.validate()) return this.$message.error('请按提示填写完整')
      if (this.headers.length === 0) return this.$message.error('没有可保存的值')

      const fields = []
      this.headers.forEach(item => {
        const e = logisticsAttrsMappingProp[item.prop]
        if (e) {
          fields.push(...e)
        } else {
          const { fieldId, attrId } = this.cacheCheckedAttr.find(el => el.fieldId === item.prop)
          fields.push({ fieldId, attrId })
        }
      })

      const subData = this.list.map(item => {
        const { id, type, productCode } = item
        const d = { id, type, productCode }
        if (type === 2) d.specAttrValues = []
        fields.forEach(el => {
          if (typeof el === 'string') {
            d[el] = item[el]
          } else if (type === 2 && this.exsitProperty(item, el.fieldId)) {
            d.specAttrValues.push(Object.assign({}, el, { attrValue: JSON.stringify([item[el.fieldId]]) }))
          }
        })
        return d
      })

      this.loading = true
      saveSxuAttrs(subData).then(res => {
        if (this.tabindex === 0) {
          this.$message.success(res.msg)
        } else if (this.tabindex === 1) {
          this.$confirm(`${res.msg}<br/>是否继续批量修改下一页`, '操作提示', {
            type: 'success',
            dangerouslyUseHTMLString: true,
            cancelButtonText: '关闭',
            confirmButtonText: '继续下一页'
          }
          ).then(() => {
            this.resetData()
            this.getSxuByCategory([this.categoryIds])
          }).catch(() => {
            this.currentPageIsSaved = true
          })
        }
      }).finally(() => {
        this.loading = false
      })
    },
    exsitProperty(obj, propName) {
      return Object.prototype.hasOwnProperty.call(obj, propName)
    },
    onSyncInput(lock, propName, val) {
      if (lock) {
        this.list.forEach(item => {
          if (this.exsitProperty(item, propName)) {
            item[propName] = val
          }
        })
      }
    },
    doLayout() {
      // 对 Table 进行重新布局，避免没有横向滚动条时底部会留出滚动条的高度（来回切换修改属性和字段时）
      this.$refs.table.doLayout()
    },
    onClear() {
      this.list = []
      this.categoryIds = ''
    },
    onNextPage() {
      this.pageindex = this.currentPageIsSaved ? 1 : (this.pageindex + 1)
      this.getSxuByCategory([this.categoryIds])
    }
  }
}
</script>

<style lang="scss" scoped>
.header-btn {
  font-weight: 700;
  margin: 0 0.3rem;
  color: var(--color-primary);
  font-size: 1.1rem;
  cursor: pointer;
}
.w-input {
  width: 50px;
  margin: 1px;
}
.g-table ::v-deep {
  .el-input__inner {
    padding: 0 5px;
  }
  .error-tip .el-input__inner {
    border-color: $--color-danger;
  }
}
</style>
