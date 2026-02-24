import {
    BookOpen,
    CheckSquare,
    ChevronLeft,
    Clock,
    Code,
    FileCode2,
    Folder,
    FolderPlus,
    LayoutTemplate,
    Maximize,
    Moon,
    Palette,
    Save,
    Settings,
    Share,
    ShieldCheck,
    Sliders,
    Square,
    Sun,
    Zap,
    ZoomIn,
    ZoomOut
} from 'lucide-react';
import { useState } from 'react';

// --- Globale Styles (CSS Variablen & Custom Classes) ---
const GlobalStyles = () => (
    <style dangerouslySetInnerHTML={{
        __html: `
    @import url('https://fonts.googleapis.com/css2?family=Recursive:wght@300..1000&display=swap');

    :root {
      --background: 0 0% 100%;
      --foreground: 222.2 84% 4.9%;
      --card: 0 0% 100%;
      --card-foreground: 222.2 84% 4.9%;
      --popover: 0 0% 100%;
      --popover-foreground: 222.2 84% 4.9%;
      --primary: 226 58% 65%;
      --primary-foreground: 0 0% 100%;
      --secondary: 210 40% 96.1%;
      --secondary-foreground: 222.2 47.4% 11.2%;
      --muted: 228 24% 96%;
      --muted-foreground: 215.4 16.3% 46.9%;
      --accent: 226 58% 65%;
      --accent-foreground: 0 0% 100%;
      --destructive: 0 72% 51%;
      --destructive-foreground: 210 40% 98%;
      --border: 214 32% 91%;
      --input: 214 32% 91%;
      --ring: 222 84% 5%;
      --radius: 0.75rem;
    }

    .dark {
      --background: 223 9% 17%;
      --foreground: 210 2% 87%;
      --card: 223 9% 17%;
      --card-foreground: 210 2% 87%;
      --popover: 223 6% 20%;
      --popover-foreground: 210 2% 87%;
      --primary: 226 58% 65%;
      --primary-foreground: 0 0% 100%;
      --secondary: 223 6% 20%;
      --secondary-foreground: 210 2% 87%;
      --muted: 223 6% 20%;
      --muted-foreground: 220 5% 47%;
      --accent: 226 58% 65%;
      --accent-foreground: 0 0% 100%;
      --destructive: 226 58% 65%;
      --destructive-foreground: 0 0% 100%;
      --border: 220 7% 14%;
      --input: 220 7% 14%;
      --ring: 226 58% 65%;
    }

    .theme-transition {
      transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }

    body {
      font-family: 'Recursive', sans-serif;
      background-color: hsl(var(--background));
      color: hsl(var(--foreground));
    }

    .border-border { border-color: hsl(var(--border)); }
    .bg-background { background-color: hsl(var(--background)); }
    .bg-muted { background-color: hsl(var(--muted)); }
    .bg-card { background-color: hsl(var(--card)); }
    .bg-primary { background-color: hsl(var(--primary)); }
    .text-primary { color: hsl(var(--primary)); }
    .text-muted-foreground { color: hsl(var(--muted-foreground)); }
    
    .glass {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    
    .glow {
      box-shadow: 0 0 20px rgba(114, 137, 218, 0.15), 0 0 60px rgba(114, 137, 218, 0.05);
    }

    /* Custom Scrollbar for Code Editor */
    .scrollbar-thin::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    .scrollbar-thin::-webkit-scrollbar-track {
      background: transparent;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb {
      background: hsl(var(--muted-foreground) / 0.3);
      border-radius: 4px;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
      background: hsl(var(--muted-foreground) / 0.5);
    }
  `}} />
);

// --- Komponenten ---

const Header = () => (
    <header className="flex h-10 shrink-0 items-center justify-between border-b border-border px-4 bg-background z-50 theme-transition">
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    G
                </div>
                <span className="text-sm font-semibold tracking-tight">
                    Graphi <span className="text-xs font-normal opacity-50 ml-1 italic">/ Untitled Diagram</span>
                </span>
            </div>
            <div className="h-4 w-[1px] bg-border mx-2"></div>
            <nav className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <button className="px-2 py-1 hover:bg-muted rounded transition-colors">File</button>
                <button className="px-2 py-1 hover:bg-muted rounded transition-colors">Edit</button>
                <button className="px-2 py-1 hover:bg-muted rounded transition-colors">Help</button>
            </nav>
        </div>

        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 border border-border rounded-md p-0.5 bg-muted/30">
                <button className="flex items-center gap-2 px-3 py-1 bg-primary text-white text-xs font-bold rounded-sm hover:opacity-90 transition-all shadow-sm">
                    <Save className="w-3.5 h-3.5" />
                    Save
                </button>
                <button className="flex items-center gap-2 px-3 py-1 hover:bg-muted text-xs font-medium rounded-sm transition-all">
                    <Share className="w-3.5 h-3.5 text-muted-foreground" />
                    Share
                </button>
            </div>
            <button className="p-1.5 hover:bg-muted rounded-full transition-all text-primary" title="AI Assistant">
                <Zap className="w-5 h-5 fill-primary/20" />
            </button>
        </div>
    </header>
);

