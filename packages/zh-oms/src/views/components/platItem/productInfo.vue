<template>
  <el-table-column slot="orderDetails" label="产品信息" width="290">
    <template slot-scope="scope">
      <el-table :data="(scope.row[arrKey]||[]).filter((item,i)=>{return i===0})" :show-header="false">
        <template v-for="(item,index) in itemData">
          <el-table-column v-if="index===0" :key="index" width="80">
            <template slot-scope="slotScope">
              <g-thumb :url="slotScope.row[item.key]" />
            </template>
          </el-table-column>
        </template>
        <el-table-column>
          <template slot-scope="scopeitem">
            <g-list-group :label-width="labelWidth" label-align="center" class="fs-6">
              <template v-for="(item,index) in itemData">
                <g-list-group-item v-if="index!==0&&item.type==='text'" :key="index" :label="item.label">
                  <g-text-ellipsis>
                    {{ scopeitem.row[item.key] }}
                    <el-tag v-if="scopeitem.row[item.tag]" type="success" size="mini">
                      {{ scopeitem.row[item.tag] }}
                    </el-tag>
                  </g-text-ellipsis>
                </g-list-group-item>
                <g-list-group-item v-if="index!==0&&item.type==='money'" :key="index" :label="item.label">
                  {{ scope.row[currency] || scope.row.currencyCode }} {{ Number(scopeitem.row[item.key]).toFixed(2) }}</g-list-group-item>
                <g-list-group-item v-if="index!==0&&item.type==='code'" :key="index" :label="item.label">
                  <g-text-ellipsis>
                    <span v-for="(code,cIndex) in scopeitem.row[item.key]" :key="cIndex">
                      {{ code.pmsSku+'*'+code.productQuantity }}
                    </span>
                  </g-text-ellipsis>
                </g-list-group-item>
              </template>
            </g-list-group>
          </template>
        </el-table-column>
      </el-table>
      <elPopover v-if="(scope.row[arrKey]||[]).length>1" :item-data="itemData" :list="scope.row[arrKey]" :currency-code="scope.row.currencyCode" :currency="scope.row[currency]" :label-width="labelWidth" />
    </template>
  </el-table-column>
</template>

<script>
import elPopover from '../elPopover/index.vue'
export default {
  components: {
    elPopover
  },
  props: {
    currency: String,
    itemData: Array,
    arrKey: String,
    labelWidth: {
      type: String,
      default: '50px'
    }
  }
}
</script>
