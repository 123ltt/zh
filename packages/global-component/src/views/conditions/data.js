export default {
  nodeType: 'group',
  children: [
    {
      nodeType: 'item',
      rule: {
        field: 'total_amount',
        op: 'notequal',
        value: '[{"amount":"12","currencyCode":"CN","platformCode":"JD"}]'
      }
    },
    {
      nodeType: 'item',
      rule: { field: 'warehouseCode', op: 'equal', value: 'a,a1' }
    },
    {
      nodeType: 'item',
      rule: { field: 'warehouseCode', op: 'notin', value: ['a,a1', 'b,b1'] }
    },
    {
      nodeType: 'group',
      op: 'and',
      children: [
        {
          nodeType: 'item',
          rule: {
            field: 'receiveCountryCode',
            op: 'in',
            value: ['KS0']
          }
        },
        {
          nodeType: 'item',
          rule: { field: 'channelCode', op: 'equal', value: 'AD1' }
        }
      ]
    }
  ],
  op: 'and',
  __root: true
}
