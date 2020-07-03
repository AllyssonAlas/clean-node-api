const MongoHelper = require('../helpers/mongo-helper')
const MissingParamError = require('../../utils/errors/missing-param-error')
const UpdateAcessTokenRepository = require('./update-access-token-repository')

let userModel

const makeSut = () => {
  return new UpdateAcessTokenRepository()
}

describe('UpdateAcessToken Repository', () => {
  let fakeUserID

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()

    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 50,
      state: 'any_state',
      password: 'hashed_password'
    })

    fakeUserID = fakeUser.ops[0]._id
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should update the user wuth the given accessToken', async () => {
    const sut = makeSut()

    await sut.update(fakeUserID, 'valid_token')
    const updatedFakeUser = await userModel.findOne({
      _id: fakeUserID
    })
    expect(updatedFakeUser.accessToken).toBe('valid_token')
  })

  test('Should throw if no params are provided', async () => {
    const sut = makeSut()
    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update(fakeUserID)).rejects.toThrow(
      new MissingParamError('accessToken')
    )
  })
})
