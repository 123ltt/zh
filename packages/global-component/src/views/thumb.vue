<template>
  <div>
    <h1>thumb</h1>
    <button @click="show=!show">switch</button>
    <div :style="{marginLeft:left+'px'}" @click="changeLeft" @mouseenter.stop>
      <g-thumb v-if="show" :url="url" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      left: 0,
      show: false,
      url: 'http://zehui-images-test-hk.oss-cn-hongkong.aliyuncs.com/upload/20201214/08d9063274cc4503ad5031503f3d4fff.png'
    }
  },
  methods: {
    changeLeft() {
      this.left += 20
      console.log('left')
    }
  }
}
</script>
