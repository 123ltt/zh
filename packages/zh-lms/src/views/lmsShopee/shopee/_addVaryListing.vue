<!-- 创建shopee单个 Vary Listing -->
<script>
import addListing from './_addListing.vue'
export default {
  name: 'LmsShopeeAddVaryListing',
  extends: addListing,
  data() {
    return {
      // Listing类型 Variation Normal Combo
      listingType: 'Variation'
    }
  }
}
</script>
