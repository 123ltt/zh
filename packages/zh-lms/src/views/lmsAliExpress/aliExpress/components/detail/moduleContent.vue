<template>
  <div>
    <ul style="list-style: none;overflow: hidden;">
      <li v-for="(item,index) in product.list"
          :key="index"
          style="float: left;text-align: center;"
          :style="{'width': spanWidth+'%'}"
      >
        <div style="border: 1px solid #c0ccda;border-radius: 6px;position: relative;margin: 5px">
          <img :src="item.imageUrls" style="min-height: 60px;max-width: 92px;max-height: 92px;">
          <!-- <el-link :href="'https://www.aliexpress.com/item/' + item.itemId + '.html'" target="_blank">{{ item.itemId }}</el-link> -->
          <a :href="'https://www.aliexpress.com/item/' + item.itemId + '.html'"
             target="_blank"
             style="position: absolute;
                          width: 100%;
                          left: 0;
                          bottom: 0;
                          color: #409EFF;
                          background-color: rgba(255, 255, 255, 0.5);
                          line-height: 0;
                          padding: 10px 0px;"
          >{{ item.itemId }}</a>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ModuleContent',
  props: {
    product: Object
  },
  computed: {
    // 列的宽度大小
    spanWidth() {
      return Math.floor(100 / this.product.layoutColumn)
    }
  }
}
</script>
