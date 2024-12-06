import React from "react";

const loading = () => {
  return (
    <section className="h-dvh bg-lime-700 text-red-700 text-4xl flex items-center justify-center space-x-2">
      <span
        className="translate-y-[-25%] animate-bounce"
        style={{ animationDelay: "0s", animationDuration: "0.7s" }}>
        ♦
      </span>
      <span
        className="translate-y-[-25%] animate-bounce"
        style={{ animationDelay: "0.2s", animationDuration: "0.7s" }}>
        ♦
      </span>
      <span
        className="translate-y-[-25%] animate-bounce"
        style={{ animationDelay: "0.4s", animationDuration: "0.7s" }}>
        ♦
      </span>
      <span
        className="translate-y-[-25%] animate-bounce"
        style={{ animationDelay: "0.6s", animationDuration: "0.7s" }}>
        ♦
      </span>
      <span
        className="translate-y-[-25%] animate-bounce"
        style={{ animationDelay: "0.8s", animationDuration: "0.7s" }}>
        ♦
      </span>
      <span
        className="translate-y-[-25%] animate-bounce"
        style={{ animationDelay: "1s", animationDuration: "0.7s" }}>
        ♦
      </span>
      <span
        className="translate-y-[-25%] animate-bounce"
        style={{ animationDelay: "1.2s", animationDuration: "0.7s" }}>
        ♦
      </span>
    </section>
  );
};

export default loading;
