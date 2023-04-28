<template>
  <el-form ref="form" :model="form" class="demo-form-inline form-col" :rules="rules" size="mini" label-width="100px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="店铺" prop="account">
          <el-select v-model="form.account" class="g-w100" :disabled="isEdit" @change="changeAccount">
            <el-option v-for="item in baseProductInfo.accountOption" :key="item.hiddenValue" :label="item.displayName" :value="item.displayName" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="form.listingType === 'Variation'?'SPU':'SKU'" :prop="form.listingType === 'Variation'?'productSpu':'productSku'" :rules="[{ required: true, message: `${form.listingType === 'Variation'?'SPU':'SKU'}不能为空`, tiggle: 'blur' }]">
          <div class="d-flex">
            <el-input v-if="form.listingType === 'Variation'" v-model="form.productSpu" :disabled="!form.account || isEdit" placeholder="请输入新系统SKU，只能单个输入" @blur="productBlur" />
            <el-input v-else v-model.trim="form.productSku" :disabled="!form.account || isEdit" placeholder="请输入新系统SKU，只能单个输入" @blur="productBlur" />
            <el-button :disabled="!form.account ||isEdit" class="ms-4" type="primary" @click="selectSkuModal">select</el-button>
          </div>
        </el-form-item>
      </el-col>
      <el-col v-if="form.listingType!=='Normal'" :span="12">
        <el-form-item v-loading="productLoading > 0" label="子SKU">
          <!-- 单个 -->
          <el-input v-if="form.listingType === 'Combo'" v-model="combineSkus" placeholder="请输入" :disabled="true" />
          <!-- 多个 -->
          <el-input v-else v-model="childSkus" placeholder="请输入" :disabled="true" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="来源URL" prop="landingPageUrl">
          <el-input v-model="form.landingPageUrl" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <!-- <el-col :span="12">
        <el-form-item label="品牌" prop="landingPageUrl">
          <el-input v-model="form.landingPageUrl" placeholder="请输入" />
        </el-form-item>
      </el-col> -->
      <el-col :span="12">
        <el-form-item label="UPC" prop="upc">
          <el-input v-model="form.upc" placeholder="请输入" maxlength="13" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入" show-word-limit maxlength="128" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="标签" prop="tags">
          <p class="tags-desc">{{ form.keywords }}</p>
          <el-tag v-for="(tag,index) in form.tags" :key="index" closable :disable-transitions="false" class="mb-2" @close="handleTagsClose(tag)">
            {{ tag }}
          </el-tag>
          <el-input v-if="inputTagsVisible" ref="saveTagInput" v-model="tagsInputVal" class="input-new-tag" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" />
          <el-button v-else class="button-new-tag" :disabled="form.tags.length === 10" size="small" @click="showInput">+ 添加标签</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="10" placeholder="请输入" show-word-limit />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="状态" prop="condition">
          <el-select v-model="form.condition" class="g-w100">
            <el-option v-for="item in statsOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="重量" prop="weight">
          <div class="d-flex">
            <el-input v-model="form.weight" maxlength="9" />
            <span class="ms-4">G</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="海关HS编码" prop="customsHsCode">
          <el-input v-model="form.customsHsCode" maxlength="20" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import selectSkuModal from '@/views/components/selectSkuModal/selectSkuModal.vue'
