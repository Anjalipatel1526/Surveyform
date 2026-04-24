import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from '@emailjs/browser';
import {
    User, Mail, Phone, Building2, GraduationCap, BookOpen, Briefcase,
    Globe, Cpu, Zap, Clock, Target, Sparkles, Settings2, Scale, Award,
    Star, MessageSquare, ChevronRight, ChevronLeft, Link, ShieldCheck, FileText, Heart, ThumbsUp, Lightbulb, Compass, Rocket, Calendar, LayoutGrid, Eye
} from "lucide-react";
import { supabase } from '../supabaseClient';

const pages = [
    {
        title: "Personal Details",
        icon: User,
        questions: [
            { id: 'name', label: 'Full Name', type: 'text', required: true, icon: User },
            { id: 'email', label: 'Email Address', type: 'email', required: true, icon: Mail },
            { id: 'phone', label: 'Phone Number', type: 'tel', required: true, icon: Phone },
            { id: 'college', label: 'College / University', type: 'text', required: true, icon: Building2 },
            { id: 'department', label: 'Department / Branch', type: 'text', required: true, icon: GraduationCap },
            { id: 'year', label: 'Year of Study', type: 'select', options: ['1st Year', '2nd Year', '3rd Year', '4th Year'], required: true, icon: BookOpen },
            { id: 'interest', label: 'Field of Interest', type: 'radio', options: ['Full Stack Developer', 'AIML', 'AIDS', 'Testing', 'UI/UX Design'], required: true, icon: Briefcase },
        ]
    },
    {
        title: "AI Usage & Perspective",
        icon: Cpu,
        questions: [
            { id: 'ai_understanding', label: 'What is your overall understanding of Artificial Intelligence (AI)?', type: 'radio', options: ['Very High', 'High', 'Moderate', 'low', 'No Understanding'], required: true, icon: BookOpen },
            { id: 'ai_career_impact', label: 'In your opinion, how will AI impact future careers?', type: 'radio', options: ['Create more opportunities', 'Replace many jobs', 'Both create and replace jobs', 'No significant impact', 'Unsure'], required: true, icon: Briefcase },
            {
                id: 'ai_tool_frequent', label: 'Which AI tool do you use most frequently?', type: 'radio', options: ['Claude', 'ChatGPT', 'Gemini Copilot', 'Microsoft Copilot'], required: true, icon: Zap
            },
            { id: 'ai_usage_frequency', label: 'How often do you use AI tools?', type: 'radio', options: ['Daily', 'Weekly', 'Occasionally', 'Rarely', 'Never'], required: true, icon: Clock },
            { id: 'ai_purposes', label: 'For what purposes do you primarily use AI tools?', type: 'radio', options: ['Academic studies', 'Coding / Programming', 'Content creation', 'Design & Creativity', 'Research', 'Personal productivity', 'Entertainment'], required: true, icon: Target },
            { id: 'ai_effectiveness', label: 'How effective do you find AI tools in solving your problems?', type: 'radio', options: ['Very Effective', 'Effective', 'Neutral', 'Ineffective', 'Very Ineffective'], required: true, icon: Sparkles },
            { id: 'ai_prompt_engineering_awareness', label: 'Are you aware of the concept of “Prompt Engineering”?', type: 'radio', options: ['Yes, and I use it', 'Aware but not confident', 'Heard of it', 'Not aware'], required: true, icon: Settings2 },
            { id: 'ai_ethics_awareness', label: 'Are you aware of ethical concerns related to AI (data privacy, bias, misuse)?', type: 'radio', options: ['Very Aware', 'Somewhat Aware', 'Heard about it', 'Not Aware'], required: true, icon: Scale },
        ]
    }
];

