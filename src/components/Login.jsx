import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../global-context/firebase-context";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const { singInUser } = UserAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

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

  const formData = async (data) => {
    //try login with user data
    if (data) {
      try {
        const loginF = await singInUser(data.email, data.password);
        console.log(loginF.user);
        if (loginF.user) {
          navigate("/home/issues");
        }
      } catch (errors) {
        console.log(errors.message);
        if (errors.message === "Firebase: Error (auth/wrong-password).") {
          notify("Password is incorrect", 4000);
        }
      }
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="center-home-div-main">
        <div className="form-login">
          <form onSubmit={handleSubmit(formData)}>
            <div className="svg-container">
              <svg
                version="1.0"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="70px"
                height="100px"
                viewBox="0 0 64 64"
                enable-background="new 0 0 64 64"
                xml:space="preserve"
              >
                <g>
                  <g>
                    <path
                      fill="#394240"
                      d="M63.329,57.781C62.954,57.219,53.892,44,31.999,44C10.112,44,1.046,57.219,0.671,57.781
			c-1.223,1.84-0.727,4.32,1.109,5.547c1.836,1.223,4.32,0.727,5.547-1.109C7.397,62.117,14.347,52,31.999,52
			c17.416,0,24.4,9.828,24.674,10.219C57.446,63.375,58.712,64,60.009,64c0.758,0,1.531-0.219,2.211-0.672
			C64.056,62.102,64.556,59.621,63.329,57.781z"
                    />
                    <path
                      fill="#394240"
                      d="M31.999,40c8.836,0,16-7.16,16-16v-8c0-8.84-7.164-16-16-16s-16,7.16-16,16v8
			C15.999,32.84,23.163,40,31.999,40z M23.999,16c0-4.418,3.586-8,8-8c4.422,0,8,3.582,8,8v8c0,4.418-3.578,8-8,8
			c-4.414,0-8-3.582-8-8V16z"
                    />
                  </g>
                  <path
                    fill="#F9EBB2"
                    d="M23.999,16c0-4.418,3.586-8,8-8c4.422,0,8,3.582,8,8v8c0,4.418-3.578,8-8,8c-4.414,0-8-3.582-8-8V16z"
                  />
                </g>
              </svg>
              <h4>Welcome back!</h4>
            </div>
            <div>
              <input
                className="input"
                type="text"
                name="email"
                id="email"
                placeholder="Email"
                {...register("email")}
              />
            </div>
            <div>
              <input
                className="input"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                {...register("password")}
                required
              />
            </div>
            <div>
              <button type="submit">Login</button>
            </div>
            <div className="create-account">
              <Link to="/create_account">I don't have a account yet 😣 !</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
