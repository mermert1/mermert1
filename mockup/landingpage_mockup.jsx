import React, { useState } from 'react';
import {
Share2,
MousePointer2,
Zap,
LayoutTemplate,
ArrowRight,
CheckCircle2,
Menu,
X,
Github,
Twitter,
Linkedin
} from 'lucide-react';

// --- Komponenten ---

const Navbar = () => {
const [isOpen, setIsOpen] = useState(false);

return (
<nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                <div
                    className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform">
                    <Share2 className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900">Graphi</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
                <a href="#features"
                    className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Funktionen</a>
                <a href="#templates"
                    className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Vorlagen</a>
                <a href="#pricing"
                    className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Preise</a>
                <div className="h-6 w-px bg-gray-200"></div>
                <button className="text-gray-900 font-medium hover:text-indigo-600 transition-colors">Anmelden</button>
                <button
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md">
                    Kostenlos starten
                </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
                <button onClick={()=> setIsOpen(!isOpen)}
                    className="text-gray-600 hover:text-gray-900 focus:outline-none"
                    >
                    {isOpen ?
                    <X className="w-6 h-6" /> :
                    <Menu className="w-6 h-6" />}
                </button>
            </div>
        </div>
    </div>

    {/* Mobile Menu */}
    {isOpen && (
    <div className="md:hidden bg-white border-b border-gray-100 absolute w-full shadow-lg">
        <div className="px-4 pt-2 pb-4 space-y-1">
            <a href="#features"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md">Funktionen</a>
            <a href="#templates"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md">Vorlagen</a>
            <a href="#pricing"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md">Preise</a>
            <div className="border-t border-gray-100 my-2 pt-2">
                <button
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md">Anmelden</button>
                <button
                    className="block w-full mt-2 bg-indigo-600 text-white px-3 py-2 text-base font-medium text-center rounded-md hover:bg-indigo-700">
                    Kostenlos starten
                </button>
            </div>
        </div>
    </div>
    )}
</nav>
);
};

const Hero = () => {
return (
<section className="relative overflow-hidden bg-white pt-16 pb-32">
    {/* Hintergrund-Dekoration */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] opacity-20 pointer-events-none">
        <div
            className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        </div>
        <div
            className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]">
        </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            <span>Graphi 2.0 ist live! Entdecke KI-gestützte Diagramme</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
            Diagramme für <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">alle.</span><br />
            Einfach, schnell, kollaborativ.
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 mb-10">
            Das intuitive Diagramm-Tool für Teams. Erstellen Sie Flowcharts, Mindmaps, Architekturdiagramme und
            Wireframes in Sekunden – direkt im Browser.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <button
                className="bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
                Jetzt kostenlos starten
                <ArrowRight className="w-5 h-5" />
            </button>
            <button
                className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
                Live-Demo ansehen
            </button>
        </div>

        {/* Mockup Canvas */}
        <div className="relative mx-auto max-w-5xl">
            <div className="rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm shadow-2xl overflow-hidden">
                {/* Mockup Header */}
                <div className="h-12 border-b border-gray-200 bg-gray-50/80 flex items-center px-4 gap-4">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div
                            className="bg-white px-3 py-1 rounded-md border border-gray-200 text-xs text-gray-500 font-medium flex items-center gap-2">
                            <span>Projekt-Architektur.graphi</span>
                        </div>
                    </div>
                    <div className="flex -space-x-2">
                        <div
                            className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-600">
                            JS</div>
                        <div
                            className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-xs font-bold text-emerald-600">
                            MR</div>
                        <div
                            className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                            +3</div>
                    </div>
                </div>

                {/* Mockup Body (Diagramm Nachbau) */}
                <div
                    className="h-[400px] md:h-[500px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] relative overflow-hidden">

                    {/* Element 1 */}
                    <div
                        className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-indigo-400 rounded-lg p-4 shadow-sm w-48 z-10">
                        <div className="text-sm font-bold text-gray-800 mb-1">Benutzer-Login</div>
                        <div className="text-xs text-gray-500">Authentifizierung via OAuth2</div>
                    </div>

                    {/* Element 2 */}
                    <div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white border-2 border-indigo-700 rounded-lg p-4 shadow-md w-56 z-10">
                        <div className="text-sm font-bold mb-1 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-300" />
                            API Gateway
                        </div>
                        <div className="text-xs text-indigo-100">Rate Limiting & Routing</div>
                    </div>

                    {/* Element 3 */}
                    <div
                        className="absolute top-3/4 left-3/4 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-emerald-400 rounded-lg p-4 shadow-sm w-48 z-10">
                        <div className="text-sm font-bold text-gray-800 mb-1">Datenbank</div>
                        <div className="text-xs text-gray-500">PostgreSQL Cluster</div>
                    </div>

                    {/* SVG Verbindungen (Stark vereinfacht für die Optik) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                        {/* Linie von Login zu API */}
                        <path d="M 25% 25% C 35% 25%, 35% 50%, 50% 50%" fill="none" stroke="#9ca3af" strokeWidth="2"
                            strokeDasharray="4 4" className="animate-[dash_2s_linear_infinite]" />
                        <circle cx="50%" cy="50%" r="4" fill="#4f46e5" />

                        {/* Linie von API zu DB */}
                        <path d="M 50% 50% C 65% 50%, 65% 75%, 75% 75%" fill="none" stroke="#9ca3af" strokeWidth="2" />
                        <polygon points="75%,75% 73%,71% 77%,71%" fill="#9ca3af"
                            transform="translate(-10, 0) rotate(45, 75%, 75%)" />
                    </svg>

                    {/* Fake Cursor (Multiplayer) */}
                    <div
                        className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-start gap-1 z-20 animate-bounce">
                        <MousePointer2 className="w-5 h-5 text-rose-500 fill-rose-500" />
                        <div
                            className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium shadow-sm">
                            Maria</div>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <style dangerouslySetInnerHTML={{__html: ` @keyframes dash { to { stroke-dashoffset: -8; } } `}} />
</section>
);
};

