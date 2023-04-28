<template>
  <div>
    <el-button size="mini" class="mb-2" type="primary" @click="setpic">设置多变体</el-button>
    <el-form ref="form" :model="form">
      <el-table :data="form.skuList.filter(item=>item.variantDraftStatus!=='delete')" border class="form-table g-table g-table-dense">
        <el-table-column label="规格名称一" align="center">
          <template slot-scope="{ row }">
            <el-form-item>
              {{ row.name1 }}
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column v-if="show" label="规格名称二" align="center">
          <template slot-scope="{ row}">
            <el-form-item>
              {{ row.name2 }}
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="SKU" align="center">
          <template slot="header">
            <div>
              <span class="has-error">SKU</span>
            </div>
          </template>
          <template slot-scope="{ row, $index }">
            <el-form-item
              :prop="'skuList.' + $index + '.productSku'"
              :rules="[{validator: validateSku}]"
              class="el-form-item_no-lable"
            >
              <div v-popover:popover>
                <el-select v-model="row.productSku" clearable filterable size="mini" placeholder="请选择" @change="setProp($index)">
                  <el-option v-for="(item, index) in skuObj.skuList" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled" />
                </el-select>
                <el-popover
                  ref="popover"
                  :disabled="!row.productSku"
                  placement="top"
                  width="200"
                  trigger="hover"
                  :content="getTitle(row)"
                />
              </div>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="零售价" align="center">
          <template slot="header">
            <div>
              <span class="has-error">零售价</span>
            </div>
            <el-button type="text" @click="openDialog(0)">批量修改</el-button>
          </template>
          <template slot-scope="{ row, $index }">
            <el-form-item
              :prop="'skuList.' + $index + '.price'"
              :rules="[{ required: true, message: '售价不能小于0'}]"
              class="el-form-item_no-lable"
            >
              <el-input v-model="row.price" v-input.positive size="mini" @change="(val)=>getResult('price',val,$index)" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="库存" align="center">
          <template slot="header">
            <div>
              <span class="has-error">库存</span>
            </div>
            <el-button type="text" @click="openDialog(1)">批量修改</el-button>
          </template>
          <template slot-scope="{ row, $index }">
            <el-form-item
              :prop="'skuList.' + $index + '.stock'"
              :rules="[{ required: true, message: '库存不能为空', trigger: 'blur' }]"
              class="el-form-item_no-lable"
            >
              <el-input v-model="row.stock" v-input.positive.numeric maxlength="4" size="mini" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="利润率" align="center">
          <template slot="header">
            <div>
              <span class="has-error">利润率</span>
            </div>
          </template>
          <template slot-scope="{ row, $index }">
            <el-form-item
              :prop="'skuList.' + $index + '.profitRate'"
              :rules="[{ required: true, message: '利润率不能为空', trigger: 'blur'}]"
              class="el-form-item_no-lable"
            >
              <el-input v-model="row.profitRate" v-input.number="[0,1]" maxlength="4" size="mini" @change="(val)=>getResult('profitRate',val,$index)" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="利润额" align="center">
          <template slot-scope="{ row }">
            <el-form-item>
              {{ row.profitPrice }}
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="成本 | 重量（kg）" align="center">
          <template slot-scope="{ row }">
            <el-form-item>
              {{ row.costPrice }} | {{ row.netWeight }}
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="运费" align="center">
          <template slot-scope="{ row }">
            <el-form-item>
              {{ row.shippingPrice }}
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24">
        <el-form-item label="产品描述" prop="description" :rules="[{ required: true, message: '产品描述不能为空'}]">
          <el-input v-model="form.description" type="textarea" show-word-limit :autosize="{ minRows: 6, maxRows: 10}" class="g-w100" />
        </el-form-item>
      </el-col>
    </el-form>
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
    >
      <g-list-group-item :label="`批量修改${name}为`">
        <el-input v-model="returnVal" size="mini" />
      </g-list-group-item>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="()=>{(dialogVisible = false,returnVal='')}">取 消</el-button>
        <el-button size="mini" type="primary" @click="batchSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { calculatePrice } from '@/api/shopee/shopee.js'
