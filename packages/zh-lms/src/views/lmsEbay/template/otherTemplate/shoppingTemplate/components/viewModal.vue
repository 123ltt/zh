<template>
  <basic-container style="min-width: 0">
    <el-form :model="form" size="mini" label-width="90px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称" prop="templateShop">
            {{ form.policyName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="刊登站点" prop="siteCode">
            {{ form.siteCode }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="店铺" prop="">
            {{ form.storeName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模板类型" prop="storeName">
            {{ form.policyInfo.warehouseId }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品所在地" prop="">
            {{ form.policyInfo.listingLocation }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="国家或地区" prop="">
            {{ form.policyInfo.countryOrRegion }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮编" prop="">
            {{ form.policyInfo.postCode }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="处理时间" prop="">
            {{ form.policyInfo.dispatchTimeMax }} 个工作日
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="默认模板" prop="">
            {{ form.isDefault ? '是' : '否' }}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="国内运输">
            <div class="config-values">
              <el-row :gutter="5" class="config-title-row">
                <el-col :span="10">运输方式</el-col>
                <el-col :span="5">运费</el-col>
                <el-col :span="5">额外每件加收</el-col>
                <el-col :span="3">是否免运费</el-col>
              </el-row>
              <el-row v-for="(item, i) in form.policyInfo.domesticInfo" :key="i" :gutter="5" style="margin-bottom:4px;">
                <el-col :span="10">
                  <el-form-item>
                    <g-text-ellipsis>{{ item.shippingServiceName }}</g-text-ellipsis>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    {{ item.freight }}
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    {{ item.freightAdditional }}
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  {{ item.isFree?'是':'否' }}
                </el-col>
              </el-row>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="国际运输">
            <div class="config-values">
              <el-row :gutter="5" class="config-title-row">
                <el-col :span="13">运输方式</el-col>
                <el-col :span="5">运费</el-col>
                <el-col :span="5">额外每件加收</el-col>
                <!-- <el-col :span="3">是否免运费</el-col> -->
              </el-row>
              <div v-for="(item, i) in form.policyInfo.intlInfo" :key="i">
                <el-row :gutter="5" style="margin-bottom:4px;">
                  <el-col :span="13">
                    <el-form-item>
                      <g-text-ellipsis>{{ item.shippingServiceName }}</g-text-ellipsis>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item>
                      {{ item.freight }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item>
                      {{ item.freightAdditional }}
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="3">
                    {{ item.isFree?'是':'否' }}
                  </el-col> -->
                </el-row>
                <div>
                  <span>运输地区</span>
                </div>
                <el-checkbox-group v-model="item.shipToLocation">
                  <el-checkbox v-for="citem in shoppingLocationDetails" :key="citem.name" :label="citem.value" :disabled="!!citem.value">{{ citem.name }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </basic-container>
</template>

<script>
import { getShoppingItems } from '@/api/ebay/template.js'
import { deepClone } from '@/util/util'
export default {
  props: {
    row: {
      required: false,
      type: Object
    },
    constList: {
      type: Object
    },
    storeOption: {
      type: Array
    }
  },
  data() {
    return {
      form: {},
      shoppingLocationDetails: [],
      shoppingItem: {
        shippingItemType: '',
        freight: '',
        freightAdditional: '',
        isFree: false,
        isALLCheckShoppingLocation: false,
        shipToLocation: []
      }
    }
  },
  created() {
    if (this.row) {
      Object.keys(this.constList.businessPolicyShippingType).forEach(item => {
        this.row.policyInfo.warehouseId = this.constList.businessPolicyShippingType[item]
      })
      this.row.policyInfo.dispatchTimeMax = this.row.policyInfo.dispatchTimeMax + ''
      if (!this.row.policyInfo.intlInfo.length) {
        this.row.policyInfo.intlInfo.push(this.shoppingItem)
      }
      if (!this.row.policyInfo.domesticInfo.length) {
        this.row.policyInfo.domesticInfo.push(this.shoppingItem)
      }
      this.form = deepClone(this.row)
    }
  },
  mounted() {
    if (this.row) {
      this.getShoppingItems('ShippingLocationDetails')
      this.getShoppingItems('CountryDetails')
      this.getShoppingItems('ShippingServiceDetails')
      this.getShoppingItems('ShippingServiceDetails', true)
    }
  },
  methods: {
    getShoppingItems(itemType, international = false) {
      const form = this.form
      getShoppingItems({ siteCode: form.siteCode, storeAccount: form.storeName, itemType: itemType, international: international }).then(res => {
        const data = res.data
        if (itemType === 'ShippingLocationDetails') { // 运输地区
          this.shoppingLocationDetails = data
        } else if (itemType === 'CountryDetails') { // 国家
          this.form.policyInfo.countryOrRegion = data.find(item => item.value === this.form.policyInfo.countryOrRegion).name
        } else if (itemType === 'ShippingServiceDetails' && !international) { // 国内运输方式
          this.handleFilter('domesticInfo', data)
        } else if (itemType === 'ShippingServiceDetails' && international) { // 国际运输方式
          this.handleFilter('intlInfo', data)
        }
      })
    },
    handleFilter(info, data) {
      this.form.policyInfo[info].forEach(ilist => {
        data.filter(item => {
          if (ilist.shippingService === item.value) {
            ilist.shippingServiceName = item.name
          }
        })
      })
    }
  }
}
</script>
<style scoped lang="scss">
.config-values{
  width: 100%;
  border-radius:6px;
  padding:4px;
  border: 1px solid #ddd;
  .el-form-item--mini.el-form-item{
    margin-bottom: 0;
  }
}
</style>
