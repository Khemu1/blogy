"use client";

import Link from "next/link";
import Image from "next/image";
import { blogyFeatures } from "@/constants";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-[100dvw] ">
      <div className="hero min-h-screen w-full relative">
        <Image
          alt="Hero"
          fill={true}
          src={"/assets/imgs/hero.png"}
          className="absolute xl:object-cover  opacity-50"
        />
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-xl md:text-5xl font-bold">
              Share Your Voice with the World
            </h1>
            <p className="mb-5 text-sm md:text-xl">
              Whether you’re a seasoned writer or a passionate newbie, Blogy is
              your platform to express and connect. Publish your thoughts and
              reach a global audience.
            </p>
            <Link
              href={"/blogs"}
              className="btn bg-[#eb512b] border-none text-white"
            >
              Become a Contributor
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full items-center gap-8 bg-gradient-to-b from-gray-900 to-gray-800 py-16 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">About Blogy</h1>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl">
          <div className="md:w-1/2 w-full flex items-center justify-center">
            <Image
              alt="About Blogy"
              src="/assets/imgs/logo.svg"
              width={400}
              height={300}
              className="rounded-lg shadow-lg object-cover p-6"
            />
          </div>
          <div className="md:w-1/2 w-full text-center md:text-left flex flex-col gap-4">
            <p className="text-lg md:text-xl">
              Blogy is an innovative blogging platform designed to connect
              passionate writers and curious readers in a dynamic, engaging
              environment. At its core, Blogy is a space where stories come to
              life, ideas are shared, and meaningful conversations are sparked.
            </p>
            <p className="text-lg md:text-xl">
              Whether you're an aspiring writer looking to publish your first
              post, a seasoned blogger searching for a wider audience, or a
              reader eager to discover fresh perspectives, Blogy offers
              something for everyone.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full items-center gap-8 py-8 bg-base-100">
        <h1 className="text-5xl font-semibold">Key Features</h1>
        <div className="flex flex-col gap-4">
          {blogyFeatures.map((f) => (
            <div key={f.title} className="feat">
              <span className="font-semibold text-xl whitespace-nowrap">
                {f.title}
              </span>
              <span className="flex text-sm md:text-base">{f.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