import { debounce } from '@/util/util'
import varySpec from '../modal/varySpec.vue'
export default {
  props: {
    imageInfo: Array,
    baseProductInfo: Object,
    skuObj: Object,
    isEdit: Boolean,
    isOnline: Boolean
  },
  data() {
    const validateSku = (rule, value, callback) => {
      if (this.form.skuList.filter(item => item.productSku === value).length === 2) {
        callback(new Error('SKU不可以重复'))
      } else if (!value) {
        callback(new Error('SKU不能为空'))
      } else {
        callback()
      }
    }
    return {
      validateSku: validateSku,
      removeSkuList: [],
      form: {
        skuList: [
        ],
        description: ''
      },
      show: false,
      dialogVisible: false,
      name: '',
      returnVal: ''
    }
  },
  watch: {
    'skuObj.skuList'() {
      this.form.skuList.forEach(item => {
        const index = this.skuObj.skuList.findIndex(res => res.value === item.productSku)
        if (index > -1) {
          item.netWeight = this.skuObj.skuList[index].netWeight
          item.costPrice = this.skuObj.skuList[index].costPrice
        }
      })
      this.formatter()
    }
  },
  mounted() {
    this.form.skuList = this.baseProductInfo?.shopeeListingVariantDTOList || []
    this.form.description = this.baseProductInfo?.description || ''
    const data = this.baseProductInfo.tierVariation
    const a = (data && data[0].options) || []
    const b = (data && data[1]?.options) || []
    const result = []
    a && a.forEach((aItem, aIndex) => {
      aItem.id = 1
      if (b.length) {
        b.forEach((bItem, bIndex) => {
          bItem.id = 1
          result.push({ name1: aItem.value, name2: bItem.value, tierIndex: JSON.stringify([aIndex, bIndex]) })
        })
      } else {
        result.push({ name1: aItem.value, tierIndex: JSON.stringify([aIndex]) })
        aItem.tierIndex = JSON.stringify([aIndex])
      }
    })
    result.length && result.forEach((item) => {
      const sItem = this.form.skuList.find(list => list.tierIndex === item.tierIndex)
      sItem.name1 = item.name1 || ''
      sItem.name2 = item.name2 || ''
      sItem.variantDraftStatus = 'update'
    })
    if (this.form.skuList[0]?.name2?.length) {
      this.show = true
    }
    this.isEdit && this.formatData('price', '', 1)
  },
  methods: {
    batchSubmit() {
      const index = ['价格', '库存'].findIndex(item => item === this.name)
      const valProp = ['price', 'stock'][index]
      if (this.isOnline) {
        index && this.baseProductInfo.updateField.push(4)
        !index && this.baseProductInfo.updateField.push(3)
      }
      this.form.skuList.forEach(item => {
        item[valProp] = this.returnVal
      })
      this.dialogVisible = false
      // 价格调物流接口
      !index && this.formatData(valProp, '', 1)
      this.returnVal = ''
    },
    openDialog(type) {
      this.name = ['价格', '库存'][type]
      this.dialogVisible = true
    },
    getTitle(row) {
      return this.skuObj.skuList.filter(item => item.value === row.productSku)?.[0]?.title
    },
    setpic() {
      const { imageInfo, baseProductInfo, isOnline } = this
      this.$modal({
        component: varySpec,
        title: '多变体规格',
        data: { imageInfo, baseProductInfo, isOnline },
        width: '50%',
        callback: (data, type) => {
          data && this.getData(data)
          if (type) {
            this.show = true
            return
          }
          this.show = false
        }
      })
    },
    getData(data) {
      let cacheList = []
      if (this.isEdit) {
        cacheList = this.form.skuList
      }
      const a = data[0].options || []
      const b = data[1]?.options || []
      const result = []
      // 笛卡尔积处理
      a.forEach((aItem, aIndex) => {
        if (b.length) {
          b.forEach((bItem, bIndex) => {
            result.push({ tierIndex: JSON.stringify([aIndex, bIndex]), name1: aItem.value, name2: bItem.value, id: bItem.id })
          })
        } else {
          result.push({ tierIndex: JSON.stringify([aIndex]), name1: aItem.value, id: aItem.id })
        }
      })
      const commonObj = {
        productSku: '',
        price: '',
        stock: '100',
        shippingPrice: '',
        profitRate: '',
        costPrice: '',
        profitPrice: '',
        netWeight: '',
        variantDraftStatus: 'add'
      }
      if (result.length && !this.form.skuList.length) {
        // 第一次多变体赋值
        result.forEach(item => {
          const obj = {
            ...commonObj,
            tierIndex: item.tierIndex,
            name1: item.name1,
            name2: item.name2
          }
          this.form.skuList.push(obj)
        })
      } else {
        // 修改多变体
        const arr = []
        result.forEach(item => {
          const index = this.form.skuList.findIndex(sItem => item.tierIndex === sItem.tierIndex)
          if (index !== -1 && item.id) {
            // 旧数据
            this.form.skuList[index].name1 = item.name1
            this.form.skuList[index].name2 = item.name2
            this.form.skuList[index].tierIndex = item.tierIndex
            this.form.skuList[index].variantDraftStatus = 'update'
            arr.push(this.form.skuList[index])
          } else {
            // 新增数据
            const obj = {
              ...commonObj,
              tierIndex: item.tierIndex,
              name1: item.name1,
              name2: item.name2
            }
            arr.push(obj)
          }
        })
        this.form.skuList = arr
        if (this.isEdit) {
          // 编辑删除数据处理
          this.form.skuList.forEach(item => {
            cacheList.forEach((cItem, cIndex) => {
              if (cItem.tierIndex === item.tierIndex && item.id) {
                cacheList.splice(cIndex, 1)
              }
            })
          })
          let delArr = cacheList
          delArr = delArr.map(dItem => {
            return { ...dItem, variantDraftStatus: 'delete' }
          })
          this.form.skuList = [...this.form.skuList, ...delArr]
        } else {
          this.form.skuList.forEach(item => {
            item.variantDraftStatus = 'add'
          })
        }
      }
      this.baseProductInfo.shopeeListingVariantDTOList = this.form.skuList
      a.length || (this.baseProductInfo.shopeeListingVariantDTOList = [])
    },
    setProp(index) {
      const i = this.skuObj.skuList.findIndex(item => item.value === this.form.skuList[index].productSku)
      this.form.skuList[index].netWeight = this.skuObj.skuList[i]?.netWeight || ''
      this.form.skuList[index].costPrice = this.skuObj.skuList[i]?.costPrice || ''
      this.formatter()
    },
    formatter() {
      this.skuObj.skuList.forEach(item => {
        item.disabled = false
      })
      this.form.skuList.forEach(item => {
        this.skuObj.skuList.forEach(res => {
          if (res.value === item.productSku) {
            res.disabled = true
          }
        })
      })
    },
    getResult: debounce(function(key, val, index) {
      if (key === 'profitRate' && (!val || val > 1 || val < 0)) {
        this.$message.warning('利润率不能小于0或大于1')
        return false
      }
      this.formatData(key, index)
    }, 500),
    formatData(Key, index, type = 0) {
      this.loading = true
      const params = {
        platformCode: 'SP',
        siteCode: this.baseProductInfo.account && this.baseProductInfo.account.split('.')[1].toUpperCase(),
        storeCode: this.baseProductInfo.accountCode,
        priceDTOList: [],
        priceRateDTOList: []
      }
      if (type) {
        // 多条入参
        this.form.skuList.forEach((item, index) => {
          const discountRatio = this.skuObj.skuList.find(res => res.value === item.productSku)?.discountRatio || ''
          const obj = {
            productSku: item.productSku,
            productCost: Number(this.form.skuList[index].costPrice) + Number(discountRatio)
          }
          if (Key === 'profitRate') {
            obj.saleProfitRate = this.form.skuList[index].profitRate
            params.priceDTOList.push(obj)
            delete params.priceRateDTOList
          } else if (Key === 'price') {
            obj.price = this.form.skuList[index].price
            params.priceRateDTOList.push(obj)
            delete params.priceDTOList
          }
        })
      } else {
        const discountRatio = this.skuObj.skuList.find(item => item.value === this.form.skuList[index].productSku).discountRatio
        const paramsObj = {
          productSku: this.form.skuList[index].productSku,
          productCost: Number(this.form.skuList[index].costPrice) + Number(discountRatio)
        }
        if (Key === 'profitRate') {
          params.priceDTOList = [
            {
              ...paramsObj,
              saleProfitRate: this.form.skuList[index].profitRate
            }
          ]
          delete params.priceRateDTOList
        } else if (Key === 'price') {
          params.priceRateDTOList = [
            {
              ...paramsObj,
              price: this.form.skuList[index].price
            }
          ]
          delete params.priceDTOList
        }
      }
      calculatePrice(params, Key).then(res => {
        let check = false
        Object.entries(res.data).forEach(([key, val], i) => {
          // Object.entries(val).forEach(([nKey, nVal]) => {
          //   if (nKey === 'NoError') {
          //     ['price', 'profitPrice', 'profitRate', 'shippingPrice'].forEach(item => {
          //       this.$set(this.form.skuList[index || i], item, nVal[item])
          //     })
          //     this.$forceUpdate()
          //   } else {
          //     this.form.skuList[index || i][Key] = ''
          //     this.$message.warning(nVal)
          //   }
          // })
          if (check) {} else {
            for (const [nKey, nVal] of Object.entries(val)) {
              if (nKey === 'NoError') {
                ['price', 'profitPrice', 'profitRate', 'shippingPrice'].forEach(item => {
                  this.$set(this.form.skuList[index || i], item, nVal[item])
                })
                this.$forceUpdate()
              } else {
                check = true
                this.form.skuList[index || i][Key] = ''
                this.baseProductInfo.checkMsg = nVal
                this.$message.warning(nVal)
                return
              }
            }
          }
        })
      }).finally(_ => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.copy-img{
      transform: scale(.85,.85);
    display: block;
    width: 95px;
    margin-left: -10px;
}
.w-90{
  width: 90%;
}
.w-80 {
  width: 80%;
}
.form-table{
  .el-form-item--mini.el-form-item{
    margin-bottom: 0;
  }
  ::v-deep .el-form-item__error{
    position: initial;
    font-weight: 400;
  }
}
.el-form-item_no-lable ::v-deep .el-form-item__content{
  margin-left: 0 !important;
}
.has-error{
  padding-left: 10px;
  position: relative;
  &::before{
    content: "*";
    display: inline-block;
    color: #F56C6C;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
