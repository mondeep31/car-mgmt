import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupInput } from "../utils/validation";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { LabelledInput } from "./LabelledInput";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
  });

  async function sendRequest() {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/auth/${type === "signup" ? "signup" : "login"}`,
        postInputs
      );
      const jwt = response.data;
      console.log(jwt);
      localStorage.setItem("token", jwt);
      alert("Signed up");
      navigate("/cars");
    } catch (e) {
      console.error(e);
      alert("Error while signing up");
    }
  }
  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
          <div className="px-10">
            <div className="text-3xl font-extrabold">
              {type === "signin"
                ? "Log in to your account"
                : "Create an account"}
            </div>
            <div className="text-slate-500">
              {type === "signin"
                ? "Don't have an account? "
                : "Already have an account"}
              <Link
                className="pl-2 underline"
                to={type == "signin" ? "/signup" : "/login"}
              >
                {type === "signin" ? "Sign up" : "Sign in"}
              </Link>
            </div>
          </div>
          <div className="pt-8">
            {type === "signup" ? (
              <LabelledInput
                label="Name"
                placeholder="Enter your name"
                onChange={(e) => {
                  setPostInputs({
                    ...postInputs,
                    name: e.target.value,
                  });
                }}
              />
            ) : null}
            <LabelledInput
              label="Email"
              placeholder="Enter your email"
              onChange={(e) => {
                setPostInputs({
                  ...postInputs,
                  email: e.target.value,
                });
              }}
            />
            <LabelledInput
              label="password"
              type={"password"}
              placeholder="Enter your password"
              onChange={(e) => {
                setPostInputs({
                  ...postInputs,
                  password: e.target.value,
                });
              }}
            />
            <button
              onClick={sendRequest}
              type="button"
              className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              {type === "signup" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
