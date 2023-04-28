<template>
  <div>
    <el-card v-loading="loading">
      <div slot="header">
        <span>基本信息</span>
      </div>
      <section class="basic">
        <el-form size="mini" label-width="120px" class="no-message">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="供应商名称">
                <el-input :value="detail.supplierName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商编码">
                <el-input :value="detail.supplierCode" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商归属人">
                <el-input :value="detail.assignName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建人">
                <el-input :value="detail.createUserName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建时间">
                <el-input :value="detail.createTime" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最后修改人">
                <el-input :value="detail.updateUserName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最后修改时间">
                <el-input :value="detail.updateTime" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </section>
    </el-card>
  </div>
</template>

<script>
import { getDetail } from '@/api/supplierManagement/supplierAllocation.js'

export default {
  name: 'IntroductionDetails',
  props: {
    detailData: Object // 父传子的表格参数
  },
  data() {
    return {
      detail: {},
      loading: false
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      getDetail(this.detailData.id).then(res => {
        this.detail = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
*{
    box-sizing: border-box;
}

</style>
