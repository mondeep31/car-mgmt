import { LoginPage } from "@/components/LoginPage";

import SideAuth from "../components/SideAuth";

export const Login = () => {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div>
          <SideAuth />
        </div>
        <div>

          <LoginPage />
        </div>
      </div>
    </div>
  );
};

export default Login;
