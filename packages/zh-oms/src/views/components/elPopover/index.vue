<template>
  <el-popover
    ref="popover"
    v-model="visible"
    popper-class="my-popper-class"
    width="500"
    trigger="click"
  >
    <div class="popover-box">
      <el-table :data="list" :show-header="false" height="200">
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
                    <el-tag v-if="scopeitem.row[item.tag]" type="success" size="mini">{{ scopeitem.row[item.tag] }}</el-tag>
                  </g-text-ellipsis>
                </g-list-group-item>
                <g-list-group-item v-if="index!==0&&item.type==='money'" :key="index" :label="item.label">
                  {{ currency||currencyCode }} {{ Number(scopeitem.row[item.key]).toFixed(2) }}
                </g-list-group-item>
              </template>
            </g-list-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="list.length>1" slot="reference" style="cursor:pointer;" class="text-primary text-center">查看更多</div>
  </el-popover>
</template>

<script>
import { debounce } from '@/util/util.js'
export default {
  props: {
    list: Array,
    currencyCode: String,
    itemData: Array,
    currency: String,
    labelWidth: String
  },
  data() {
    return {
      visible: false
    }
  },
  mounted() {
    const hide = debounce(() => {
      this.visible = false
    }, 500, true)
    const el = document.getElementById('app')
    el.addEventListener('wheel', hide)
    this.$once('hook:beforeDestroy', () => el.removeEventListener('wheel', hide))
  }
}
</script>

<style lang="scss">
$color: #999;
.my-popper-class{
  padding: 0!important;
  .popover-box{
    box-shadow: 2px 2px 10px rgba(0,0,0,.4);
    border: 1px solid $color;
    border-radius: 2px;
  }
  &.el-popper[x-placement^=top] .popper__arrow{
    bottom: -6px;
    border-top-color: $color;
  }
  &.el-popper[x-placement^=bottom] .popper__arrow{
    top: -6px;
    border-bottom-color: $color;
  }
}
</style>