const Features = () => {
const features = [
{
icon:
<MousePointer2 className="w-6 h-6 text-indigo-600" />,
title: "Echtzeit-Zusammenarbeit",
description: "Arbeiten Sie zeitgleich mit Ihrem Team am selben Diagramm. Sehen Sie Mauszeiger und Änderungen in
Echtzeit."
},
{
icon:
<LayoutTemplate className="w-6 h-6 text-indigo-600" />,
title: "Hunderte Vorlagen",
description: "Starten Sie nicht bei Null. Wählen Sie aus einer riesigen Bibliothek von Vorlagen für AWS, Azure, Mindmaps
und mehr."
},
{
icon:
<Zap className="w-6 h-6 text-indigo-600" />,
title: "Blitzschnell & Leicht",
description: "Graphi läuft direkt im Browser und ist auf Performance optimiert. Keine Installation, keine Wartezeiten."
}
];

return (
<section id="features" className="py-24 bg-gray-50 border-t border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-3">Warum Graphi?</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Alles, was Sie für perfekte Diagramme
                brauchen</h3>
            <p className="text-lg text-gray-600">Verabschieden Sie sich von klobigen Desktop-Apps. Graphi bringt
                modernes Diagramming direkt in Ihren Browser.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
            <div key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                    {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                </p>
            </div>
            ))}
        </div>
    </div>
</section>
);
};

const Testimonial = () => {
return (
<section className="py-24 bg-white">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
            className="bg-indigo-600 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            {/* Deko-Elemente */}
            <div
                className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2">
            </div>
            <div
                className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2">
            </div>

            <div className="relative z-10">
                <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-amber-400 fill-amber-400 mx-1" viewBox="0 0 20 20">
                        <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    ))}
                </div>
                <p className="text-2xl md:text-4xl font-medium leading-tight mb-8">
                    "Seit wir Graphi im Team nutzen, hat sich unsere Dokumentationszeit halbiert. Es ist unglaublich
                    intuitiv und die Echtzeit-Funktion ist ein Gamechanger."
                </p>
                <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 bg-indigo-300 rounded-full overflow-hidden border-2 border-indigo-400">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=c0aede"
                            alt="Benutzer Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-lg">Felix Hoffmann</div>
                        <div className="text-indigo-200 text-sm">Lead Architect bei TechFlow</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
);
};

const CTA = () => {
return (
<section className="py-20 bg-gray-50">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Bereit, Ihre Ideen zu visualisieren?</h2>
        <p className="text-xl text-gray-600 mb-10">Keine Kreditkarte erforderlich. Starten Sie in weniger als 30
            Sekunden.</p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
                className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                Kostenlosen Account erstellen
            </button>
            <span className="text-gray-500 text-sm">oder</span>
            <button
                className="w-full sm:w-auto text-indigo-600 font-semibold px-4 py-2 hover:bg-indigo-50 rounded-lg transition-colors">
                Mit Google anmelden
            </button>
        </div>
        <div className="mt-8 flex justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 14 Tage Pro-Version gratis
            </div>
            <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Jederzeit kündbar
            </div>
        </div>
    </div>
</section>
);
};

const Footer = () => {
return (
<footer className="bg-white border-t border-gray-200 pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center transform rotate-3">
                        <Share2 className="text-white w-3 h-3" />
                    </div>
                    <span className="font-bold text-xl text-gray-900">Graphi</span>
                </div>
                <p className="text-gray-500 mb-6 max-w-sm">
                    Machen Sie Schluss mit unübersichtlichen Konzepten. Visualisieren, planen und kollaborieren Sie auf
                    einer grenzenlosen Arbeitsfläche.
                </p>
                <div className="flex gap-4">
                    <a href="#" className="text-gray-400 hover:text-indigo-600">
                        <Twitter className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-indigo-600">
                        <Github className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-indigo-600">
                        <Linkedin className="w-5 h-5" />
                    </a>
                </div>
            </div>

            {/* Links */}
            <div>
                <h4 className="font-bold text-gray-900 mb-4">Produkt</h4>
                <ul className="space-y-3">
                    <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Funktionen</a>
                    </li>
                    <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Integrationen</a>
                    </li>
                    <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Preise</a></li>
                    <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Changelog</a></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-gray-900 mb-4">Ressourcen</h4>
                <ul className="space-y-3">
                    <li><a href="#"
                            className="text-gray-500 hover:text-indigo-600 transition-colors">Vorlagen-Galerie</a></li>
                    <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Hilfe-Center</a>
                    </li>
                    <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Tutorials</a></li>
                    <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Blog</a></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-gray-900 mb-4">Unternehmen</h4>
                <ul className="space-y-3">
                    <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Über uns</a></li>
                    <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Karriere</a></li>
                    <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Datenschutz</a>
                    </li>
                    <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Impressum</a></li>
                </ul>
            </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Graphi Inc. Alle Rechte vorbehalten.
            </p>
            <div className="flex gap-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-gray-900">Nutzungsbedingungen</a>
                <a href="#" className="text-gray-400 hover:text-gray-900">Cookies</a>
            </div>
        </div>
    </div>
</footer>
);
};

// --- Haupt-App ---

export default function App() {
return (
<div className="min-h-screen font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
    <Navbar />
    <main>
        <Hero />
        <Features />
        <Testimonial />
        <CTA />
    </main>
    <Footer />
</div>
);
}