import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b-1 border-gray-900 flex bg-white w-full mx-auto innerbox flex flex-1 w-full flex-col items-center justify-center p-4">
      <div className="max-w-5xl flex justify-between flex px-4 max-xl w-full">
      <div className="gg-head flex col-1 w-1/3 justify-start w-30 text-3xl">
        <Link href="https://www.gitagpt.in/"
        className="flex items-center">
          <Image
          alt="GitaGPT"
          src="/logo.png"
          width={100}
          height={22}
        />
      </Link>
      </div>
      <div className="gg-menu flex items-center">
        <Link href="https://twitter.com/Gita_GPT"
        className="px-2 space-x-3 max-w-5xl align-center innerbox flex">
        <p className="text-slate-800 px-4">Twitter</p>
      </Link>
      </div>
      </div>
    </header>
  );
}
