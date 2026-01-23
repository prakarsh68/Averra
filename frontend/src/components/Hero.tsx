import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="h-[90vh] flex flex-col justify-center items-center text-center bg-gradient-to-br from-black via-dark to-dark2 text-white px-4">
      <h1 className="text-7xl font-extrabold bg-goldShine bg-clip-text text-transparent drop-shadow-lg tracking-widest">
        AVERRA
      </h1>
      <p className="mt-6 text-xl max-w-2xl text-gray-300">
        AI that watches over Earth. Detecting disasters. Saving lives.
      </p>
      <button
        onClick={() => navigate("/map")}
        className="mt-10 px-10 py-3 border border-goldLight text-goldLight rounded-lg hover:bg-goldShine hover:text-black transition shadow-goldGlow text-lg"
      >
        View Disaster Map
      </button>
    </section>
  );
};

export default Hero;
