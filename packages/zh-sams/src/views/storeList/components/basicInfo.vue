<template>
  <basic-container>
    <div class="btn-head">
      <p />
      <el-button type="primary" size="mini" :disabled="submitBtnEnable" @click="handleUpdate('formObjRef')">修 改</el-button>
    </div>
    <el-form ref="formObjRef" :model="formObj" :rules="rules" label-width="110px" size="mini" class="form-col">
      <el-row style="width:74%;margin: auto;">
        <el-col :span="12">
          <el-form-item label="平台" prop="platformName">
            <el-input v-model.trim="formObj.platformName" :disabled="true" placeholder="请输入" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="站点" prop="siteName">
            <el-input v-model.trim="formObj.siteName" :disabled="true" placeholder="请输入" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="店铺名" prop="name">
            <el-input v-model.trim="formObj.name" :disabled="true" placeholder="请输入" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col v-if="isPlatformCode" :span="12">
          <el-form-item label="刊登站点" prop="sitePublishIds">
            <el-select v-model="formObj.sitePublishIds" multiple filterable clearable default-first-option placeholder="请选择" size="mini" style="width:200px">
              <el-option v-for="(item,index) in findForm.siteOption" :key="index" :label="item.displayName" :value="item.hiddenValue" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="店铺编号" prop="code">
            <el-input v-model.trim="formObj.code" :disabled="true" placeholder="请输入" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="店铺评级" prop="storeGrade">
            <el-select v-model="formObj.storeGrade" clearable placeholder="请选择" style="width:200px">
              <el-option v-for="(item,index) in findForm.storeGradeOption" :key="index" :label="item.displayName" :value="item.hiddenValue" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="平台店铺等级" prop="storeLevel">
            <el-select v-model="formObj.storeLevel" clearable placeholder="请选择" style="width:200px">
              <el-option v-for="(item,index) in findForm.storeLevelOption" :key="index" :label="item.displayName" :value="item.hiddenValue" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="店铺状态" prop="storeStatusName">
            <el-input v-model.trim="formObj.storeStatusName" :disabled="true" placeholder="请输入" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="首单日期" prop="firstOrderDate">
            <el-input v-model.trim="formObj.firstOrderDate" :disabled="true" placeholder="请输入" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属组织" prop="organizationId">
            <el-select v-model="formObj.organizationId" clearable placeholder="请选择" style="width:200px">
              <el-option v-for="(item,index) in findForm.compOption" :key="index" :label="item.orgName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="添加日期" prop="createTime">
            <el-date-picker v-model="formObj.createTime" type="date" :disabled="true" placeholder="选择日期" format="yyyy-MM-dd " value-format="yyyy-MM-dd" size="mini" style="width:200px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="应收账款余额" prop="receivableBalance">
            <div class="flex-box">
              <div>
                <el-input v-model.trim="formObj.receivableBalance" maxlength="8" placeholder="请输入" clearable />
              </div>
              <el-select v-model="formObj.receivableBalanceCurrency" clearable filterable default-first-option placeholder="请选择" style="margin-left:10px">
                <el-option v-for="(item,index) in findForm.regCurrencyOption" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="店铺租金" prop="rent">
            <div class="flex-box">
              <div>
                <el-input v-model.trim="formObj.rent" placeholder="请输入" maxlength="8" clearable />
              </div>
              <div>
                <el-select v-model="formObj.rentCurrencyCode" clearable filterable default-first-option placeholder="请选择" style="margin-left:10px">
                  <el-option v-for="(item,index) in findForm.regCurrencyOption" :key="index" :label="item.name" :value="item.id" />
                </el-select>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="冻结/关闭时间" prop="freezeOrCloseDate">
            <el-date-picker v-model="formObj.freezeOrCloseDate" type="date" placeholder="选择日期" format="yyyy-MM-dd " value-format="yyyy-MM-dd" size="mini" style="width:200px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="冻结/关闭金额" prop="freezeOrCloseMoney">
            <div class="flex-box">
              <div>
                <el-input v-model.trim="formObj.freezeOrCloseMoney" maxlength="8" placeholder="请输入" clearable />
              </div>
              <el-select v-model="formObj.freezeOrCloseMoneyCurrency" clearable filterable default-first-option placeholder="请选择" style="margin-left:10px">
                <el-option v-for="(item,index) in findForm.regCurrencyOption" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </div>
          </el-form-item>
        </el-col>
        <template v-if="formObj.isFba === 'true'">
          <el-col :span="12">
            <el-form-item label="是否FBA店铺" prop="isFba">
              <el-radio-group v-model="formObj.isFba">
                <el-radio v-for="(item,index) in findForm.fbaOption" :key="index" :label="item.hiddenValue" :value="item.hiddenValue">{{ item.displayName }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="FBA店铺库存" prop="fbaStock">
              <el-input v-model.trim="formObj.fbaStock" maxlength="8" placeholder="请输入" clearable class="w200" />
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model.trim="formObj.remark" :maxlength="LIMIT.title" placeholder="请输入" type="textarea" style="width:200px" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </basic-container>
</template>

<script>
import { LIMIT } from '@/config/form'
import { deepClone } from '@/util/util'
import { siteOption } from '@/api/site' // 站点
import { getStoreGradeList, getBaseInfoById, listOfPlatform, updateBaseInfoById } from '@/api/storeList'
import { dictionary, compList, currencyList } from '@/api/public'
export default {
  name: 'BasicInfo',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    compId: {
      type: String
    }
  },
  data() {
    return {
      LIMIT,
      formObj: {
        platformName: '',
        siteName: '',
        name: '',
        code: '',
        storeLevel: '',
        storeGrade: '',
        storeStatus: '',
        firstOrderDate: '',
        organizationId: '',
        createTime: '',
        receivableBalance: '',
        rent: '',
        freezeOrCloseDate: '',
        freezeOrCloseMoney: '',
        isFba: '',
        fbaStock: '',
        remark: ''
      },
      oldForm: {}, // 备份
      sitePublishCode: ['EB', 'LZ'],
      findForm: {
        fbaOption: [],
        compOption: [], // 组织架构
        storeLevelOption: [],
        storeGradeOption: [], // 店铺等级
        regCurrencyOption: [],
        siteOption: []
      },
      rules: {
        organizationId: [{ required: true, message: '所属组织不能为空', trigger: 'blur' }],
        fbaStock: [{ trigger: 'blur', message: '请输入有效FBA店铺库存', pattern: /^[1-9]\d*$/ }],
        freezeOrCloseMoney: [{ trigger: 'blur', message: '请输入有效冻结/关闭金额', pattern: /^[1-9]\d*$/ }],
        rent: [{ trigger: 'blur', message: '请输入正整数', pattern: /^[1-9]\d*$/ }],
        receivableBalance: [{ trigger: 'blur', message: '请输入正整数', pattern: /^[1-9]\d*$/ }],
        isFba: [{ required: true, message: '是否FBA店铺不能为空', trigger: 'change' }]
      }
    }
  },
  computed: {
    // 是否修改，并启用提交按钮
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.formObj))
    },
    isPlatformCode() {
      return this.sitePublishCode.includes(this.formObj.platformCode)
    }
  },
  mounted() {
    this.getBaseInfoById()
    this.dictionary('sams_yes_or_not')
    this.getCurrencyList()
    this.getSiteOption()
  },
  methods: {
    // 修改
    handleUpdate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const formObj = this.formObj
          if (this.compId) {
            this.findForm.compOption.forEach(acc => {
              if (formObj.organizationId === acc.id) {
                formObj.organizationCode = acc.orgName
              }
            })
            if (formObj.createTime) {
              formObj.createTime = `${formObj.createTime} 00:00:00`
            }
            if (formObj.freezeOrCloseDate) {
              formObj.freezeOrCloseDate = `${formObj.freezeOrCloseDate} 00:00:00`
            }
            if (formObj.firstOrderDate) {
              formObj.firstOrderDate = `${formObj.firstOrderDate} 00:00:00`
            }
            // 刊登站点
            const sitePublishIds = Array.from(new Set(this.formObj.sitePublishIds))
            const sitePublishItem = []
            this.findForm.siteOption.forEach(item => {
              if (sitePublishIds.includes(item.hiddenValue)) {
                const obj = {}
                obj.siteId = item.hiddenValue
                obj.siteCode = item.displayName
                sitePublishItem.push(obj)
              }
            })
            this.formObj.sitePublishList = sitePublishItem
            updateBaseInfoById({ ...formObj }).then(res => {
              this.$message.success(res.msg)
              this.$emit('close', true)
            })
          }
        }
      })
    },
    // 站点下拉列表
    getSiteOption(id) {
      siteOption({ platform: id }).then(res => {
        const data = res.data
        if (data.length) {
          this.findForm.siteOption = data
        }
      })
    },
    // 获取基础信息详情
    getBaseInfoById() {
      getBaseInfoById({ id: this.compId }).then(res => {
        const data = res.data
        this.getSiteOption(data.platformId)
        const sitePublishIds = data.sitePublishList.map(item => item.siteId)
        data.sitePublishIds = Array.from(new Set(sitePublishIds))
        // const arr = this.findForm.siteOption.filter(item => data.sitePublishIds.includes(item.hiddenValue))
        data.fbaStock = parseInt(data.fbaStock)
        if (data.fbaStock === 0) {
          data.fbaStock = ''
        }
        data.storeGrade = data.storeGrade && data.storeGrade.toString()
        data.isFba = data.isFba + ''
        if (data.freezeOrCloseMoney && data.freezeOrCloseMoney != null) {
          data.freezeOrCloseMoney = parseInt(data.freezeOrCloseMoney) <= 0 ? '' : parseInt(data.freezeOrCloseMoney)
        }
        if (data.receivableBalance && data.receivableBalance !== null) {
          data.receivableBalance = parseInt(data.receivableBalance) <= 0 ? '' : parseInt(data.receivableBalance)
        }
        if (data.rent && data.rent !== null) {
          data.rent = parseInt(data.rent) <= 0 ? '' : parseInt(data.rent)
        }
        data.organizationId = typeof (data.organizationId) === 'number' ? data.organizationId + '' : data.organizationId
        this.formObj = res.data
        this.oldForm = deepClone(this.formObj)
        this.getCompList()
        this.getListOfPlatform()
        this.getStoreGradeList()
      })
    },
    // 店铺评级
    getStoreGradeList() {
      getStoreGradeList().then(res => {
        const data = res.data
        this.findForm.storeGradeOption = data
        const list = data.filter(item => item.hiddenValue === this.formObj.storeGrade)
        this.formObj.storeGrade = list.length ? this.formObj.storeGrade : ''
        this.$set(this.formObj, this.formObj.storeGrade)
      })
    },
    // 店铺等级
    getListOfPlatform() {
      listOfPlatform({ platformName: this.formObj.platformName }).then(res => {
        const data = res.data
        this.findForm.storeLevelOption = data
        const list = data.filter(item => item.hiddenValue === this.formObj.storeLevel)
        this.formObj.storeLevel = list.length ? this.formObj.storeLevel : ''
        this.$set(this.formObj, this.formObj.storeLevel)
      })
    },
    // 币种
    getCurrencyList() {
      currencyList().then(res => {
        this.findForm.regCurrencyOption = res.data
      })
    },
    // 员工列表
    getCompList() {
      compList({ category: 2 }).then(res => {
        const data = res.data
        this.findForm.compOption = data
        const list = data.filter(item => item.id === this.formObj.organizationId)
        this.formObj.organizationId = list.length ? this.formObj.organizationId : ''
      })
    },

    // 字典
    dictionary(code) {
      dictionary({ code: code }).then(res => {
        this.findForm.fbaOption = res.data
      })
    }

  }

}
</script>

<style scoped>
.w200{
  width: 200px !important;
}
.flex-box{
  display:flex;
  justify-content:space-between;
  width: 200px;
}
</style>
