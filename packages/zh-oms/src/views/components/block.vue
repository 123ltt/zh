<template>
  <div ref="blockRef" class="block-wrap" :style="disabledStyle">
    <!-- top border area -->
    <div v-if="hasT||showT" class="top d-flex">
      <div class="top-left" :class="{ 't-border': tLine, 'tl-border': tlLine }">
        <i v-if="hasT" class="el-icon-caret-bottom arrow" />
      </div>
      <div class="top-right" :class="{'tr-border':trLine}" />
    </div>
    <div class="center d-flex align-items-center">
      <!-- left border area -->
      <div v-if="hasL||showL" class="left">
        <div class="left-top" :class="{ 'l-border': lLine, 'lt-border': ltLine }" :style="lBorderColor">
          <i v-if="hasL" class="el-icon-caret-right arrow" />
        </div>
        <div class="left-bottom" :class="{'lb-border':lbLine}" />
      </div>
      <!-- midden main border area -->
      <div class="midden flex-shrink-0 d-flex flex-column justify-content-center">
        <div class="title"><i class="icon" :class="itemData.icon" />{{ itemData.title || '包裹管理' }}</div>
        <template v-if="!$slots.default">
          <g-list-group item-class="text-start pt-1" label-width="70px">
            <g-list-group-item label="推WMS时间">
              <g-text-ellipsis>{{ itemData.lastPushWmsTime }}</g-text-ellipsis></g-list-group-item>
            <g-list-group-item label="包裹单号">
              <g-text-ellipsis class="linkClass text-primary" @click.native="toList(itemData.packageCode, 'pack')">{{ itemData.packageCode }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="状态">
              <g-text-ellipsis :style="markRedStyle(itemData.packageStatus)">{{ itemData.packageStatusName }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="停留时间">
              <g-text-ellipsis :style="markRedStyle(itemData.packageStatus)">{{ itemData.packageStayTime }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="标记结果">
              <g-text-ellipsis>{{ itemData.markStatusName }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </template>
        <slot />
      </div>
      <!-- right border area -->
      <div v-if="hasR||showR" class="right">
        <div class="right-top" :class="{ 'r-border': rLine, 'rt-border': rtLine }" />
        <div class="right-bottom" :class="{'rb-border':rbLine}" />
      </div>
    </div>
    <!-- bottom border area -->
    <div v-if="hasB||showB" class="bottom d-flex">
      <div class="bottom-left" :class="{ 'b-border': bLine, 'bl-border': blLine }" />
      <div class="bottom-right" :class="{'br-border':brLine}" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Block',
  props: {
    disabled: Boolean,
    toList: Function,
    itemData: Object,
    isMin: Boolean,
    showL: Boolean,
    showR: Boolean,
    showT: Boolean,
    showB: Boolean,

    tLine: Boolean,
    tlLine: Boolean,
    trLine: Boolean,

    lLine: Boolean,
    ltLine: Boolean,
    lbLine: Boolean,

    rLine: Boolean,
    rtLine: Boolean,
    rbLine: Boolean,

    bLine: Boolean,
    blLine: Boolean,
    brLine: Boolean
  },
  computed: {
    hasR() {
      return this.rLine || this.rtLine || this.rbLine
    },
    hasL() {
      return this.lLine || this.ltLine || this.lbLine
    },
    hasB() {
      return this.bLine || this.blLine || this.brLine
    },
    hasT() {
      return this.tLine || this.tlLine || this.trLine
    },
    lBorderColor() {
      if ((this.lLine || this.ltLine) && this.lbLine) return { 'border-bottom-color': 'transparent' }
      return ''
    },
    disabledStyle() {
      return this.disabled ? { filter: 'grayscale(90%)', opacity: '.68' } : {}
    }
  },
  mounted() {
    if (this.isMin) this.$refs.blockRef.style.height = '120px'
  },
  methods: {
    markRedStyle(data) {
      return [1, 3, 5, 8, 10, 11, 13].includes(data) ? 'color:red;' : ''
    }
  }
}
</script>
<style lang="scss" scoped>
.linkClass{
  cursor: pointer;
  &:hover{
    text-decoration: underline;
  }
}

.block-wrap{
  $color: rgb(187 208 194);
  $title-color: #1aa78e;
  $border: 4px solid $color;
  max-width: 343px;
  height: 150px;
  text-align: center;
  // top and bottom border area common style
  .top, .bottom{
    width: 100%;
    height: 40px;
    &>div{
      width: calc(50% + 2px);
      box-sizing: border-box;
      opacity: .5;
    }
  }
  // top border area --- start
  .top-left{
    position: relative;
    &.t-border{
      border-right: $border;
    }
    &.tl-border{
      border-right: $border;
      border-top: $border;
    }
    i.arrow{
      font-size: 16px;
      position: absolute;
      bottom: 0;
      right: 0;
      transform: translate(58%, 60%);
      color: $color !important;
    }
  }
  .top-right{
    margin-left: -4px;
    &.tr-border{
      border-left: $border;
      border-top: $border;
    }
  }
  // top border area --- end

  // bottom border area --- start
  .bottom-left{
    &.b-border{
      border-right: $border;
    }
    &.bl-border{
      border-right: $border;
      border-bottom: $border;
    }
  }
  .bottom-right{
    margin-left: -4px;
    &.br-border{
      border-left: $border;
      border-bottom: $border;
    }
  }
  // bottom border area --- end

  .center{
    height: 150px;
  }
  // left and right border area common style
  .left, .right{
    width: 40px;
    height: 100%;
    &>div{
      height: calc(50% + 2px);
      box-sizing: border-box;
      opacity: .5;
    }
  }
  // left border area --- start
  .left-top{
    text-align: left;
    position: relative;
    &.l-border{
      border-bottom: $border;
    }
    &.lt-border{
      border-left: $border;
      border-bottom: $border;
    }
    i.arrow{
      font-size: 16px;
      position: absolute;
      bottom: 0;
      right: 0;
      transform: translate(70%, 60%);
      color: $color !important;
    }
  }
  .left-bottom{
    margin-top: -4px;
    &.lb-border{
      border-left: $border;
      border-top: $border;
    }
  }
  // left border area --- end

  // right border area --- start
  .right-top{
    &.r-border{
      border-bottom: $border;
    }
    &.rt-border{
      border-right: $border;
      border-bottom: $border;
    }
  }
  .right-bottom{
    margin-top: -4px;
    &.rb-border{
      border-right: $border;
      border-top: $border;
    }
  }
  // right border area --- end

  // midden main border area --- start
  .midden{
    width: 230px;
    margin: 6px;
    height: 100%;
    position: relative;
    // background-color: #eeeeee9e;
    // box-sizing: border-box;
    // border-radius: 4px;
    // box-shadow: 0px 0px 4px var(--color-primary) inset;
    .icon{
      color: $title-color;
      font-size: 32px;
      vertical-align: middle;
      margin-right: 4px;
    }
    .title{
      width: 90%;
      vertical-align: top;
      display: inline;
      margin: 1px auto;
      color: $title-color;
      // border-radius: 2px;
      // border: 2px dashed var(--color-primary);
    }
  }
  // midden main border area --- end
}
</style>
