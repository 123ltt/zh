<template>
  <basic-container>
    <el-form ref="form" :model="form" size="mini" class="sp-form  form-col" style="width:45%;">
      <el-table :data="form.tableData" row-key="productSku" border class="form-table g-table g-table-dense">
        <el-table-column label="运输方式">
          <template slot-scope="{ row, $index }">
            <!-- <el-input v-model="row.transpo" size="mini" /> -->
            <el-form-item
              :prop="'tableData.' + $index + '.transport'"
              class="pt-3"
            >
              <el-input v-model="row.transport" size="mini" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="报关周期">
          <template slot-scope="{ row , $index }">
            <!-- <el-input v-model="row.cycle" size="mini" /> -->
            <el-form-item
              :prop="'tableData.' + $index + '.customCycle'"
              class="pt-3"
            >
              <el-input v-model="row.customCycle" size="mini" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="">
          <template slot-scope="{ row, $index }">
            <el-form-item
              :prop="'tableData.' + $index + '.unit'"
              class="pt-3"
            >
              <el-input v-model="row.unit" size="mini" readonly />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="" style="height:40px;" class="changebtn">
          <template slot-scope="{row, $index }" class="pt-0 pb-0 mt-0">
            <el-button v-if="form.tableData.length > 0" circle icon="el-icon-minus" size="mini" title="点击删除" @click="removeRow(row, $index)" />
            <el-button circle icon="el-icon-plus" size="mini" title="点击添加" @click="addRow(row, $index)" />
          </template>
        </el-table-column>
      </el-table>
      <el-form-item class="pt-4" style="margin-left: 400px;">
        <el-button type="primary" icon="el-icon-refresh" @click="search">取消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="reset">保存</el-button>
      </el-form-item>
    </el-form></basic-container>
</template>

<script>
// import siteModal from './modal/siteModal.vue'
// import journalModal from './modal/journalModal.vue'
// import tempImport from './modal/tempImport.vue'
// import { optionsWithPlatformCode } from '@/api/amazon/amazon.js'
// import { imglist, platformAll } from '@/api/common.js'
// import { imglist } from '@/api/common.js'
// import { deepClone } from '@/util/util'
export default {
  name: 'RuleSetting',
  data() {
    return {
      tableData: [{
        transport: '海运',
        customCycle: '',
        unit: '天'
      }
      ],
      form: {
        tableData: [{
          transport: '海运',
          customCycle: '',
          unit: '天'
        }]
      },
      headers: [
        { prop: 'transport', label: '运输方式' },
        { prop: 'customCycle', label: '报关周期' },
        { prop: 'unit', label: '单位' }
      ],
      platformList: [],
      storeList: [],
      requestFlag: false
    }
  },
  mounted() {

  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
      this.form.preDate = null
      this.search()
    },
    search() {
      this.getData()
    },
    addRow(row, index) {
      this.form.tableData.push({ transport: '', customCycle: [], unit: '天' })
    },
    removeRow(row, index) {
      this.form.tableData.splice(index, 1)
    },
    getData() {
      // let params = {}
      // params = Object.assign({}, this.form)
      // this.$refs.table.load(1, params)
    }
    // fetch({ current, size }, params) {
    //   return imglist({ current, size, ...params }).then(res => {
    //     console.log(1111111)
    //   }).catch(() => {
    //     return {
    //       records: [{
    //         account: 'finerysale',
    //         accountCode: 'ebay_007I',
    //         createDept: '-1',
    //         createTime: '2021-06-18 09:09:09',
    //         createUser: '1367779878467063809',
    //         id: '1405694034512449538',
    //         imageDomain: 'https://guic8593-pic.efinny.net',
    //         isDeleted: 0,
    //         platform: 'ebay',
    //         status: 1,
    //         updateTime: '2021-06-18 09:09:09',
    //         updateUser: '1367779878467063809'
    //       }, {
    //         account: 'guic8593',
    //         accountCode: 'ebay_007H',
    //         createDept: '-1',
    //         createTime: '2021-06-17 18:16:18',
    //         createUser: '1367779878467063809',
    //         id: '1405469341370740737',
    //         imageDomain: 'https://guic8593-pic.efinny.net',
    //         isDeleted: 0,
    //         platform: 'ebay',
    //         status: 1,
    //         updateTime: '2021-06-17 18:16:18',
    //         updateUser: '1367779878467063809'
    //       }], // 列表数据
    //       total: 2, // 总记录数
    //       size: 20 // 每页最大记录数
    //     }
    //   }).finally(() => {
    //     // this.loading = false
    //   })
    // },
  }
}
</script>

<style lang="scss" scoped>
</style>
