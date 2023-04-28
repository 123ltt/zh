<template>
  <el-form ref="form" :model="form" size="mini" :label-width="'180px'" class="attr-form form-col">
    <div class="el-form-item tr">
      <el-button v-if="form.property.length" size="mini" @click="resetAttr()">属性重置</el-button>
      <el-button :disabled="!baseProductInfo.categoryId"
                 :loading="loading"
                 type="primary"
                 size="mini"
                 class="load-attr"
                 @click="upateCateAttr"
      >获取最新属性
        <el-tooltip class="item" effect="dark" content="根据以上所选类目从平台获取最新属性" placement="top" />
      </el-button>
      <load-attr v-if="form.property.length" :product-sku="baseProductInfo.productSpu" />
    </div>
    <el-row v-if="form.property.length" :gutter="10" class="attr-box">
      <div v-for="(item, index) in form.property" :key="index">
        <!-- 优先展示所有的必填项，必填项不足非必填补上/超过10条折叠 -->
        <el-col v-if="isCollapse ? (!hasRequired && index < 10) || (item.required || index < 10) : true" :span="12">
          <el-row class="ms-0 me-0">
            <el-col v-if="item.type == 'interval'" :span="20" class="mb-0">
              <el-form-item
                :label="item.names"
                :prop="'property.'+index+'.value'"
                :rules="item.required ? [{ required: true, message: '请输入'+item.names, trigger: 'blur' }] : []"
              >
                <el-row :gutter="4" class="ms-0 me-0">
                  <el-col :span="11" class="mb-0">
                    <el-input v-model="item.value1" class="g-w100" />
                  </el-col>
                  <el-col :span="2" class="mb-0 text-center">-</el-col>
                  <el-col :span="11" class="mb-0">
                    <el-input v-model="item.value2" class="g-w100" />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col v-else :span="20" class="mb-0">
              <el-form-item
                :label="item.names"
                :prop="'property.'+index+'.value'"
                :rules="item.required ? [{ required: true, message: '请输入'+item.names, trigger: 'change' }] : []"
              >
                <el-input v-if="item.diy" slot="label" v-model="item.name" placeholder="自定义属性名" class="g-w100 item-label text-end" />
                <!-- number输入框 -->
                <el-input v-if="item.type == 'number'" v-model="item.value" v-input.number.numeric :placeholder="item.names" class="g-w100" />
                <!-- text输入框 -->
                <el-input v-if="item.type == 'text'" v-model="item.value" :placeholder="item.names" class="g-w100" />
                <div v-if="item.type == 'checkbox'">
                  <el-checkbox-group v-if="item.valueJson.length <= 3" v-model="item.value">
                    <el-checkbox v-for="val in item.valueJson" :key="val.id" :label="val.id">{{ val.names.zh }}</el-checkbox>
                  </el-checkbox-group>
                  <el-button v-else @click="setCheckBox(item)">设置</el-button>
                </div>
                <!-- :props="{ children: 'attributes', label: 'label', value: 'id' }" -->
                <div class="d-flex">
                  <el-cascader
                    v-if="item.type == 'listbox'"
                    v-model="item.value"
                    :options="item.valueJson"
                    :props="{ label: 'label', value: 'id' }"
                    :placeholder="item.names"
                    clearable
                    :class="item.isOhter ? 'me-2' : 'g-w100'"
                    @change="(value) => listBoxChange(value, item, index)"
                  />
                  <el-input v-if="item.isOhter" v-model="item.otherValue" />
                </div>
              </el-form-item>
            </el-col>
            <el-col v-if="!item.required" :span="2" style="height:40px;min-height:40px;text-align:right" class="mb-0">
              <el-button size="mini" icon="el-icon-minus" class="icon-btn" @click="remove(index)" />
            </el-col>
            <el-col v-if="form.property.length === index + 1" :span="2" style="height:40px;min-height:40px;text-align:right" class="float-end mb-0">
              <el-button size="mini" icon="el-icon-plus" class="icon-btn" @click="addDiyAttr()" />
            </el-col>
          </el-row>
        </el-col>
      </div>
    </el-row>
    <div class="">
      <el-button v-if="(arrtLen > 10 && !hasRequired) || (noRequired && arrtLen > 10) " @click="isCollapse = !isCollapse">{{ isCollapse ? '点我展开' : '点我折叠' }}</el-button>
    </div>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
