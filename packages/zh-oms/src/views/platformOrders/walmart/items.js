export default [
  {
    title: '订单信息',
    items: [
      { label: '销售平台', prop: 'platformCode', value: 'Walmart' },
      { label: '平台单号', prop: 'purchaseOrderId' },
      { label: 'OMS单号', prop: 'omOrderId', path: 'oms/orderManagement/details' },
      { label: '交易号', prop: 'customerOrderId' },

      { label: '销售店铺', prop: 'storeName' },
      { label: '平台订单状态', prop: 'orderStatus' },
      { label: 'OMS订单状态', prop: 'omOrderStatus' },
      { label: '原始交易号', prop: 'originalCustomerOrderId' },

      { label: '销售站点', prop: 'siteCode' },
      { label: '订单来源', prop: 'orderType' },
      { label: '订单类型', prop: 'platOrderType' },
      { label: '是否WFS', prop: 'ifWFS' }
    ]
  },
  {
    title: '费用详情',
    currency: 'shippingCurrency',
    items: [
      { label: '订单总金额', prop: 'orderAmount', isPrice: true },
      { label: '平台交易费', prop: 'platformTrade', isPrice: true },
      { label: '买家实付金额', prop: 'buyerActuallyPayAmount', isPrice: true },
      { label: '卖家实收金额（除税）', prop: 'sellerIncomeAmount', labelWidth: '120px', isPrice: true },

      { label: '税费', prop: 'taxAmount', isPrice: true },
      { label: '客付运费', prop: 'freightChargesAmount', isPrice: true },
      { label: '卖家实收运费', prop: 'sellerActuallyPayInAmount', isPrice: true }
    ]
  },
  {
    title: '收货地址',
    items: [
      { label: '收件人', prop: 'name' },
      { label: '国家', prop: 'country' },
      { label: '省/州', prop: 'state' },
      { label: '城市', prop: 'city' },

      { label: '移动电话', prop: 'phone' },
      { label: '固定电话', prop: 'x' },
      { label: '邮编', prop: 'postalCode' },
      { label: '买家邮箱', prop: 'customerEmailId' },
      { label: '地址一', prop: 'address1', grow: 1 },
      { label: '地址二', prop: 'address2', grow: 1 }
    ]
  },
  {
    title: '物流信息',
    items: [
      { label: '预计发货时间', prop: 'estimatedShipDate' },
      { label: '预计送达时间', prop: 'estimatedDeliveryDate' },
      { label: '运输方式', prop: 'methodCode' },
      { label: '物流商', prop: 'carrier' }
      // { label: '跟踪号', prop: 'trackingNumber' }
    ]
  },
  {
    title: '时间信息',
    items: [
      { label: '订单创建时间', prop: 'orderDate' },
      { label: '抓单时间', prop: 'firstGrabDate' },
      { label: '标记时间', prop: 'omsMarkDate' },
      { label: '平台订单最后更新时间', prop: 'platLastUpdateTime', labelWidth: '120px' }
      // { label: '实际发货时间', prop: 'x' }
    ]
  },
  {
    title: '商品信息',
    type: 'table',
    key: 'goods',
    items: [
      { label: '商品图片', prop: 'productImgUrl', type: 'image', width: 80 },
      {
        label: '商品信息',
        type: 'table',
        itemData: [
          { label: '在线SKU', prop: 'sku', labelWidth: '60px', type: 'text' },
          { label: '商品名称', prop: 'productName', labelWidth: '60px', type: 'text' },
          { label: 'ItemID', prop: 'lineNumber', labelWidth: '60px', type: 'text' },
          { label: 'item状态', prop: 'lineStatus', labelWidth: '60px', type: 'text' },
          { label: '标记跟踪号', prop: 'trackingNumber', labelWidth: '60px', type: 'text' }
        ]
      },
      { label: '产品单价（不含税）', prop: 'itemPrice', type: 'money', width: 130 },
      { label: '税费', prop: 'tax', type: 'money', width: 120 },
      { label: '产品单价（含税）', prop: 'itemPriceTax', type: 'money', width: 120 },
      { label: '数量', prop: 'quantity', type: 'text', width: 120 },
      { label: '销售金额', prop: 'saleAmount', type: 'money', width: 120 }
    ]
  }
]
