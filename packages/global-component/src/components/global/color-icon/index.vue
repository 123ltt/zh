<template>
  <svg style="fill:currentColor;overflow:hidden;" :style="{width,height,verticalAlign}" aria-hidden="true">
    <use :xlink:href="'#icon-'+icon" />
  </svg>
</template>

<script>
export default {
  name: 'GColorIcon',
  props: {
    icon: String,
    width: {
      type: String,
      default: '1em'
    },
    height: {
      type: String,
      default: '1em'
    },
    verticalAlign: {
      type: String,
      default: '-0.15em'
    }
  }
}
</script>
