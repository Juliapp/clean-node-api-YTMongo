const MongoDbHelper = require('../../../src/infra/helpers/mongo-helper')
const UpdateAccessTokenRepository = require('../../../src/infra/repositories/update-access-token-repository')
const { MissingParamError } = require('../../../src/utils/errors')

const makeSut = () => {
  const sut = new UpdateAccessTokenRepository()
  return {
    sut
  }
}
describe('UpdateAccessToken Repository', () => {
  let fakeUserId
  let userModel

  beforeAll(async () => {
    await MongoDbHelper.connect(process.env.MONGO_URL)
    userModel = await MongoDbHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()

    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 50,
      state: 'any_stage',
      password: 'hashed_password'
    })

    fakeUserId = fakeUser.ops[0]._id
  })

  afterAll(async () => {
    await MongoDbHelper.disconnect()
  })

  test('Should update the user with the given accessToken', async () => {
    const { sut } = makeSut()
    await sut.update(fakeUserId, 'valid_token')
    const updatedFakeUser = await userModel.findOne({ _id: fakeUserId })
    expect(updatedFakeUser.accessToken).toBe('valid_token')
  })

  test('Should throw if no params is provided', async () => {
    const { sut } = makeSut()

    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update(fakeUserId)).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
