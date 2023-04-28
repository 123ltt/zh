<template>
  <el-form ref="form" v-loading="loading" :model="form" size="mini" class="form-col" label-width="100px" :rules="rules">
    <el-form-item label="平台" prop="feedPlatform">
      <div v-if="row">{{ form.feedPlatform }}</div>
      <el-select v-else v-model="form.feedPlatform" class="w-50" filterable @change="platformChange(form.feedPlatform)">
        <el-option v-for="(item, index) in siteOption" :key="index" :value="item.candidateDisplayName" :label="item.displayName" />
      </el-select>
    </el-form-item>
    <el-form-item label="店铺" prop="accounts" :rules="!(row &&row.id)?rules.accounts:[{required:false}]">
      <div v-if="row">{{ form.account }}</div>
      <g-select v-else v-model="form.accounts" class="w-50" :items="autoList" key-field="hiddenValue" label-field="displayName" value-field="displayName" placeholder="请选择" multiple is-checked-all />
    </el-form-item>
    <el-form-item label="原负责人" prop="originalSaleUser">
      <SelectUser ref="selectUser" :search-data="form" :prop="'originalSaleUser'" class="w-50" />
    </el-form-item>
    <el-form-item label="指定新负责人" prop="newSaleUser">
      <SelectUser ref="selectUser" :search-data="form" :prop="'newSaleUser'" class="w-50" />
    </el-form-item>
    <div class="text-end">
      <el-button size="mini" @click="$parent.$emit('close')">取消</el-button>
      <el-button type="primary" size="mini" @click="submitDialog('form')">保存</el-button>
    </div>
  </el-form>
</template>

<script>
import { optionsWithPlatformCode } from '@/api/amazon/amazon'
import { listingUserFeedSave, listingUserFeedUpdate } from '@/api/common.js'
import SelectUser from '@/views/components/searchHead/selectUser.vue'
export default {
  name: 'EditModel',
  components: { SelectUser },
  props: {
    row: Object,
    siteOption: Array
  },
  data() {
    return {
      loading: false,
      autoList: [],
      form: {
        id: null,
        feedPlatform: '',
        accounts: [],
        newSaleUser: '',
        originalSaleUser: ''
      },
      rules: {
        feedPlatform: [{ required: true, message: '平台不能为空', trigger: 'change' }],
        accounts: [{ required: true, message: '店铺不能为空', trigger: 'change' }],
        originalSaleUser: [{ required: true, message: '原负责人不能为空', trigger: 'change' }],
        newSaleUser: [{ required: true, message: '指定新负责人不能为空', trigger: 'change' }]
      }
    }
  },
  mounted() {
    if (this.row?.id) {
      Object.keys(this.form).forEach(key => {
        this.form[key] = this.row[key]
        if (this.row?.id) {
          this.form.account = this.row.account
        }
      })
    }
  },
  methods: {
    changeUser(val) {
      this.form.accounts = val && val.id
    },
    platformChange(val) {
      if (val) {
        optionsWithPlatformCode({ platformCode: val }).then(res => {
          this.autoList = res.data
        })
      }
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const form = this.form
          if (form.originalSaleUser === form.newSaleUser) return this.$message.error('原负责人和指定新负责人不能是同一个人')
          const msg = '<p class="text-danger">将把“原负责人”名下所有listing的负责人，更新为“指定新负责人”，请确认是否要重新分配负责人！</p>'
          this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            type: 'warning'
          }).then(() => {
            if (this.row?.id) {
              listingUserFeedUpdate(form).then(res => {
                this.$message.success(res.msg)
                this.$parent.$emit('close', true)
              })
            } else {
              listingUserFeedSave(form).then(res => {
                this.$message.success(res.msg)
                this.$parent.$emit('close', true)
              })
            }
          })
        }
      })
    }

  }

}
</script>

<style>

</style>
