import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Clock, User, Mail, Star, ExternalLink, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRealtime, setIsRealtime] = useState(false);

    useEffect(() => {
        fetchInitialData();

        // Subscribe to Realtime changes
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'survey_responses',
                },
                (payload) => {
                    console.log('Realtime update received:', payload);
                    setResponses((prev) => [payload.new, ...prev]);
                    setIsRealtime(true);
                    setTimeout(() => setIsRealtime(false), 3000);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('survey_responses')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (!error) {
            setResponses(data);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen w-full bg-[#0a0f1e] text-white p-4 sm:p-8 font-inter">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
                            <Database size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Survey Admin</h1>
                            <p className="text-slate-400 text-sm">Realtime Response Monitor</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${isRealtime ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                            <div className={`w-2 h-2 rounded-full ${isRealtime ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`} />
                            {isRealtime ? 'LIVE UPDATING' : 'CONNECTED'}
                        </div>
                        <button
                            onClick={fetchInitialData}
                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
                        >
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </header>

                {/* Submissions List */}
                {loading && responses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                        <RefreshCw size={48} className="animate-spin mb-4 opacity-20" />
                        <p>Loading responses...</p>
                    </div>
                ) : responses.length === 0 ? (
                    <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-12 text-center">
                        <Database size={48} className="mx-auto mb-4 text-slate-700" />
                        <h3 className="text-xl font-bold mb-2">No Responses Yet</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">Wait for students to submit the survey. New entries will appear here instantly.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {responses.map((response) => (
                                <motion.div
                                    key={response.id}
                                    layout
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="bg-slate-900/40 border border-white/5 hover:border-blue-500/30 rounded-[2rem] p-6 transition-all group backdrop-blur-sm"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-blue-400">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-200 leading-tight">{response.name || 'Anonymous'}</h3>
                                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                                    <Clock size={12} />
                                                    {new Date(response.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-yellow-500/80 bg-yellow-500/10 px-2 py-1 rounded-lg text-[10px] font-bold">
                                            <Star size={10} />
                                            {response.experience}/5
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 px-3 py-2 rounded-xl">
                                            <Mail size={14} className="opacity-50" />
                                            <span className="truncate">{response.email || 'No email provided'}</span>
                                        </div>
                                        <div className="text-xs text-slate-500 leading-relaxed px-1">
                                            <span className="text-slate-400 font-medium">Interest:</span> {response.interest || 'Not specified'}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                                            {response.year || 'Unknown Year'}
                                        </div>
                                        <button className="text-blue-500 hover:text-blue-400 transition-colors p-2 hover:bg-blue-500/10 rounded-lg">
                                            <ExternalLink size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
