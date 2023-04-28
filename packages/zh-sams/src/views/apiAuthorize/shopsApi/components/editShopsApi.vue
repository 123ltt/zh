<template>
  <el-form ref="siteFormRef" style="margin:0 auto" :rules="rules" :model="siteForm" label-width="180px" size="mini" class="form-col">
    <div style="margin:0 auto;width:90%;">
      <div style="text-align: left;">
        <el-form-item label="平台" prop="platformId" :rules="!row?[{ required: true, message: '平台名称不能为空', trigger: 'change' }]:[{required:false}]">
          <template v-if="!row">
            <el-select v-model="siteForm.platformId" filterable clearable placeholder="请选择" class="w300" size="mini" @change="changePlatformId">
              <el-option v-for="(item,index) in findForm.platformOption" :key="index" :label="item.displayName" :value="item.hiddenValue" />
            </el-select>
          </template>
          <span v-else>{{ siteForm.platformCode }}</span>
        </el-form-item>
        <el-form-item label="站点" prop="siteId" :rules="!isShowSite?[{ required: true, message: '站点不能为空', trigger: 'change' }]:[{required:false}]">
          <template v-if="!row">
            <!-- disabledSite -->
            <el-select v-model="siteForm.siteId" clearable filterable class="w300" :disabled="!findForm.siteOption.length" placeholder="请选择" @change="handlerSite">
              <el-option v-for="(item,index) in findForm.siteOption" :key="index" :label="item.displayName" :value="item.hiddenValue" />
            </el-select>
          </template>
          <span v-else>{{ siteForm.siteCode }}</span>
        </el-form-item>
        <el-form-item label="店铺名称" prop="storeName" :rules="!row?[{required: true, message: '店铺编号不能为空', trigger: 'change' }]:[{required:false}]">
          <el-select v-if="!row" v-model="siteForm.storeName" filterable clearable :disabled="disabledStoreCode" placeholder="请选择" class="w300" size="mini">
            <el-option
              v-for="(item,index) in findForm.storeCodeOption"
              :key="index"
              :label="item.displayName"
              :value="item.displayName"
            />
          </el-select>
          <span v-else>{{ row.storeName }}</span>
        </el-form-item>
        <template v-if="isDevelopAccount">
          <el-form-item
            label="开发者账号"
            prop="developAccount"
            :rules="[{required: true, message: '开发者账号不能为空',trigger:'blur'}]"
          >
            <el-input v-model.trim="siteForm.developAccount" placeholder="请输入" size="mini" class="w300" @input="siteForm.developAccount=siteForm.developAccount.replace(/[\u4E00-\u9FA5]/g,'')" />
            <!-- <el-select
            v-model="siteForm.developAccount"
            clearable
            placeholder="请选择" style="width:100%;"
            size="mini"
          >
            <el-option
              v-for="(item,index) in findForm.developAccountOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select> -->
          </el-form-item>
        </template>
        <el-form-item label="token" prop="token">
          <el-input v-model.trim="siteForm.token" class="w300" maxlength="1000" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="refreshToken" prop="refreshToken">
          <el-input v-model.trim="siteForm.refreshToken" class="w300" maxlength="1000" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="apiUrl" prop="apiUrl">
          <el-input v-model.trim="siteForm.apiUrl" class="w300" maxlength="1000" placeholder="请输入" clearable />
        </el-form-item>
        <div v-for="(v,item, index) of siteForm.paramMap" :key="index">
          <el-form-item
            :label="item"
            :prop="'paramMap.'+item"
          >
            <el-input v-model.trim="siteForm.paramMap[item]" class="w300" placeholder="请输入" clearable />
          </el-form-item>
        </div>
      </div>
    </div>
    <div style="padding-top: 20px; text-align: right">
      <el-button size="medium" @click="$parent.$emit('close')">取 消</el-button>
      <el-button size="medium" type="primary" :disabled="row?submitBtnEnable:false" @click="handlerSeve('siteFormRef')">确 定</el-button>
    </div>
  </el-form>
</template>

