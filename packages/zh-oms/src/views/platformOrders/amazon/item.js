export default [
  {
    title: '订单信息',
    items: [
      { label: '销售平台', prop: 'platformCode', value: '亚马逊' },
      { label: '平台单号', prop: 'platOrderId' },
      { label: 'OMS单号', prop: 'omOrderId', path: 'oms/orderManagement/details' },
      { label: '是否FBA', prop: 'isFBA', itemList: { false: '否', true: '是' } },
      { label: '销售站点', prop: 'siteCode', value: '亚马逊' },
      { label: '平台订单状态', prop: 'orderStatus' },
      { label: 'OMS订单状态', prop: 'omOrderStatus' },
      { label: '订单来源', prop: 'orderTypeDesc' },
      { label: '销售店铺', prop: 'storeName' }
    ]
  },
  {
    title: '费用详情',
    items: [
      { label: '订单总金额', prop: 'orderTotal', isPrice: true },
      { label: '平台交易费', prop: 'platformTradeAmount', isPrice: true },
      { label: '买家实付金额', prop: 'paymentAmount', isPrice: true },
      { label: '卖家实收金额（除税）', prop: 'sellerIncomeAmount', labelWidth: '120px', isPrice: true },
      { label: '平台优惠金额', prop: 'platPreferential', isPrice: true, value: 0 },
      { label: '卖家优惠金额', prop: 'promotionDiscountTotal', isPrice: true },
      { label: '税费', prop: 'taxAmount', isPrice: true },
      { label: '客付运费', prop: 'freightChargesAmount', labelWidth: '120px', isPrice: true },
      { label: '调整金额', prop: 'decimal', isPrice: true, value: 0 },
      { label: '交易号', prop: 'orderSn', value: '' },
      { label: '付款方式', prop: 'paymentMethod' }
    ]
  },
  {
    title: '收货地址',
    items: [
      { label: '收件人', prop: 'shippingAddressName' },
      { label: '国家', prop: 'shippingAddressCountry' },
      { label: '省/州', prop: 'shippingAddressStateOrRegion' },
      { label: '城市', prop: 'shippingAddressCity' },
      { label: '移动电话', prop: 'shippingAddressPhone' },
      { label: '固定电话', prop: 'shippingAddressPhone' },
      { label: '邮编', prop: 'shippingAddressPostalCode' },
      { label: '买家邮箱', prop: 'buyerEmail' },
      { label: '地址一', prop: 'shippingAddressLine1' },
      { label: '地址二', prop: 'shippingAddressLine2' }
    ]
  },
  {
    title: '物流信息',
    items: [
      { label: '承诺送达开始时间', prop: 'earliestShipDate', labelWidth: '100px' },
      { label: '承诺送达结束时间', prop: 'latestShipDate', labelWidth: '100px' },
      { label: '配送级别', prop: 'shipmentServiceLevelCategory' },
      { label: '物流商', prop: 'shippingProvider' },
      { label: '跟踪号', prop: 'trackingNumber', labelWidth: '100px' }
    ]
  },
  {
    title: '时间信息',
    items: [
      { label: '订单创建时间', prop: 'purchaseDate' },
      { label: '订单付款时间', prop: 'orderTime', labelWidth: '150' },
      { label: '抓单时间', prop: 'firstGrabDate' },
      { label: '平台订单最后更新时间', prop: 'lastUpdateDate', labelWidth: '150' },
      { label: '标记时间', prop: 'omsMarkDate' },
      { label: '实际发货时间', prop: 'deliverDate', labelWidth: '150' }
    ]
  }, {
    title: '商品信息',
    type: 'table',
    key: 'goods',
    items: [
      { label: '商品图片', prop: 'imageUrl', type: 'image', width: 80 },
      {
        label: '商品信息',
        type: 'table',
        width: 200,
        itemData: [
          { label: '在线SKU', prop: 'sellerSku', labelWidth: '50px', type: 'text' },
          { label: '商品名称', prop: 'title', labelWidth: '50px', type: 'text' },
          { label: 'ItemID', prop: 'orderItemId', labelWidth: '50px', type: 'text' },
          { label: 'ASIN', prop: 'asin', labelWidth: '50px', type: 'text' }
        ]
      },
      { label: '产品单价（不含税）', prop: 'singleItemPriceNoTax', type: 'money', width: 130 },
      { label: '税费', prop: 'singleItemTax', type: 'money', width: 120 },
      { label: '产品单价（含税)', prop: 'singleItemPrice', type: 'money', width: 120 },
      { label: '数量', prop: 'quantityOrdered', type: 'text', width: 120 },
      { label: '销售金额', prop: 'itemPriceDiscount', type: 'money', width: 120 }
    ]
  }
]
