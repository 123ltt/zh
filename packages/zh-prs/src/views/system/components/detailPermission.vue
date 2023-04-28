<template>
  <basic-container>
    <el-card header="基本信息" class="detailCard">
      <g-list-group :cols="2">
        <g-list-group-item label="平台名称">
          {{ detailList.platformCode }}
        </g-list-group-item>

        <g-list-group-item label="店铺编码">
          {{ detailList.storeCode }}
        </g-list-group-item>
      </g-list-group>
    </el-card>
    <el-card header="用户授权" class="detailCard">

      <el-table class="g-table g-table-dense"
                stripe
                border
                :data="detailList.permissionDetailList"
      >
        <el-table-column v-for="item in headerPermission" :key="item.prop" v-bind="item" />
      </el-table>
    </el-card>
    <el-card header="操作记录" class="detailCard">

      <el-table class="g-table g-table-dense"
                stripe
                border
                :data="recordList"
      >
        <el-table-column v-for="item in headerRecord" :key="item.prop" v-bind="item" />
      </el-table>
    </el-card>
  </basic-container>
</template>

<script>
import { getPermissionDetail, getPermissionHis } from '@/api/system/permission'
export default {
  props: {
    id: String
  },
  data() {
    return {
      detailList: [],
      recordList: [],
      headerPermission: [
        { label: '登陆账户', prop: 'account' },
        { label: '姓名', prop: 'name' },
        { label: '岗位', prop: 'postName' },
        { label: '职业', prop: 'positionName' }
      ],
      headerRecord: [
        { label: '操作人', prop: 'createUser' },
        { label: '操作时间', prop: 'createTime' },
        { label: '操作记录', prop: 'record' }
      ]
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      getPermissionDetail({ id: (this.id) }).then(res => {
        this.detailList = res.data
      })
      getPermissionHis({ id: (this.id) }).then(res => {
        this.recordList = res.data
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.detailCard ::v-deep{
  .el-card__header{
    font-weight: 700;
    background: linear-gradient(to right, #f5f4f4,#fff);
  }
  .el-card__body{
    padding-left: 30px;
  }
}
</style>