<script>
import { createAuthorize, paramsList, updateParamValue, storeDetail } from '@/api/shopsApi'
import { deepClone } from '@/util/util'
import { siteOption, storePlatformCodeByAdmin } from '@/api/site' // 站点
export default {
  name: 'EditShopsApi',
  props: {
    row: {
      type: Object,
      default: null
    },
    findForm: {
      type: Object
    }
  },
  data() {
    return {
      siteForm: {
        platformId: '',
        platformCode: '',
        siteId: '',
        storeName: '',
        developAccount: '',
        token: '',
        apiUrl: '',
        refreshToken: '',
        paramMap: {}
      },
      showSiteCode: ['WH', 'SM'],
      disabledSite: true,
      disabledSaveBtn: true,
      disabledStoreCode: true, // 店铺联动
      isDevelopAccount: false, // 是否是开发者账号
      oldForm: null,
      platformCode: 'LZ', // LZ
      platformId: '', // 平台id
      rules: {}
    }
  },
  computed: {
    // 是否显示站点
    isShowSite() {
      return this.showSiteCode.includes(this.siteForm.platformCode)
    },
    isChangeStore() {
      return ['LZ', 'WH', 'SM'].includes(this.siteForm.platformCode)
    },
    isPlatformCode() {
      return this.findForm.platformOption.find(item => item.hiddenValue === this.platformId && item.candidateDisplayName === this.platformCode)
    },
    // 是否修改，并启用提交按钮
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.siteForm))
    }
  },
  mounted() {
    if (!this.row) {
      this.findForm.siteOption = []
    }
    this.row && this.getStoreDetail()
  },
  methods: {
    getStoreDetail() {
      storeDetail({ id: this.row.id }).then(res => {
        this.siteForm = res.data
        this.oldForm = deepClone(this.siteForm)
      })
    },
    // 保存
    handlerSeve(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let storeId = ''
          if (this.isPlatformCode || this.isShowSite) {
            storeId = this.findForm.storeCodeOption.filter(item => item.displayName === this.siteForm.storeName).map(acc => acc.hiddenValue)
          } else {
            storeId = this.findForm.storeCodeOption.filter(item => item.displayName === this.siteForm.storeName).map(acc => acc.hiddenValue)
          }
          this.siteForm.storeId = storeId.join(',')
          if (this.row) {
            const siteForm = this.siteForm
            const params = {
              id: siteForm.id,
              token: siteForm.token,
              apiUrl: siteForm.apiUrl,
              refreshToken: siteForm.refreshToken
            }
            params.paramMap = (JSON.stringify(this.oldForm.paramMap) === JSON.stringify(siteForm.paramMap)) ? {} : siteForm.paramMap
            updateParamValue({ ...params }).then(res => {
              this.$message.success(res.msg)
              this.$parent.$emit('close', true)
            })
          } else {
            this.siteForm.params = this.siteForm.paramMap
            createAuthorize(this.siteForm).then(res => {
              this.$message.success(res.msg)
              this.$parent.$emit('close', true)
            })
          }
        }
      })
    },
    getStorePlatformCodeByAdmin() {
      storePlatformCodeByAdmin({ platformCode: this.siteForm.platformCode, siteId: this.siteForm.siteId }).then(res => {
        this.findForm.storeCodeOption = res.data
      })
    },
    // 平台切换
    changePlatformId(id) {
      this.platformId = id
      this.siteForm.siteId = ''
      this.siteForm.platformCode = this.findForm.platformOption.find(item => item.hiddenValue === id).candidateDisplayName
      const filterList = this.findForm.platformOption.filter(acc => acc.hiddenValue === id && acc.displayName.toLowerCase() === 'ebay')
      // if (this.isShowSite) {
      //   this.disabledStoreCode = false
      //   this.isShowSite && this.getParamsList()
      // } else
      // if (this.isChangeStore) { // lazada
      this.disabledStoreCode = false
      this.getStorePlatformCodeByAdmin()
      this.getParamsList()
      // } else {
      //   this.disabledStoreCode = true
      // }
      this.isDevelopAccount = !!filterList.length
      id && this.getSiteOption(id)
      this.disabledSite = !id
      this.siteForm.storeName = ''
      this.siteForm.siteId = ''
      this.findForm.siteOption = []
      this.findForm.storeCodeOption = []
      this.siteForm.paramMap = {}
    },
    // 站点下拉列表
    getSiteOption(id) {
      siteOption({ platform: id }).then(res => {
        this.findForm.siteOption = res.data
      })
    },
    // 站点切换事件
    async handlerSite(id) {
      !id && this.getStorePlatformCodeByAdmin()
      if (!this.isPlatformCode) {
        await this.getStoreBySiteId()
        this.siteForm.storeName = ''
        this.findForm.storeCodeOption = []
      }
      this.getParamsList()
    },
    // 参数列表
    async getParamsList() {
      await paramsList({ platformId: this.siteForm.platformId, siteId: this.siteForm.siteId }).then(res => {
        const data = res.data
        if (data.length) {
          this.siteForm.paramMap = data.reduce((prevVal, item) => {
            prevVal[item] = ''
            return prevVal
          }, {})
        } else {
          this.siteForm.paramMap = {}
        }

        // const a = { a: 'a' }
        // data.map(item => {
        //   a['_' + item] = ''
        // })
        // this.siteForm.params = a
      })
    },
    // 获取站点下的店铺列表
    getStoreBySiteId() {
      this.disabledStoreCode = false
      this.getStorePlatformCodeByAdmin()
      // storCodeOption({ platformId: this.siteForm.platformId, siteId: this.siteForm.siteId }).then(res => {
      //   if (res.data.length) {
      //     this.findForm.storeCodeOption = res.data
      //   }
      // })
    }
  }

}
</script>

<style lang="scss" scoped>
.el-form-box {
  padding: 20px;
}
.el-input__inner {
  width: 300px;
}
.w300 {
  width: 240px;
}
</style>
