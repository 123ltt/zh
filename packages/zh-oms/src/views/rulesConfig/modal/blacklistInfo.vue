<template>
  <div>
    <el-row>
      <el-divider content-position="left">邮箱信息</el-divider>
      <el-form label-width="115px" size="mini" class="no-message">
        <el-col :span="12">
          <el-form-item label="邮箱：">
            <el-input v-model="email" size="mini" />
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-divider content-position="left">账号信息</el-divider>
    <el-row>
      <el-form label-width="115px" size="mini" class="no-message">
        <el-col :span="12">
          <el-form-item label="销售平台：">
            <el-select v-model="form.platCode" class="width-100" filterable clearable>
              <el-option v-for="item in platformList" :key="item.value" :value="item.value" :label="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="买家账号：">
            <el-input v-model="form.buyerId" />
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-divider content-position="left">收件人地址信息</el-divider>
    <el-row>
      <el-form label-width="115px" size="mini" class="no-message">
        <el-col :span="12">
          <el-form-item label="收件人：">
            <el-input v-model="formAddress.receiveFullName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话：">
            <el-input v-model="formAddress.mobileNo" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="国家：">
            <el-select v-model="formAddress.receiveCountryCode" class="width-100" filterable clearable>
              <el-option v-for="(item,index) in countryList" :key="index" :label="item.countryCn" :value="item.countryCode" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮编：">
            <el-input v-model="formAddress.receiveZip" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="省/州：">
            <el-input v-model="formAddress.receiveDeltaProvince" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="城市：">
            <el-input v-model="formAddress.receiveCity" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地址：">
            <el-input v-model="formAddress.receiveAddress" />
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row type="flex" justify="end">
      <el-button size="mini" @click="cancle">取消</el-button>
      <el-button :loading="loading" type="primary" size="mini" @click="submit">确定</el-button>
    </el-row>
  </div>
</template>

<script>
import { save, update, baseCountry, getDetailById } from '@/api/downloadCenter'
import { getPlatformList } from '@/api/common.js'
export default {
  props: {
    type: String,
    id: String
  },
  data() {
    return {
      email: '',
      form: {
        platCode: '',
        buyerId: ''
      },
      formAddress: {
        receiveFullName: '',
        mobileNo: '',
        receiveCountryCode: '',
        receiveZip: '',
        receiveDeltaProvince: '',
        receiveCity: '',
        receiveAddress: ''
      },
      loading: false,
      countryList: [],
      platformList: []
    }
  },
  mounted() {
    getPlatformList().then(res => {
      this.platformList = res.data.map(item => {
        return {
          label: item.platformName,
          value: item.platformCode
        }
      })
    })
    this.getBaseCountry()
    if (this.id) {
      this.getDetails()
    }
  },
  methods: {
    getDetails() {
      getDetailById(this.id).then(res => {
        this.email = res.data.email
        this.form = {
          platCode: res.data.platCode,
          buyerId: res.data.buyerId
        }
        this.formAddress = {
          receiveFullName: res.data.receiveFullName,
          mobileNo: res.data.mobileNo,
          receiveCountryCode: res.data.receiveCountryCode,
          receiveZip: res.data.receiveZip,
          receiveDeltaProvince: res.data.receiveDeltaProvince,
          receiveCity: res.data.receiveCity,
          receiveAddress: res.data.receiveAddress
        }
      })
    },
    submit() {
      if (!this.email && this.returnResult(this.form) && this.returnResult(this.formAddress)) {
        this.$message.warning('邮箱 地址信息 账号信息三者必须填写其中一个，支持填写多个')
        return false
      }
      if ((this.form.platCode && !this.form.buyerId) || (!this.form.platCode && this.form.buyerId)) {
        this.$message.warning('请完善账号信息')
        return false
      }
      if (!this.returnResult(this.formAddress) && !this.formAddress.receiveFullName) {
        this.$message.warning('请填写收件人')
        return false
      }
      const parmas = Object.assign({ email: this.email }, this.form, this.formAddress)
      if (this.id) {
        parmas.id = this.id
        update(parmas).then(res => {
          if (res.success) {
            this.$message.success('修改成功')
            this.close(true)
          }
        })
        return false
      }
      this.loading = true
      save(parmas).then(res => {
        if (res.success) {
          this.$message.success('新增成功')
          this.close(true)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    returnResult(data) {
      const type = true
      for (const key in data) {
        // 对象中有属性不为空则返回false 否则返回true
        if (data[key]) return false
      }
      return type
    },
    getBaseCountry() {
      baseCountry().then(res => {
        this.countryList = res.data
      })
    },
    close(type = false) {
      this.$parent.$emit('close', type)
    },
    cancle() {
      this.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.width-100{
  width: 100%;
}
</style>
