<template>
  <div class="openBox">
    <main v-loading="loading" class="main">
      <el-form ref="rulesForm" :model="openData" label-width="120px" size="mini">
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <span slot="label">
                <span class="biaozhi">*</span>
                供应商名称:</span>
              <el-input
                v-model="openData.supplierName"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <span slot="label">
                <span class="biaozhi">*</span>
                商品名称:</span>
              <el-input
                v-model="openData.goodsName"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <span slot="label">
                <span class="biaozhi">*</span>
                商品类目:</span>
              <el-input
                v-model="openData.category"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="score">
              <span slot="label">
                <span class="biaozhi">*</span>
                商品编号:</span>
              <el-input
                v-model="openData.goodsCode"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <span slot="label">
                商品品牌:</span>
              <el-input
                v-model="openData.goodsBrand"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="price" label="商品报价:" :rules="{ required: true, message: '商品报价不能为空', trigger: 'blur' }">
              <el-input
                v-model="openData.price"
                v-input.positive
                maxlength="9"
                clearable
                placeholder="请输入"
                @input="changeVal"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="currency" label="币种:" :rules="{ required: true, message: '币种不能为空', trigger: 'change' }">
              <el-select
                ref="input"
                v-model="openData.currency"
                clearable
                placeholder="请搜索选择"
                filterable
              >
                <el-option
                  v-for="item in currencyList"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="isTax" label="是否含税:" :rules="{ required: true, message: '是否含税不能为空', trigger: 'change' }">
              <el-select
                ref="input"
                v-model="openData.isTax"
                clearable
                placeholder="请搜索选择"
                filterable
              >
                <el-option
                  v-for="item in taxList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </main>
    <footer class="footer">
      <el-button
        size="mini"
        @click="doclose()"
      >取消</el-button>
      <el-button
        size="mini"
        type="primary"
        @click="todefine()"
      >保存</el-button>
    </footer>
  </div>
</template>

<script>
import { update, save } from '@/api/goodsManagement/goodsAuotation.js'
import { getMyDictBiz } from '@/api/commonApi/common.js'
import { debounce } from '@/util/util'
export default {
  name: 'GoodsAuotationAdd',
  props: {
    isAdd: Boolean,
    openData: Object, // 父传子的表格参数
    close: { // 父传子的关闭函数
      type: Function,
      default: null
    },
    define: { // 父传子的关闭函数
      type: Function,
      default: null
    }
  },
  data() {
    return {
      taxList: [
        { id: 0, name: '是' },
        { id: 1, name: '否' }
      ],
      loading: false,
      currencyList: [],
      oldValue: ''
    }
  },
  created() {
    if (!this.isAdd) {
      this.openData.currency = this.openData.currency + ''
    }
    this.getData()
  },
  methods: {
    getData() {
      getMyDictBiz('pss_account_currency').then(res => {
        this.currencyList = res.data
        if (this.isAdd) {
          this.currencyList.forEach(item => {
            if (item.dictValue === 'RMB') {
              this.openData.currency = item.dictKey
            }
          })
        }
      })
    },
    // 控制输入两位小数
    changeVal(val) {
      if (val.indexOf('.') !== -1 && val.split('.')[1].length > 2) {
        this.openData.price = this.oldValue
      } else {
        this.oldValue = val
      }
    },
    todefine: debounce(function() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (this.openData.price <= 0) {
            this.$message.error('价格要大于0!')
          } else if (this.openData.price > 10000000) {
            this.$message.error('价格最大为999999.99!')
          } else {
            this.loading = true
            const obj = {
              goodsId: this.openData.goodsId,
              price: this.openData.price,
              currency: this.openData.currency,
              isTax: this.openData.isTax
            }
            if (this.isAdd) {
              save(obj).then(() => {
                this.$parent.$emit('close', true)
                this.loading = false
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              })
            } else {
              obj.id = this.openData.id
              update(obj).then(() => {
                this.$parent.$emit('close', true)
                this.loading = false
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              })
            }
          }
        }
      })
    }),
    doclose() {
      this.$parent.$emit('close')
      this.close()
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
::v-deep input[type="number"]{
  -moz-appearance: textfield;
}
*{
    box-sizing: border-box;
}
.openBox{
    width: 100%;
    overflow: auto;
    .header {
      box-sizing: border-box;
      padding: 0 20px;
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #cccccc;
      .title {
        font-size: 14px;
      }
    }
    .main {
      width: 100%;
      ::v-deep .el-select{
          width: 100%;
      }
      ::v-deep .el-form-item{
          margin-bottom: 10px!important;
      }
      ::v-deep .el-form-item__content{
        //   width: 100%;
          ::v-deep .el-input-group__prepend{
              width: 25%;
              padding: 0;
              text-align: center;
          }
      }
      .biaozhi {
            color: red;
            font-size: 12px;
          }
        .idcard{
            display: flex;
            justify-content: space-between;
        }
        ::v-deep .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        ::v-deep .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
        ::v-deep .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 300px;
            height: 200px;
            line-height: 200px;
            text-align: center;
        }
        ::v-deep .avatar {
            width: 300px;
            height: 200px;
            display: block;
        }
        .small{
            width: 25%;
            margin:0 10px;
            ::v-deep input{
                padding: 0 10px!important;
            }
        }
        .main-img {
            position: absolute;
            left: 0;
            top: 0;
            line-height: initial;
            color: #000;
            font-size: 24px;
            font-weight: bold;
            border-radius: 6px 0;
            background-color: #fff;
        }
    }
    .footer {
      text-align: right;
    //   margin-top: 30px;
      // padding-bottom: 40px;
    }
}
::v-deep .el-dialog__body{
    padding-top: 10px;
    padding-bottom: 40px;
}
</style>
