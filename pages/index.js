import { useSession } from "next-auth/react";
import Layout from "../components/Layout";

export default function Home() {
  const {data: session} = useSession()
  console.log(session);
  return(
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>
          Hello, <b>{session?.user?.name}</b>
        </h2>
        <div className="flex gap-1 bg-gray-200 text-black rounded-lg">
          <img src={session?.user?.image} alt="" className="w-6 h-6 rounded-lg"/>
          <span className="px-2">
            {session?.user?.name}
          </span>
        </div>
      </div>
    </Layout>
  )
}
