import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Database, Clock, User, Mail, Star, ExternalLink,
    RefreshCw, Users, BarChart3, List, ChevronRight,
    Search, Filter, Download
} from 'lucide-react';

const AdminDashboard = () => {
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // overview, analytics, students
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchInitialData();

        const channel = supabase
            .channel('admin-updates')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'survey_responses' },
                (payload) => {
                    setResponses((prev) => [payload.new, ...prev]);
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('survey_responses')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setResponses(data);
        setLoading(false);
    };

    // Analytics Helpers
    const getAnalytics = () => {
        if (responses.length === 0) return null;

        const interests = {};
        const years = {};
        let avgExperience = 0;

        responses.forEach(r => {
            interests[r.interest] = (interests[r.interest] || 0) + 1;
            years[r.year] = (years[r.year] || 0) + 1;
            avgExperience += (r.experience || 0);
        });

        return {
            total: responses.length,
            interests: Object.entries(interests).sort((a, b) => b[1] - a[1]),
            years: Object.entries(years).sort((a, b) => b[1] - a[1]),
            avgExperience: (avgExperience / responses.length).toFixed(1)
        };
    };

    const stats = getAnalytics();
    const filteredResponses = responses.filter(r =>
    (r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) return (
        <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
            <RefreshCw className="text-blue-500 animate-spin" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0f1e] text-white font-inter">
            {/* Sidebar / Navigation */}
            <div className="flex flex-col lg:flex-row min-h-screen">
                <aside className="w-full lg:w-64 bg-slate-900/50 border-r border-white/5 p-6 space-y-8">
                    <div className="flex items-center gap-3 px-2">
                        <div className="bg-blue-600 p-2 rounded-xl">
                            <Database size={20} />
                        </div>
                        <span className="font-bold text-lg tracking-tight">Admin Console</span>
                    </div>

                    <nav className="space-y-2">
                        {[
                            { id: 'overview', icon: BarChart3, label: 'Overview' },
                            { id: 'analytics', icon: Users, label: 'User Analysis' },
                            { id: 'students', icon: List, label: 'Detailed Data' }
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${activeTab === item.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon size={18} />
                                <span className="font-medium text-sm">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                        <div>
                            <h2 className="text-3xl font-bold capitalize">{activeTab} Dashboard</h2>
                            <p className="text-slate-500 text-sm mt-1">Monitoring {responses.length} total student submissions</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={fetchInitialData} className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all">
                                <RefreshCw size={20} />
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm transition-all">
                                <Download size={18} />
                                Export CSV
                            </button>
                        </div>
                    </div>

                    {/* Overview Tab */}
                    {activeTab === 'overview' && stats && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Total Students', value: stats.total, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                                    { label: 'Avg experience', value: stats.avgExperience, icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                                    { label: 'Top Interest', value: stats.interests[0]?.[0] || 'N/A', icon: Star, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                                    { label: 'Active Sessions', value: '1', icon: Clock, color: 'text-green-400', bg: 'bg-green-400/10' }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem]">
                                        <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                                            <stat.icon size={20} />
                                        </div>
                                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</h3>
                                        <p className="text-2xl font-bold mt-1 truncate">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem]">
                                    <h3 className="font-bold mb-6 flex items-center gap-2">
                                        <BarChart3 size={18} className="text-blue-500" />
                                        Interest Distribution
                                    </h3>
                                    <div className="space-y-4">
                                        {stats.interests.map(([name, count]) => (
                                            <div key={name} className="space-y-2">
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span className="text-slate-300">{name}</span>
                                                    <span className="text-blue-400">{count}</span>
                                                </div>
                                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(count / stats.total) * 100}%` }}
                                                        className="h-full bg-blue-600 rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem]">
                                    <h3 className="font-bold mb-6 flex items-center gap-2">
                                        <Database size={18} className="text-purple-500" />
                                        Year Analysis
                                    </h3>
                                    <div className="space-y-4">
                                        {stats.years.map(([name, count]) => (
                                            <div key={name} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-transparent hover:border-white/5">
                                                <span className="font-bold text-sm">{name}</span>
                                                <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-bold">{count} responses</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === 'analytics' && stats && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem]">
                                    <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">AI Familiarity</h4>
                                    <div className="text-2xl font-bold text-blue-400">
                                        {((responses.filter(r => r.ai_understanding === 'Yes').length / Math.max(responses.length, 1)) * 100).toFixed(0)}%
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">understand AI basics</p>
                                </div>
                                <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem]">
                                    <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Prompt Awareness</h4>
                                    <div className="text-2xl font-bold text-purple-400">
                                        {((responses.filter(r => r.ai_prompt_engineering_awareness === 'Yes').length / Math.max(responses.length, 1)) * 100).toFixed(0)}%
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">aware of prompt eng.</p>
                                </div>
                                <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem]">
                                    <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Confidence Avg</h4>
                                    <div className="text-2xl font-bold text-green-400">
                                        {(responses.reduce((acc, r) => acc + parseInt(r.ai_confidence || 0), 0) / Math.max(responses.length, 1)).toFixed(1)}/5
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">student confidence</p>
                                </div>
                            </div>

                            <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem]">
                                <h3 className="font-bold mb-8 flex items-center gap-2 text-xl">
                                    <BarChart3 size={20} className="text-blue-500" />
                                    AI Readiness Analysis
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <h4 className="text-sm font-bold text-slate-200 border-l-2 border-blue-600 pl-3">Career Impact Outlook</h4>
                                        <div className="space-y-4">
                                            {['Optimistic', 'Concerned', 'Neutral'].map(opinion => {
                                                const count = responses.filter(r => r.ai_career_impact?.includes(opinion)).length;
                                                const percentage = ((count / Math.max(responses.length, 1)) * 100).toFixed(0);
                                                return (
                                                    <div key={opinion} className="space-y-2">
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-slate-400">{opinion}</span>
                                                            <span className="text-blue-400 font-bold">{percentage}%</span>
                                                        </div>
                                                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${percentage}%` }}
                                                                className="h-full bg-blue-500 rounded-full"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="text-sm font-bold text-slate-200 border-l-2 border-purple-600 pl-3">Top AI Tools Mentioned</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {Array.from(new Set(responses.flatMap(r => r.ai_tools_familiar?.split(',').map(s => s.trim())))).filter(Boolean).slice(0, 10).map(tool => (
                                                <div key={tool} className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold rounded-2xl">
                                                    {tool}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Students Tab - Detailed Table */}
                    {activeTab === 'students' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900/40 p-6 rounded-[2rem] border border-white/5">
                                <div className="relative w-full sm:w-96">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-slate-800/50 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                    />
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 rounded-xl border border-slate-700 text-sm font-medium">
                                        <Filter size={16} /> Filter
                                    </button>
                                </div>
                            </div>

                            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                                <th className="px-8 py-6">Student</th>
                                                <th className="px-6 py-6">Academic Info</th>
                                                <th className="px-6 py-6 font-medium">Interest</th>
                                                <th className="px-6 py-6">Contact</th>
                                                <th className="px-6 py-6">Rating</th>
                                                <th className="px-8 py-6 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredResponses.map((res) => (
                                                <tr key={res.id} className="hover:bg-white/[0.02] transition-colors group">
                                                    <td className="px-8 py-6 text-sm">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold">
                                                                {res.name?.charAt(0) || '?'}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-200">{res.name}</p>
                                                                <p className="text-xs text-slate-500 line-clamp-1">{res.college || 'No college data'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 text-xs text-slate-400">
                                                        <p className="font-medium text-slate-300">{res.department}</p>
                                                        <p className="mt-1">{res.year}</p>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/20">
                                                            {res.interest}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-6 text-xs text-slate-400">
                                                        <p>{res.email}</p>
                                                        <p className="mt-1">{res.phone}</p>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                                                            <Star size={14} fill="currentColor" />
                                                            {res.experience}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg transition-all text-slate-400">
                                                            <ExternalLink size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
