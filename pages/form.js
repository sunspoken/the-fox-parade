import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedForm() {
  const [step, setStep] = useState(0); // Tracks current question
  const [responses, setResponses] = useState({ name: "", answers: [] }); // Stores all answers
  const [submitted, setSubmitted] = useState(false);

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
      let updatedResponses;

      if (step === 0) {
        // First step updates the name field
        updatedResponses = { ...prevResponses, name: value };
      } else {
        // Other steps append to the answers array
        updatedResponses = {
          ...prevResponses,
          answers: [...prevResponses.answers, { [questions[step].key]: value }],
        };
      }

      // Check if it's the last step, and call handleSubmit if needed
      if (step >= questions.length - 1) {
        handleSubmit(updatedResponses);
      }

      console.log(updatedResponses);

      return updatedResponses; // Return the updated state
    });

    // Increment the step (safe to do here)
    if (step < questions.length - 1) {
      setStep((prevStep) => prevStep + 1); // Step change doesn’t depend on `responses`
    }
  };

  const handleSubmit = async (updatedResponses) => {
    try {
      await addDoc(collection(db, "responses"), updatedResponses);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting form: ", error);
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim() !== "") {
                      handleNext(e.target.value);
                    }
                  }}
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
