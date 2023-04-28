<template>
  <div>
    <oneListing v-if="!isVariation" ref="oneListing" v-bind="{baseProductInfo,labelWidth}" />
    <varyListing v-else ref="varyListing" v-bind="{imageInfo,baseProductInfo,skuObj,isEdit,isOnline}" />
  </div>

</template>

<script>
import oneListing from './oneListing.vue'
import varyListing from './varyListing.vue'
export default {
  name: 'VariantAttr',
  components: { oneListing, varyListing },
  props: {
    labelWidth: String,
    isEdit: Boolean,
    isOnline: Boolean,
    isVariation: Boolean,
    baseProductInfo: Object,
    imageInfo: Array,
    skuObj: Object
  }
}
</script>
