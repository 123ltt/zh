<template>
  <!-- 供应商分配/批量修改 -->
  <el-card v-loading="loading" class="cardBox">
    <el-card class="cardBox">
      <div slot="header" style="heigt:20px;line-height:20px;">
        <span style="font-weight: 600;">批量修改</span>
      </div>
      <el-table :data="changeTable" size="mini" max-height="400px" class="g-table" stripe style="width: 100%" border>
        <el-table-column label="岗位" prop="name" align="center" min-width="120">
          <template slot-scope="scope">
            <el-select v-model="scope.row.updateTypeEnum" clearable placeholder="请先选择岗位" filterable style="width:100%" size="mini" @change="changeEnum">
              <el-option v-for="item in enumList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="当前对接人" align="center" fixed="right" min-width="150">
          <template slot-scope="scope">
            <g-select v-model="scope.row.oldPersonId" style="width:100%;" :items="userList" key-field="id" label-field="name" value-field="id" @change="getSeach(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="新对接人" align="center" fixed="right" min-width="150">
          <template slot-scope="scope">
            <g-select v-model="scope.row.newPersonId" style="width:100%;" :items="userList" key-field="id" label-field="name" value-field="id" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" min-width="100">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="changeBtn(scope.row)">确认更改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="caozuo">
      <div slot="header">
        <span style="font-weight: 600;">查询结果列表</span>
      </div>
      <el-table :data="seachTable" size="mini" max-height="300px" class="g-table" stripe style="width: 100%" border>
        <el-table-column prop="supplierName" label="供应商名称" align="center" min-width="160" show-overflow-tooltip />
        <el-table-column prop="localPurchaserName" label="本地采购" align="center" min-width="100" />
        <el-table-column prop="overseaPurchaserName" label="海外采购" align="center" min-width="100" />
        <el-table-column prop="developerName" label="开发员" align="center" min-width="100" />
        <el-table-column prop="productDirectorName" label="产品对接员" align="center" min-width="100" />
      </el-table>
    </el-card>
  </el-card>
</template>

<script>

import { getList, batchUpdate } from '@/api/basicManagement/distribution.js'

import { getUser } from '@/api/commonApi.js'

export default {
  name: 'ProductBatch',
  data() {
    return {
      loading: false,
      changeTable: [
        { updateTypeEnum: '', oldPersonId: '', newPersonId: '' }
      ],
      enumList: [
        { id: 'LocalPurchaser', name: '本地采购' },
        { id: 'OverseaPurchaser', name: '海外采购' },
        { id: 'Developer', name: '开发员' },
        { id: 'ProductDirector', name: '产品对接人' }
      ],
      seachTable: [],
      seachObj: {
        LocalPurchaser: 'localPurchaserId',
        OverseaPurchaser: 'overseaPurchaserId',
        Developer: 'developerId',
        ProductDirector: 'productDirectorId'
      },
      userList: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      this.loading = true
      getUser().then(res => {
        this.userList = res.data.records
        this.loading = false
      })
    },
    getSeach(val) {
      if (val.oldPersonId) {
        const obj = {}
        obj[this.seachObj[val.updateTypeEnum]] = val.oldPersonId
        getList(1, -1, obj).then(res => {
          this.seachTable = res.data.records
          if (!this.seachTable.length) {
            this.$message.error('未查到当前对接人数据！')
          }
        })
      }
    },
    changeBtn(val) {
      if (val.newPersonId && val.oldPersonId) {
        this.loading = true
        const upData = {
          newPersonId: val.newPersonId,
          oldPersonId: val.oldPersonId,
          updateTypeEnum: val.updateTypeEnum
        }
        batchUpdate(upData).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.changeTable.forEach(item => {
            item.oldPersonId = ''
            item.newPersonId = ''
          })
          this.seachTable = []
          this.loading = false
        })
      } else {
        this.$message.error('请先选择对接双方！')
      }
    },
    changeEnum() {
      this.changeTable[0].oldPersonId = ''
      this.changeTable[0].newPersonId = ''
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item{
  margin-bottom: 10px!important;
}
.redStar{
  color: red;
  font-size: 12px;
}
.cardBox{
  ::v-deep .el-card__body{
    padding: 0;

  }
}
</style>
