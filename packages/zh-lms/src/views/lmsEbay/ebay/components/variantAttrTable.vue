<template>
  <el-table ref="table"
            :data="listingVariations"
            :header-cell-style="{ background:'#FAFAFA', color:'rgba(0,0,0,.85)' }"
            border
            stripe
            class="g-table"
            size="small"
            style="width: 100%"
  >
    <el-table-column label="子SKU">
      <template slot-scope="{row}">
        <el-tooltip :disabled="!row.productName" class="item" effect="dark" :content="row.productName" placement="top">
          <span class="d-block">SKU：{{ row.productSku }}{{ onlineStatus.includes(row.listingStatus) ? '(Online)' : row.listingStatus === 10 ? '(Canceled)': '' }}</span>
          <span class="d-block">平台：{{ row.sellerSku }}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="图片" prop="img" width="120">
      <template slot-scope="{row,index}">
        <span v-if="row.variationPictures && row.variationPictures.imgShowList && row.variationPictures.imgShowList.length" class="d-flex">
          <g-thumb :width="40" :height="40" :url="row.variationPictures.imgShowList[0].imageUrl" class="pic" />
          <el-button type="text" @click="changeImgModal(row, index)">more</el-button>
        </span>
      </template>
    </el-table-column>
    <el-table-column :label="detaildata.productIdType" prop="productIdTypeValue" width="120" />
    <el-table-column label="EPID" prop="epid" />
    <el-table-column label="变体属性" prop="listingSpecs">
      <template slot-scope="{ row }">
        <div v-if="row.listingSpecs">
          <div v-for="(attr, idx) in row.listingSpecs" :key="idx" class="sku-attr">
            <span class="color999">{{ attr.name }}：</span>
            <span v-if="attr.value" class="color999">{{ attr.value }}</span>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="售价" prop="startPrice" width="110" />
    <el-table-column label="成本|利润率" width="100">
      <template slot-scope="{ row }">
        {{ row.costPrice&&!isNaN(row.costPrice)?parseFloat(row.costPrice).toFixed(2):'-' }} | {{ row.actualProfitRate && row.actualProfitRate * 1 }}
      </template>
    </el-table-column>
    <el-table-column label="库存" prop="stock" width="80" />
    <el-table-column label="运费|重量" min-width="80">
      <template slot-scope="{ row }">
        {{ detaildata.logical &&!isNaN(detaildata.logical.cost)? Number(detaildata.logical.cost):'-' }} | {{ row.weight }}
      </template>
    </el-table-column>
    <!-- <el-table-column label="物流" prop="logistics" width="90">
      <template v-if="row.logical" slot-scope="{ row }">
        <el-button v-if="row.logical" type="text" @click="showLogisticsList(row)">
          {{ row.logical.deliveryGroupName }} | {{ row.logical.cost }}
        </el-button>
      </template>
    </el-table-column> -->
  </el-table>
</template>

<script>
import changeChildSkuImg from './changeChildSkuImg.vue'
import showLogisticsList from '@/views/lmsAmazon/amazon/components/showLogisticsList.vue'
import { onlineStatus } from './addEbayListing.handle.js'
export default {
  name: 'VariantAttrTable',
  props: {
    detaildata: Object,
    listingVariations: {
      type: Array
    }
  },
  data() {
    return {
      onlineStatus
    }
  },
  methods: {
    // 选择子SKU图片
    changeImgModal(row, index) {
      // const variationPictures = []
      // row.variationPictures.imgShowList.forEach(item => {
      //   const obj = {}
      //   obj.imageUrl = item.imageUrl
      //   variationPictures.push(obj)
      // })
      this.$modal({
        title: '查看子SKU图片',
        component: changeChildSkuImg,
        width: '1000px',
        data: {
          data: {
            productSku: row.productSku,
            imgShowList: row.variationPictures.imgShowList,
            extraImagList: []
          },
          isReadOnly: true
        }
      })
    },
    // 查看子SKU物流列表
    showLogisticsList(row) {
      this.$modal({
        title: '子SKU物流列表',
        component: showLogisticsList,
        width: '1000px',
        data: {
          logistics: row.logical ? [row.logical] : [],
          productSku: row.productSku
        }
      })
    }
  }
}
</script>

<style>

</style>
