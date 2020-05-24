module.exports = class UnauthorizedError extends Error {
  constructor () {
    super('Unauthorized! Server cannot find user with such credentials.')
    this.name = 'UnauthorizedError'
  }
}
