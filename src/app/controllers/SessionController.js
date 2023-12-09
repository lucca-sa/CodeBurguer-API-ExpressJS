import * as Yup from 'yup'
import Jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'
import User from '../models/User'

class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })

    function returnSessionError() {
      return response
        .status(401)
        .json({ error: 'Email or Password are Incorrect' })
    }

    if (!(await schema.isValid(request.body))) {
      return returnSessionError()
    }

    const { email, password } = request.body

    const user = await User.findOne({
      where: { email },
    })

    if (!user) {
      return returnSessionError()
    }

    if (!(await user.checkPassword(password))) {
      return returnSessionError()
    }

    return response.json({
      id: user.id,
      email,
      name: user.name,
      admin: user.admin,
      token: Jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    })
  }
}

export default new SessionController()
