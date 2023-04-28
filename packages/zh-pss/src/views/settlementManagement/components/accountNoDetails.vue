<template>
  <basic-container>
    <el-card>
      <section class="basic">
        <el-form size="mini" label-width="100px" class="no-message">
          <el-row :gutter="10">
            <el-col :span="16">
              <el-form-item label="供应商名称">
                <el-input :value="detail.supplierName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="账号类型">
                <el-input :value="accountType" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="币种">
                <el-input :value="accountCurrency" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="账户名称">
                <el-input :value="detail.account" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="账户账号">
                <el-input :value="detail.accountNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col v-if="isBank" :span="8">
              <el-form-item label="账户开户行">
                <el-input :value="accountBank" disabled />
              </el-form-item>
            </el-col>
            <el-col v-if="isBank" :span="8">
              <el-form-item label="账户类型">
                <el-input :value="accountUserType" disabled />
              </el-form-item>
            </el-col>
            <el-col v-if="isBank" :span="24">
              <el-form-item label="开户行支行">
                <el-input :value="detail.accountBankBranch" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="开户人身份证">
                <div class="imgListBox">
                  <div v-for="item in imgArr" :key="item.make">
                    <p>{{ item.title }}</p>
                    <upload-image v-if="getScc" :images.sync="item.container" :primary="false" :is-remove="true" :http-request="httpRequest" :uploading.sync="item.imgStatus" :avatar="true" :size="5242880" />
                  </div>
                </div>
              </el-form-item>
            </el-col>
            <el-col v-if="isBank" :span="24">
              <el-form-item label="开户人银行卡">
                <upload-image v-if="getScc" :images.sync="imageList" :primary="false" :is-remove="true" :http-request="httpRequest" :uploading.sync="imageUploading" :avatar="true" :size="5242880" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-checkbox v-model="isdefa" disabled>默认结算账户</el-checkbox>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建人">
                <el-input :value="detail.createUserName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建时间">
                <el-input :value="detail.createTime" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="修改人">
                <el-input :value="detail.updateUserName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最后修改时间">
                <el-input :value="detail.updateTime" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </section>
    </el-card>
  </basic-container>
</template>

<script>
import { getDetail, getBank, getCurrency } from '@/api/settlementManagement/settlementAccountNo.js'
import httpRequest from '@/api/common/upload'
import { UploadImage } from 'global-components'
export default {
  name: 'AccountNoDetails',
  components: { UploadImage },
  props: {
    detailData: Object, // 父传子的表格参数
    close: { // 父传子的关闭函数
      type: Function,
      default: null
    }
  },
  data() {
    return {
      detail: {},
      accountType: '',
      isdefa: false,
      bankList: [],
      accountUserType: '',
      accountCurrency: '',
      accountBank: '',
      positiveImg: '',
      reverseImg: '',
      httpRequest,
      currencyList: [],
      isBank: true,
      loading: false,
      getScc: true,
      imageList: [],
      imageUploading: false, // 上传状态
      imgArr: [
        { title: '正面', container: [], imgStatus: false },
        { title: '反面', container: [], imgStatus: false }
      ]
    }
  },
  mounted() {
    this.getData(this.detailData.id)
  },
  methods: {
    getData(val) {
      this.loading = true
      this.getScc = false
      getDetail(val).then(res => {
        const data = res.data
        this.detail = data
        if (this.detail.supplierFileList.length) {
          this.positiveImg = this.detail.supplierFileList[0].link
          this.reverseImg = this.detail.supplierFileList[1].link
        }
        if (this.detail.accountUserType === 1) {
          this.accountUserType = '对公账户'
        } else if (this.detail.accountUserType === 2) {
          this.accountUserType = '对私账户'
        }
        if (this.detail.accountType === 1) {
          this.accountType = '银行卡'
          this.isBank = true
        } else if (this.detail.accountType === 2) {
          this.accountType = '支付宝'
          this.isBank = false
        } else if (this.detail.accountType === 3) {
          this.accountType = '微信'
          this.isBank = false
        }
        if (this.detail.isDefault === 0) {
          this.isdefa = true
        } else if (this.detail.isDefault === 1) {
          this.isdefa = false
        }
        getBank().then(res => {
          const data = res.data
          data.forEach(item => {
            if (+item.dictKey === +this.detail.accountBank) {
              this.accountBank = item.dictValue
            }
          })
        })
        getCurrency().then(res => {
          const data = res.data
          data.forEach(item => {
            if (+item.dictKey === +this.detail.accountCurrency) {
              this.accountCurrency = item.dictValue
            }
          })
          if (res.data.supplierFileList) {
            this.imgArr[0].container.push({ url: res.data.supplierFileList[0].link, name: res.data.supplierFileList[0].fileName })
            this.imgArr[1].container.push({ url: res.data.supplierFileList[1].link, name: res.data.supplierFileList[1].fileName })
          } else {
            this.imgArr[0].container.push({ url: '', name: '无图' })
            this.imgArr[1].container.push({ url: '', name: '无图' })
          }
          if (res.data.accountPicture) {
            this.imageList.push({ url: res.data.accountPicture, name: '银行卡' })
          } else {
            this.imageList.push({ url: '', name: '无图' })
          }
          this.getScc = true
          this.loading = false
        })
      })
    },
    doclose() {
      this.$emit('close')
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
.imgListBox{
  display: flex;
  flex-wrap: wrap;
  p{
    margin: 0;
    text-align: center;
  }
}
</style>