const ActivityBar = ({ activeTab, setActiveTab }) => {
    const topIcons = [
        { id: 'explorer', icon: Folder, label: 'Explorer' },
        { id: 'history', icon: Clock, label: 'History' },
        { id: 'templates', icon: LayoutTemplate, label: 'Templates' },
        { id: 'themes', icon: Palette, label: 'Themes' },
    ];

    return (
        <aside className="w-12 shrink-0 border-r border-border bg-background flex flex-col items-center py-4 gap-4 z-40 theme-transition">
            {topIcons.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`p-2 rounded-lg transition-all ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary'}`}
                        title={item.label}
                    >
                        <Icon className="w-5 h-5" />
                    </button>
                );
            })}

            <div className="mt-auto flex flex-col gap-4">
                <button className="p-2 text-muted-foreground hover:text-primary transition-all" title="Settings">
                    <Settings className="w-5 h-5" />
                </button>
            </div>
        </aside>
    );
};

const Sidebar = () => (
    <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col theme-transition">
        <div className="h-10 flex items-center px-4 border-b border-border justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Explorer</span>
            <button className="text-muted-foreground hover:text-primary transition-all">
                <ChevronLeft className="w-4 h-4" />
            </button>
        </div>
        <div className="flex-1 overflow-auto p-2">
            <div className="space-y-4">
                {/* Cloud Workspace Section */}
                <section>
                    <h4 className="text-[10px] font-bold text-muted-foreground px-2 mb-2 uppercase tracking-tighter">
                        Cloud Workspace
                    </h4>
                    <div className="space-y-1">
                        <button className="w-full text-left px-2 py-1.5 text-sm rounded bg-primary/5 text-primary flex items-center gap-2 group transition-colors">
                            <FileCode2 className="w-3.5 h-3.5" />
                            <span className="truncate">Untitled Diagram</span>
                        </button>
                    </div>
                </section>

                {/* Local Storage Section */}
                <section>
                    <h4 className="text-[10px] font-bold text-muted-foreground px-2 mb-2 uppercase tracking-tighter">
                        Local Storage
                    </h4>
                    <button className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground group">
                        <FolderPlus className="w-6 h-6 mb-2 group-hover:text-primary transition-colors" />
                        <span className="text-xs font-medium">Link Folder</span>
                    </button>
                </section>
            </div>
        </div>
    </aside>
);

const CodeEditorPane = () => (
    <div className="w-1/2 flex flex-col border-r border-border bg-background theme-transition">
        {/* Editor Tabs */}
        <div className="h-9 flex border-b border-border bg-muted/20 items-center px-1">
            <button className="h-full px-4 text-xs font-bold border-b-2 border-primary text-primary flex items-center gap-2">
                <Code className="w-3.5 h-3.5" />
                Code
            </button>
            <button className="h-full px-4 text-xs font-medium text-muted-foreground hover:bg-muted/40 flex items-center gap-2 transition-colors">
                <Sliders className="w-3.5 h-3.5" />
                Config
            </button>
            <button className="h-full px-4 text-xs font-medium text-muted-foreground hover:bg-muted/40 flex items-center gap-2 transition-colors">
                <BookOpen className="w-3.5 h-3.5" />
                Learning
            </button>
            <div className="ml-auto flex items-center pr-2">
                <button className="p-1 px-2 text-[10px] font-bold bg-accent/10 border border-accent/20 rounded text-accent hover:bg-accent/20 transition-all">
                    Doc
                </button>
            </div>
        </div>

        {/* Monaco Editor Mock */}
        <div className="flex-1 relative font-mono text-sm p-4 overflow-auto scrollbar-thin">
            <div className="flex gap-4 leading-relaxed">
                {/* Line Numbers */}
                <div className="text-muted-foreground/30 text-right select-none pr-2 font-mono">
                    1<br />2<br />3<br />4<br />5<br />6<br />7
                </div>
                {/* Code Content */}
                <div className="flex-1 font-mono tracking-wide">
                    <span className="text-blue-400">flowchart</span> <span className="text-foreground">TD</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-pink-400">Start</span> --&gt; <span className="text-green-400">NodeA</span><span className="text-foreground/80">[Process A]</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">NodeA</span> --&gt; <span className="text-green-400">NodeB</span><span className="text-foreground/80">{"{Decision}"}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">NodeB</span> <span className="text-blue-300">--|Yes|--&gt;</span> <span className="text-green-400">End</span><span className="text-foreground/80">([Done/Finished])</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">NodeB</span> <span className="text-blue-300">--|No|--&gt;</span> <span className="text-green-400">Retry</span><span className="text-foreground/80">[Repeat]</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">Retry</span> --&gt; <span className="text-green-400">NodeA</span>
                </div>
            </div>
            {/* Cursor Mock */}
            <div className="absolute w-[2px] h-5 bg-primary animate-pulse top-[20px] left-[56px]"></div>
        </div>
    </div>
);

