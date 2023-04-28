<template>
  <el-form ref="form" :rules="rules" :model="form" size="mini" label-width="80px">
    <el-row>
      <el-col :span="24">
        <el-form-item label="店铺" prop="account">
          <el-select v-model="form.account" placeholder="请选择" clearable style="width:100%">
            <el-option v-for="(item,index) in storeCodeOption" :key="index" :label="item.displayName" :value="item.displayName" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="设置调价">
          <div class="config-values">
            <el-row :gutter="5" class="config-title-row">
              <el-col :span="6">区域</el-col>
              <el-col :span="14">调价方式
                <el-radio-group v-model="form.priceAdjustMethod">
                  <el-radio :label="1">按金额</el-radio>
                  <el-radio :label="2">按比例</el-radio>
                </el-radio-group>
              </el-col>
            </el-row>
            <el-row v-for="(item, i) in form.areaList" :key="i" :gutter="5" style="margin-bottom:4px;">
              <el-col :span="6">
                {{ item.areaName }}
              </el-col>
              <el-col :span="14">
                <el-select v-model="item.updateType" style="width:100px">
                  <el-option v-for="(citem,cindex) in updateTypeOption" :key="cindex" :label="citem.label" :value="citem.value" />
                </el-select>
                <el-input v-if="form.priceAdjustMethod ===1" v-model="item.price" v-input.positive placeholder="请输入" size="mini" clearable style="width:160px;" class="mx-2" @input="() => { item.price = toFixed2(item.price) }" />
                <el-input v-else v-model="item.price" v-input.positive.number placeholder="请输入" size="mini" clearable style="width:160px;" class="mx-2" />
                <span class="m-s-1">{{ form.priceAdjustMethod===2?'%':'USD' }}</span>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="text-end">
      <el-button size="mini" @click="$parent.$emit('close')">取消</el-button>
      <el-button type="primary" size="mini" :disabled="row ? submitBtnEnable : false" @click="submitDialog('form')">保存</el-button>
    </div>
  </el-form>
</template>

<script>
import { deepClone, toFixed2 } from '@/util/util'
import { adjustAdd, adjustDetail, adjustUpdate } from '@/api/aliExpress/temp.js'
import * as addListingHandle from '../../../aliExpress/components/aliExpress.handle.js'
export default {
  name: 'EditModal',
  props: {
    row: {
      type: Object
    },
    storeCodeOption: {
      type: Array
    }
  },
  data() {
    return {
      toFixed2,
      form: {
        priceAdjustMethod: 1,
        areaList: []
      },
      updateTypeOption: [{ label: '+', value: 1 }, { label: '-', value: 2 }],
      oldForm: {},
      countryList: deepClone(addListingHandle.countryList),
      rules: {
        account: [{ required: true, message: '店铺不能为空', trigger: 'change' }],
        name: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.form))
    }
  },
  mounted() {
    this.row && this.getAdjustDetail()
    if (!this.row) {
      this.countryList.forEach(item => {
        this.form.areaList.push({ areaCode: item.code, areaName: item.eName })
      })
    }
  },
  methods: {
    getAdjustDetail() {
      adjustDetail(this.row.id).then(res => {
        const data = res.data
        this.countryList.forEach(item => {
          item.areaCode = item.code
          item.areaName = item.eName
          data.areaList.forEach(list => {
            if (item.code === list.areaCode) {
              item.price = list.price
              item.updateType = list.updateType
            }
          })
        })
        this.$nextTick(() => {
          data.areaList = deepClone(this.countryList)
          this.form = data
          this.oldForm = deepClone(res.data)
        })
      })
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const form = this.form
          const params = {
            account: form.account,
            name: form.name,
            priceAdjustMethod: form.priceAdjustMethod
          }
          params.areaList = form.areaList.filter(item => item.price && item.price !== '')
          if (this.row && this.row.id) {
            adjustUpdate({ ...params, id: this.row.id }).then(res => {
              this.$message.success(res.msg)
              this.$parent.$emit('close', true)
            })
          } else {
            adjustAdd({ ...params }).then(res => {
              this.$message.success(res.msg)
              this.$parent.$emit('close', true)
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.config-values{
  border-radius:6px;
  padding:6px;
  border: 1px solid #ddd;
  height: 320px;
  overflow-y: scroll;
  .el-form-item--mini.el-form-item{
    margin-bottom: 0;
  }
}
</style>
