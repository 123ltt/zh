<template>
  <el-form ref="form" :model="form" size="mini" :label-width="'150px'" class="attr-form form-col">
    <div v-if="form.property.length" class="mb-2">
      <el-button size="mini" @click="resetAttr()">属性重置</el-button>
      <load-attr :product-sku="baseProductInfo.productSpu" :is-edit="isEdit" />
      <el-button size="mini" type="primary" @click="getAttrByPlatform()">从平台获取属性</el-button>
    </div>
    <el-row v-if="form.property.length" :gutter="10" class="attr-box">
      <div v-for="(item, index) in form.property" :key="index">
        <!-- 优先展示所有的必填项，必填项不足非必填补上/超过10条折叠 -->
        <el-col v-if="isCollapse ? (!hasRequired && index < 10) || (item.required || index < 10) : true" :span="12">
          <el-row class="ms-0 me-0">
            <el-col :span="20" class="mb-0">
              <el-form-item
                :label="item.attributeName"
                :prop="'property.'+index+'.value'"
                :rules="item.required ? [{ required: true, message: '请输入'+item.attributeName, trigger: 'blur' }] : []"
              >
                <el-select v-if="item.type==='select'" v-model="item.value" class="w-100">
                  <el-option v-for="list in item.options" :key="list" :value="list" :label="list" />
                </el-select>
                <el-input v-if="item.type==='input'" v-model="item.value" placeholder="自定义属性名" />
                <!-- number输入框 -->
                <el-input v-if="item.type == 'input'&&item.number" v-model="item.value" :placeholder="&quot;item.names&quot;" class="g-w100" />
              </el-form-item>
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
import loadAttr from '../../../components/loadAttr/loadAttr.vue'
import { deepClone } from '@/util/util'
import { getCateogAttr } from '@/api/shopee/category.js'
export default {
  name: 'CategoryAttr',
  components: { loadAttr },
  props: {
    labelWidth: {
      type: String,
      default: '120px'
    },
    isEdit: Boolean,
    // 产品详细信息
    baseProductInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: false,
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
  watch: {
    'baseProductInfo.attributes'() {
      this.form.property = this.baseProductInfo.attributes.map(item => {
        return { value: item.value || item.attribute_value || '', attributeId: item.attribute_id || item.attributeId }
      })
      this.attrList = Object.assign([], this.baseProductInfo.attributes)
      this.getCateogAttr(this.baseProductInfo.categoryId, this.baseProductInfo.account, 'edit')
    }
  },
  methods: {
    resetAttr() {
      this.attrList.forEach(item => {
        item.value = ''
      })
      this.form.property = deepClone(this.attrList)
    },
    // 获取类目属性列表
    getCateogAttr(categoryId, site, type = 'add') {
      if (!categoryId) return
      const sites = site.split('.')[1].toUpperCase()
      getCateogAttr({ categoryId, site: sites }).then(res => {
        this.form.property = res.data.map((item, i) => {
          const typeObj = {
            COMBO_BOX: 'select',
            DROP_DOWN: 'select',
            TEXT_FILED: 'input'
          }
          item.type = typeObj[item.inputType]
          item.number = item.attributeType === 'float_type'
          item.options = JSON.parse(item.options)
          const obj = {
            required: item.isMandatory,
            type: item.type,
            options: item.options,
            attributeName: item.attributeName,
            attributeId: item.attributeId,
            number: item.number
          }
          if (type === 'add') {
            obj.value = ''
          } else {
            const index = this.form.property.findIndex(fitem => fitem.attributeId === item.attributeId)
            if (index > -1) {
              obj.value = this.form.property[index].value
            } else {
              obj.value = ''
            }
          }
          return obj
        })
        this.attrList = deepClone(this.form.property)
      }).finally(() => {
      })
    },
    getAttrByPlatform() {
      const { categoryId, account } = this.baseProductInfo
      this.getCateogAttr(categoryId, account)
    }
  }
}
</script>

<style lang="scss" scoped>
.attr-form{
  width: 90%;
}
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
