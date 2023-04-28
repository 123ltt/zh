<template>
  <div>
    <g-thumb v-if="disabled" :url="url" class="assets-thumb m-1 border position-relative" :delay="500" />
    <el-dropdown v-else trigger="click" placement="bottom" @command="onSelect">
      <span>
        <g-thumb :url="url" class="assets-thumb m-1 border position-relative" :delay="500" />
      </span>
      <el-dropdown-menu slot="dropdown" class="my-0">
        <el-dropdown-item v-for="item in flags"
                          :key="item.icon"
                          :command="item"
                          class="px-3"
        >
          {{ item.checked?'取消':'设为' }} <i :class="['el-icon-'+item.icon,item.checked?'text-primary':'']" />{{ item.title }}
        </el-dropdown-item>
        <el-dropdown-item :command="-1" class="px-3">移除该图片</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import Flags from './flags'

export default {
  name: 'ThumbBig',
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
      showBtn: false,
      flags: Flags().map(item => {
        item.checked = this.tags.includes(item.value)
        return item
      })
    }
  },
  methods: {
    onSelect(data) {
      if (data === -1) {
        this.$emit('remove')
      } else {
        data.checked = !data.checked
        this.$emit('select', this.flags.filter(el => el.checked))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.assets-thumb {
  cursor: pointer;
  ::v-deep .thumb-btn {
    margin: 1px;
    padding: 2px;
    font-size: 1.4rem;
    border: 1px #ccc solid;
    background: rgba(255,255,255,0.8);
    border-radius: 50%;
    &:hover {
      background-color: #fff;
      cursor: pointer;
    }
  }
}
</style>
