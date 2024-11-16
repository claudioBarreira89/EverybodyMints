import { useState } from "react";
import { ethers } from "ethers";
import Confetti from "react-confetti";
import { useSpring, animated } from "react-spring";

const CONTRACT_ADDRESS = "0xB35B0f875c9861B35C115AAe646C6106Ca8b2AAe";
const CONTRACT_ABI = [
  {
    "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default function Home() {
  const [txHash, setTxHash] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const memes = ["/meme1.webp", "/meme2.webp", "/meme3.webp"];
  const randomMeme = memes[Math.floor(Math.random() * memes.length)];

  const titleAnimation = useSpring({
    loop: true,
    from: { transform: "translateY(-10px)" },
    to: { transform: "translateY(10px)" },
    config: { tension: 150, friction: 10 },
  });

  const mintMemeCoin = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.mint(ethers.parseUnits("10", 18));
      await tx.wait();

      setTxHash(tx.hash);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (error) {
      console.error("Error minting tokens:", error);
      alert("Minting failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        body {
          font-family: 'Press Start 2P', cursive;
          background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
          background-size: 300% 300%;
          animation: gradientAnimation 10s ease infinite;
          margin: 0;
          padding: 0;
          color: #ffffff;
          text-align: center;
        }

        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      {showConfetti && <Confetti />}
      <animated.h1 style={{ ...styles.title, ...titleAnimation }}>Mint Your Meme Coin 🚀</animated.h1>
      <button
        onClick={mintMemeCoin}
        disabled={loading}
        style={styles.button(loading)}
      >
        {loading ? "Minting..." : "Mint Meme Coin"}
      </button>
      {txHash && (
        <>
          <p style={{ marginTop: "20px", wordBreak: "break-word" }}>
            <strong>Transaction Hash:</strong>{" "}
            <a
              href={`https://eth-sepolia.blockscout.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              View on Blockscout
            </a>
          </p>
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <img
              src={randomMeme}
              alt="Meme Coin"
              style={styles.memeImage}
            />
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    height: "100vh",
    justifyContent: "center",
  },
  title: {
    fontSize: "24px",
    color: "#ff5f6d",
    textShadow: "0px 0px 10px #ff5f6d",
    marginBottom: "20px",
  },
  button: (loading: boolean) => ({
    padding: "15px 30px",
    background: "linear-gradient(90deg, #ff5f6d, #ffc371)",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "10px",
    boxShadow: "0px 4px 20px rgba(255, 95, 109, 0.7)",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "transform 0.2s",
    transform: loading ? "scale(0.95)" : "scale(1)",
  }),
  link: {
    color: "cyan",
    textDecoration: "underline",
  },
  memeImage: {
    width: "200px",
    height: "200px",
    borderRadius: "15px",
    boxShadow: "0px 4px 20px rgba(255, 95, 109, 0.7)",
  },
};