import { deepClone } from '@/util/util'
export default {
  name: 'BaseInfo',
  props: {
    // 产品详细信息
    baseProductInfo: Object,
    isVariation: Boolean,
    // 是否禁用
    isEdit: Boolean,
    // 请求详细信息加载状态
    productLoading: Number
  },
  data() {
    const validateTags = (rule, value, callback) => {
      if (value.length <= 0) {
        return callback(new Error('请选择至少一个标签'))
      } else {
        callback()
      }
    }
    return {
      statsOption: [{ label: 'NEW', value: 'NEW' }, { label: 'USED', value: 'USED' }, { label: 'REFURBISHED', value: 'REFURBISHED' }],
      form: {
        account: '',
        productSpu: '',
        landingPageUrl: '',
        productSku: '',
        customsHsCode: '',
        weight: '',
        condition: 'NEW', // 状态
        variantList: [],
        upc: '',
        title: '',
        keywords: '',
        tags: [],
        profitRate: '',
        listingType: '',
        description: '',
        customerUser: ''// 客服
      },
      listingType: '', // Listing类型 Variation Normal Combo
      inputTagsVisible: false,
      childSkus: '', // 子sku
      combineSkus: '', // combo类型 +子SKU编码
      tagsInputVal: '',
      accountOption: [],
      rules: {
        account: [{ required: true, message: '店铺不能为空', tiggle: 'change' }],
        title: [{ required: true, message: '标题不能为空', tiggle: 'blur' }],
        tags: [{ trype: 'array', validator: validateTags, required: true, message: '请选择至少一个标签', tiggle: 'change' }],
        landingPageUrl: [{ pattern: /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/, message: '请输入正确的来源URL', trigger: 'blur' }],
        description: [{ required: true, message: '备注不能为空', tiggle: 'blur' }]
      }
    }
  },
  watch: {
    baseProductInfo(oldVal, newVal) {
      const data = deepClone(this.baseProductInfo)
      Object.keys(this.form).forEach((key) => {
        this.form[key] = data[key]
      })
      this.form.weight = this.isEdit ? data.weight : data.packageWeight * 1000
      const { combineSku, skuList, listingType, wishListingVariantVOList } = this.baseProductInfo
      if (listingType === 'Variation') {
        if (this.isEdit) {
          this.childSkus = wishListingVariantVOList.map(item => item.productSku).join()
        } else {
          this.childSkus = skuList.map(item => item.productSku).join()
        }
      }
      if (combineSku) {
        const combineSkus = []
        combineSku.map(item => {
          combineSkus.push(`${item.sku}*${item.count}`)
        })
        this.combineSkus = combineSkus.join('')
      }
    },
    // 监听店铺改变
    'form.account'(val, oldVal) {
      this.form = {
        account: this.form.account,
        productSpu: '',
        landingPageUrl: '',
        productSku: '',
        customsHsCode: '',
        weight: '',
        condition: '', // 状态
        variantList: [],
        upc: '',
        title: '',
        keywords: '',
        tags: [],
        listingType: '',
        description: ''
      }
      this.childSkus = ''
      this.changeStore()
    }
  },
  methods: {
    // 手动输入sku获取详细信息
    productBlur(event) {
      const value = event.target.value
      if (value) {
        this.$emit('getSkuDetail', value)
      }
    },
    // 店铺改变调用父组件方法 来更新其他子组件
    changeStore() {
      this.$emit('exportChangeStore', 'isChange')
    },
    // 选择产品sku弹窗
    selectSkuModal() {
      this.$modal({
        title: '选择产品',
        component: selectSkuModal,
        width: '1100px',
        data: {
          platformCode: 'WH',
          account: this.form.accountCode
        },
        callback: (row) => {
          if (row) {
            const type = ['Variation', 'Normal', 'Combo']
            this.listingType = type[row.type - 1] // 是否变体
            this.$emit('getSkuDetail', row.productSku, this.listingType)
          }
        }
      })
    },
    // 切换店铺事件
    changeAccount(val) {
      this.baseProductInfo.accountOption.filter(item => {
        if (item.displayName === val) {
          // 店铺编码
          this.form.accountCode = item.candidateDisplayName
          // 店铺过来的销售利润率
          this.form.profitRate = item.publishGrossProfitRate
          this.form.customerUser = item.customerServiceId
        }
      })
      this.$emit('updateAccount', this.form)
    },

    // tag 标签处理
    showInput() {
      this.inputTagsVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
      this.$refs.form.validateField('tags') // 再次校验tag的正则
    },
    handleInputConfirm() {
      const tagsInputVal = this.tagsInputVal
      if (tagsInputVal && this.form.tags.length <= 9) {
        this.form.tags.push(tagsInputVal)
      }
      this.inputTagsVisible = false
      this.tagsInputVal = ''
    },
    handleTagsClose(tag) {
      this.form.tags.splice(this.form.tags.indexOf(tag), 1)
    }
    // tags标签 end
  }

}
</script>

<style scoped>
.el-tag{
  margin-right: 10px;
}
.el-tag + .el-tag {
  margin-right: 10px;
  margin-left: 0 !important;
}
.tags-desc{
  margin:0;
  font-size: 12px;
  color: #c0c4cc;
}
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: baseline;
  }
</style>
