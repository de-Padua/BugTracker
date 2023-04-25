import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { UserAuth } from "../global-context/firebase-context";

export default function CreateAccout() {
  //navigate

  const navigate = useNavigate();

  //user auth is required

  const { createNewUser } = UserAuth();
  const { addNewUserToDB } = UserAuth();
  const { updateUser } = UserAuth();

  //notification account create
  const notify = (message, time) =>
    toast.info(message, {
      position: "top-left",
      autoClose: time,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  ////////////////////////////////

  const [validForm, setValidForm] = useState(true);

  const regex_email =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  const email_style_form = validForm
    ? { borderColor: "" }
    : { borderColor: "red" };

  const newAccountValidation = (data) => {
    if (data) {
      const email_validation = data.email.match(regex_email);
      if (email_validation && data.password_to_match === data.password) {
        setValidForm(true);
        console.log("Email correctly validated");

        //if email_validation is true, create a new account and validate
        createNewUser(data.email, data.password, data.Username)
          .then((newUser) => {
            notify("Account successfully created", 500);
            updateUser(data.Username)
              .then(() => {
                addNewUserToDB(newUser.user, newUser.user.uid);
              })
              .then(() => {
                setTimeout(() => {
                  navigate("/login");
                }, 1200);
              });
          })
          .catch((errors) => {
            if (
              errors.message === "Firebase: Error (auth/email-already-in-use)."
            ) {
              notify("Email already in use", 4000);
            }
          });
      } else if (data.password_to_match !== data.password) {
        setValidForm(false);
        notify("Passwords do not match", 4000);
      }
    }
  };
  return (
    <div>
      <ToastContainer />

      <div className="center-home-div-main">
        <div className="form-login">
          <form onSubmit={handleSubmit(newAccountValidation)}>
            <div className="svg-container">
              <svg
                version="1.0"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="64px"
                height="74px"
                viewBox="0 0 64 64"
                enable-background="new 0 0 64 64"
                xml:space="preserve"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <g>
                    {" "}
                    <g>
                      {" "}
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        fill="#394240"
                        d="M48,12H4c-2.211,0-4,1.789-4,4v28c0,2.211,1.789,4,4,4h8v12 c0,1.617,0.973,3.078,2.469,3.695C14.965,63.902,15.484,64,16,64c1.039,0,2.062-0.406,2.828-1.172L33.656,48H48 c2.211,0,4-1.789,4-4V16C52,13.789,50.211,12,48,12z M44,40H32c-1.023,0-2.047,0.391-2.828,1.172L20,50.344V44 c0-2.211-1.789-4-4-4H8V20h36V40z"
                      ></path>{" "}
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        fill="#394240"
                        d="M60,0H16c-2.211,0-4,1.789-4,4v4h40c2.211,0,4,1.789,4,4v24h4 c2.211,0,4-1.789,4-4V4C64,1.789,62.211,0,60,0z"
                      ></path>{" "}
                    </g>{" "}
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      fill="#F9EBB2"
                      d="M44,40H32c-1.023,0-2.047,0.391-2.828,1.172L20,50.344V44 c0-2.211-1.789-4-4-4H8V20h36V40z"
                    ></path>{" "}
                  </g>{" "}
                </g>
              </svg>
              <h4>Let us know more about you!</h4>
            </div>
            <div>
              <input
                className="input"
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                required
                {...register("Username")}
              />
            </div>
            <div>
              <input
                style={email_style_form}
                className="input"
                type="text"
                name="email"
                id="email"
                placeholder="Email"
                required
                {...register("email")}
              />
            </div>
            <div>
              <input
                style={email_style_form}
                className="input"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                {...register("password")}
              />
            </div>
            <div>
              <input
                style={email_style_form}
                className="input"
                type="password"
                name="password2"
                id="password2"
                placeholder="Confirm password"
                {...register("password_to_match")}
              />
            </div>

            <div>
              <button
                type="submit"
                onClick={() => {
                  newAccountValidation();
                }}
              >
                Create account now
              </button>
            </div>
            <div className="create-account">
              <Link to="/login">I have a account! 😅</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
