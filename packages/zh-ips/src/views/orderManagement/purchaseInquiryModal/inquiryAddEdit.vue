<template>
  <el-form ref="rulesForm" v-loading="loading" :model="addData" label-width="120px" size="mini">
    <div class="bigBox">
      <el-row :gutter="10" class="inputBox">
        <el-col :span="24">
          <el-form-item label="产品名称" prop="productName" :rules="{required:true,message:'不能为空',trigger:'blur'}">
            <el-input v-model.trim="addData.productName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="产品类目" prop="category">
            <el-input v-model.trim="addData.category" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="采购数量" prop="purchaseQty" :rules="{required:true,message:'不能为空',trigger:'blur'}">
            <el-input v-model.trim="addData.purchaseQty" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="采购单价" prop="purchasePrice" :rules="{required:true,message:'不能为空',trigger:'blur'}">
            <el-input v-model.trim="addData.purchasePrice" clearable placeholder="请输入" @blur="getInput(addData.purchasePrice)">
              <template slot="append">RMB</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="imgBox">
        <el-image style="width: 60%;" :src="url?url:'https://img.zcool.cn/community/017bcb58b4db5fa801219c7719b5ff.jpg@1280w_1l_2o_100sh.jpg'" />
      </div>
    </div>
    <el-row :gutter="30">
      <el-col :span="24">
        <el-form-item label="选择供应商" prop="checkData" :rules="{required:true,message:'不能为空',trigger:'change'}">
          <el-table :data="addData.checkData" border stripe class="g-table">
            <el-table-column label="" width="30">
              <template slot-scope="scope">
                <el-radio v-model="select" :label="scope.row.goodsId" @change.native="getTemplateRow(scope.$index,scope.row)" />
              </template>
            </el-table-column>
            <el-table-column prop="supplierName" show-overflow-tooltip label="供应商名称" align="center" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.prime===1">(主){{ scope.row.supplierName }}</span>
                <span v-else>{{ scope.row.supplierName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="商品名称" align="center" min-width="100" show-overflow-tooltip />
            <el-table-column prop="goodsUrl" label="商品链接" align="center" min-width="80">
              <template slot-scope="scope">
                <g-link :href="scope.row.goodsUrl">商品链接</g-link>
              </template>
            </el-table-column>
            <el-table-column prop="goodsPrice" label="商品价格" align="center" min-width="70" />
            <el-table-column prop="purAccountCurrency" label="币种" align="center" min-width="60">
              <template slot-scope="slot">
                <span>{{ slot.row.purAccountCurrency===1?'RMB':'' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="goodsUrl" label="阿里单价" align="center" min-width="80">
              <template slot-scope="scope">
                <span>{{ getPrice(addData.purchaseQty,scope.row.priceRanges) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="purchaseAging" label="采购时效" align="center" min-width="80" />
            <el-table-column prop="supplierLevel" label="供应商等级" align="center" min-width="85" />
            <el-table-column prop="supplierScore" label="供应商评分" align="center" min-width="85">
              <template slot-scope="scope">
                <span>{{ scope.row.supplierScore===-1?'':scope.row.supplierScore }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="manageModel" label="经营模式" align="center" min-width="90">
              <template slot-scope="slot">
                <div v-for="item in newmanageModelList" :key="item.dictKey">
                  <span v-if="slot.row.manageModel == item.dictKey">{{ item.dictValue }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="询价备注" prop="inqueryComment" style="width:100%" :rules="{required:true,message:'不能为空',trigger:'blur'}">
          <el-input v-model.trim="addData.inqueryComment" :rows="2" type="textarea" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item style="text-align: right;padding-right: 20px;">
          <el-button size="mini" icon="el-icon-circle-close" @click="$parent.$emit('close')">取消</el-button>
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="save()">保存</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

</template>
<script>
import { getProductEdit, edit, processAdd } from '@/api/ordermanagement/chaseInquiry'
export default {
  props: {
    newmanageModelList: Array,
    openData: Object,
    idestWarehouseId: String,
    type: String
  },
  data() {
    return {
      addData: {},
      url: '',
      loading: false,
      select: '',
      addEditype: '',
      rows: {},
      inquiryId: '',
      productSku: '',
      id: ''
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 判断阿里价格
    getPrice(val, arr) {
      if (arr.length && val) {
        for (let i = arr.length - 1; i >= 0; i--) {
          if (i === 0) {
            if (+val >= +arr[i].startQuantity) {
              return arr[i].price
            } else {
              return ''
            }
          } else {
            if (+val >= +arr[i].startQuantity) {
              return arr[i].price
            }
          }
        }
      } else {
        return ''
      }
    },
    getInput(val) {
      if (/(^[0-9]{1,6}$)|(^[0-9]{1,6}\.{1}[0-9]{1,2}$)/.test(val)) this.$set(this.addData, 'purchasePrice', val)
      else {
        this.$message.error('最大可输入999999.99; 且最多保留两位小数')
        this.$set(this.addData, 'purchasePrice', '')
      }
    },
    getTemplateRow(index, row) { // 获取选中数据
      this.rows = JSON.parse(JSON.stringify(row))
    },
    getData() {
      this.url = this.openData.productImg
      this.inquiryId = this.openData.inquiryId
      this.productSku = this.openData.productSku
      this.id = this.openData.id
      this.addEditype = this.type
      if (this.type === 'add') {
        this.addData = JSON.parse(JSON.stringify(this.openData))
        this.select = ''
        const obj = {
          productSku: this.openData.productSku,
          destWareHouseId: this.idestWarehouseId
        }
        this.loading = true
        getProductEdit(obj).then(res => {
          this.$set(this.addData, 'checkData', res.data)
          this.loading = false
        })
      } else {
        this.addData = JSON.parse(JSON.stringify(this.openData))
        this.select = this.openData.goodsId
        const obj = {
          productSku: this.openData.productSku,
          destWareHouseId: this.idestWarehouseId
        }
        this.loading = true
        getProductEdit(obj).then(res => {
          this.$set(this.addData, 'checkData', res.data)
          this.loading = false
        })
      }
    },
    save() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (this.select) {
            this.$set(this.rows, 'purchaseQty', this.addData.purchaseQty)
            this.$set(this.rows, 'purchasePrice', this.addData.purchasePrice)
            this.$set(this.rows, 'inqueryComment', this.addData.inqueryComment)
            this.$set(this.rows, 'inquiryId', this.inquiryId)
            this.$set(this.rows, 'productSku', this.productSku)
            this.$set(this.rows, 'id', this.id)
            if (this.addEditype === 'edit') {
              edit(this.rows).then(res => {
                this.$parent.$emit('close', true)
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
              })
            } else if (this.addEditype === 'add') {
              processAdd(this.rows).then(res => {
                this.$parent.$emit('close', true)
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
              })
            }
          } else {
            this.$message({
              message: '必须选择供应商',
              type: 'error'
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep.el-radio__label{
  display: none;
}
.bigBox{
  display: flex;
  align-items: flex-start;
  .inputBox{
    width: 50%;
  }
  .imgBox{
    width: 50%;
    display: flex;
    justify-content: center;
    align-items:flex-start;
  }
}
</style>
