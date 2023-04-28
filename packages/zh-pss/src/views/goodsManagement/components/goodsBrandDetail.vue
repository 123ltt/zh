<template>
  <el-card>
    <el-form size="mini" label-width="90px" class="no-message">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="供应商名称:">
            <el-input :value="detail.supplierName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="商品类目:">
            <el-input :value="detail.category" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="品牌名称:">
            <el-input :value="detail.goodsBrand" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="品牌说明:">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :value="detail.brandDesc" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="创建人:">
            <el-input :value="detail.createUserName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="创建时间:">
            <el-input :value="detail.createTime" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="最后修改人:">
            <el-input :value="detail.updateUserName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="最后修改时间:">
            <el-input :value="detail.updateTime" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import { getDetail } from '@/api/goodsManagement/goodsBrand.js'
export default {
  name: 'GoodsBrandDetail',
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
    this.getData(this.detailData.id)
  },
  methods: {
    getData(val) {
      this.loading = true
      getDetail(val).then(res => {
        this.detail = res.data
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
