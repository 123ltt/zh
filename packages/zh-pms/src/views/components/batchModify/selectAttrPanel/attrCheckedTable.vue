<template>
  <el-table class="g-table g-table-dense" :data="list" border stripe size="small" :height="height">
    <el-table-column label="已选属性" width="100">
      <template slot-scope="{row}">
        <g-text-ellipsis>{{ row.attrName }}</g-text-ellipsis>
      </template>
    </el-table-column>
    <el-table-column label="取值配置">
      <template slot-scope="{row,$index}">
        <div v-if="row.attrs.length===0" style="height:29px" />
        <div v-else class="d-flex">
          <g-select v-model="row.tempChecked"
                    :items="row.attrs"
                    key-field="code"
                    label-field="value"
                    value-field="code"
                    readonly
                    placeholder="点击查看取值列表"
          />
          <el-button icon="el-icon-plus" size="mini" class="ms-1" @click="addProp(row,$index)" />
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="55">
      <template slot-scope="{row}">
        <el-button type="text" @click="$emit('remove',row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import AddPropValue from '../../addPropValue.vue'

export default {
  name: 'AttrCheckedTable',
  props: {
    items: {
      type: Array,
      default: () => [{}]
    },
    height: String
  },
  data() {
    return {
      list: []
    }
  },
  watch: {
    items: {
      handler() {
        this.list = this.initData()
      },
      immediate: true
    }
  },
  methods: {
    initData() {
      return this.items.map(item => {
        if (!Object.prototype.hasOwnProperty.call(item, 'attrValueList')) {
          item.tempChecked = ''
          return item
        }

        const attrs = JSON.parse(item.attrValueList) || []
        return {
          attrId: item.attrId,
          fieldId: item.fieldId,
          attrName: item.attrName,
          attrs,
          tempChecked: ''
        }
      })
    },
    addProp(data, index) {
      this.$modal({
        title: '添加属性值',
        component: AddPropValue,
        width: '360px',
        data: {
          id: data.fieldId
        },
        callback: (attrs, item) => {
          if (attrs) {
            data.attrs.push(item)
            this.items.splice(index, 1, data)
          }
        }
      })
    }
  }
}
</script>
