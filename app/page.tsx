"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "./utils/motion";
import { features } from "@/constants";
const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full overflow-hidden">
      <section className="hero min-h-screen w-full relative">
        <Image
          alt="Hero background"
          fill
          src="/assets/imgs/hero.png"
          className="absolute object-cover opacity-50"
          priority
          quality={100}
          sizes="100vw"
        />
        <div className="hero-overlay bg-opacity-60"></div>
        <motion.div
          variants={staggerContainer(0.1, 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="hero-content text-neutral-content text-center"
        >
          <motion.div
            variants={fadeIn("up", "spring", 0.5, 1)}
            className="max-w-4xl px-4"
          >
            <h1 className="mb-5 text-4xl md:text-6xl font-bold leading-tight">
              Share Your <span className="text-[#eb512b]">Voice</span> with the
              World
            </h1>
            <p className="mb-8 text-lg md:text-2xl max-w-2xl mx-auto">
              Whether you're a seasoned writer or a passionate newbie, Blogy is
              your platform to express and connect. Publish your thoughts and
              reach a global audience.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/signup"
                className="btn btn-lg bg-[#eb512b] hover:bg-[#d44926] border-none text-white transition-all duration-300 transform hover:scale-105"
              >
                Become a Contributor
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="w-full bg-gradient-to-b from-gray-900 to-gray-800 py-20 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-16 text-center">
            About <span className="text-[#eb512b]">Blogy</span>
          </h1>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="lg:w-1/2 w-full flex justify-center"
            >
              <Image
                alt="About Blogy"
                src="/assets/imgs/logo.svg"
                width={500}
                height={400}
                className="rounded-lg shadow-2xl object-contain p-6 hover:shadow-primary/40 transition-all duration-300"
              />
            </motion.div>

            <div className="lg:w-1/2 w-full space-y-6">
              <motion.p
                variants={fadeIn("left", "spring", 0.2, 1)}
                className="text-lg md:text-xl leading-relaxed"
              >
                Blogy is an innovative blogging platform designed to connect
                passionate writers and curious readers in a dynamic, engaging
                environment. At its core, Blogy is a space where stories come to
                life, ideas are shared, and meaningful conversations are
                sparked.
              </motion.p>

              <motion.p
                variants={fadeIn("left", "spring", 0.4, 1)}
                className="text-lg md:text-xl leading-relaxed"
              >
                Whether you're an aspiring writer looking to publish your first
                post, a seasoned blogger searching for a wider audience, or a
                reader eager to discover fresh perspectives, Blogy offers
                something for everyone.
              </motion.p>

              <motion.div
                className="flex justify-center sm:justify-start"
                variants={fadeIn("left", "spring", 0.6, 1)}
              >
                <Link
                  href="/register"
                  className="btn btn-wide  mt-6 bg-[#eb512b] hover:bg-[#d44926] border-none text-white"
                >
                  Join Our Community
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="w-full py-20 bg-base-100 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Key <span className="text-[#eb512b]">Features</span>
          </motion.h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeIn("up", "spring", index * 0.1, 0.75)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="card-body items-center text-center">
                  <div className="text-4xl mb-4 text-[#eb512b]">
                    {feature.icon}
                  </div>
                  <h2 className="card-title text-2xl mb-2">{feature.title}</h2>
                  <p className="text-base-content/80">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-20 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-8"
          >
            Ready to Start Your Blogging Journey?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl mb-10 max-w-2xl mx-auto"
          >
            Join thousands of writers who are already sharing their stories on
            Blogy.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link
              href="/register"
              className="btn btn-wide btn-lg bg-[#eb512b] hover:bg-[#d44926] border-none text-white"
            >
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
