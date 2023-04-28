<template>
  <div>
    <el-card class="box-card">
      <cols-form ref="formRef" :cols="1" message-style :form-item="formItem" :form-info="formInfo" />
      <el-table :data="tableData"
                stripe
                border
                size="mini"
                class="g-table g-table-dense"
                :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}"
      >
        <el-table-column label="登陆账户">
          <template v-slot="{$index}">
            <!-- <el-select v-model="accountInfo[$index]"
                       filterable
                       clearable
                       size="mini"
                       placeholder="请选择"
                       @change="selectAccount"
            >
              <el-option v-for="(item,i) in accountAll" :key="i" :value="item.id" :label="item.account" />
            </el-select> -->
            <remote-select v-model="accountInfo[$index]" :fetch="getUserList" option-label="account" option-value="account" prop="fuzzyName" size="mini" @changeOption="changeOption($event,$index)" />
          </template>
        </el-table-column>
        <el-table-column v-for="item in headers" :key="item.prop" v-bind="item" width="120" />
        <el-table-column width="120">
          <template #header>
            <i class="el-icon-circle-plus icon-color" @click="addData" />
          </template>
          <template v-slot="{row,column,$index}">
            <i class="el-icon-remove icon-del" @click="delData($index)" />
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" size="mini" @click="saveData">保存</el-button>
      <el-button type="plan" size="mini" @click="cancelData">取消</el-button>
    </el-card>

  </div>

</template>

<script>
import remoteSelect from '@/views/components/remoteSelect.vue'
import { getStoreCodeListUnlimit, getPlatformListUnlimit, getUserList } from '@/api/common'
import { getPermissionSubmit, getPermissionDetail } from '@/api/system/permission'
import colsForm from '@/views/components/colsForm'
export default {
  components: { colsForm, remoteSelect },
  props: {
    isAdd: Boolean,
    row: Object
  },
  data() {
    return {
      getUserList,
      accountInfo: [],

      formInfo: {
        platformCode: '',
        storeCode: ''
      },
      formItem: [
        {
          type: 'gselect',
          label: '平台名称',
          prop: 'platformCode',
          options: [],
          optionValue: 'platformCode',
          optionLabel: 'platformName',
          required: true,
          attrs: {
            disabled: !this.isAdd
          }
        },
        {
          type: 'gselect',
          label: '店铺编码',
          prop: 'storeCode',
          optionValue: 'value',
          options: [],
          attrs: {
            disabled: !this.isAdd
          },
          placeholder: !this.isAdd ? '""' : '请选择店铺编码'
        }
      ],
      headers: [

        { label: '姓名', prop: 'name' },
        { label: '岗位', prop: 'postName' },
        { label: '职业', prop: 'positionName' }
      ],
      tableData: [
        { account: '', name: '', postName: '', positionName: '' }

      ]
    }
  },
  watch: {
    'formInfo.platformCode'(val) {
      this.formInfo.storeCode = ''
      if (val) {
        getStoreCodeListUnlimit({ platformCode: val }).then(res => {
          this.formItem[1].options = res.data
        })
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    changeOption(val, index) {
      this.tableData.splice(index, 1, val)
    },
    getData() {
      if (!this.isAdd) {
        this.formInfo.platformCode = this.row.platformCode
        this.formInfo.storeCode = this.row.storeCode
        getPermissionDetail({ id: this.row.id }).then(res => {
          if (res.data.permissionDetailList.length) {
            this.tableData = res.data.permissionDetailList
            this.accountInfo = this.tableData.map(item => item.account)
          } else {
            this.tableData = [{ account: '', name: '', postName: '', positionName: '' }]
          }
        })
      }
      Promise.all([
        getPlatformListUnlimit(),
        getStoreCodeListUnlimit()

      ]).then(res => {
        this.formItem[0].options = res[0].data
        this.formItem[1].options = res[1].data
      })
    },
    delData(i) {
      if (this.tableData.length === 1) { return this.$message.warning('已经是最后一个了') }
      this.accountInfo.splice(i, 1)
      this.tableData.splice(i, 1)
    },
    saveData() {
      this.$refs.formRef.colsForm.validate(val => {
        if (val) {
          const params = this.isAdd ? { platformCode: this.formInfo.platformCode, storeCode: this.formInfo.storeCode } : { platformCode: this.row.platformCode, storeCode: this.row.storeCode }

          var userIdList = this.tableData.map(item => item.userId)

          getPermissionSubmit({ userIdList, id: this.row.id, ...params }).then(res => {
            this.$message.success(res.msg)
            this.$parent.$emit('close', true)
          })
        }
      })
    },
    selectAccount(val) {

    },
    cancelData() {
      this.$parent.$emit('close')
    },
    addData() {
      if (!this.accountInfo[this.tableData.length - 1]) { return this.$message.warning('请选择登陆账户') }
      this.tableData.push({ account: '', name: '', postName: '', positionName: '' })
    }
  }
}
</script>

<style scoped lang="scss">
.icon-color{
  font-size: 24px;
  color: dodgerblue;
}
.icon-del{
  font-size: 24px;
  color: #F56C6C;
}

</style>
