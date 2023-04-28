<template>
  <basic-container>
    <div class="row">
      <el-button size="mini" @click="search('1688')">1688</el-button>
      <el-button size="mini" @click="search('拼多多')">拼多多</el-button>
      <el-button type="primary" size="mini" @click="addNum">添加买家账号</el-button>
    </div>
    <el-table
      :data="buyerAccountList"
      border
      stripe
      :header-cell-style="{background:'#fafafa',color:'#606266','text-align':'center'}"
      style="width: 100%"
      :cell-style="{'text-align':'center'}"
    >
      <el-table-column
        v-for="(item,index) in numList"
        :key="index"
        :label="item.label"
        :prop="item.prop"
      />
      <el-table-column>
        <template slot="header">
          <el-button type="primary" :loading="loading" icon="el-icon-message-solid" size="mini" @click="syncEvent()">同步全部</el-button>
        </template>
        <template v-slot="scope">
          <el-button v-if="scope.row.syncStatusName != '同步中'" :loading="scope.row.remindLoading" icon="el-icon-message-solid" type="primary" size="mini" @click="syncEvent(scope.row)">开始同步</el-button>
          <el-button type="primary" size="mini" @click="DelEvent(scope.row.id)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </basic-container>
</template>
<script>
import addedit from '../orderManagement/orderManagementModal/addedit.vue'// 弹框组件
import { getBuyerInfo, getPlatformInfo } from '@/api/orderListInfo'// 买家账号+字典数据（平台，状态，付款方式）
import { deleteI, syncOrder } from '@/api/orderSynchronization'// 删除+同步
export default {
  name: 'Synchronizationorder',
  data() {
    return {
      buyerAccountList: [],
      serachData: {
        platformCode: ''
      },
      loading: false,
      numList: [
        { label: '买家ID', prop: 'buyerId' },
        { label: '买家账号', prop: 'buyerAccount' },
        { label: '同步状态', prop: 'syncStatusName' },
        { label: '最近同步时间', prop: 'syncTime' }
      ]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getBuyerInfo().then(res => {
        this.buyerAccountList = res.data
      })
    },
    // 添加买家账号
    addNum() {
      this.$modal({
        title: '添加买家账号',
        component: addedit,
        width: '500px',
        data: {
        },
        callback: (bool) => {
        }
      })
    },
    // 同步-全部同步
    syncEvent(row) {
      const obj = {}
      if (row) {
        console.log('row', row)
        obj.id = row.id
        this.$set(row, 'remindLoading', true)
        if (row.syncStatusName === '同步完成') {
          this.getData()
          this.$set(row, 'remindLoading', false)
          this.$message.success('同步成功~')
        }
      } else {
        console.log('批量同步')
        this.loading = true
        setTimeout(() => {
          this.$message.success('同步成功~')
          this.loading = false
        }, 2000)
      }
      syncOrder(obj).then(res => {
      })
    },

    // 删除
    DelEvent(val) {
      deleteI(val).then(res => {
        this.$confirm('确定删除该文件?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getData()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      })
    },
    // 1688 拼多多
    search(code) {
      if (code === '1688') {
        getPlatformInfo({ code: 'ips_pur_platform' }).then(res => {
          this.serachData.platformCode = res.data[0].dictValue
          getBuyerInfo(this.serachData).then(res => {
            this.buyerAccountList = res.data
          })
        })
      } else {
        //  暂时没有拼多多数据，先写假数据
        getPlatformInfo({ code: 'ips_pur_platform' }).then(res => {
          this.serachData.platformCode = '没有多多平台，先写假数据'
          getBuyerInfo(this.serachData).then(res => {
            this.buyerAccountList = res.data
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.row{
  margin-top: 10px;
  margin-bottom: 10px;
}

</style>
