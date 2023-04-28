import faker from 'faker'

export default (size = 2) => {
  const list = []
  while (size > 0) {
    faker.setLocale('zh_CN')
    const name = faker.name.lastName() + faker.name.firstName()
    const job = faker.name.jobTitle()
    const suffix = '_' + size
    faker.setLocale('en')
    list.push({
      id: faker.datatype.uuid(),
      name,
      account: faker.name.firstName().toLocaleLowerCase() + suffix,
      phone: faker.phone.phoneNumber('1##########').replace(/^(\d)(\d)/, ($1, $2, $3) => {
        return $2 + (Number($3) < 3 ? 3 : $3)
      }),
      age: faker.datatype.number({ min: 18, max: 50 }),
      email: faker.internet.email(),
      url: faker.internet.url(),
      avatar: faker.internet.avatar(),
      ip: faker.internet.ip() + suffix,
      job,
      companyName: faker.company.companyName(),
      city: faker.address.cityName(),
      datetime: faker.time.recent()
    })
    size--
  }
  return list
}
