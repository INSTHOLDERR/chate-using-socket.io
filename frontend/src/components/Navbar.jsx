import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { 
  LogOut, 
  MessageCircleMore, 
  Settings, 
  User, 
  Menu,
  X,
  Home,
  Moon,
  Sun
} from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <header
        className={`
          fixed w-full top-0 z-50 transition-all duration-300
          ${scrolled 
            ? "bg-base-100/95 backdrop-blur-md shadow-lg" 
            : "bg-base-100 shadow-md"
          }
          border-b border-base-200
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo Section */}
            <Link 
              to="/" 
              className="group flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="size-10 lg:size-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                <MessageCircleMore className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl lg:text-2xl font-bold text-base-content">
                  Chate
                </h1>
                <p className="text-xs text-base-content/60">Connect & Chat</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`
                      relative px-4 lg:px-5 py-2 rounded-lg transition-all duration-200
                      flex items-center gap-2
                      ${isActive 
                        ? "text-primary bg-primary/10" 
                        : "text-base-content/70 hover:text-base-content hover:bg-base-200"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="font-medium text-sm lg:text-base">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1 lg:gap-2">
              
              {/* Theme Toggle - Light/Dark Only */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-base-content/60 hover:text-base-content hover:bg-base-200 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>

              {/* User Menu & Profile */}
              {authUser && (
                <div className="flex items-center gap-2">
                  {/* Profile Button - Click to go to profile */}
                  <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-base-200 transition-all duration-200"
                  >
                    <div className="relative">
                      <img
                        src={authUser.profilePic || `https://ui-avatars.com/api/?background=3b82f6&color=fff&bold=true&name=${authUser.fullName}`}
                        alt={authUser.fullName}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-primary cursor-pointer hover:ring-4 transition-all"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-base-100" />
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-semibold text-base-content">
                        {authUser.fullName}
                      </p>
                      <p className="text-xs text-base-content/60">
                        {authUser.email}
                      </p>
                    </div>
                  </button>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-error hover:bg-error/10 transition-all duration-200"
                    aria-label="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-base-content/60 hover:text-base-content hover:bg-base-200 transition-all"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
            md:hidden fixed top-16 left-0 right-0 bg-base-100 border-b border-base-200 shadow-xl
            transition-all duration-300 ease-in-out transform
            ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}
          `}
        >
          <div className="px-4 py-4 space-y-2">
            {/* Navigation Links */}
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-base-content/70 hover:bg-base-200"
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
            
            {/* Theme Toggle in Mobile Menu */}
            <button
              onClick={() => {
                toggleTheme();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base-content/70 hover:bg-base-200 transition-all"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-5 h-5" />
                  <span className="font-medium">Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-5 h-5" />
                  <span className="font-medium">Light Mode</span>
                </>
              )}
            </button>
            
            {/* User Info in Mobile Menu */}
            {authUser && (
              <>
                <div className="border-t border-base-200 my-3" />
                <div className="flex items-center gap-3 px-4 py-3 bg-base-200 rounded-lg">
                  <img
                    src={authUser.profilePic || `https://ui-avatars.com/api/?background=3b82f6&color=fff&bold=true&name=${authUser.fullName}`}
                    alt={authUser.fullName}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-base-content">
                      {authUser.fullName}
                    </p>
                    <p className="text-xs text-base-content/60 truncate">
                      {authUser.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-2 rounded-lg text-error hover:bg-error/10 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from going under navbar */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Navbar;