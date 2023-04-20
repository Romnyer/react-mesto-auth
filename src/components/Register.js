import React from "react";
import {Link} from 'react-router-dom';
import Login from "./AuthForm";

function Register({onSubmit, isLoading}) {
  return (
    <Login
    title={'Регистрация'}
    onSubmit={onSubmit}
    valueText={isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
    >
      <p className="login__submit-text">
        Уже зарегистрированы?
        <Link to="/" className="login__entry-link">Войти</Link>
      </p>
    </Login>

  )
}

export default Register;
