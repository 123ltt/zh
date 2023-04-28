<template>
  <div class="basic-container-box">
    <el-form ref="formObjRef" v-loading="loading" :model="formObj" label-width="100px" size="mini" class="form-col">
      <el-row>
        <el-col :span="12">
          <el-form-item label="主销售" prop="sellerName">
            <span>{{ formObj.sellerName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主客服" prop="customerServiceName">
            <span>{{ formObj.customerServiceName }}</span>
          </el-form-item>
        </el-col>
        <el-col v-if="formObj.assignedSellerList && formObj.assignedSellerList.length" v-loading="loading" :span="24">
          <el-form-item label="已分配的销售" prop="sellerName">
            <div v-for="(sitem,index) in formObj.assignedSellerList" :key="index" :disabled="!sitem.isPermitted" class="line-box">
              <el-button>{{ sitem.name }} <i v-if="sitem.isPermitted" class="el-icon-circle-close fz20" @click="delAssignedSeller(sitem,index)" /></el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="其他销售" prop="sellerIdList">
            <el-select v-model="formObj.sellerIdList" filterable multiple default-first-option clearable placeholder="请选择" size="mini" style="width:100%">
              <el-option v-for="(item,index) in sellerNameOption" :key="index" :label="item.name" :value="item.seller" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="footer" style="text-align: right">
        <el-button size="medium" @click="doclose">取消</el-button>
        <el-button size="medium" type="primary" @click="saveSellerAssign">保存</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getAssignSellerList, saveSellerAssign } from '@/api/storeList'
export default {
  name: 'DistributeStore',
  props: {
    item: {
      type: Object
    },
    sellerType: {
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      formObj: {
        customerServiceName: '',
        sellerName: '',
        sellerIdList: [],
        assignedSellerList: []
      },
      sellerNameOption: []
    }
  },
  created() {
    if (this.item) {
      this.formObj = {
        customerServiceName: this.item.customerServiceName,
        sellerName: this.item.sellerName
      }
    }
    this.getAssignSellerList()
  },
  methods: {
    // 删除
    delAssignedSeller(item, index) {
      this.formObj.assignedSellerList.splice(index, 1)
      this.sellerNameOption.push(item)
      this.$set(this.formObj, index, this.formObj.assignedSellerList)
    },
    getAssignSellerList() {
      this.loading = true
      getAssignSellerList({ id: this.item.id }).then(res => {
        this.loading = false
        const data = res.data
        const sellerIdList = []
        data.assignedSellers.forEach(acc => {
          if (!data.waitAssignSellers.length) {
            sellerIdList.push(acc.name)
          } else {
            sellerIdList.push(acc.seller)
          }
        })
        this.formObj.sellerIdList = []
        this.formObj.assignedSellerList = data.assignedSellers
        if (data.assignedSellers && data.assignedSellers.length) {
          data.waitAssignSellers = data.waitAssignSellers.filter(item => {
            if (data.assignedSellers.findIndex(i => i.seller === item.seller) === -1) {
              return item
            }
          })
        }
        this.sellerNameOption = data.waitAssignSellers
      }).finally(() => {
        this.loading = false
      })
    },
    // 保存
    saveSellerAssign() {
      this.loading = true
      const sellerIdList = this.formObj.sellerIdList
      const assignedSellerListId = []
      const arrList = []
      this.formObj.assignedSellerList.forEach(item => {
        arrList.push(item.seller)
      })
      const arrItem = sellerIdList.concat(arrList)
      arrItem.forEach(item => {
        if (!assignedSellerListId.includes(item)) {
          assignedSellerListId.push(item)
        }
      })
      saveSellerAssign({ storeId: this.item.id, sellerIdList: assignedSellerListId }).then(res => {
        this.loading = false
        this.$message.success(res.msg)
        this.doclose()
      }).finally(() => {
        this.loading = false
      })
    },

    doclose() {
      this.$parent.$emit('close')
    }
  }

}
</script>

<style lang="scss" scoped>
::v-deep .none{display:none !important;}
.line-box{
  display: inline-block;
  margin:0 10px 6px 0;
}
.fz20{
  font-size: 12px;
  margin-left: 4px;
}
</style>
