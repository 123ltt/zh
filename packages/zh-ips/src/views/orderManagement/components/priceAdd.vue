<template>
  <basic-container v-loading="loading">
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form ref="rulesForm" :model="addData" label-width="120px" size="mini">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-row>
              <el-col :span="24">
                <el-form-item label="产品编码" prop="productSku" :rules="{required:true,message:'不能为空',trigger:'blur'}">
                  <el-input v-model.trim="addData.productSku" @blur="getVal(addData.productSku)" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="产品类目" prop="category">
                  <el-input v-model.trim="category" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="产品名称" prop="productName">
                  <el-input v-model.trim="productName" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="采购单价" prop="purchasePrice" :rules="{required:true,message:'不能为空',trigger:'blur'}">
                  <el-input v-model.trim="addData.purchasePrice" v-input.positive clearable placeholder="请输入" @input="getInput">
                    <template slot="append">RMB</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <div class="imgBox">
              <el-image style="width: 60%;" :src="url?url:'https://img.zcool.cn/community/017bcb58b4db5fa801219c7719b5ff.jpg@1280w_1l_2o_100sh.jpg'" />
            </div>
          </el-col>
          <el-col :span="24">
            <el-form-item label="选择供应商" prop="checkData">
              <el-table :data="tableData" border stripe class="g-table">
                <el-table-column width="35">
                  <template slot-scope="scope">
                    <el-radio v-model="select" :label="scope.$index" @change.native="getTemplateRow(scope.$index,scope.row)" />
                  </template>
                </el-table-column>
                <el-table-column prop="supplierName" show-overflow-tooltip label="供应商名称" align="center" min-width="150">
                  <template slot-scope="scope">
                    <span v-if="scope.row.prime===1">(主){{ scope.row.supplierName }}</span>
                    <span v-else>{{ scope.row.supplierName }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="goodsName" label="商品名称" align="center" min-width="100" show-overflow-tooltip />
                <el-table-column prop="goodsPrice" label="商品价格" align="center" min-width="70" />
                <el-table-column prop="purAccountCurrency" label="币种" align="center" min-width="60">
                  <template slot-scope="slot">
                    <span>{{ slot.row.purAccountCurrency===1?'RMB':'' }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="supplierLevel" label="供应商等级" align="center" min-width="85" />
                <el-table-column prop="supplierScore" label="供应商评分" align="center" min-width="85">
                  <template slot-scope="slot">
                    <span>{{ slot.row.supplierScore==-1?'':slot.row.supplierScore }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="manageModel" label="经营模式" align="center" min-width="90">
                  <template slot-scope="slot">
                    <span>{{ manageModelObj[slot.row.manageModel] }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remarks" style="width:100%">
              <el-input v-model.trim="addData.remarks" :rows="2" type="textarea" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item style="text-align: right;padding-right: 20px;">
              <el-button size="mini" icon="el-icon-circle-close" @click="$emit('close')">取消</el-button>
              <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="define()">保存</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </basic-container>

</template>
<script>
import { getGoodsInfo, update, save, getUpdateDetail } from '@/api/ordermanagement/price'
import { dictionary } from '@/api/commonApi'
import { deepClone } from '@/util/util'

export default {
  name: 'IpsProductAdd',
  props: {
    editData: Object
  },
  data() {
    return {
      addData: {
        productSku: '',
        purchasePrice: '',
        remarks: '',
        priceListId: '',
        id: ''
      },
      oldprice: '',
      manageModelObj: {},
      allData: {},
      category: '',
      productName: '',
      url: '',
      tableData: [],
      select: '',
      addEditype: '',
      checkData: {},
      inquiryId: '',
      productSku: '',
      loading: false
    }
  },
  mounted() {
    this.dealWith()
  },
  methods: {
    getInput(val) {
      if (val > 1000000 || (val.split('.')[1] && val.split('.')[1].length > 2)) {
        this.addData.purchasePrice = this.oldprice
      } else {
        this.oldprice = val
      }
    },
    getTemplateRow(index, row) { // 获取选中数据
      this.checkData = deepClone(row)
    },
    getVal(val) {
      if (val) {
        getGoodsInfo(val).then(res => {
          const data = res.data
          this.category = data.category
          this.productName = data.productName
          this.url = data.productImg
          this.tableData = data.inquiryGoodsVOS
        })
      } else {
        this.category = ''
        this.productName = ''
        this.url = ''
        this.tableData = []
        this.select = ''
      }
    },
    // 保存
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (!this.checkData) {
            this.$message.error('请选择主供应商！')
          } else {
            this.allData = Object.assign(this.checkData, this.addData)
            if (this.allData) {
              (this.editData ? update : save)(this.allData).then(res => {
                this.$emit('close', true)
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              })
            }
          }
        }
      })
    },
    dealWith() {
      dictionary('ips_manage_model').then(res => {
        res.data.forEach(item => {
          this.manageModelObj[item.dictKey] = item.dictValue
        })
      })
      if (this.editData) {
        getUpdateDetail(this.editData.id).then(res => {
          const data = res.data
          this.category = data.category
          this.productName = data.productName
          this.url = data.url
          this.tableData = data.inquiryGoodsVOS
          Object.keys(this.addData).forEach(item => {
            this.addData[item] = data[item]
            this.addData.priceListId = data.priceListId
          })
          this.select = data.inquiryGoodsVOS.findIndex((item) => item.supplierId === data.supplierId)
          this.checkData = deepClone(data.inquiryGoodsVOS[this.select])
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-radio__label{
  display: none;
}
.imgBox{
    width: 70%;
    height: 70%;
    display: flex;
    justify-content: center;
    align-items:flex-start;
  }
</style>
