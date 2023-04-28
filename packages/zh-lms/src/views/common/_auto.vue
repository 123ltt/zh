<template>
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id" :page-size="10">
      <template slot="header">
        <el-form ref="formName" :model="form" size="mini" label-width="70px" class="no-message form-col">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="平台" prop="feedPlatform">
                <el-select v-model="form.feedPlatform" filterable class="w-100" clearable @change="platformChange">
                  <el-option v-for="item in platformList" :key="item.candidateDisplayName" :label="item.displayName" :value="item.candidateDisplayName" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="店铺" prop="accounts">
                <el-select v-model="form.accounts" collapse-tags multiple filterable clearable class="w-100" @focus="getAccountOption">
                  <el-option v-for="item in autoList" :key="item.hiddenValue" :label="item.displayName" :value="item.displayName" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="添加人" prop="createUser" label-width="50px">
                <g-select v-model="form.createUser" :items="createUserOption" key-field="id" label-field="nameJobNumber" value-field="id" class="w-100" @change="changeUser" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态" prop="feedStatus">
                <el-select v-model="form.feedStatus" filterable clearable class="w-100">
                  <el-option v-for="item in feedStatus" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="SKU/SPU" prop="sku">
                <el-input v-model="form.sku" placeholder="请输入" class="w-100" type="textarea" :rows="1" @change="getSkuList" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="添加时间">
                <el-date-picker
                  v-model="form.dateTime"
                  type="datetimerange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  class="w-100"
                  :default-time="['00:00:00', '23:59:59']"
                  @change="getDateTime"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-button type="primary" @click="search">搜索</el-button>
                <el-button @click="resetForm('formName')">清空</el-button>
                <!-- <el-button type="primary" size="mini" @click="autoPublication">添加SKU/SPU</el-button>
                <el-button type="primary" @click="exportExcel">导出</el-button> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <div style="text-align:right;margin-right:5rem">
              <el-button type="primary" size="mini" @click="autoPublication">添加SKU/SPU</el-button>
              <el-button type="primary" size="mini" @click="exportExcel">导出</el-button>
            </div>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="status" label="更新结果">
        <template v-slot="{row}">
          <span>{{ ['待创建','进行中','创建失败','创建成功'][row.feedStatus-1] }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="feedMsg" label="报错内容">
        <template v-slot="{row}">
          <g-text-ellipsis><span>{{ row.feedMsg }}</span></g-text-ellipsis>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>
<script>
import { deepClone, dowloadExc } from '@/util/util'
import { optionsWithPlatformCode, getUserList } from '@/api/amazon/amazon'
import { getAutoPublication, platformOption, autoPulicationApi } from '@/api/common.js'
import autoPublication from './modal/autoPublication.vue'
export default {
  name: 'LmsCommonAuto',
  data() {
    return {
      descs: 'create_time',
      form: {
        // descs: 'create_time',
        dateTime: [],
        accounts: []
      },
      headers: [
        { type: 'index', label: '序号' },
        { prop: 'sku', label: 'sku/spu' },
        { prop: 'feedPlatform', label: '平台' },
        { prop: 'account', label: '店铺' },
        { slot: true, slotName: 'status' },
        { slot: true, slotName: 'feedMsg' },
        // { prop: 'feedMsg', label: '报错内容' },
        { prop: 'createUserName', label: '添加人' },
        { prop: 'createTime', label: '添加时间' }
      ],
      feedStatus: [
        { value: 1, label: '待创建' },
        { value: 2, label: '进行中' },
        { value: 3, label: '创建失败' },
        { value: 4, label: '创建成功' }
      ],
      platformList: [],
      autoList: [],
      createUserOption: []
    }
  },
  created() {
    this.getOptionsWithPlatformCode()
    this.getUserList()
  },
  mounted() {
    this.refresh()
  },
  methods: {
    // 导出按钮
    exportExcel() {
      this.$confirm('确定导出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const name = '自动刊登导出数据.xlsx'
        const params = {
          ...this.form,
          accounts: this.form.accounts,
          createUser: this.form.createUser,
          skus: this.form.skus
        }
        autoPulicationApi(params).then((res) => {
          if (res.size) {
            dowloadExc(res, name)
          }
        })
      }).catch(() => {
        console.log('catch导出错误')
      })
    },
    getSkuList(val) {
      const mulSku = Array.from(new Set(val.split(/,|，|；|;|\r|\n|\r\n|\s+/)))
      // 删除空字符串
      if (mulSku.includes('')) mulSku.splice(mulSku.findIndex(its => its === ''), 1)
      this.$set(this.form, 'skus', mulSku)
    },
    platformChange(val) {
      if (val) {
        optionsWithPlatformCode({ platformCode: val }).then(res => {
          this.autoList = res.data
        })
      }
    },
    getDateTime(val) {
      if (val) {
        this.form.createTimeStart = val[0]
        this.form.createTimeEnd = val[1]
        this.form.dateTime = val
      } else {
        this.form.createTimeStart = ''
        this.form.createTimeEnd = ''
      }
    },
    refresh() {
      this.$refs.table.load(1, this.form)
    },
    fetch({ current, size }, params) {
      // 去除sku字段
      const deepParams = deepClone(params)
      this.$delete(deepParams, 'sku')
      return getAutoPublication({ current, size }, deepParams).then(res => {
        const data = res.data
        const records = data.records.map(item => { item.feedPlatform = this.platformList.find(its => its.candidateDisplayName === item.feedPlatform).displayName; return item })
        return {
          records: records, // 列表数据
          total: data.total, // 总记录数
          size: data.size // 每页最大记录数
        }
      })
    },
    getAccountOption() {
      if (!this.form.feedPlatform) this.$message.warning('请先选择平台')
    },
    // 店铺列表
    getOptionsWithPlatformCode() {
      Promise.all([platformOption()]).then(res => {
        this.platformList = res[0].data
      })
    },
    changeUser(val) {
      this.form.createUser = val && val.id
    },
    // 创建人列表
    getUserList(query) {
      this.loadingUser = true
      getUserList({ name: query, current: 1, size: 9999 }).then(res => {
        this.loadingUser = false
        const records = res.data.records
        records.forEach(item => {
          item.nameJobNumber = `${item.name}${item.jobNumber}`
        })
        this.createUserOption = records
      }).finally(() => {
        this.loadingUser = false
      })
    },
    autoPublication() {
      this.$modal({
        title: '指定sku自动刊登',
        width: '500px',
        data: {
          // autoList: this.autoList
        },
        component: autoPublication,
        callback: refresh => {
          refresh && this.refresh(1)
        }
      })
    },
    search() {
      this.refresh()
    },
    resetForm() {
      this.form = {
        // descs: 'create_time'
      }
      this.refresh(1)
    }
  }
}
</script>
