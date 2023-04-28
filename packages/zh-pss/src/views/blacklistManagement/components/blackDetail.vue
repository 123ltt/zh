<template>
  <el-form v-loading="loading" label-width="120px" size="mini" class="no-message">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="供应商名称">
          <el-input :value="detaildata.supplierName" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="商品名称" style="width:100%">
          <el-input :value="detaildata.goodsName" disabled style="width:100%" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="商品编码">
          <el-input :value="detaildata.goodsCode" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="黑名单原因">
          <el-input :value="detaildata.reason" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="创建人">
          <el-input :value="detaildata.createUser" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="创建时间">
          <el-input :value="detaildata.createTime" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="最后修改人">
          <el-input :value="detaildata.updateUser" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="最后修改时间">
          <el-input :value="detaildata.updateTime" disabled />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

</template>
<script>
import { getDetail } from '@/api/basicManagement/blacklistOfSuppliers'
export default {
  name: 'BlackDetail',
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      isShow: false,
      detaildata: {}
    }
  },
  mounted() {
    this.getData(this.id)
  },
  methods: {
    getData(id) {
      this.loading = true
      getDetail(id).then(res => {
        if (res.code === 200) {
          this.detaildata = res.data
          this.loading = false
        }
      })
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>