import setAttrModal from './setAttrModal.vue'
import loadAttr from '@/views/components/loadAttr/loadAttr.vue'
import { getCateogAttr, upateCateAttr } from '@/api/aliExpress/category.js'
import * as addListingHandle from './aliExpress.handle.js'
export default {
  name: 'CategoryAttr',
  components: { loadAttr },
  props: {
    labelWidth: {
      type: String,
      default: '120px'
    },
    // 产品详细信息
    baseProductInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      attrList: [],
      // 是否折叠
      isCollapse: true,
      form: {
        property: []
      },
      diyAttrList: []
    }
  },
  computed: {
    // 是否存在必填项
    hasRequired() {
      return this.form.property.find(item => item.required)
    },
    // 是否存在非必填项
    noRequired() {
      return this.form.property.find(item => !item.required)
    },
    arrtLen() {
      return this.form.property.length
    }
  },
  methods: {
    clearAttr() {
      this.attrList = []
      this.diyAttrList = []
      this.resetAttr()
    },
    resetAttr() {
      this.form.property = deepClone(this.attrList)
    },
    remove(index) {
      if (this.form.property[index].diy) {
        this.diyAttrList.shift(1)
      }
      this.form.property.splice(index, 1)
    },
    // 添加我自定义类目属性
    addDiyAttr() {
      const name = 'name' + (this.diyAttrList.length + 1)
      this.diyAttrList.push(name)
      this.form.property.push(addListingHandle.diyAttr())
    },
    // 选择下拉属性判断是否有子属性
    listBoxChange(value, item, index) {
      item.isOhter = false
      // 先删除当前属性的其他子属性
      item.valueJson.filter(o => {
        if (o.attributes) {
          o.attributes.filter(t => {
            const attributes = JSON.parse(t)
            if (attributes.attributeId === this.form.property[index + 1].attributeId) {
              this.form.property.splice(index + 1, 1)
            }
          })
        }
      })
      // 添加当前属性的当前子属性
      item.valueJson.filter(o => {
        if (o.id === value[0]) {
          if (addListingHandle.otherK.includes(o.label)) {
            item.isOhter = true
            this.$set(item, 'otherValue', '')
          }
          if (o.attributes) {
            o.attributes.forEach(t => {
              const attributes = JSON.parse(t)
              addListingHandle.setAttrItemType(attributes)
              this.form.property.splice(index + 1, 0, attributes)
            })
          }
        }
      })
    },
    // 获取类目属性列表
    getCateogAttr(categoryId, account, productAttrs) {
      if (!(categoryId && account)) {
        this.clearAttr()
        return
      }
      this.$emit('productLoadingStart')
      return new Promise((resolve, reject) => {
        getCateogAttr({ categoryId, account }).then(res => {
          this.setCateogAttrRes(res, productAttrs, resolve)
          !res.data && this.$message.error('类目属性暂无承载数据')
        }).finally(() => {
          this.$emit('productLoadingEnd')
        })
      })
    },
    setCateogAttrRes(res, productAttrs, resolve) {
      if (res.data) {
        const data = res.data || []
        const { varAttr, attrList, diyAttrList } = addListingHandle.setAttrValue(data, productAttrs, this)
        this.attrList = attrList.map(item => {
          if (item.names?.indexOf('Brand Name') > -1 && item.valueJson?.length) {
            item.value = item.valueJson[0].id
          }
          return item
        })
        this.diyAttrList = diyAttrList
        // 发货地获取仓库列表
        varAttr.find(item => {
          if (item.attributeId === 200007763) {
            const countryCode = item.valueJson.map(v => v.label)
            addListingHandle.getWareHouseList(countryCode).then(res => {
              addListingHandle.warehouse.list = res
              this.$emit('updateVarAttr', varAttr)
              resolve && resolve(1)
            })
          }
        })
      } else {
        resolve(res.msg)
      }
      this.resetAttr()
    },
    // 获取产品属性值
    getPropertyValue() {
      const property = []
      this.form.property.filter(item => {
        if (Array.isArray(item.value) ? item.value.length : item.value) {
          if (item.diy) {
            property.push({
              attrName: item.name,
              attrValue: item.value
            })
          } else {
            const attrValue = item.isOhter && item.otherValue ? item.otherValue : undefined
            if (Array.isArray(item.value)) {
              item.value.forEach(v => {
                property.push({
                  attrNameId: item.attributeId,
                  attrValueId: attrValue ? undefined : v,
                  attrValue
                })
              })
            } else {
              if (item.type === 'text' || item.type === 'number') {
                property.push({ attrNameId: item.attributeId, attrValue: item.value })
              } else {
                property.push({ attrNameId: item.attributeId, attrValueId: attrValue ? undefined : item.value, attrValue })
              }
            }
          }
        }
      })
      return property
    },
    // checkbox选项超过3个另弹弹窗设置属性
    setCheckBox(item) {
      this.$modal({
        title: `请选择${item.names}的值`,
        component: setAttrModal,
        width: '600px',
        data: {
          data: item
        },
        callback: (value) => {
          if (value) {
            item.value = value
          }
        }
      })
    },
    // 更新属性
    upateCateAttr() {
      const { categoryId, account, productAttrs } = this.baseProductInfo
      this.$emit('productLoadingStart')
      this.loading = true
      upateCateAttr({ categoryId, account, productAttrs }).then(res => {
        res.data ? this.$message.success('同步类目属性成功') : this.$message.error('类目属性暂无承载数据')

        this.setCateogAttrRes(res)
      }).finally(() => {
        this.$emit('productLoadingEnd')
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// .attr-form{
//   width: 80%;
// }
.item-label {
  margin-top: -5px;
}
::v-deep .el-form-item__label {
    line-height: 15px;
    margin-top: 5px;
}
.load-attr{
  margin-left: 20px;
}
.el-col{
  min-height: 51px;
}
.attr-box{
  max-height: 550px;
  overflow-y: scroll;
}
.text-end{
  ::v-deep input{
    text-align: right;
  }
}
</style>
