<template>
  <div>
    <el-form :model="form" :rules="rules" :inline="true" size="mini">
      <el-form-item label="SKU编码" prop="pmsSku">
        <el-input v-model="form.pmsSku" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData">解析</el-button>
      </el-form-item>
    </el-form>
    <div v-if="!show" class="show-box d-flex justify-content-center align-items-center">
      点击解析，查询数据
    </div>
    <div v-else>
      <el-divider content-position="left">解析结果</el-divider>
      <g-list-group label-align="center">
        <g-list-group-item label="SKU图片" label-width="75px">
          <g-thumb :url="data.productPicUrl" />
        </g-list-group-item>
        <g-list-group-item label="SKU名称" label-width="75px">
          <g-text-ellipsis>{{ data.productsName }}</g-text-ellipsis>
        </g-list-group-item>
        <g-list-group-item label="PMS成本价格" label-width="75px">
          <g-text-ellipsis>
            {{ data.skuCost }}
          </g-text-ellipsis>
        </g-list-group-item>
      </g-list-group>
      <g-table
        ref="table"
        :headers="headers"
        row-key="id"
        border
        default-expand-all
        :page-show="false"
        :fixed-height="false"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      />
      <el-row type="flex" justify="end">
        <el-button size="mini" @click="cancle">取消</el-button>
        <el-button type="primary" size="mini" @click.stop="save">确认</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import { analyzeSku, getBySkuAndPackageCode } from '@/api/packOrders'
export default {
  props: {
    omOrderId: {
      type: String,
      default: ''
    },
    skuList: {
      type: Array,
      default: () => []
    },
    index: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      form: { pmsSku: '' },
      rules: {
        pmsSku: [
          { required: true, message: 'SKU编码不能为空' }
        ]
      },
      show: false,
      data: {},
      tableData: [
        { id: 0, warehouseName: '', availableStock: '' }
      ],
      headers: [
        { label: '仓库', prop: 'warehouseName' },
        { label: '可用库存数量', prop: 'availableStock' }
      ]
    }
  },
  methods: {
    getList() {
      getBySkuAndPackageCode({ productSku: this.data.pmsSku, omOrderId: this.omOrderId }).then(res => {
        this.$refs.table.tableList = res.data
      })
    },
    getData() {
      if (!this.form.pmsSku) {
        return
      }
      analyzeSku({ pmsSku: this.form.pmsSku }).then(res => {
        if (!res.data) {
          this.$message.warning('暂无此sku数据')
          return
        }
        let check = false
        this.skuList.forEach(item => {
          if (item.label === res.data.pmsSku) {
            check = true
          }
        })
        if (check) {
          this.$message.warning('新加包裹已有此sku不需要重复添加')
          return
        }
        this.data = res.data
        this.getList()
        this.show = true
      })
    },
    cancle() {
      this.$parent.$emit('close', false)
    },
    save() {
      const data = {
        label: this.data.pmsSku,
        value: this.data.pmsSku,
        platformProductId: ''
      }
      this.close(data)
    },
    close(data) {
      this.$parent.$emit('close', data, this.index)
    }
  }
}
</script>

<style lang="scss" scoped>
.show-box{
  min-height: 200px;
}
</style>
