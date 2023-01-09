import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { login } from "../../store/session";

const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const demoLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login("demo@aa.io", "password"));
    if (data) {
      setErrors(data);
    }
  };

  if (user) {
    return <Redirect to="/home" />;
  }

  return (
    <form onSubmit={onLogin}>
      <div className="login-container">
        <div className="login-errors">
          {errors.map((error, ind) => (
            <div key={ind}>{error}</div>
          ))}
        </div>
        {/* <div>
        <label htmlFor='FirstName'>First Name</label>
        <input
          name='name'
          type='text'
          placeholder='First Name'
          value={email}
          onChange={updateEmail}
        />
      </div>
      <div>
        <label htmlFor='LastName'>Last Name</label>
        <input
          name='name'
          type='text'
          placeholder='Last Name'
          value={email}
          onChange={updateEmail}
        />
      </div>
      <div>
        <label htmlFor='Username'>Username</label>
        <input
          name='name'
          type='text'
          placeholder='Username'
          value={email}
          onChange={updateEmail}
        />
      </div>
      <div>
        <label htmlFor='email'>Email</label>
        <input
          name='email'
          type='text'
          placeholder='Email'
          value={email}
          onChange={updateEmail}
        />
      </div> */}
        <div className="login-email">
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={updateEmail}
          />
        </div>
        <div className="login-password">
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={updatePassword}
          />
          <button type="submit">Login</button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
