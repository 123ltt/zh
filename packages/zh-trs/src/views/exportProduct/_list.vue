<template>
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch">
      <el-table-column slot="skuSlot" label="SKU编码">
        <template v-slot="{row}">
          <g-link class="text-primary" @click="openSpuSkuDetail(row.productSku, row.name)">{{ row.productSku }}</g-link>
        </template>
      </el-table-column>
      <template slot="header">
        <el-form ref="form" :inline="true" :model="form" size="mini">
          <el-row>
            <el-col :span="6">
              <el-form-item label="SKU编码" prop="productSku" class="ms-4">
                <el-input v-model="form.productSku" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申报品名" prop="declareProductName">
                <el-input v-model="form.declareProductName" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="HS编码" prop="hsCode" class="ms-4">
                <el-input v-model="form.hsCode" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleImport">导入</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="hscodeSlot" label="HS编码" width="130px">
        <template v-slot="{row}">
          <el-input v-model="row.hsCode" type="text" />
        </template>
      </el-table-column>
      <el-table-column slot="reportItemSlot" label="申报要素" width="130px">
        <template v-slot="{row}">
          <el-input
            v-model="row.declareElement"
            type="textarea"
            :rows="3"
            placeholder=""
          />
        </template>
      </el-table-column>
      <el-table-column slot="handSlot" label="操作" width="55px">
        <template slot-scope="scope">
          <el-row>
            <el-col>
              <el-button type="text" class="pd-r0" @click="del(scope.row.id)">删除</el-button>
            </el-col>
            <el-col>
              <el-button type="text" class="pd-r0" @click="save(scope.row)">保存</el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { openSpuSkuDetail } from '@/views/components/utils.js'
import { exportList, rowDelete, rowSave } from '@/api/export.js'
import ExelImport from '@/views/components/exelImport.vue'
export default {
  name: 'TrsExportProductList',
  data() {
    return {
      openSpuSkuDetail,
      form: {
        declareProductName: null,
        hsCode: null,
        productSku: null
      },
      headers: [
        { slot: true, slotName: 'skuSlot' },
        { prop: 'productDesc', label: '产品描述' },
        { prop: 'declareProductName', label: '申报品名' },
        { slot: true, slotName: 'hscodeSlot' },
        { prop: 'licenseCode', label: '许可证代码', width: '90px' },
        { prop: 'exportRebateRate', label: '出口退税率', width: '90px' },
        { prop: 'firstStatutoryUnit', label: '第一法定单位' },
        { prop: 'secondStatutoryUnit', label: '第二法定单位' },
        { slot: true, slotName: 'reportItemSlot' },
        { slot: true, slotName: 'handSlot' },
        { prop: 'updateUserName', label: '修改人' },
        { prop: 'updateTime', label: '修改时间' }
      ]
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
      this.form.declareProductName = null
      this.form.hsCode = null
      this.form.productSku = null
      this.search()
    },
    search() {
      this.getData()
    },
    // 导入
    handleImport() {
      this.$modal({
        title: '导入',
        width: '560px',
        component: ExelImport,
        callback: (refresh) => {
          refresh && this.getData()
        }
      })
    },
    del(id) {
      this.$confirm('请确认是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = id
        rowDelete(ids).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功') && this.getData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    save(row) {
      const params = {
        declareElement: row.declareElement,
        hsCode: row.hsCode,
        id: row.id
      }
      rowSave(params).then(res => {
        if (res.code === 200) {
          this.$message.success('保存成功') && this.getData()
        }
      })
    },
    getData() {
      let params = {}
      params = Object.assign({}, this.form)
      this.$refs.table.load(1, params)
    },
    fetch({ current, size }, params) {
      return exportList({ current, size, ...params }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-col{
  margin-bottom:-3px;
}
::v-deep .pd-r0.el-button{
  padding-right:0;
  padding-left:0;
}
</style>
