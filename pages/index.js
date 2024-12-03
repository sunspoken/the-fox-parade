import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome to the Parade!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Scan the QR code or click below to start.
      </motion.p>
      <Link href="/form">
        <motion.button
          style={{
            padding: "10px 20px",
            marginTop: "20px",
            cursor: "pointer",
            fontSize: "1.2em",
          }}
          whileHover={{ scale: 1.1 }}
        >
          Go to Form
        </motion.button>
      </Link>
    </div>
  );
}
