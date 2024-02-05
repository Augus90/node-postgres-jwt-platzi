const UserService = require('./user.service');
const boom = require('@hapi/boom');
const bycript = require('bcrypt');
const jwt = require('jsonwebtoken');
const { config } = require('../config/config');
const nodemailer = require('nodemailer');

const service = new UserService();

class AuthService {
  async getUser(email, password) {
    const user = await service.findByEmail(email);

    //Validaión para cuando el usuario no exista
    if (!user) {
      throw boom.unauthorized();
    }

    const isMatch = await bycript.compare(password, user.password);

    //Si el password no coincide, sale un mensaje que el usuario no está autorizado
    if (!isMatch) {
      throw boom.unauthorized();
    }

    delete user.dataValues.password;
    delete user.dataValues.recoveryToken;
  }

  sighToken(user) {
    const jwtConfig = {
      expiresIn: '1d',
    };

    const payload = {
      sub: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwtSecret, jwtConfig);

    return {
      user,
      token,
    };
  }

  async sendRecovery(email) {
    const user = await service.findByEmail(email);

    //Validaión para cuando el usuario no exista
    if (!user) {
      throw boom.unauthorized();
    }

    const jwtConfig = {
      expiresIn: '15m',
    };
    const payload = { sub: user.id };
    const token = jwt.sign(payload, config.jwtSecret, jwtConfig);
    const link = `http://myfrontend.com/recovery?token=${token}`;

    await service.update(user.id, { recoveryToken: token });

    const mail = {
      from: config.emailRecovery, // sender address
      to: `${user.email}`, // list of receivers
      subject: 'Email para recuperar la constraseña', // Subject line
      text: 'Password Reset', // plain text body
      html: `<b>Ingresa a este LINK para recuperar tu contraseña => ${link}</b>`, // html body
    };

    const rta = await this.sendEmail(mail);
    return rta;
  }

  async sendEmail(infoMail) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.emailRecovery,
        pass: config.emailRecoverySecret,
      },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail(infoMail);
    return { message: 'Email sent successfully' };
  }

  async changePassword(token, password) {
    console.log(`---Token ${token}, password ${password}`);
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      console.log('Payload: ', payload);
      const user = await service.findOne(payload.sub);

      if (user.recoveryToken !== token) {
        console.log(
          "Couldn't change password. User Token:",
          user.recoveryToken
        );
        throw boom.unauthorized();
      }

      const hash = await bycript.hash(password, 10);
      await service.update(user.id, { recoveryToken: null, password: hash });

      return { message: 'Password Change' };
    } catch (error) {
      throw boom.unauthorized();
    }
  }
}

module.exports = AuthService;