const PreviewPane = () => (
    <div className="flex-1 bg-muted/5 relative overflow-hidden flex flex-col items-center justify-center p-8 theme-transition">
        {/* Mermaid Render Area */}
        <div className="w-full h-full flex items-center justify-center relative">
            <div className="glass p-8 rounded-2xl glow shadow-2xl bg-background/50 transition-all duration-500 hover:scale-[1.02]">
                {/* Mock SVG Diagram */}
                <svg width="300" height="250" viewBox="0 0 300 250" className="text-foreground transition-colors">
                    <rect x="110" y="10" width="80" height="40" rx="20" className="fill-primary/20 stroke-primary" strokeWidth="2" />
                    <text x="150" y="35" textAnchor="middle" fontSize="12" fill="currentColor" className="font-sans font-medium">Start</text>

                    <line x1="150" y1="50" x2="150" y2="90" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)" />

                    <rect x="100" y="90" width="100" height="40" rx="4" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="2" />
                    <text x="150" y="115" textAnchor="middle" fontSize="12" fill="currentColor" className="font-sans font-medium">Process A</text>

                    {/* Additional Mock Elements for aesthetics */}
                    <line x1="150" y1="130" x2="150" y2="170" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <polygon points="150,170 190,195 150,220 110,195" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="2" />
                    <text x="150" y="199" textAnchor="middle" fontSize="12" fill="currentColor" className="font-sans font-medium">Decision</text>

                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                        </marker>
                    </defs>
                </svg>
            </div>
        </div>

        {/* Floating Zoom Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
            <div className="flex flex-col border border-border rounded-lg bg-background shadow-lg overflow-hidden theme-transition">
                <button className="p-2 hover:bg-muted border-b border-border transition-colors text-foreground"><ZoomIn className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-muted border-b border-border transition-colors text-foreground"><ZoomOut className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-muted transition-colors text-foreground"><Maximize className="w-4 h-4" /></button>
            </div>
            <button className="p-2 bg-background border border-border rounded-lg shadow-lg hover:text-primary transition-colors theme-transition text-foreground">
                <span className="text-[10px] font-bold block px-1">100%</span>
            </button>
        </div>
    </div>
);

const StatusBar = ({ isDark, toggleTheme }) => (
    <footer className="h-7 shrink-0 bg-primary text-white flex items-center justify-between px-3 text-[10px] font-bold uppercase tracking-wider z-50">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
                <Square className="w-3 h-3" />
                Hand-Drawn
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
                <CheckSquare className="w-3 h-3" />
                Background Grid
            </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 opacity-80 font-medium">
            Graphi Live Editor <span className="opacity-50 mx-1">•</span> Developed by Batu Atakan Erol
        </div>

        <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 cursor-pointer hover:opacity-80">
                <ShieldCheck className="w-3 h-3" />
                Privacy & Security
            </div>
            <div className="h-3 w-[1px] bg-white/30"></div>

            {/* Interactive Theme Toggle */}
            <div
                className="flex items-center gap-1 cursor-pointer hover:text-white/80 transition-colors"
                onClick={toggleTheme}
            >
                {isDark ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                {isDark ? 'Light Mode' : 'Dark Mode'}
            </div>

            <div className="h-3 w-[1px] bg-white/30"></div>
            <div className="font-mono">v11.12.0</div>
        </div>
    </footer>
);

// --- Haupt-App ---

export default function App() {
    const [activeTab, setActiveTab] = useState('explorer');
    // Darkmode State - standardmäßig true, da das HTML .dark gesetzt hatte
    const [isDark, setIsDark] = useState(true);

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <>
            <GlobalStyles />
            <div className={`h-screen w-full overflow-hidden flex flex-col font-sans ${isDark ? 'dark' : ''} bg-background text-foreground`}>
                <Header />

                <main className="flex flex-1 overflow-hidden">
                    <ActivityBar activeTab={activeTab} setActiveTab={setActiveTab} />
                    <Sidebar />

                    <div className="flex-1 flex overflow-hidden">
                        <CodeEditorPane />
                        <PreviewPane />
                    </div>
                </main>

                <StatusBar isDark={isDark} toggleTheme={toggleTheme} />
            </div>
        </>
    );
}