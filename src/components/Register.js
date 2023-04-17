import React from "react";
import {Link} from 'react-router-dom';
import Login from "./Login";

function Register({onSubmit, isLoading}) {
  return (
    <Login
    title={'Регистрация'}
    onSubmit={onSubmit}
    valueText={'Зарегистрироваться'}
    valueLoadingText={'Регистрация...'}
    isLoading={isLoading}
    >
      <p className="login__submit-text">
        Уже зарегистрированы?
        <Link to="/" className="login__entry-link">Войти</Link>
      </p>
    </Login>

  )
}

export default Register;
