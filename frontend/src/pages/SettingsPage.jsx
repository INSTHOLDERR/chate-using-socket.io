import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { useState, useEffect } from "react";
import { 
  Settings, 
  Palette, 
  MessageCircle, 
  Check,
  LogOut,
  Shield,
  HelpCircle,
  Type,
  CheckCircle,
  ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const FONTS = [
  { 
    id: "inter", 
    name: "Inter", 
    fontFamily: "'Inter', system-ui, sans-serif",
    description: "Modern and clean",
    category: "Sans-serif"
  },
  { 
    id: "poppins", 
    name: "Poppins", 
    fontFamily: "'Poppins', system-ui, sans-serif",
    description: "Elegant and rounded",
    category: "Sans-serif"
  },
  { 
    id: "roboto", 
    name: "Roboto", 
    fontFamily: "'Roboto', system-ui, sans-serif",
    description: "Professional and neutral",
    category: "Sans-serif"
  },
  { 
    id: "opensans", 
    name: "Open Sans", 
    fontFamily: "'Open Sans', system-ui, sans-serif",
    description: "Friendly and readable",
    category: "Sans-serif"
  },
  { 
    id: "montserrat", 
    name: "Montserrat", 
    fontFamily: "'Montserrat', system-ui, sans-serif",
    description: "Geometric and stylish",
    category: "Sans-serif"
  },
  { 
    id: "lato", 
    name: "Lato", 
    fontFamily: "'Lato', system-ui, sans-serif",
    description: "Warm and approachable",
    category: "Sans-serif"
  },
  { 
    id: "playfair", 
    name: "Playfair Display", 
    fontFamily: "'Playfair Display', serif",
    description: "Classic and elegant",
    category: "Serif"
  },
  { 
    id: "merriweather", 
    name: "Merriweather", 
    fontFamily: "'Merriweather', serif",
    description: "Traditional and readable",
    category: "Serif"
  },
  { 
    id: "sourcecode", 
    name: "Source Code Pro", 
    fontFamily: "'Source Code Pro', monospace",
    description: "Monospace for tech lovers",
    category: "Monospace"
  }
];

const FONT_SIZES = [
  { id: "small", name: "Small", value: "0.875rem", lineHeight: "1.25rem" },
  { id: "medium", name: "Medium", value: "1rem", lineHeight: "1.5rem" },
  { id: "large", name: "Large", value: "1.125rem", lineHeight: "1.75rem" },
  { id: "xl", name: "Extra Large", value: "1.25rem", lineHeight: "1.75rem" }
];

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false, time: "10:42 AM" },
  { id: 2, content: "I'm doing great! Just working on new features.", isSent: true, time: "10:43 AM" },
  { id: 3, content: "That's awesome! Keep up the good work! 💪", isSent: false, time: "10:44 AM" },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { authUser, logout } = useAuthStore();
  const [selectedFont, setSelectedFont] = useState(() => {
    return localStorage.getItem("selectedFont") || "inter";
  });
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("fontSize") || "medium";
  });
  const navigate = useNavigate();

  useEffect(() => {
    const font = FONTS.find(f => f.id === selectedFont);
    if (font) {
      document.documentElement.style.setProperty('--font-family', font.fontFamily);
      localStorage.setItem("selectedFont", selectedFont);
    }
  }, [selectedFont]);

  useEffect(() => {
    const size = FONT_SIZES.find(s => s.id === fontSize);
    if (size) {
      document.documentElement.style.setProperty('--font-size-base', size.value);
      document.documentElement.style.setProperty('--line-height-base', size.lineHeight);
      localStorage.setItem("fontSize", fontSize);
    }
  }, [fontSize]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* User Info Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={authUser?.profilePic || `https://ui-avatars.com/api/?background=3b82f6&color=fff&bold=true&name=${authUser?.fullName || "User"}`} 
                alt={authUser?.fullName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{authUser?.fullName}</p>
              <p className="text-xs text-gray-500">{authUser?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Theme Selection - List View */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Color Themes
                  </h3>
                  <p className="text-sm text-gray-600">
                    Choose a theme that matches your style
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
              {THEMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`
                    w-full px-6 py-4 flex items-center justify-between transition-all duration-200
                    hover:bg-gray-50 group
                    ${theme === t ? "bg-blue-50" : ""}
                  `}
                >
                  <div className="flex items-center gap-4">
                    {/* Color Preview Boxes */}
                    {/* Color Preview Boxes */}
<div className="flex gap-2">
  <div 
    className="w-8 h-8 rounded-lg shadow-md transition-transform group-hover:scale-110"
    style={{ 
      backgroundColor: t === "light" ? "#3b82f6" :
                      t === "dark" ? "#3b82f6" :
                      t === "cupcake" ? "#65c3c8" :
                      t === "bumblebee" ? "#e0a82e" :
                      t === "emerald" ? "#66cc8a" :
                      t === "corporate" ? "#4b6bfb" :
                      t === "synthwave" ? "#e779c1" :
                      t === "retro" ? "#ef9995" :
                      t === "cyberpunk" ? "#ff7598" :
                      t === "valentine" ? "#e96d7b" :
                      t === "halloween" ? "#f28c18" :
                      t === "garden" ? "#5c7f67" :
                      t === "forest" ? "#1eb2a6" :
                      t === "aqua" ? "#09ecf3" :
                      t === "lofi" ? "#0d0c22" :
                      t === "pastel" ? "#d1c1e1" :
                      t === "fantasy" ? "#6d8bdb" :
                      t === "wireframe" ? "#b8b8b8" :
                      t === "black" ? "#262626" :
                      t === "luxury" ? "#171618" :
                      t === "dracula" ? "#ff79c6" :
                      t === "cmyk" ? "#45aaf2" :
                      t === "autumn" ? "#c85a17" :
                      t === "acid" ? "#fa00ff" :
                      t === "lemonade" ? "#f9d72f" :
                      t === "night" ? "#0f172a" :
                      t === "coffee" ? "#3e2723" :
                      "#3b82f6"
    }}
  ></div>
  <div 
    className="w-8 h-8 rounded-lg shadow-md transition-transform group-hover:scale-110"
    style={{ 
      backgroundColor: t === "light" ? "#6366f1" :
                      t === "dark" ? "#8b5cf6" :
                      t === "cupcake" ? "#ef9fbc" :
                      t === "bumblebee" ? "#f9d72f" :
                      t === "emerald" ? "#377cfb" :
                      t === "corporate" ? "#7b92b2" :
                      t === "synthwave" ? "#58c7f3" :
                      t === "retro" ? "#a4cbb4" :
                      t === "cyberpunk" ? "#75d1f0" :
                      t === "valentine" ? "#a9476d" :
                      t === "halloween" ? "#6f3a15" :
                      t === "garden" ? "#c9d4c3" :
                      t === "forest" ? "#1c4e43" :
                      t === "aqua" ? "#0e8097" :
                      t === "lofi" ? "#2a2b3d" :
                      t === "pastel" ? "#f2c4cf" :
                      t === "fantasy" ? "#a67cda" :
                      t === "wireframe" ? "#e2e2e2" :
                      t === "black" ? "#404040" :
                      t === "luxury" ? "#2e2c2f" :
                      t === "dracula" ? "#8be9fd" :
                      t === "cmyk" ? "#fc5c65" :
                      t === "autumn" ? "#dc843a" :
                      t === "acid" ? "#00ff00" :
                      t === "lemonade" ? "#e0a82e" :
                      t === "night" ? "#1e293b" :
                      t === "coffee" ? "#4e342e" :
                      "#6366f1"
    }}
  ></div>
  <div 
    className="w-8 h-8 rounded-lg shadow-md transition-transform group-hover:scale-110"
    style={{ 
      backgroundColor: t === "light" ? "#8b5cf6" :
                      t === "dark" ? "#a78bfa" :
                      t === "cupcake" ? "#eeaf3a" :
                      t === "bumblebee" ? "#18181b" :
                      t === "emerald" ? "#f68067" :
                      t === "corporate" ? "#67cba0" :
                      t === "synthwave" ? "#f3cc30" :
                      t === "retro" ? "#ebdc9c" :
                      t === "cyberpunk" ? "#c07eec" :
                      t === "valentine" ? "#e86d78" :
                      t === "halloween" ? "#f28c18" :
                      t === "garden" ? "#e4d6b5" :
                      t === "forest" ? "#ccdde2" :
                      t === "aqua" ? "#06e0e8" :
                      t === "lofi" ? "#feebe2" :
                      t === "pastel" ? "#b7e0e7" :
                      t === "fantasy" ? "#f7d44a" :
                      t === "wireframe" ? "#a3a3a3" :
                      t === "black" ? "#666666" :
                      t === "luxury" ? "#e2bf7c" :
                      t === "dracula" ? "#bd93f9" :
                      t === "cmyk" ? "#fed330" :
                      t === "autumn" ? "#e8b87a" :
                      t === "acid" ? "#ff00aa" :
                      t === "lemonade" ? "#18181b" :
                      t === "night" ? "#334155" :
                      t === "coffee" ? "#795548" :
                      "#8b5cf6"
    }}
  ></div>
</div>
                    
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 capitalize">
                        {t} Theme
                      </div>
                      <div className="text-sm text-gray-500">
                        {t === "light" && "Bright and clean interface"}
                        {t === "dark" && "Easy on the eyes, perfect for night"}
                        {t === "cupcake" && "Sweet and soft pastel colors"}
                        {t === "bumblebee" && "Vibrant yellow-themed design"}
                        {t === "emerald" && "Fresh green nature theme"}
                        {t === "corporate" && "Professional business style"}
                        {t === "synthwave" && "Retro 80s neon vibes"}
                        {t === "retro" && "Classic vintage feel"}
                        {t === "cyberpunk" && "Futuristic neon theme"}
                        {t === "valentine" && "Romantic pink-themed"}
                        {t === "halloween" && "Spooky orange and black"}
                        {t === "garden" && "Fresh floral theme"}
                        {t === "forest" && "Deep woodland colors"}
                        {t === "aqua" && "Cool ocean blues"}
                        {t === "lofi" && "Soft vintage aesthetic"}
                        {t === "pastel" && "Gentle pastel colors"}
                        {t === "fantasy" && "Magical dreamy theme"}
                        {t === "wireframe" && "Minimalist wireframe style"}
                        {t === "black" && "Sleek all-black design"}
                        {t === "luxury" && "Elegant gold accents"}
                        {t === "dracula" && "Dark vampire-inspired"}
                        {t === "cmyk" && "Print-style color theme"}
                        {t === "autumn" && "Warm fall colors"}
                        {t === "acid" && "Bold vibrant colors"}
                        {t === "lemonade" && "Fresh citrus theme"}
                        {t === "night" && "Deep night sky"}
                        {t === "coffee" && "Warm coffee tones"}
                        {t === "winter" && "Cool winter colors"}
                        {!["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "acid", "lemonade", "night", "coffee", "winter"].includes(t) && "Unique and custom theme"}
                      </div>
                    </div>
                  </div>
                  
                  {theme === t && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-blue-600 font-medium">Active</span>
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Font Selection */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl shadow-lg">
                  <Type className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Font Settings
                  </h3>
                  <p className="text-sm text-gray-600">
                    Customize your reading experience
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Font Family Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Font Family
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {FONTS.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setSelectedFont(font.id)}
                      className={`
                        p-4 rounded-xl text-left transition-all duration-200 border-2
                        ${selectedFont === font.id 
                          ? "border-blue-500 bg-blue-50 shadow-md" 
                          : "border-gray-200 hover:border-gray-300"
                        }
                      `}
                      style={{ fontFamily: font.fontFamily }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">
                            {font.name}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {font.description}
                          </div>
                          <div className="text-xs text-gray-400 mt-2">
                            {font.category}
                          </div>
                        </div>
                        {selectedFont === font.id && (
                          <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="mt-3 text-gray-600 text-sm">
                        The quick brown fox jumps over the lazy dog
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Font Size
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {FONT_SIZES.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setFontSize(size.id)}
                      className={`
                        p-4 rounded-xl text-center transition-all duration-200 border-2
                        ${fontSize === size.id 
                          ? "border-blue-500 bg-blue-50 shadow-md" 
                          : "border-gray-200 hover:border-gray-300"
                        }
                      `}
                    >
                      <div className="font-semibold text-gray-900">
                        {size.name}
                      </div>
                      <div 
                        className="text-gray-600 mt-2"
                        style={{ fontSize: size.value }}
                      >
                        Aa
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Live Chat Preview */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-white" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Live Preview</h3>
                  <p className="text-blue-100 text-sm">See your changes in real-time</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-2xl mx-auto">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white font-semibold">JD</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">John Doe</h4>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-xs text-green-500">Online</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-4 space-y-4 min-h-[320px]">
                  {PREVIEW_MESSAGES.map((msg, idx) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isSent ? "justify-end" : "justify-start"} animate-fade-in`}
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className={`max-w-[70%] ${msg.isSent ? "order-2" : "order-1"}`}>
                        <div
                          className={`
                            px-4 py-2 rounded-2xl shadow-md transition-all
                            ${msg.isSent
                              ? "bg-primary text-white rounded-br-sm"
                              : "bg-gray-200 text-gray-900 rounded-bl-sm"
                            }
                          `}
                        >
                          <p className="text-sm" style={{ 
                            fontFamily: FONTS.find(f => f.id === selectedFont)?.fontFamily,
                            fontSize: FONT_SIZES.find(s => s.id === fontSize)?.value
                          }}>
                            {msg.content}
                          </p>
                        </div>
                        <p className={`text-xs text-gray-500 mt-1 ${msg.isSent ? "text-right" : "text-left"}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value="Type your message here..."
                      readOnly
                      style={{
                        fontFamily: FONTS.find(f => f.id === selectedFont)?.fontFamily,
                        fontSize: FONT_SIZES.find(s => s.id === fontSize)?.value
                      }}
                      className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm bg-white text-gray-500 focus:outline-none cursor-default"
                    />
                    <button className="bg-primary text-white px-6 py-2 rounded-full hover:opacity-90 transition shadow-md text-sm font-medium">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500 rounded-lg shadow-md">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Customization Tip</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Your theme, font, and size preferences are saved automatically and will persist across sessions. 
                  Mix and match different combinations to find your perfect setup!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;