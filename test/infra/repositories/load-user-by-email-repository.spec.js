const MongoDbHelper = require('../../../src/infra/helpers/mongo-helper')
const LoadUserByEmailRepository = require('../../../src/infra/repositories/load-user-by-email-repository')
const { MissingParamError } = require('../../../src/utils/errors')

let db

const makeSut = () => {
  const sut = new LoadUserByEmailRepository()
  return {
    sut
  }
}

describe('LoadUserByEmailRepository', () => {
  let userModel
  // CONFIGURAÇÕES DO BANCO

  beforeAll(async () => {
    await MongoDbHelper.connect(process.env.MONGO_URL)
    db = await MongoDbHelper.getDb()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
    userModel = await db.collection('users')
  })

  afterAll(async () => {
    await MongoDbHelper.disconnect()
  })

  test('Should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('invalid_email@mail.com')
    expect(user).toBeNull()
  })

  test('Should return an user if no user is found', async () => {
    const { sut } = makeSut()

    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 50,
      state: 'any_stage',
      password: 'hashed_password'
    })

    const user = await sut.load('valid_email@mail.com')
    expect(user).toEqual({
      _id: fakeUser.ops[0]._id,
      password: fakeUser.ops[0].password
    })
  })

  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.load()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
