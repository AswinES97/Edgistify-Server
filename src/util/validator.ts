import { ReqValidationError } from '@ticket-common/common'
import { NextFunction, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'

// check password regex
const reqValidator = {
  fullname: () => {
    return body('fullname').trim().notEmpty().isLength({ min: 5, max: 15 })
  },
  email: () => {
    return body('email').isEmail()
  },
  password: () => {
    return body('password')
      .trim()
      .notEmpty()
      .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^*-]).{8,}$/)
  },
  validatorFn: (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) throw new ReqValidationError(errors.array())
    next()
  }
}

export default reqValidator