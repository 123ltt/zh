<template>
  <basic-container class="batch-modify">
    <div v-show="current===0">
      <ModifyProperty ref="property" @change="onChange" @change-tab="onChangeTab" />
    </div>
    <div v-show="current===1">
      <ModifyField :items="list"
                   @remove="onRemove"
                   @change-tab="onChangeTab"
                   @updated="$refs.property.currentPageIsSaved=true"
      />
    </div>
  </basic-container>
</template>

<script>
import ModifyProperty from './components/batchModify/modifyProperty.vue'
import ModifyField from './components/batchModify/modifyField.vue'

export default {
  name: 'PmsBatchModify',
  components: { ModifyProperty, ModifyField },
  data() {
    return {
      list: [],
      current: 0
    }
  },
  methods: {
    onChange(data) {
      this.list = data
    },
    onChangeTab(tabIndex) {
      this.current = tabIndex
      if (tabIndex === 0) {
        this.$nextTick(() => {
          this.$refs.property.doLayout()
        })
      }
    },
    onRemove(index) {
      this.$refs.property.removeRow(index)
    }
  }
}
</script>

<style lang="scss" scoped>
.batch-modify ::v-deep {
  .g-table {
    tr:hover {
      .remove-code button {
        display: inline-block;
        &:hover {
          i {
            font-weight: 700;
          }
        }
      }
    }
    .remove-code {
      button {
        color: $--color-danger;
        padding: 0 5px 0 0 !important;
        display: none;
      }
    }

    td {
      padding: 5px 0;
      .cell {
        line-height: 30px;
      }
    }
  }
}
</style>
