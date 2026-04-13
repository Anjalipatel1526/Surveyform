import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Mail, Calendar, Phone, Link, Briefcase,
    Building2, GraduationCap, BookOpen, Star, BarChart3,
    Heart, ThumbsUp, Lightbulb, MessageSquare, ChevronRight, ChevronLeft,
    Globe, Cpu, LayoutGrid, Zap, Clock, Target, ShieldCheck, Sparkles
} from "lucide-react";

// Update this with your actual Google Apps Script URL
const GAS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

const questions = [
    { id: 'name', label: 'Full Name', type: 'text', required: true, icon: User },
    { id: 'email', label: 'Email Address', type: 'email', required: true, icon: Mail },
    { id: 'dob', label: 'Date of Birth', type: 'date', required: true, icon: Calendar },
    { id: 'phone', label: 'Phone Number', type: 'tel', required: true, icon: Phone },
    { id: 'linkedin', label: 'LinkedIn Profile', type: 'url', required: true, icon: Link },
    { id: 'interest', label: 'Field of Interest', type: 'radio', options: ['Full Stack Developer', 'AIML', 'AIDS', 'Testing', 'UI/UX Design'], required: true, icon: Briefcase },
    { id: 'college', label: 'College / University', type: 'text', required: true, icon: Building2 },
    { id: 'department', label: 'Department / Branch', type: 'text', required: true, icon: GraduationCap },
    { id: 'year', label: 'Year of Study', type: 'select', options: ['1st Year', '2nd Year', '3rd Year', '4th Year'], required: true, icon: BookOpen },
    { id: 'ai_understanding', label: 'What is your overall understanding of Artificial Intelligence (AI)?', type: 'radio', options: ['Very High', 'High', 'Moderate', 'low', 'No Understanding'], required: true, icon: BookOpen },
    { id: 'ai_role', label: 'How do you perceive the role of AI in today’s world?', type: 'radio', options: ['Extremely Important', 'Important', 'Neutral', 'Slightly Important', 'Not Important'], required: true, icon: Globe },
    { id: 'ai_career_impact', label: 'In your opinion, how will AI impact future careers?', type: 'radio', options: ['Create more opportunities', 'Replace many jobs', 'Both create and replace jobs', 'No significant impact', 'Unsure'], required: true, icon: Briefcase },
    { id: 'ai_usage', label: 'Are you currently using any AI-based tools or applications?', type: 'radio', options: ['Yes', 'No'], required: true, icon: Cpu },
    { id: 'ai_tools_familiar', label: 'Which AI tools are you familiar with?', type: 'radio', options: ['ChatGPT', 'Google Gemini', 'Microsoft Copilot', 'Midjourney / DALL·E', 'Canva AI', 'Grammarly', 'Not familiar with any AI tools'], required: true, icon: LayoutGrid },
    { id: 'ai_tool_frequent', label: 'Which AI tool do you use most frequently?', type: 'radio', options: ['ChatGPT', 'Google Gemini', 'Microsoft Copilot', 'Canva AI', 'Other'], required: true, icon: Zap },
    { id: 'ai_usage_frequency', label: 'How often do you use AI tools?', type: 'radio', options: ['Daily', 'Weekly', 'Occasionally', 'Rarely', 'Never'], required: true, icon: Clock },
    { id: 'ai_purposes', label: 'For what purposes do you primarily use AI tools?', type: 'radio', options: ['Academic studies', 'Coding / Programming', 'Content creation', 'Design & Creativity', 'Research', 'Personal productivity', 'Entertainment'], required: true, icon: Target },
    { id: 'ai_reliance_area', label: 'Which area do you rely on AI the most?', type: 'radio', options: ['Learning concepts', 'Writing / Documentation', 'Problem solving', 'Coding assistance', 'Design & media generation'], required: true, icon: ShieldCheck },
    { id: 'ai_effectiveness', label: 'How effective do you find AI tools in solving your problems?', type: 'radio', options: ['Very Effective', 'Effective', 'Neutral', 'Ineffective', 'Very Ineffective'], required: true, icon: Sparkles },
    { id: 'experience', label: 'Workshop Experience', type: 'range', min: 1, max: 5, required: true, icon: Star },
    { id: 'relevance', label: 'Relevance to Curriculum', type: 'range', min: 1, max: 5, required: true, icon: BarChart3 },
    { id: 'satisfaction', label: 'Content Satisfaction', type: 'range', min: 1, max: 5, required: true, icon: Heart },
    { id: 'recommend', label: 'Recommend this workshop?', type: 'radio', options: ['Yes', 'No', 'Maybe'], required: true, icon: ThumbsUp },
    { id: 'valuable_learned', label: 'Most valuable takeaway?', type: 'textarea', required: false, icon: Lightbulb },
    { id: 'improvement_suggestions', label: 'Any suggestions?', type: 'textarea', required: false, icon: MessageSquare },
];

