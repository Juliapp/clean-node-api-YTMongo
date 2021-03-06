const EmailValidator = require('../../src/utils/helpers/email-validator')
const validator = require('validator')

const makeSut = () => {
  const sut = new EmailValidator()
  return { sut }
}

describe('Email Validator', () => {
  test('Should return true id validator returns true', () => {
    const { sut } = makeSut()
    const isEmailValid = sut.isValid('valid_email@email.com')
    expect(isEmailValid).toBe(true)
  })

  test('Should return false id validator returns false', () => {
    validator.isEmailValid = false
    const { sut } = makeSut()
    const isEmailValid = sut.isValid('invalid_email@email.com')
    expect(isEmailValid).toBe(false)
  })

  test('Should call validator with correct email', () => {
    const { sut } = makeSut()
    sut.isValid('any_email@email.com')
    expect(validator.email).toBe('any_email@email.com')
  })
})
