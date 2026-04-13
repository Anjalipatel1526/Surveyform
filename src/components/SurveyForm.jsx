import React, { useState } from 'react';
import heroImage from '../assets/hero.png';

const SurveyForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        dob: '',
        phone: '',
        college: '',
        department: '',
        year: '',
        linkedin: '',
        portfolio: '',
        experience: '5',
        relevance: '5',
        satisfaction: '5',
        recommend: 'Yes',
        valuable_learned: '',
        improvement_suggestions: ''
    });

    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        // Replace with your actual Google Apps Script Web App URL
        const GAS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

        try {
            if (GAS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
                alert('Please configure the Google Apps Script URL in SurveyForm.jsx');
                setStatus('idle');
                return;
            }

            const response = await fetch(GAS_URL, {
                method: 'POST',
                mode: 'no-cors', // Important for GAS
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            setStatus('success');
            alert('Thank you! Your survey response has been recorded.');
            setFormData({
                name: '', email: '', dob: '', phone: '', college: '', department: '', year: '',
                linkedin: '', portfolio: '',
                experience: '5', relevance: '5', satisfaction: '5', recommend: 'Yes',
                valuable_learned: '', improvement_suggestions: ''
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="relative h-48 bg-indigo-600 overflow-hidden">
                    <img
                        src={heroImage}
                        alt="AI Workshop"
                        className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-8 text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-lg">AI Workshop Student Survey</h1>
                        <p className="mt-2 text-indigo-50 font-medium italic drop-shadow-md">Engineering Student Information & Feedback</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Section: Basic Information */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-900 border-b pb-2 mb-6">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                                <input
                                    required
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                <input
                                    required
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="+91 12345 67890"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn Profile (Optional)</label>
                                <input
                                    type="url"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Portfolio Link (Optional)</label>
                                <input
                                    type="url"
                                    name="portfolio"
                                    value={formData.portfolio}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="https://portfolio.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">College Name</label>
                                <input
                                    required
                                    type="text"
                                    name="college"
                                    value={formData.college}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Engineering College"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                                <input
                                    required
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Computer Science"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Year of Study</label>
                                <select
                                    required
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                >
                                    <option value="">Select Year</option>
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Section: Survey Questions */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-900 border-b pb-2 mb-6">AI Workshop Feedback</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">How would you rate your overall experience with the AI workshop? (1-5)</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="1"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                                <div className="flex justify-between text-xs text-slate-500 mt-1 px-1">
                                    <span>1 (Poor)</span>
                                    <span>2</span>
                                    <span>3</span>
                                    <span>4</span>
                                    <span>5 (Excellent)</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">How relevant was the workshop content to your engineering curriculum? (1-5)</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="1"
                                    name="relevance"
                                    value={formData.relevance}
                                    onChange={handleChange}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                                <div className="flex justify-between text-xs text-slate-500 mt-1 px-1">
                                    <span>1 (Irrelevant)</span>
                                    <span>5 (Very Relevant)</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Rate your satisfaction with the hands-on sessions & instructors (1-5)</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="1"
                                    name="satisfaction"
                                    value={formData.satisfaction}
                                    onChange={handleChange}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3">Would you recommend this workshop to your peers?</label>
                                <div className="flex space-x-6">
                                    {['Yes', 'No'].map(option => (
                                        <label key={option} className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="recommend"
                                                value={option}
                                                checked={formData.recommend === option}
                                                onChange={handleChange}
                                                className="w-4 h-4 text-indigo-600 bg-slate-100 border-slate-300 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-sm text-slate-700">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">What was the most valuable thing you learned?</label>
                                <textarea
                                    name="valuable_learned"
                                    value={formData.valuable_learned}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Share your key takeaways..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Any suggestions for future workshops?</label>
                                <textarea
                                    name="improvement_suggestions"
                                    value={formData.improvement_suggestions}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="How can we do better?"
                                ></textarea>
                            </div>
                        </div>
                    </section>

                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all active:scale-95 ${status === 'submitting'
                            ? 'bg-indigo-300 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-500/30'
                            }`}
                    >
                        {status === 'submitting' ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </span>
                        ) : 'Submit Survey Response'}
                    </button>
                </form>
            </div>
            <footer className="max-w-3xl mx-auto mt-8 text-center text-slate-400 text-sm">
                &copy; 2026 AI Workshop | Designed for Engineering Excellence
            </footer>
        </div>
    );
};

export default SurveyForm;
