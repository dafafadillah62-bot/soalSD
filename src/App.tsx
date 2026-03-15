import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Calculator, 
  Globe, 
  Beaker, 
  ChevronRight, 
  RotateCcw, 
  Trophy, 
  CheckCircle2, 
  XCircle,
  Sparkles,
  Loader2,
  ArrowLeft,
  Settings,
  Save
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Subject, Question, QuizState } from './types';
import { SUBJECTS, QUESTIONS } from './constants';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export default function App() {
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [userApiKey, setUserApiKey] = useState<string>(() => localStorage.getItem('GEMINI_API_KEY') || "");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(userApiKey);

  useEffect(() => {
    const activeKey = userApiKey || process.env.GEMINI_API_KEY;
    if (!activeKey || activeKey === "MY_GEMINI_API_KEY") {
      setApiKeyMissing(true);
    } else {
      setApiKeyMissing(false);
    }
  }, [userApiKey]);

  const saveApiKey = () => {
    localStorage.setItem('GEMINI_API_KEY', tempApiKey);
    setUserApiKey(tempApiKey);
    setIsSettingsOpen(false);
  };

  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    isFinished: false,
    answers: [],
    selectedSubject: null,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const startQuiz = (subject: Subject) => {
    setState({
      currentQuestionIndex: 0,
      score: 0,
      isFinished: false,
      answers: [],
      selectedSubject: subject,
    });
    setQuestions(QUESTIONS[subject]);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const generateMoreQuestions = async () => {
    if (!state.selectedSubject) return;
    setIsGenerating(true);
    try {
      const activeKey = userApiKey || process.env.GEMINI_API_KEY || "";
      const customAi = new GoogleGenAI({ apiKey: activeKey });
      
      const prompt = `Generate 3 multiple choice questions for elementary school students (SD) in Indonesia about ${state.selectedSubject}. 
      Return the result as a JSON array of objects with the following structure:
      {
        "id": "string",
        "text": "string",
        "options": ["string", "string", "string", "string"],
        "correctAnswer": number (0-3),
        "explanation": "string"
      }
      Make sure the language is simple and suitable for children.`;

      const response = await customAi.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const newQuestions = JSON.parse(response.text || "[]");
      setQuestions(prev => [...prev, ...newQuestions]);
    } catch (error) {
      console.error("Error generating questions:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === questions[state.currentQuestionIndex].correctAnswer;
    
    if (isCorrect) {
      setState(prev => ({ ...prev, score: prev.score + 1 }));
    }
    
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (state.currentQuestionIndex < questions.length - 1) {
      setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setState(prev => ({ ...prev, isFinished: true }));
    }
  };

  const resetQuiz = () => {
    setState({
      currentQuestionIndex: 0,
      score: 0,
      isFinished: false,
      answers: [],
      selectedSubject: null,
    });
    setQuestions([]);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const getSubjectIcon = (subject: Subject) => {
    switch (subject) {
      case 'Matematika': return <Calculator className="w-8 h-8" />;
      case 'IPA': return <Beaker className="w-8 h-8" />;
      case 'Bahasa Indonesia': return <BookOpen className="w-8 h-8" />;
      case 'IPS': return <Globe className="w-8 h-8" />;
    }
  };

  const getSubjectColor = (subject: Subject) => {
    switch (subject) {
      case 'Matematika': return 'bg-blue-500';
      case 'IPA': return 'bg-green-500';
      case 'Bahasa Indonesia': return 'bg-orange-500';
      case 'IPS': return 'bg-purple-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#2D2D2D] font-sans selection:bg-orange-200 pb-safe pt-safe">
      {apiKeyMissing && (
        <div className="bg-red-500 text-white p-2 text-center text-sm font-bold sticky top-0 z-50 flex items-center justify-center gap-2">
          ⚠️ API Key Gemini belum dikonfigurasi. 
          <button onClick={() => setIsSettingsOpen(true)} className="underline hover:text-white/80">Klik di sini untuk mengatur.</button>
        </div>
      )}
      
      <div className="fixed top-4 right-4 z-40">
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white p-8 rounded-[32px] border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-md w-full space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black">Pengaturan API</h2>
                <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-black">
                  <XCircle className="w-8 h-8" />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Masukkan API Key Gemini Anda untuk menggunakan fitur "Tambah Soal". Kunci ini akan disimpan secara lokal di browser Anda.
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider">Gemini API Key</label>
                  <input 
                    type="password"
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="Masukkan API Key..."
                    className="w-full p-4 bg-gray-50 border-2 border-black rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <p className="text-[10px] text-gray-400 italic">
                  Dapatkan API Key gratis di <a href="https://aistudio.google.com/app/apikey" target="_blank" className="underline">Google AI Studio</a>.
                </p>
              </div>

              <button 
                onClick={saveApiKey}
                className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold text-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <Save className="w-6 h-6" /> Simpan Perubahan
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto px-4 py-8 md:py-16">
        
        <AnimatePresence mode="wait">
          {!state.selectedSubject ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <motion.h1 
                  className="text-5xl md:text-7xl font-black tracking-tighter text-[#1A1A1A]"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  KUIS <span className="text-orange-500 italic">PINTAR</span> SD
                </motion.h1>
                <p className="text-xl text-gray-600 font-medium">Pilih mata pelajaran untuk mulai belajar!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SUBJECTS.map((subject) => (
                  <motion.button
                    key={subject}
                    whileHover={{ scale: 1.02, rotate: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startQuiz(subject)}
                    className={`p-6 rounded-3xl flex items-center gap-6 text-left transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.15)] border-2 border-black ${getSubjectColor(subject)} text-white`}
                  >
                    <div className="bg-white/20 p-3 rounded-2xl">
                      {getSubjectIcon(subject)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{subject}</h3>
                      <p className="text-white/80 text-sm">Klik untuk mulai kuis</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : state.isFinished ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8 bg-white p-12 rounded-[40px] border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="inline-block p-6 bg-yellow-400 rounded-full border-4 border-black animate-bounce">
                <Trophy className="w-16 h-16 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-black">Luar Biasa!</h2>
                <p className="text-xl text-gray-600">Kamu telah menyelesaikan kuis {state.selectedSubject}</p>
              </div>
              
              <div className="text-7xl font-black text-orange-500">
                {Math.round((state.score / questions.length) * 100)}%
              </div>
              
              <div className="text-2xl font-bold">
                Skor: {state.score} / {questions.length}
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => startQuiz(state.selectedSubject!)}
                  className="w-full py-4 bg-black text-white rounded-2xl font-bold text-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  <RotateCcw className="w-6 h-6" /> Coba Lagi
                </button>
                <button
                  onClick={resetQuiz}
                  className="w-full py-4 bg-white text-black border-2 border-black rounded-2xl font-bold text-xl hover:bg-gray-50 transition-colors"
                >
                  Pilih Pelajaran Lain
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <button 
                  onClick={resetQuiz}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2 bg-black text-white px-4 py-1 rounded-full font-bold text-sm">
                  {state.selectedSubject}
                </div>
                <div className="font-bold text-gray-500">
                  {state.currentQuestionIndex + 1} / {questions.length}
                </div>
              </div>

              <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden border-2 border-black">
                <motion.div 
                  className="h-full bg-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((state.currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              <div className="bg-white p-8 rounded-[32px] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-8">
                <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                  {questions[state.currentQuestionIndex]?.text}
                </h2>

                <div className="grid gap-4">
                  {questions[state.currentQuestionIndex]?.options.map((option, index) => (
                    <button
                      key={index}
                      disabled={selectedOption !== null}
                      onClick={() => handleAnswer(index)}
                      className={`
                        p-5 rounded-2xl text-left text-lg font-bold transition-all border-2 border-black
                        ${selectedOption === null 
                          ? 'bg-white hover:bg-gray-50 hover:translate-x-1' 
                          : index === questions[state.currentQuestionIndex].correctAnswer
                            ? 'bg-green-400 text-white'
                            : selectedOption === index
                              ? 'bg-red-400 text-white'
                              : 'bg-gray-100 opacity-50'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {selectedOption !== null && index === questions[state.currentQuestionIndex].correctAnswer && (
                          <CheckCircle2 className="w-6 h-6" />
                        )}
                        {selectedOption === index && index !== questions[state.currentQuestionIndex].correctAnswer && (
                          <XCircle className="w-6 h-6" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-6 bg-yellow-50 rounded-2xl border-2 border-yellow-200 space-y-2"
                    >
                      <p className="font-bold text-yellow-800 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" /> Penjelasan:
                      </p>
                      <p className="text-yellow-900">
                        {questions[state.currentQuestionIndex].explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={nextQuestion}
                    disabled={selectedOption === null}
                    className={`
                      flex-1 py-4 rounded-2xl font-bold text-xl flex items-center justify-center gap-2 transition-all
                      ${selectedOption === null 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-black text-white hover:bg-gray-800'
                      }
                    `}
                  >
                    {state.currentQuestionIndex === questions.length - 1 ? 'Selesai' : 'Lanjut'} <ChevronRight className="w-6 h-6" />
                  </button>
                  
                  {state.currentQuestionIndex === questions.length - 1 && (
                    <button
                      onClick={generateMoreQuestions}
                      disabled={isGenerating}
                      className="px-6 py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                      Tambah Soal
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
