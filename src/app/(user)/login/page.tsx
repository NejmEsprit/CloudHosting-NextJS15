//import { cookies } from "next/headers";
import LoginForm from "./LoginForm";
//import { redirect } from "next/navigation";

const LoginPage =async () => {
  // const cookieStore = await cookies();
  // const token = cookieStore.get("jwtToken")?.value;
  // if(token){
  //  return redirect('/')
  // }
  return (
    <section className="fix-height container m-auto px-7 flex items-center justify-center">
      <div className="m-auto bg-white rounded-lg p-5 w-full md:w-2/3">
        <h1 className="text-3xl font-bold text-gray-800 mb-5 flex justify-center">
          Log In
        </h1>
        <LoginForm />
      </div>
    </section>
  );
};

export default LoginPage;
