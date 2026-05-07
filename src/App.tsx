import { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Menu,
  User,
  Shield,
  Eye,
  Info,
  X,
  Plus
} from 'lucide-react';
import { useClerk, useUser, SignIn, SignUp } from '@clerk/clerk-react';
import OcrProcessor from './components/OcrProcessor';
import NotificationModal from './components/NotificationModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const { signOut } = useClerk();
  const { user, isSignedIn } = useUser();

  const sidebarItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Studio' },
    { id: 'documents', icon: FileText, label: 'Documents' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] flex text-slate-900 font-sans selection:bg-teal-100 overflow-hidden">
      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md relative shadow-2xl border border-white/20"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X size={20} />
              </Button>
              {authMode === 'signin' ? (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">Welcome Back</h2>
                    <p className="text-sm text-slate-500 text-center">Sign in to access your TextExtract Studio</p>
                  </div>
                  <SignIn />
                  <p className="text-center text-sm text-slate-500">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setAuthMode('signup')}
                      className="text-teal-600 hover:text-teal-700 font-semibold underline-offset-4 hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">Create Account</h2>
                    <p className="text-sm text-slate-500">Join TextExtract Studio today</p>
                  </div>
                  <SignUp />
                  <p className="text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <button
                      onClick={() => setAuthMode('signin')}
                      className="text-teal-600 hover:text-teal-700 font-semibold underline-offset-4 hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
      />

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 288 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 lg:relative overflow-hidden flex flex-col shadow-sm`}
      >
        <div className="p-6 md:p-8 flex items-center space-x-3 border-b border-slate-50 shrink-0">
          <div className="h-10 w-10 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200 shrink-0">
            <Eye className="h-6 w-6 text-white" />
          </div>
          <div className="whitespace-nowrap">
            <span className="text-xl font-bold tracking-tight text-slate-900">TextExtract</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full px-4 py-4 text-sm font-medium rounded-2xl transition-all duration-200 group relative ${activeTab === item.id
                ? 'bg-teal-50 text-teal-700 shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <item.icon className={`h-5 w-5 mr-3 transition-colors ${activeTab === item.id ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'
                }`} />
              <span className="whitespace-nowrap">{item.label}</span>
              {activeTab === item.id && (
                <motion.div
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-600"
                />
              )}
            </button>
          ))}
        </nav>

        {/* Navigation bottom buffer */}
        <div className="p-6 mt-auto shrink-0" />
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 shrink-0">
          <div className="flex items-center space-x-6 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-xl hover:bg-slate-100"
            >
              <Menu size={22} className="text-slate-600" />
            </Button>

            <div className="relative max-w-md w-full hidden md:block group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
              <Input
                className="bg-slate-100/50 border-none rounded-2xl pl-11 py-6 focus-visible:ring-2 focus-visible:ring-teal-500/20 focus-visible:bg-white transition-all shadow-none"
                placeholder="Search history..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center mr-2">
              <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 px-4">
                <Plus size={18} className="mr-2" />
                New Process
              </Button>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <Bell size={22} className="text-slate-600" />
                  <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 rounded-2xl p-0 shadow-2xl border-slate-200/60 overflow-hidden" align="end">
                <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                  <Badge variant="secondary" className="bg-teal-100 text-teal-700 hover:bg-teal-200">2 New</Badge>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                        <Plus size={14} className="text-teal-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[13px] font-bold text-slate-900 leading-none">System Update</p>
                        <p className="text-xs text-slate-500 leading-tight">Vibe coding engine enhanced for better accuracy.</p>
                        <p className="text-[10px] text-slate-400 font-medium">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <Info size={14} className="text-blue-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[13px] font-bold text-slate-900 leading-none">Welcome to Studio</p>
                        <p className="text-xs text-slate-500 leading-tight">Start extracting text from your images instantly.</p>
                        <p className="text-[10px] text-slate-400 font-medium">Just now</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-slate-50 text-center">
                  <button className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors">Mark all as read</button>
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {isSignedIn ? (
                  <button className="flex items-center space-x-3 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-100 transition-all duration-300 pr-4 group outline-none focus:ring-2 focus:ring-teal-500/10">
                    <div className="h-10 w-10 rounded-xl overflow-hidden shadow-inner ring-2 ring-teal-50/50 group-hover:ring-teal-100 transition-all">
                      <img
                        src={user?.imageUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-xs font-bold text-slate-900 leading-tight">{user?.fullName || "Guest User"}</p>
                      <p className="text-[10px] text-teal-600 font-bold tracking-widest leading-tight mt-0.5 uppercase">Account Dashboard</p>
                    </div>
                    <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </button>
                ) : (
                  <Button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-6 py-5 font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    Sign In
                  </Button>
                )}
              </DropdownMenuTrigger>
              {isSignedIn && (
                <DropdownMenuContent className="w-64 rounded-2xl p-2 mt-2 shadow-2xl border-slate-200/60 animate-in slide-in-from-top-2" align="end">
                  <div className="px-4 py-3 border-b border-slate-50 mb-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{user?.primaryEmailAddress?.emailAddress || "guest@textextract.io"}</p>
                  </div>
                  <DropdownMenuItem className="rounded-xl py-3 focus:bg-teal-50 focus:text-teal-700 cursor-pointer">
                    <User className="mr-3 h-4 w-4" />
                    <span className="font-medium">Account Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl py-3 focus:bg-teal-50 focus:text-teal-700 cursor-pointer">
                    <Shield className="mr-3 h-4 w-4" />
                    <span className="font-medium">Privacy & Security</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-50" />
                  <DropdownMenuItem onClick={() => signOut()} className="rounded-xl py-3 text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer">
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-bold">Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>
        </header>

        {/* Studio Content */}
        <div className="flex-1 overflow-y-auto bg-[#fafafa]">
          <div className="max-w-6xl mx-auto px-8 py-10 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200/50 pb-10"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Badge className="bg-teal-600 text-white border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest">New</Badge>
                  <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold tracking-widest uppercase">
                    <span className="hover:text-teal-600 cursor-pointer transition-colors">Studio</span>
                    <span className="text-slate-200">/</span>
                    <span className="text-slate-500">Workspace</span>
                  </div>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[0.9]">
                  TextExtract Studio
                </h1>
                <p className="text-slate-500 text-lg max-w-xl leading-relaxed">
                  Advanced vision-processing environment. Convert any visual data into refined, editable digital text instantly.
                </p>
              </div>

              <div className="hidden lg:flex items-center space-x-4 shrink-0">
                <div className="bg-white rounded-3xl p-4 border border-slate-200 flex items-center shadow-sm min-w-[200px]">
                  <div className="bg-teal-50 p-2.5 rounded-2xl">
                    <Info size={20} className="text-teal-600" />
                  </div>
                  <div className="px-4">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider leading-none">AI Latency</p>
                    <p className="text-sm font-bold text-slate-900 leading-tight mt-1">~1.2s avg. speed</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <OcrProcessor />
            </motion.div>

            <footer className="pt-16 pb-12 mt-12 border-t border-slate-200/60">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="font-extrabold text-slate-900 text-base tracking-tight leading-none block">TextExtract</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Vision Studio</span>
                  </div>
                </div>

                <div className="text-center md:text-left space-y-2">
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-1">Created & Owned By</p>
                  <p className="text-slate-900 text-sm font-black whitespace-nowrap">
                    &copy; {new Date().getFullYear()} Hemanta Bhattarai
                    <span className="mx-3 text-slate-200">|</span>
                    <span className="text-slate-400 font-medium">Developed with Vibe Coding</span>
                  </p>
                </div>

                <div className="flex items-center space-x-8">
                  <a href="#" className="text-slate-400 hover:text-slate-900 transition-all text-[10px] font-black uppercase tracking-widest border-b-2 border-transparent hover:border-teal-500 pb-1">Privacy</a>
                  <a href="#" className="text-slate-400 hover:text-slate-900 transition-all text-[10px] font-black uppercase tracking-widest border-b-2 border-transparent hover:border-teal-500 pb-1">Terms</a>
                  <a href="#" className="text-slate-400 hover:text-slate-900 transition-all text-[10px] font-black uppercase tracking-widest border-b-2 border-transparent hover:border-teal-500 pb-1">Support</a>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;