import React, { useState } from "react";
import { Calendar, Clock, Users, Award, Code, Heart, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function Homepage() {
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/signup");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PROTOTECH</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a
                href="#"
                className="text-gray-600 hover:text-orange-500 transition-colors"
              >
                Sponsors
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-orange-500 transition-colors"
              >
                Mentors
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-orange-500 transition-colors"
              >
                FAQ
              </a>
            </nav>
            <button
              onClick={handleLogin}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
            >
              LOGIN
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - 3D Blocks */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main 3D Block Structure */}
              <div className="relative transform -rotate-12 hover:rotate-0 transition-transform duration-700">
                {/* PROTO Block */}
                <div className="bg-white shadow-2xl rounded-lg p-8 mb-4 border-l-8 border-orange-500 transform hover:scale-105 transition-all duration-300">
                  <div className="text-4xl font-black text-gray-900 tracking-tight">
                    PROTO
                  </div>
                </div>

                {/* TO Block */}
                <div className="bg-white shadow-2xl rounded-lg p-8 mb-4 border-l-8 border-red-500 ml-8 transform hover:scale-105 transition-all duration-300">
                  <div className="text-4xl font-black text-gray-900 tracking-tight">
                    TO
                  </div>
                </div>

                {/* THON Block */}
                <div className="bg-white shadow-2xl rounded-lg p-8 mb-4 border-l-8 border-pink-500 ml-16 transform hover:scale-105 transition-all duration-300">
                  <div className="text-4xl font-black text-gray-900 tracking-tight">
                    THON
                  </div>
                </div>

                {/* 2025 Block */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 shadow-2xl rounded-lg p-8 ml-24 transform hover:scale-105 transition-all duration-300">
                  <div className="text-4xl font-black text-white tracking-tight">
                    2025
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 animate-bounce">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="absolute top-20 -left-8 animate-pulse">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg rotate-12">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>

              <div
                className="absolute bottom-10 -right-8 animate-bounce"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="w-14 h-14 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <Award className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-6xl font-black text-gray-900 mb-4">
                The{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                  Online
                </span>
              </h1>
              <h2 className="text-4xl font-bold text-gray-700 mb-6">
                UX Hackathon
              </h2>

              <div className="flex items-center space-x-6 text-gray-600 mb-8">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">
                    February 12, 2025 — February 14, 2025
                  </span>
                </div>
              </div>

              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Test your rapid prototyping and design thinking skills! Push the
                limits of your mind to make something amazing in just 48 hours.
              </p>

              <button
                onClick={handleRegister}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-4 rounded-lg text-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {isRegistered ? "WELCOME ABOARD!" : "REGISTER"}
              </button>
            </div>

            {/* How it Works Section */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                How Does it Work?
              </h3>
              <p className="text-gray-600 text-center mb-4">
                You're used to the normal design process — now try it at 10x the
                speed.
              </p>
              <div className="text-center">
                <span className="text-lg font-semibold text-gray-700">
                  The added benefit is{" "}
                </span>
                <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                  NO CODE, JUST DESIGN
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Participants</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                <Clock className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">48hrs</div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                <Award className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">$10K</div>
                <div className="text-sm text-gray-600">Prizes</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
