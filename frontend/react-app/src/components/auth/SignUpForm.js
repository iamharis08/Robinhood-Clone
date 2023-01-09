import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";
import "../../css/SignUpPage.css";

const SignUpForm = () => {
  const [errors, setErrors] = useState([]);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [total_investment, setInvestment] = useState("");
  const [buying_power, setBuyingPower] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      const data = await dispatch(
        signUp(
          username,
          email,
          password,
          first_name,
          last_name,
          total_investment,
          buying_power
        )
      );
      if (data) {
        setErrors(data);
        console.log(data)
      }
    } else {setErrors(["password: Passwords must match", "repeat_password: Passwords must match"])}
  };

  const updateFirstName = (e) => {
    setFirstName(e.target.value);
  };
  const updateLastName = (e) => {
    setLastName(e.target.value);
  };
  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };
  const updateInvestment = (e) => {
    setInvestment(e.target.value);
    setBuyingPower(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to="/home" />;
  }

  return (
    <div className="sign-up-container">
      <div className="left-signup-container">
        <div className="self-promotion">Invest with zero commission fees</div>
        <div className="disclosure">
          Be advised, Risinghood is an investing simulation app.{" "}
        </div>
        <div className="bottom-image">
          <img
            src={
              "https://cdn.robinhood.com/app_assets/odyssey/experiment/invest.png"
            }
          />
        </div>
      </div>
      <div className="right-signup-container">
        <div className="signup-title">Sign up to start your journey</div>
            <div className="signup-errors">
              {errors.map((error, ind) => (
                <div key={ind}>{error}</div>
              ))}
            </div>
        <div className="signup-form-container">
          <form onSubmit={onSignUp}>
            <div className="signup-names-inputs">
              <div>
                {/* <label htmlFor="FirstName">First Name</label> */}
                <input
                  name="signup"
                  type="text"
                  placeholder="First Name"
                  value={first_name}
                  onChange={updateFirstName}
                />
              </div>
              <div>
                {/* <label htmlFor="LastName">Last Name</label> */}
                <input
                  name="signup"
                  type="text"
                  placeholder="Last Name"
                  value={last_name}
                  onChange={updateLastName}
                />
              </div>
            </div>
            <div className="signup-names-inputs">
              <div>
                {/* <label>User Name</label> */}
                <input
                  type="text"
                  name="signup"
                  placeholder="Username"
                  onChange={updateUsername}
                  value={username}
                ></input>
              </div>
              <div>
                {/* <label>Email</label> */}
                <input
                  type="text"
                  name="signup"
                  placeholder="Email"
                  onChange={updateEmail}
                  value={email}
                ></input>
              </div>
            </div>
            <div className="signup-names-inputs">

              <div>
                {/* <label>Password</label> */}
                <input
                  type="password"
                  name="signup"
                  placeholder="Password"
                  onChange={updatePassword}
                  value={password}
                ></input>
              </div>
              <div>
                {/* <label>Initial Investment</label> */}
                <input
                  type="text"
                  name="signup"
                  placeholder="Total Investment"
                  onChange={updateInvestment}
                  value={total_investment}
                ></input>
              </div>
            </div>

            <div>
              {/* <label>Repeat Password</label> */}
              <input
                type="password"
                name="signup"
                placeholder="Repeat Password"
                onChange={updateRepeatPassword}
                value={repeatPassword}
                required={true}
              ></input>
            </div>

            <button id="signup-submit-button" type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
