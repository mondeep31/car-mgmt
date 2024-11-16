import { SignupPage } from "@/components/SignupPage";

import SideAuth from "../components/SideAuth";

export const Signup = () => {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div>
          <SideAuth />
        </div>
        <div>

          <SignupPage />
        </div>
      </div>
    </div>
  );
};

export default Signup;
