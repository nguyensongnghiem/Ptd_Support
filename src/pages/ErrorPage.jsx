import { Link, NavLink, useLocation } from "react-router-dom";

const ErrorPage = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen items-center justify-center bg-black text-white p-4 overflow-hidden relative">
      {/* Background (Black Hole / Galaxy Image) */}
      {/* Thay thế '/images/blackhole_galaxy.gif' bằng đường dẫn đến ảnh của bạn */}
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-30 animate-pulse-background"
           style={{ backgroundImage: "url('/images/blackhole_galaxy.gif')" }}> 
      </div>

      {/* Main Content Box */}
      <div className="text-center z-10 p-8 bg-gray-900 bg-opacity-80 rounded-2xl shadow-2xl backdrop-blur-md border border-gray-700 max-w-lg mx-auto transform -translate-y-4 animate-fade-in-up">
        
        {/* Animated 404 number */}
        <h1 className="text-7xl md:text-8xl font-black text-purple-400 drop-shadow-lg animate-fade-in-bouncing">
          404
        </h1>
        
        {/* Main Message */}
        <p className="mt-6 text-2xl md:text-3xl font-semibold text-gray-100">
          Oops! Bạn đã đi lạc vào Lỗ Đen rồi!
        </p>
        
        {/* Sub Message */}
        <p className="mt-4 text-base md:text-lg text-gray-300 leading-relaxed">
          Tín hiệu từ Trái Đất đã mất. Trang bạn đang tìm kiếm không tồn tại trong vũ trụ này.
        </p>
        
        {/* Call to Action Button */}
        <NavLink
          to="/"
          replace
          className="mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-blue-600 px-8 py-3 text-lg font-medium text-white shadow-xl 
                     hover:bg-blue-700 transition-all duration-300 ease-in-out 
                     transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-75"
        >
          {/* Earth Icon - Thay thế '/images/earth_icon.png' bằng đường dẫn đến ảnh của bạn */}
          <img src="/images/earth_icon.png" alt="Trái Đất" className="h-7 w-7 animate-spin-slow" />
          Quay về Trái Đất an toàn
        </NavLink>

        {/* Optional: Add a subtle hint or joke */}
        <p className="mt-4 text-sm text-gray-500 italic">
          (Kiểm tra lại tọa độ của bạn hoặc thử lại sau!)
        </p>
      </div>

      {/* CSS Animations (place in a <style jsx> block or your global CSS file) */}
      <style jsx>{`
        @keyframes pulse-background {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.03);
            opacity: 0.35;
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(-4px);
          }
        }

        @keyframes fade-in-bouncing {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          50% {
            opacity: 1;
            transform: translateY(10px);
          }
          100% {
            transform: translateY(0);
          }
        }

        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .animate-pulse-background {
          animation: pulse-background 15s infinite ease-in-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-fade-in-bouncing {
          animation: fade-in-bouncing 1s ease-out forwards;
          animation-delay: 0.3s; /* Delay for a nicer entrance */
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ErrorPage;