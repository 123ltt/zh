<template>
  <el-form ref="rulesForm" v-loading="loading" :model="openData" label-width="100px" size="mini">
    <el-row>
      <el-col :span="24">
        <el-form-item prop="supplierId" label="供应商名称" :rules="{ required: true, message: '供应商名称不能为空', trigger: 'change' }">
          <g-select v-model="openData.supplierId" style="width:100%" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="returnRecipient" label="退货收件人" :rules="{ required: true, message: '退货收件人不能为空', trigger: 'blur' }">
          <el-input
            v-model="openData.returnRecipient"
            clearable
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="returnAddress" label="退货地址" :rules="{ required: true, message: '退货地址不能为空', trigger: 'blur' }">
          <el-select
            v-model="openData.returnCountry"
            class="address"
            clearable
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in listAddress"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-select
            v-model="openData.returnProvince"
            class="address"
            clearable
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in provinceList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-select
            v-model="openData.returnCity"
            class="address"
            clearable
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in cityList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-input
            v-model="openData.returnAddress"
            clearable
            class="smallAddress"
            placeholder="请输入具体地址"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item>
          <span slot="label">
            固定电话:</span>
          <el-input
            v-model="openData.telCode"
            clearable
            class="telCode"
            maxlength="4"
            placeholder="请输入"
            @input="getTel"
          />
          <span class="divider"> — </span>
          <el-input
            v-model="openData.telNumber"
            v-input.positive.numeric
            maxlength="8"
            class="telNumber"
            clearable
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="phoneNumber" label="移动电话" :rules="{ required: true, message: '移动电话不能为空', trigger: 'blur' }">
          <el-input
            v-model="openData.phoneNumber"
            v-input.positive.numeric
            clearable
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="默认地址">
          <el-switch v-model="isStatus" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item style="text-align: right;padding-right: 20px;">
          <el-button size="mini" icon="el-icon-circle-close" @click="$parent.$emit('close')">取消</el-button>
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="define()">保存</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { save, update } from '@/api/addressManagement/returnAddress.js'

export default {
  name: 'ReturnAdd',
  props: {
    isAdd: Boolean,
    supplierList: Array,
    listAddress: Array,
    openData: Object // 父传子的表格参数
  },
  data() {
    return {
      countryList: [],
      provinceList: [],
      cityList: [],
      oldTel: '',
      isStatus: true,
      loading: false
    }
  },
  watch: {
    'openData.returnCountry'(newVal, oldVal) {
      this.openData.returnProvince = ''
      if (newVal === '') {
        this.provinceList = []
        return
      }
      if (newVal !== oldVal) {
        this.listAddress.forEach(item => {
          // eslint-disable-next-line eqeqeq
          if (item.id == newVal) {
            this.provinceList = item.provinces
          }
        })
      }
    },
    'openData.returnProvince'(newVal, oldVal) {
      this.openData.returnCity = ''
      if (newVal === '') {
        this.cityList = []
        return
      }
      if (newVal !== oldVal) {
        this.provinceList.forEach(item => {
          // eslint-disable-next-line eqeqeq
          if (item.id == newVal) {
            this.cityList = item.citys
          }
        })
      }
    }
  },
  created() {
    this.dealWith(this.isAdd)
  },
  methods: {
    // 封装判断函数
    bool(val) {
      if (val == null || val === '') {
        return true
      }
      return false
    },
    getTel(val) {
      if (val) {
        if (!+val && +val !== 0) {
          this.openData.telCode = this.oldTel
        } else {
          this.oldTel = val
        }
      } else {
        this.oldTel = val
      }
    },
    // 保存
    define() {
      this.isStatus ? this.openData.isDefault = 0 : this.openData.isDefault = 1
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (!(/^1[3456789]\d{9}$/.test(this.openData.phoneNumber))) {
            this.$message.error('手机号码有误，请重填！')
          } else if (this.openData.returnCountry === '' || this.openData.returnProvince === '' || this.openData.returnCity === '') {
            this.$message.error('退货地址的国家，省份，城市都不能为空！')
          } else {
            let pan = true
            if (this.openData.telNumber !== '' || this.openData.telCode !== '') {
              if (this.openData.telNumber === '' || this.openData.telCode === '') {
                pan = false
                this.$message.error('固定号码不完整，请重填！')
              } else if (!(/^0\d{2,3}$/.test(this.openData.telCode)) || !(/^\d{7,8}$/.test(this.openData.telNumber))) {
                this.$message.error('固定号码有误，请重填！')
                pan = false
              }
            }
            if (pan) {
              this.loading = true;
              (this.isAdd ? save : update)(this.openData).then(() => {
                this.$parent.$emit('close', true)
                this.loading = false
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              }).catch(() => {
                this.loading = false
              })
            }
          }
        }
      })
    },
    // 编辑处理
    dealWith(val) {
      this.loading = true
      if (!val) {
        if (this.openData.telCode === -1) {
          this.openData.telCode = ''
        }
        if (this.openData.telNumber === -1) {
          this.openData.telNumber = ''
        }
        if (this.openData.isDefault === 0) {
          this.isStatus = true
        } else if (this.openData.isDefault === 1) {
          this.isStatus = false
        }
        this.openData.supplierId = this.openData.supplierId + ''
        this.listAddress.forEach(item => {
          if (item.id === this.openData.returnCountry) {
            this.provinceList = item.provinces
            this.provinceList.forEach(item1 => {
              if (item1.id === this.openData.returnProvince) {
                this.cityList = item1.citys
              }
            })
          }
        })
        this.loading = false
      } else {
        this.listAddress.forEach(item => {
          if (item.name === '中国') {
            this.openData.returnCountry = item.id
          }
        })
        this.loading = false
      }
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
.address{
          width: 31%;
          margin-right: 5px;
      }
      .smallAddress{
          margin-top: 10px;
      }
      .telCode{
          width: 30%;
      }
      .divider{
          display: inline-block;
          width: 10%;
          text-align: center;
          color: #c4c7cf;
      }
      .telNumber{
          width: 60%;
      }
</style>
