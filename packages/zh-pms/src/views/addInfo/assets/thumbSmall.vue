<template>
  <div class="d-flex thumb-small">
    <g-thumb :url="url"
             class="m-1 border"
             :width="36"
             :height="36"
             :delay="500"
    />
    <template v-if="!disabled">
      <FlagBtn v-for="item in flags"
               :key="item.icon"
               v-model="item.checked"
               :icon="item.icon"
               class="mx-1"
               :title="item.title"
               @click="onSelect"
      />
      <el-button size="mini"
                 type="text"
                 class="fs-5 mx-0 el-icon-delete text-muted mx-1"
                 title="移除该图片"
                 @click="$emit('remove')"
      />
    </template>
  </div>
</template>

<script>
import FlagBtn from './flagBtn.vue'
import Flags from './flags'

export default {
  name: 'ThumbSmall',
  components: { FlagBtn },
  props: {
    url: String,
    tags: Array,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      flags: Flags().map(item => {
        item.checked = this.tags.includes(item.value)
        return item
      })
    }
  },
  methods: {
    onSelect() {
      this.$emit('select', this.flags.filter(item => item.checked))
    }
  }
}
</script>

<style lang="scss" scoped>
.thumb-small {
  transition: all 0.3s;
  &:hover {
    box-shadow: 0 0 5px rgba(0,0,0,0.2);
    background-color: #fff;
  }
}
</style>
