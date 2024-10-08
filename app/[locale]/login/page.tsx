import { login } from "./actions";
import { IoMdLock } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { GrLogin } from "react-icons/gr";

export default function LoginPage() {
  const log = "bg-gray-300/50 p-2 rounded-xl flex items-center gap-1 ";
  return (
    <div className="  justify-center items-center flex mt-36 rounded-3xl p-12 shadow-xl flex-col">
      <div className="rounded-2xl shadow-2xl p-4 w-fit flex justify-center">
        {" "}
        <GrLogin size={30} />
      </div>
      <p className="text-xl font-bold mt-4">Sign in with email</p>
      <form>
        <div className="flex flex-col mt-8 ">
          <label htmlFor="email" className={log}>
            <MdEmail />
            Email
          </label>
          <input id="email" name="email" type="email" required />
          <label htmlFor="password" className={log}>
            <IoMdLock />
            Password
          </label>
          <input id="password" name="password" type="password" required />
          <button
            formAction={login}
            className="bg-black text-white rounded-xl w-full py-2"
          >
            Log in
          </button>
        </div>
      </form>
    </div>
  );
}
