<template>
  <div>
    <el-card v-for="(card, i) in items" :key="i" class="plat-details-form">
      <h4 slot="header" class="my-1">{{ card.title }}</h4>
      <template v-if="card.type==='table'">
        <el-table :data="form[card.key]" border class="g-table g-table-dense">
          <template v-for="(item,index) in card.items">
            <el-table-column v-if="item.type==='image'" :key="index" :width="item.width" :label="item.label">
              <template slot-scope="scope">
                <g-thumb :url="scope.row[item.prop]" />
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.type==='table'" :key="index" :label="item.label">
              <template slot-scope="scope">
                <g-list-group-item v-for="(list, tindex) in item.itemData" :key="tindex" :label-width="list.labelWidth" :label="list.label">
                  <g-text-ellipsis v-if="list.type==='text'">
                    {{ scope.row[list.prop] }}
                  </g-text-ellipsis>
                  <g-text-ellipsis v-else-if="list.type==='code'">
                    <span v-for="(code,cIndex) in scope.row[list.prop]" :key="cIndex">
                      {{ code.pmsSku+'*'+code.productQuantity }}
                    </span>
                  </g-text-ellipsis>
                </g-list-group-item>
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.type==='money'" :key="index" :width="item.width" :label="item.label">
              <template slot-scope="scope">
                <g-text-ellipsis>{{ form.currencyCode }} {{ Number(scope.row[item.prop]).toFixed(2) }}</g-text-ellipsis>
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.type==='text'" :key="index" :width="item.width" :label="item.label">
              <template slot-scope="scope">
                <g-text-ellipsis>{{ scope.row[item.prop] }}</g-text-ellipsis>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </template>
      <template v-else>
        <g-list-group :cols="cols" :label-width="labelWidth" label-align="center">
          <g-list-group-item v-for="(item, index) in card.items" :key="index" :label="item.label" :label-width="item.labelWidth" :class="item.grow>0&&['flex-grow-' + item.grow]">
            <g-text-ellipsis>
              <span v-if="item.path" class="text-primary cursor-pointer" @click="toDetails(item.path, item.prop)">
                {{ form[item.prop] }}
              </span>
              <template v-else-if="item.itemList">{{ item.itemList[form[item.prop]] }}</template>
              <template v-else>{{ `${item.isPrice?formatterMoney(form[item.prop], card.currency):form[item.prop]}` }}</template>
            </g-text-ellipsis>
          </g-list-group-item>
        </g-list-group>
      </template>
    </el-card>
  </div>
</template>
<script>
import { platDetails } from '@/api/platformOrder'
export default {
  name: 'DetailsForm',
  props: {
    cols: {
      type: [Number, String],
      default: 4
    },
    labelWidth: {
      type: String,
      default: '80px'
    },
    items: {
      type: Array,
      default: () => []
    },
    config: Object
  },
  data() {
    return {
      form: this.getForm()
    }
  },
  mounted() {
    if (this.config) this.getData()
  },
  methods: {
    getData() {
      platDetails(this.config).then(res => {
        Object.entries(res.data).forEach(([key, value]) => {
          this.form[key] = value ?? '' // 把null、undefined的值改为 ''
        })
        this.$emit('rendered', this.form)
      })
    },
    getForm() {
      const list = this.items
      return list.reduce((pre, cur) => {
        cur.items.forEach(item => {
          pre[item.prop] = item.value ?? ''
        })
        return pre
      }, {})
    },
    formatterMoney(price, currency = 'currencyCode') {
      let res = (this.form[currency] ?? '') + ' '
      res += parseFloat(price || 0).toFixed(2)
      return res
    },
    toDetails(path, prop) {
      const data = {}
      data[prop] = this.form[prop]
      this.$newPage({ path, data })
    }
  }
}
</script>

<style lang="scss" scoped>
.plat-details-form ::v-deep{
  .el-card__header{
     background: linear-gradient(to right, #f5f4f4,#fff);
  }
  .el-card__body{
    padding: 6px;
  }
  .cursor-pointer{
    cursor: pointer;
  }
}
</style>
