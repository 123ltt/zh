<template>
  <Dict :table-api="getParentList"
        :child-table-api="getChildList"
        :del-api="remove"
        :add-api="add"
        :update-api="update"
        :detail-api="getDict"
  />
</template>

<script>
import {
  getParentList,
  getChildList,
  remove,
  update,
  add,
  getDict
} from '@/api/system/dictbiz'

export default {
  components: {
    Dict: () => import('@/components/dict/index.vue')
  },
  data() {
    return {
      getParentList: getParentList,
      getChildList: getChildList,
      update: update,
      add: add,
      remove: remove,
      getDict: getDict
    }
  }
}
</script>