const SurveyForm = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', college: '', department: '', year: '', interest: '',
        ai_understanding: '', ai_career_impact: '', ai_tool_frequent: '',
        ai_tool_frequent_other: '', ai_usage_frequency: '', ai_purposes: '', ai_effectiveness: '',
        ai_prompt_engineering_awareness: '', ai_ethics_awareness: '', ai_previous_workshops: '',
        experience: 3, additional_feedback: ''
    });

    const [status, setStatus] = useState('idle');
    const [step, setStep] = useState(0); // 0, 1, 2 representing the pages
    const [direction, setDirection] = useState(1);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const isSubmitted = localStorage.getItem('survey_submitted');
        if (isSubmitted === 'true') {
            setStatus('success');
        }
    }, []);

    const handleChange = (e) => {
        setErrors(prev => ({ ...prev, [e.target.name]: '' }));
        setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    };

    const nextStep = () => {
        const currentPage = pages[step];
        const newErrors = {};

        // Validate all questions on the current page
        currentPage.questions.forEach(q => {
            if (q.required && !formData[q.id]) {
                newErrors[q.id] = 'This field is required';
            }

            if (q.id === 'email' && formData.email) {
                const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
                if (!gmailRegex.test(formData.email)) {
                    newErrors.email = 'Please enter a valid @gmail.com address';
                }
            }

            if (q.id === 'phone' && formData.phone) {
                const phoneRegex = /^\d{10}$/;
                if (!phoneRegex.test(formData.phone)) {
                    newErrors.phone = 'Please enter a valid 10-digit phone number';
                }
            }

            if (q.id === 'ai_tool_frequent' && formData.ai_tool_frequent === 'Other' && !formData.ai_tool_frequent_other) {
                newErrors.ai_tool_frequent = 'Please specify the tool name';
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (step < pages.length - 1) {
            setDirection(1);
            setStep(s => s + 1);
            // Scroll to top of the form when moving to next page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            handleSubmit();
        }
    };

    const prevStep = () => {
        if (step > 0) {
            setDirection(-1);
            setStep(s => s - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = async () => {
        setStatus('submitting');
        try {
            // 1. Save to Supabase
            // Map the new consolidated fields back to the original database schema
            const payload = { ...formData };
            payload.valuable_learned = payload.additional_feedback;
            delete payload.additional_feedback;

            const { error: dbError } = await supabase
                .from('survey_responses')
                .insert([payload]);

            if (dbError) throw dbError;

            // 2. Send Professional Email Confirmation
            if (import.meta.env.VITE_EMAILJS_PUBLIC_KEY && import.meta.env.VITE_EMAILJS_PUBLIC_KEY !== 'public_key') {
                const templateParams = {
                    user_name: formData.name,
                    user_email: formData.email,
                    from_name: 'Anjali Patel',
                    reply_to: 'anjalipatel@unaitech.com',
                    message: `Dear ${formData.name},\n\nYour survey response has been successfully received.\n\nThank you for your valuable contribution and time.\n\nBest regards,\nAnjali Patel`
                };

                await emailjs.send(
                    import.meta.env.VITE_EMAILJS_SERVICE_ID,
                    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                    templateParams,
                    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
                );
            }

            localStorage.setItem('survey_submitted', 'true');
            setStatus('success');
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0f1e] p-4">
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

    const currentPage = pages[step];
    const PageIcon = currentPage.icon;

    const variants = {
        enter: (d) => ({ x: d > 0 ? 50 : -50, opacity: 0, scale: 0.95 }),
        center: { x: 0, opacity: 1, scale: 1 },
        exit: (d) => ({ x: d < 0 ? 50 : -50, opacity: 0, scale: 0.95 })
    };

    return (
        <div className="min-h-screen w-full bg-[#0a0f1e] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-y-auto font-inter">
            {/* Subtle background patterns */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none fixed">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[120px]" />
                <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <div className="relative z-10 w-full max-w-2xl flex flex-col items-center my-8">
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
                <div className="w-full h-1.5 bg-white/10 rounded-full mb-10 overflow-hidden flex">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((step + 1) / pages.length) * 100}%` }}
                        className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] rounded-full"
                    />
                </div>

                {/* Main Card */}
                <div className="w-full relative">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={step}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-white rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl shadow-slate-200/60 p-8 sm:p-12 border border-slate-100 flex flex-col ring-1 ring-slate-900/[0.02] mb-10"
                        >
                            {/* Card Header */}
                            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                                    <PageIcon size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 leading-tight">
                                        {currentPage.title}
                                    </h2>
                                    <span className="text-xs font-semibold text-slate-400">
                                        Step {step + 1} of {pages.length}
                                    </span>
                                </div>
                            </div>

                            {/* Input Sections */}
                            <div className="flex-grow space-y-10">
                                {currentPage.questions.map((q) => {
                                    const QuestionIcon = q.icon;
                                    const isError = !!errors[q.id];
                                    return (
                                        <div key={q.id} className="scroll-m-20" id={`q-${q.id}`}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <QuestionIcon size={16} className="text-slate-400" />
                                                <label className="text-sm font-bold text-slate-700">
                                                    {q.label} {q.required && <span className="text-red-500">*</span>}
                                                </label>
                                            </div>

                                            {q.type === 'radio' ? (
                                                <div className="flex flex-col gap-3">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {q.options.map(opt => (
                                                            <button
                                                                key={opt}
                                                                onClick={() => {
                                                                    setErrors(prev => ({ ...prev, [q.id]: '' }));
                                                                    setFormData(p => ({ ...p, [q.id]: opt }));
                                                                }}
                                                                className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 border ${formData[q.id] === opt
                                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 scale-[1.02]'
                                                                    : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100 hover:border-slate-200'
                                                                    }`}
                                                            >
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {q.id === 'ai_tool_frequent' && formData.ai_tool_frequent === 'Other' && (
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
                                                                className={`w-full bg-slate-50 border rounded-2xl px-5 py-4 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none ${errors.ai_tool_frequent ? 'border-red-500 bg-red-50/30' : 'border-transparent shadow-inner'}`}
                                                                autoFocus
                                                            />
                                                        </motion.div>
                                                    )}
                                                </div>
                                            ) : q.id === 'year' ? (
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                                    {q.options.map((opt, i) => (
                                                        <button
                                                            key={opt}
                                                            onClick={() => {
                                                                setErrors(prev => ({ ...prev, [q.id]: '' }));
                                                                setFormData(p => ({ ...p, [q.id]: opt }));
                                                            }}
                                                            className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl transition-all duration-300 border ${formData[q.id] === opt
                                                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 scale-105 z-10'
                                                                : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100 hover:border-slate-200'
                                                                }`}
                                                        >
                                                            <span className="text-xl font-black mb-0.5">{i + 1}</span>
                                                            <span className="text-[8px] font-bold uppercase tracking-widest opacity-80">
                                                                {i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} Year
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : q.type === 'range' ? (
                                                <div className="pt-4 flex flex-col items-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                                    <div className="text-5xl font-black text-blue-600 mb-6 tabular-nums">{formData[q.id]}</div>
                                                    <input
                                                        type="range" min={q.min} max={q.max}
                                                        name={q.id} value={formData[q.id]}
                                                        onChange={handleChange}
                                                        className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                                                    />
                                                    <div className="w-full flex justify-between mt-4 px-1 text-[10px] font-bold text-slate-400">
                                                        <span>MIN ({q.min})</span>
                                                        <span>MAX ({q.max})</span>
                                                    </div>
                                                </div>
                                            ) : q.type === 'textarea' ? (
                                                <textarea
                                                    name={q.id} value={formData[q.id]}
                                                    onChange={handleChange} placeholder="Share your thoughts..."
                                                    className={`w-full bg-slate-50 border rounded-2xl px-5 py-4 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] resize-none ${isError ? 'border-red-500 bg-red-50/30' : 'border-transparent'}`}
                                                />
                                            ) : (
                                                <input
                                                    type={q.type} name={q.id}
                                                    value={formData[q.id]} onChange={handleChange}
                                                    placeholder={q.id === 'phone' ? "Enter 10-digit number" : "Type your answer here..."}
                                                    className={`w-full bg-slate-50 border rounded-2xl px-5 py-4 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none ${isError ? 'border-red-500 bg-red-50/30' : 'border-transparent'}`}
                                                />
                                            )}

                                            {/* Error Message per field */}
                                            <AnimatePresence>
                                                {isError && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="mt-2"
                                                    >
                                                        <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest pl-1">
                                                            ⚠️ {errors[q.id]}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )
                                })}
                            </div>



                            {/* Buttons Area */}
                            <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between gap-4 sticky bottom-0 bg-white z-10 py-4">
                                {step > 0 ? (
                                    <button
                                        onClick={prevStep}
                                        className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200"
                                    >
                                        <ChevronLeft size={16} />
                                        <span>Back</span>
                                    </button>
                                ) : <div />}

                                <button
                                    onClick={nextStep}
                                    disabled={status === 'submitting'}
                                    className={`flex items-center gap-1.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm font-bold shadow-lg transition-all duration-300 ${status === 'submitting'
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                                        : 'bg-blue-600 text-white shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0'
                                        }`}
                                >
                                    <span>{status === 'submitting' ? 'Saving...' : step === pages.length - 1 ? 'Complete Survey' : 'Continue'}</span>
                                    {step < pages.length - 1 && <ChevronRight size={18} />}
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SurveyForm;
