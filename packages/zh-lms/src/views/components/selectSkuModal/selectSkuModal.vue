<template>
  <!-- 搜索可刊登的产品弹窗 -->
  <div v-loading="loading" class="log-box">
    <el-form
      ref="screenForm"
      :model="form"
      size="mini"
      class="form-col no-message"
    >
      <el-row>
        <el-col :span="4">
          <el-form-item :label="isVariation ? 'SPU' : 'SKU'" prop="sku" label-width="40px">
            <el-input v-model.trim="form.sku" :placeholder="isVariation ? '请输入SPU' : '请输入SKU'" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="牛蛙SKU" prop="nwSku" label-width="64px">
            <el-input v-model.trim="form.nwSku" placeholder="请输入牛蛙SKU" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="产品名称" prop="productName" label-width="65px">
            <el-input v-model="form.productName" placeholder="请输入产品名称" class="w-100" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="产品类型" prop="type" label-width="70px">
            <el-radio v-if="showType !== 'spu'" v-model="form.type" label="2" @change="current = 1; onLoad()">Normal</el-radio>
            <el-radio v-if="showType !== 'spu'" v-model="form.type" label="3" @change="current = 1; onLoad()">Combo</el-radio>
            <el-radio v-if="showType !== 'sku'" v-model="form.type" label="1" @change="current = 1; onLoad()">Variation</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item label-width="0">
            <div style="display:flex">
              <el-button type="primary" size="mini" @click="current = 1; onLoad()">搜索</el-button>
              <el-button size="mini" @click="$refs['screenForm'].resetFields();onLoad()">清空</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :data="list"
      :header-cell-style="{ background:'#FAFAFA', color:'rgba(0,0,0,.85)' }"
      row-key="productSku"
      border
      stripe
      size="mini"
      class="g-w100 g-table g-table-dense max-h"
    >
      <el-table-column :label="isVariation ? 'SPU' : 'SKU'" prop="productSku" />
      <el-table-column label="牛蛙SKU" prop="nwSku" />
      <el-table-column label="图片" prop="imageUrl">
        <template slot-scope="{ row }">
          <g-thumb :url="row.imageUrl" />
        </template>
      </el-table-column>
      <el-table-column label="产品名称" :show-overflow-tooltip="true" prop="productNameEn" />
      <el-table-column label="操作" prop="handle">
        <template slot-scope="{ row }">
          <el-button type="text" @click="selectHandle(row)">请选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="current"
      :page-size="size"
      :total="total"
      class="pagination"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>

/**
 * @description 搜索可刊登的产品弹窗
 * **/

import { getCanPublishSkuByProduct } from '@/api/pms.js'
export default {
  name: 'SelectSkuModal',
  props: {
    showType: {
      type: String,
      default: 'all' // all, sku, spu
    },
    platformCode: String,
    account: String,
    siteCode: String
  },
  data() {
    return {
      loading: false,
      // 当前页面码
      current: 1,
      // 分页大小
      size: 10,
      total: 0,
      form: {
        sku: '',
        // 产品名称
        productName: '',
        // 产品类型 1spu, 2-normal sku, 3-组合 sku
        type: '2',
        // 牛蛙SKU
        nwSku: ''
      },
      // sku列表数据
      list: []
    }
  },
  computed: {
    isVariation() {
      return this.form.type === '1'
    }
  },
  created() {
    if (this.showType === 'spu') {
      this.form.type = '1'
    }
    this.onLoad()
  },
  methods: {
    onLoad() {
      this.loading = true
      const { type, productName, sku, nwSku } = this.form
      getCanPublishSkuByProduct(this.current, this.size, {
        productSku: !this.isVariation ? sku : undefined,
        productSpu: this.isVariation ? sku : undefined,
        nwSku,
        type,
        productName,
        platformCode: this.platformCode,
        account: this.account,
        siteCode: this.siteCode
      }).then((res) => {
        const { records, total } = res.data
        this.list = records || []
        this.total = total
      }).finally(() => {
        this.loading = false
      })
    },
    // 分页相关
    handleSizeChange(val) {
      this.size = val
      this.onLoad()
    },
    handleCurrentChange(val) {
      this.current = val
      this.onLoad()
    },
    // 选择sku并获取详细信息
    selectHandle(row) {
      this.$parent.$emit('close', row)
    }
  }
}
</script>

<style lang="scss" scoped>
.max-h{
  max-height: 400px;
  overflow: auto;
  &::before{
    height: 0
  }
}
.pagination{
  text-align: right;
  padding-top: 18px;
  border-top: 1px #EBEEF5 solid;
}
::v-deep .el-form-item__label {
  padding: 0 10px 0 0;
}
.log-box {
  ::v-deep .el-radio {
    margin-right: 5px;
  }
}
</style>
