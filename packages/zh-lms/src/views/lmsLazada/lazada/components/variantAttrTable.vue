<template>
  <el-table ref="table"
            :data="detaildata.skus"
            :header-cell-style="{ background:'#FAFAFA', color:'rgba(0,0,0,.85)' }"
            border
            stripe
            class="g-table"
            size="small"
            style="width: 100%"
  >
    <el-table-column label="子SKU">
      <template slot-scope="{row}">
        <el-tooltip v-if="row.productName" class="item" effect="dark" :content="row.productName" placement="top">
          <span class="d-block">SKU：{{ row.productSku }}</span>
        </el-tooltip>
        <span v-else class="d-block">SKU：{{ row.productSku }}</span>
        <!-- <span class="d-block">平台：{{ row.sellerSku }}</span> -->
      </template>
    </el-table-column>
    <el-table-column label="图片" prop="img">
      <template slot-scope="{row,index}">
        <span class="d-flex">
          <g-thumb :width="40"
                   :height="40"
                   :url="row.masterImage"
                   class="pic"
          />
          <el-button type="text" @click="changeImgModal(row, index)">more</el-button>
        </span>
      </template>
    </el-table-column>
    <template v-for="(v, k, i) in detaildata.varAttr">
      <el-table-column :key="i" :label="k" prop="listingSpecs">
        <template slot-scope="{ row }">
          <div class="sku-attr">
            <span class="color999">{{ row.specifications[k] }}</span>
          </div>
        </template>
      </el-table-column>
    </template>
    <el-table-column label="售价" prop="price">
      <template slot-scope="{ row, $index }">
        <el-button v-if="!detaildata.itemId" type="text" @click="showSitePrice(row, $index)">
          {{ row.price }} <span v-if="detaildata.listingStatus > 4" class="ms-2">{{ detaildata.site && siteList[detaildata.site] && siteList[detaildata.site].currency }}</span>
        </el-button>
        <template v-else>{{ row.price }} <span v-if="detaildata.listingStatus > 4" class="ms-2">{{ detaildata.site && siteList[detaildata.site] &&siteList[detaildata.site].currency }}</span></template>
      </template>
    </el-table-column>
    <el-table-column label="促销价" prop="specialPrice">
      <template slot-scope="{ row, $index }">
        <el-button v-if="!detaildata.itemId" type="text" @click="showSitePrice(row, $index)">
          {{ row.specialPrice }} <span v-if="detaildata.listingStatus > 4" class="ms-2">{{ detaildata.site && siteList[detaildata.site] && siteList[detaildata.site].currency }}</span>
        </el-button>
        <template v-else>{{ row.specialPrice }} <span v-if="detaildata.listingStatus > 4" class="ms-2">{{ detaildata.site && siteList[detaildata.site] && siteList[detaildata.site].currency }}</span></template>
      </template>
    </el-table-column>
    <el-table-column label="成本|利润率">
      <template slot-scope="{ row }">{{ row.productCost }} | {{ row.profitRate }}</template>
    </el-table-column>
    <el-table-column label="库存" prop="quantity" />
    <el-table-column label="Taxes" prop="taxClass" />
    <el-table-column label="运费|重量">
      <template slot-scope="{ row }"> {{ row.shippingFee }} | {{ row.productWeight }}</template>
    </el-table-column>
  </el-table>
</template>

<script>
import changeChildSkuImg from './changeChildSkuImg.vue'
import allSitePrice from './allSitePrice.vue'
import { siteList } from './addListing.handle.js'
export default {
  name: 'VariantAttrTable',
  props: {
    detaildata: Object,
    isDetail: String
  },
  data() {
    return {
      siteList
    }
  },
  methods: {
    // 选择子SKU图片
    changeImgModal(row, index) {
      this.$modal({
        title: '查看子SKU图片',
        component: changeChildSkuImg,
        width: '1000px',
        data: {
          data: {
            productSku: row.productSku,
            imgShowList: row.imgShowList,
            extraImagList: []
          },
          isReadOnly: true,
          isDetail: this.isDetail
        }
      })
    },
    showSitePrice(row, index) {
      this.$modal({
        title: '各站点价格',
        component: allSitePrice,
        width: '600px',
        data: {
          isDetail: true,
          isEdit: true,
          siteArr: this.detaildata.siteCodeArr,
          baseProductInfo: { ...this.baseProductInfo, platformCode: 'LZ' },
          row: row
        }
      })
    }
  }
}
</script>
