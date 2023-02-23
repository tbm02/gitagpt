import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { languageType } from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";
import logo from './gita-gpt.svg';


const Home: NextPage = () => {
  const [response, setResponse] = useState<Record<string, unknown> | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [gita, setGita] = useState("");
  const [language, setLanguage] = useState<languageType>("Basic");
  const [generatedGitas, setGeneratedGitas] = useState<String>("");


  // Here is how code operares
   const prompt =
   language === "Krishna"
     ? `You are Krishna, answer according to the Bhagavad Gita. Make sure there is a life lessons on morality, strength, discipline and spirituality.${language}`
     : `Generate ${language} verse from Bhagavad Gita clearly labeled Chapter name. Make sure each generated verse is at least 14 words and at max 20 words and base them on this context:${gita}${
        gita.slice(-1) === "." ? "" : "."
       }`;
  
   const generateGita = async (e: any) => {
    e.preventDefault();
    setGeneratedGitas("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      setResponse({
        status: response.status,
        body: await response.text(),
        headers: {
          "X-Ratelimit-Limit": response.headers.get("X-Ratelimit-Limit"),
          "X-Ratelimit-Remaining": response.headers.get(
            "X-Ratelimit-Remaining"
          ),
          "X-Ratelimit-Reset": response.headers.get("X-Ratelimit-Reset"),
        },
      });
      setLoading(false);
      toast.error(`It seems that you have exceeded your quota. But don't you worry my friend! Just take a deep breath and give it a minute. Everything will be alright!`);
      return;
    }

    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedGitas((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  const isDisabled = () => {
    const trimmedgita = gita.trim();
    if (trimmedgita.length === 1) {
      return true;
    } else {
      return false;
    }
  };

  const limitCharacters = (e: any) => {
    if (e.target.value.length > 300) {
      e.target.value = e.target.value.substr(0, 300);
      toast.error("Whoa, you're on a roll! But you've hit the max character limit. Keep up the good work, though!");
    }
  };
    
 return (
    
    <div className="bg-gray-100 flex mx-auto flex-col items-center justify-center min-h-screen">
      <Head>
        <title>Gita GPT – Bhagavad Geeta AI 🔥</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="max-w-5xl innerbox flex flex-1 w-full flex-col p-4">
        <div className="max-xl w-full">
        <h2 className="sm:text-4xl text-xl max-w-2xl font-bold text-slate-900 my-5">Unlock the Power of AI with the Bhagavad Gita</h2>
        <p className="text-base font-base mb-2">
            What troubles you, my friend?</p>
          <div className="my-2">
          <textarea
            value={gita}
            onChange={(e) => setGita(e.target.value)}
            onInput={limitCharacters}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isDisabled()) {
                e.preventDefault();
                generateGita(e);
              }
            }}
            rows={4}
            className="w-full text-xl font-light rounded-lg shadow-sm border-0 focus:outline-none focus:shadow-outline"
            placeholder={"For example, 'How can I find inner peace?'"}
          />
          {!loading && (
            <button
            className="bg-black rounded-xl text-white font-bold px-4 py-2 sm:mt-4 mt-5 hover:bg-black/80 w-half inline-block flex-wrap flex"
            onClick={(e) => generateGita(e)}
          >
            Ask Krishna &rarr;
          </button>
        )}
        {loading && (
          <button
            className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-4 mt-5 hover:bg-black/80"
            disabled
          >
            <LoadingDots color="white" style="large" />
          </button>
          )}
        </div>
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="my-5" />
        
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="text-left space-y-10 p-4">
              {generatedGitas && (
                <>
                  <div>
                    <h2 className="sm:text-2xl text-xl font-bold text-slate-800 mx-auto">
                      Krishna say:
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col max-xl mx-auto">
                    {generatedGitas
                        .substring(generatedGitas.indexOf("1") + 3)
                        .split("1.")
                        .map((generatedGita) => {
                          return (
                            <div
                              className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                              onClick={() => {
                                navigator.clipboard.writeText(generatedGita);
                                toast("Copied to clipboard", {
                                  icon: "✂️",
                                });
                              }}
                              key={generatedGita}
                            >
                              <p className="mb-2.5 space-y-4 text-slate-800 py-2	">{generatedGita}</p>
                              <a href="https://twitter.com/intent/tweet?text=Find%20solace%20in%20the%20wisdom%20of%20Shree%20Krishna%20%F0%9F%A6%9A%0A%0ABhagavad%20Gita%20AI%20App%0A%0Ahttps%3A//www.gitagpt.com" target="_blank" className="text-[#1da1f2] font-medium text-sm px-5 py-2.5 text-center inline-flex items-center hover:opacity-80">
              <svg className="w-4 h-4 mr-2 -ml-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="twitter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M459.4 151.7c.325 4.548 .325 9.097 .325 13.65 0 138.7-105.6 298.6-298.6 298.6-59.45 0-114.7-17.22-161.1-47.11 8.447 .974 16.57 1.299 25.34 1.299 49.06 0 94.21-16.57 130.3-44.83-46.13-.975-84.79-31.19-98.11-72.77 6.498 .974 12.99 1.624 19.82 1.624 9.421 0 18.84-1.3 27.61-3.573-48.08-9.747-84.14-51.98-84.14-102.1v-1.299c13.97 7.797 30.21 12.67 47.43 13.32-28.26-18.84-46.78-51.01-46.78-87.39 0-19.49 5.197-37.36 14.29-52.95 51.65 63.67 129.3 105.3 216.4 109.8-1.624-7.797-2.599-15.92-2.599-24.04 0-57.83 46.78-104.9 104.9-104.9 30.21 0 57.5 12.67 76.67 33.14 23.72-4.548 46.46-13.32 66.6-25.34-7.798 24.37-24.37 44.83-46.13 57.83 21.12-2.273 41.58-8.122 60.43-16.24-14.29 20.79-32.16 39.31-52.63 54.25z"></path></svg>
              Share on Twitter
            </a>
                            </div>
                        );
                      })}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
        <hr className="space-y-10 my-5" />
        <div className="max-xl w-full whitespace-pre-line break-words rounded-xl bg-white p-4 mb-5 ring-1 ring-slate-900/5">
        <h2 className="text-xl font-bold text-slate-800 mx-auto py-2">Find solace in the wisdom of
Shree Krishna 🦚</h2>
<p className="bg-primary-300 text-slate-700 my-5">GitaGPT is AI chatbot that uses Bhagavad Gita references to answer your questions. This is an open platform, feel free to ask Krishna anything.</p>
<a
              className="inline-block flex-warp w-half rounded-xl mr-2 border border-gray-300 bg-white px-4 py-2 text-slate-700 transition-colors hover:bg-gray-100 my-2.5"
              href="https://www.sahu4you.com/gita-gpt/" target="_blank" rel="noopener noreferrer"
              >
              Support this project
            </a>
            <a href="https://twitter.com/intent/tweet?text=Find%20solace%20in%20the%20wisdom%20of%20Shree%20Krishna%20%F0%9F%A6%9A%0A%0ABhagavad%20Gita%20AI%20App%0A%0Ahttps%3A//www.gitagpt.com" target="_blank" className="inline-block rounded-xl border border-gray-300 bg-white px-4 py-2 w-half font-bold transition-colors hover:bg-gray-100 my-2.5 hover:opacity-80">
              <svg className="text-[#1da1f2] w-4 h-4 mr-2 inline-block" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="twitter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M459.4 151.7c.325 4.548 .325 9.097 .325 13.65 0 138.7-105.6 298.6-298.6 298.6-59.45 0-114.7-17.22-161.1-47.11 8.447 .974 16.57 1.299 25.34 1.299 49.06 0 94.21-16.57 130.3-44.83-46.13-.975-84.79-31.19-98.11-72.77 6.498 .974 12.99 1.624 19.82 1.624 9.421 0 18.84-1.3 27.61-3.573-48.08-9.747-84.14-51.98-84.14-102.1v-1.299c13.97 7.797 30.21 12.67 47.43 13.32-28.26-18.84-46.78-51.01-46.78-87.39 0-19.49 5.197-37.36 14.29-52.95 51.65 63.67 129.3 105.3 216.4 109.8-1.624-7.797-2.599-15.92-2.599-24.04 0-57.83 46.78-104.9 104.9-104.9 30.21 0 57.5 12.67 76.67 33.14 23.72-4.548 46.46-13.32 66.6-25.34-7.798 24.37-24.37 44.83-46.13 57.83 21.12-2.273 41.58-8.122 60.43-16.24-14.29 20.79-32.16 39.31-52.63 54.25z"></path></svg>
              Twitter
            </a>
            
</div>
        <div className="max-xl w-full whitespace-pre-line break-words rounded-xl bg-white p-4 mb-5 ring-1 ring-slate-900/5">
        <h2 className="text-xl font-bold text-slate-800 mx-auto py-2">
            Explore Uncover truth and deepen knowledge with insight
        </h2>
        <p className="mb-2.5 space-y-4 text-slate-800 py-2">
              Bhagavad Gita holds the key to unlocking answers to every query and challenges. Ask anything like any miracle, powerful mantras that help in real life.</p>
              <a
              className="inline-block font-bold flex-warp w-half rounded-xl mr-2 border border-gray-300 bg-white px-4 py-2 text-slate-700 transition-colors hover:bg-gray-100 my-5"
              href="https://www.sahu4you.com/gita-gpt/" target="_blank" rel="noopener noreferrer"
              >
              Start Learning 📔
            </a>
</div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
