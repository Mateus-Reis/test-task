import React from "react";
import { animated, useSpring } from "@react-spring/web";
import { useInView } from "react-intersection-observer";

const Presentation: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fade = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(50px)",
  });

  const backgroundStyle = {
    backgroundImage:
      "url('/backgrounds/presentation-background.jpeg'), linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundBlendMode: "overlay",
  };

  const scrollToSignUp = () => {
    const signUpSection = document.getElementById("signup");
    if (signUpSection) {
      signUpSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <animated.section
      ref={ref}
      style={{ ...fade, ...backgroundStyle }}
      id="presentation"
      className="w-full min-h-screen flex flex-col items-center justify-center text-center bg-fixed"
    >
      <h1 className="text-4xl font-bold mb-4 text-white max-w-2xl">
        Test assignment for front-end developer
      </h1>
      <p className="text-lg mb-8 text-white max-w-xl">
        What defines a good front-end developer is one that has skilled
        knowledge of HTML, CSS, and JS with a vast understanding of User design
        thinking as they&apos;ll be building web interfaces with accessibility
        in mind. They should also be excited to learn, as the world of Front-End
        Development keeps evolving.
      </p>

      <button
        onClick={scrollToSignUp}
        className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition-colors duration-300"
      >
        Sign Up
      </button>
    </animated.section>
  );
};

export default Presentation;
