import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Turnstile from "react-turnstile"; // Import Turnstile component

export default function AnimatedForm() {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState({ name: "", answers: [] });
  const [submitted, setSubmitted] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null); // Store CAPTCHA token

  const siteKey = "0x4AAAAAAA4fDyXC6N5FMQ4R"; // Replace with your Cloudflare Site Key

  const questions = [
    {
      question: "What's your name?",
      type: "text",
      placeholder: "Enter your name",
      key: "name",
    },
    {
      question: "Pick your favorite mythical creature:",
      type: "choice",
      choices: ["Dragon", "Unicorn", "Phoenix", "Kraken"],
      key: "favoriteCreature",
    },
    {
      question: "Which superpower would you choose?",
      type: "choice",
      choices: ["Invisibility", "Flying", "Time Travel", "Super Strength"],
      key: "superpower",
    },
  ];

  const handleNext = (value) => {
    setResponses((prevResponses) => {
      let updatedResponses =
        step === 0
          ? { ...prevResponses, name: value }
          : {
              ...prevResponses,
              answers: [
                ...prevResponses.answers,
                { [questions[step].key]: value },
              ],
            };

      if (step >= questions.length - 1) {
        handleSubmit(updatedResponses);
      }
      return updatedResponses;
    });

    if (step < questions.length - 1) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handleSubmit = async (updatedResponses) => {
    if (!captchaToken) {
      alert("Please complete CAPTCHA verification.");
      return;
    }

    try {
      const response = await fetch(
        "https://parade-worker.sunspokenstudio.workers.dev",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...updatedResponses, captchaToken }), // Send CAPTCHA token
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Submission failed");

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <div style={{ width: 600, textAlign: "center" }}>
        <Turnstile sitekey={siteKey} onVerify={setCaptchaToken} />
        {/* CAPTCHA Integration */}
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.h1
              key="thank-you"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              Thank you for your response!
            </motion.h1>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <h2>{questions[step].question}</h2>
              {questions[step].type === "text" && (
                <motion.input
                  type="text"
                  placeholder={questions[step].placeholder}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleNext(e.target.value)
                  }
                  style={{
                    padding: "10px",
                    fontSize: "1em",
                    marginTop: "10px",
                    width: "60%",
                  }}
                  autoFocus
                />
              )}
              {questions[step].type === "choice" && (
                <div style={{ marginTop: "20px" }}>
                  {questions[step].choices.map((choice, index) => (
                    <motion.button
                      key={index}
                      style={{
                        padding: "10px 20px",
                        margin: "5px",
                        cursor: "pointer",
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleNext(choice)}
                    >
                      {choice}
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