const SurveyForm = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', dob: '', phone: '', college: '', department: '', year: '', linkedin: '', interest: '',
        ai_understanding: '', ai_role: '', ai_career_impact: '', ai_usage: '', ai_tools_familiar: '', ai_tool_frequent: '',
        ai_tool_frequent_other: '', ai_usage_frequency: '', ai_purposes: '', ai_reliance_area: '', ai_effectiveness: '',
        experience: 3, relevance: 3, satisfaction: 3, recommend: 'Yes', valuable_learned: '', improvement_suggestions: ''
    });
    const [status, setStatus] = useState('idle');
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(1);

    const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

    const nextStep = () => {
        const q = questions[step];

        // Validation for "Other" field in Question 15
        if (q.id === 'ai_tool_frequent' && formData.ai_tool_frequent === 'Other' && !formData.ai_tool_frequent_other) {
            return;
        }

        if (q.required && !formData[q.id]) {
            return;
        }
        if (step < questions.length - 1) {
            setDirection(1);
            setStep(s => s + 1);
        } else {
            handleSubmit();
        }
    };

    const prevStep = () => {
        if (step > 0) {
            setDirection(-1);
            setStep(s => s - 1);
        }
    };

    const handleSubmit = async () => {
        setStatus('submitting');
        try {
            await fetch(GAS_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(formData) });
            setStatus('success');
            setTimeout(() => { setStatus('idle'); setStep(0); }, 3000);
        } catch { setStatus('error'); }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-3xl shadow-2xl shadow-blue-900/10 p-10 text-center border border-slate-100 max-w-sm w-full"
                >
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Success!</h2>
                    <p className="text-slate-500">Your response has been saved securely.</p>
                </motion.div>
            </div>
        );
    }

    const currentQuestion = questions[step];
    const Icon = currentQuestion.icon;

    const variants = {
        enter: (d) => ({ x: d > 0 ? 50 : -50, opacity: 0, scale: 0.95 }),
        center: { x: 0, opacity: 1, scale: 1 },
        exit: (d) => ({ x: d < 0 ? 50 : -50, opacity: 0, scale: 0.95 })
    };

    return (
        <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-inter">
            {/* Subtle background patterns */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[120px]" />
                <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <div className="relative z-10 w-full max-w-md flex flex-col items-center">
                {/* Brand Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col items-center mb-6 sm:mb-8"
                >
                    <div className="bg-white p-3 sm:p-4 rounded-3xl shadow-xl shadow-blue-500/10 mb-3 sm:mb-4 border border-slate-100 transition-all">
                        <img src="/logo.ico" alt="Logo" className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
                    </div>
                    <h1 className="text-[10px] sm:text-sm font-bold uppercase tracking-widest text-slate-400 text-center">Engineering Student Onboarding</h1>
                </motion.div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full mb-10 overflow-hidden flex">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                        className="h-full bg-blue-600 rounded-full"
                    />
                </div>

                {/* Main Card */}
                <div className="w-full relative min-h-[380px] sm:min-h-[420px]">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={step}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-6 sm:p-8 border border-slate-100 flex flex-col h-full ring-1 ring-slate-900/[0.02]"
                        >
                            {/* Card Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
                                    <Icon size={20} />
                                </div>
                                <span className="text-xs font-semibold text-slate-400">
                                    Question {step + 1} / {questions.length}
                                </span>
                            </div>

                            <h2 className="text-xl font-bold text-slate-900 leading-tight mb-8">
                                {currentQuestion.label}
                            </h2>

                            {/* Input Sections */}
                            <div className="flex-grow">
                                {currentQuestion.type === 'radio' ? (
                                    <div className="flex flex-col gap-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {currentQuestion.options.map(opt => (
                                                <button
                                                    key={opt}
                                                    onClick={() => {
                                                        setFormData(p => ({ ...p, [currentQuestion.id]: opt }));
                                                        if (opt !== 'Other') setTimeout(nextStep, 300);
                                                    }}
                                                    className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 border ${formData[currentQuestion.id] === opt
                                                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 scale-[1.02]'
                                                        : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100 hover:border-slate-200 hover:scale-[1.01]'
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                        {currentQuestion.id === 'ai_tool_frequent' && formData.ai_tool_frequent === 'Other' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-2"
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="Specify the tool name..."
                                                    name="ai_tool_frequent_other"
                                                    value={formData.ai_tool_frequent_other}
                                                    onChange={handleChange}
                                                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none shadow-inner"
                                                    autoFocus
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                ) : currentQuestion.id === 'year' ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {currentQuestion.options.map((opt, i) => (
                                            <button
                                                key={opt}
                                                onClick={() => { setFormData(p => ({ ...p, [currentQuestion.id]: opt })); setTimeout(nextStep, 300); }}
                                                className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl transition-all duration-300 border ${formData[currentQuestion.id] === opt
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 scale-105 z-10'
                                                    : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100 hover:border-slate-200 hover:scale-[1.02]'
                                                    }`}
                                            >
                                                <span className="text-2xl font-black mb-0.5">{i + 1}</span>
                                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                                                    {i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} Year
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                ) : currentQuestion.id === 'dob' ? (
                                    <div className="flex flex-col gap-4">
                                        <div className="group relative">
                                            <label className="block text-[10px] font-bold text-slate-400 mb-2 ml-1 uppercase tracking-wider">Date of Birth</label>
                                            <input
                                                type="text"
                                                placeholder="DD / MM / YYYY"
                                                value={formData.dob || ''}
                                                onChange={(e) => {
                                                    let val = e.target.value.replace(/\D/g, '');
                                                    if (val.length > 8) val = val.slice(0, 8);

                                                    let formatted = '';
                                                    if (val.length > 0) {
                                                        formatted = val.slice(0, 2);
                                                        if (val.length > 2) {
                                                            formatted += ' / ' + val.slice(2, 4);
                                                            if (val.length > 4) {
                                                                formatted += ' / ' + val.slice(4, 8);
                                                            }
                                                        }
                                                    }
                                                    setFormData(p => ({ ...p, dob: formatted }));
                                                }}
                                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-300 tracking-widest tabular-nums"
                                            />
                                            <div className="absolute right-6 top-[3.25rem] text-slate-300">
                                                <Calendar size={18} />
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-medium text-center">
                                            Please use the format Day / Month / Year
                                        </div>
                                    </div>
                                ) : currentQuestion.type === 'range' ? (
                                    <div className="pt-4 flex flex-col items-center">
                                        <div className="text-5xl font-black text-blue-600 mb-6 tabular-nums">{formData[currentQuestion.id]}</div>
                                        <input
                                            type="range" min={currentQuestion.min} max={currentQuestion.max}
                                            name={currentQuestion.id} value={formData[currentQuestion.id]}
                                            onChange={handleChange}
                                            className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                                        />
                                        <div className="w-full flex justify-between mt-4 px-1 text-[10px] font-bold text-slate-400">
                                            <span>MIN ({currentQuestion.min})</span>
                                            <span>MAX ({currentQuestion.max})</span>
                                        </div>
                                    </div>
                                ) : currentQuestion.type === 'textarea' ? (
                                    <textarea
                                        name={currentQuestion.id} value={formData[currentQuestion.id]}
                                        onChange={handleChange} placeholder="Share your thoughts..."
                                        className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] resize-none"
                                    />
                                ) : (
                                    <input
                                        type={currentQuestion.type} name={currentQuestion.id}
                                        value={formData[currentQuestion.id]} onChange={handleChange}
                                        placeholder="Type your answer here..."
                                        onKeyDown={e => e.key === 'Enter' && nextStep()}
                                        className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                )}
                            </div>

                            {/* Buttons Area */}
                            <div className="mt-8 sm:mt-10 flex items-center justify-between gap-4">
                                {step > 0 ? (
                                    <button
                                        onClick={prevStep}
                                        className="flex items-center gap-2 px-5 sm:px-6 py-3 rounded-2xl text-sm font-bold text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200"
                                    >
                                        <ChevronLeft size={18} />
                                        <span>Back</span>
                                    </button>
                                ) : <div />}

                                <button
                                    onClick={nextStep}
                                    disabled={status === 'submitting' || (currentQuestion.required && !formData[currentQuestion.id])}
                                    className={`flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-sm font-bold shadow-xl transition-all duration-300 ${(currentQuestion.required && !formData[currentQuestion.id])
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                                        : 'bg-blue-600 text-white shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0'
                                        }`}
                                >
                                    <span>{status === 'submitting' ? 'Saving...' : step === questions.length - 1 ? 'Complete' : 'Continue'}</span>
                                    {step < questions.length - 1 && <ChevronRight size={18} />}
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Info */}
                <p className="mt-12 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">
                    Powered by Student Analytics Core • Survey v2.0
                </p>
            </div>
        </div>
    );
};

export default SurveyForm;
