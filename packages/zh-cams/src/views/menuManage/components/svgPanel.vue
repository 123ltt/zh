<template>
  <div v-infinite-scroll="load"
       v-loading="loading"
       :infinite-scroll-distance="20"
       :infinite-scroll-disabled="loaded"
       class="infinite-list"
  >
    <template v-for="(item,index) in list">
      <span v-if="index%10===0" :key="'a'+item" class="order-num">{{ Math.floor(index/10)+1 }}</span>
      <div :key="'b'+item" class="infinite-list-item">
        <svgicon :icon="item" width="3rem" height="100%" color="#666" @click.native="onSelect(item)" />
      </div>
    </template>
  </div>
</template>

<script>
import { axios } from '@/plugins/request/index'

export default {
  data() {
    return {
      loading: true,
      pageindex: 1,
      pagesize: 60,
      allList: [],
      list: [],
      loaded: false
    }
  },
  created() {
    axios.get('/svgicons/index.json').then(res => {
      this.allList = res.data
      this.pageindex = 1
      this.load()
    }).finally(() => {
      this.$nextTick(() => {
        this.loading = false
      })
    })
  },
  methods: {
    load() {
      this.list = this.allList.slice(0, this.pageindex * this.pagesize)
      this.loaded = this.list.length === this.allList.length
      this.pageindex++
    },
    onSelect(val) {
      this.$emit('select', 'svg:' + val)
    }
  }
}
</script>

<style lang="scss" scoped>
.infinite-list {
  overflow: auto;
  width: 100%;
  height: 450px;

  .order-num {
    float:left;
    width: 100%;
    color: rgb(230, 36, 10);
  }

  .infinite-list-item {
    float:left;
    margin: 6px 15px;
    height: 3rem;
    width: 3rem;
    transition: transform 0.3s;
    &:hover {
      transform: scale(1.5);
    }
  }
}
</style>
