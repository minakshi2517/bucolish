'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BucolishLogo from '../brand/BucolishLogo';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Cigarette,
  Dog,
  Utensils,
  PartyPopper,
  ShieldAlert,
} from 'lucide-react';

export default function QuizFlow() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [completedSummary, setCompletedSummary] = useState<string[] | null>(null);

  // Quiz State
  const [cleanlinessLevel, setCleanlinessLevel] = useState(4);
  const [choresSharing, setChoresSharing] = useState('Equal rota');
  const [cookingHabit, setCookingHabit] = useState('Sometimes');

  const [sleepSchedule, setSleepSchedule] = useState('Early bird (10pm - 6am)');
  const [workArrangement, setWorkArrangement] = useState('Hybrid');
  const [noiseTolerance, setNoiseTolerance] = useState('Moderate');

  const [guestComfort, setGuestComfort] = useState('Weekends only');
  const [partyHabit, setPartyHabit] = useState('Occasional gatherings');

  const [smokingPreference, setSmokingPreference] = useState('Strict non-smoker');
  const [drinkingHabit, setDrinkingHabit] = useState('Social drinker');
  const [petPreference, setPetPreference] = useState('Loves pets');
  const [foodPreference, setFoodPreference] = useState('Any');

  const questions = [
    {
      title: 'How tidy are you in common areas?',
      category: 'Cleanliness & Habits',
      render: () => (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm font-bold text-gray-700">
            <span>Relaxed (1)</span>
            <span className="text-purple-700 font-extrabold text-base">
              {cleanlinessLevel === 5
                ? '5 - Spotless / Spick & Span'
                : cleanlinessLevel === 4
                ? '4 - Very Clean & Tidy'
                : cleanlinessLevel === 3
                ? '3 - Moderate / Normal'
                : '1-2 - Relaxed'}
            </span>
            <span>Spick & Span (5)</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={cleanlinessLevel}
            onChange={(e) => setCleanlinessLevel(parseInt(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer h-2"
          />
          <div className="pt-2">
            <label className="block text-xs font-bold text-gray-600 mb-2">
              How should household chores be managed?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {['Maid does everything', 'Equal rota', 'DIY as needed'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setChoresSharing(opt)}
                  className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                    choresSharing === opt
                      ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'What is your regular sleep schedule?',
      category: 'Schedule & Noise',
      render: () => (
        <div className="space-y-3">
          {[
            {
              id: 'Early bird (10pm - 6am)',
              label: 'Early Bird',
              desc: 'Asleep before 11 PM, awake early morning.',
              icon: Sun,
            },
            {
              id: 'Night owl (2am - 10am)',
              label: 'Night Owl',
              desc: 'Productive late at night, sleep past 1-2 AM.',
              icon: Moon,
            },
            {
              id: 'Flexible',
              label: 'Flexible / Shift dependent',
              desc: 'Schedule changes depending on work sprints.',
              icon: Sparkles,
            },
          ].map((item) => {
            const Icon = item.icon;
            const selected = sleepSchedule === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSleepSchedule(item.id)}
                className={`w-full p-3.5 rounded-xl border text-left flex items-center gap-3.5 transition-all ${
                  selected
                    ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-sm'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    selected ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <div className="font-bold text-sm">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      ),
    },
    {
      title: 'What is your work arrangement & noise comfort?',
      category: 'Work & Environment',
      render: () => (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Work Location
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {['WFH full-time', 'Hybrid', 'Work from office'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setWorkArrangement(opt)}
                  className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                    workArrangement === opt
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Noise Tolerance at Home
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {['Quiet zone', 'Moderate', 'Lively'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setNoiseTolerance(opt)}
                  className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                    noiseTolerance === opt
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'How comfortable are you with guests and hosting?',
      category: 'Social Style',
      render: () => (
        <div className="space-y-3">
          {[
            'No overnight guests',
            'Weekends only',
            'Any time with notice',
            'Very open & frequent',
          ].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setGuestComfort(opt)}
              className={`w-full p-3.5 rounded-xl border text-left font-bold text-sm transition-all ${
                guestComfort === opt
                  ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'Values & Deal-breakers',
      category: 'Lifestyle Non-Negotiables',
      render: () => (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Smoking Preference
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Strict non-smoker', 'Balcony smoker', 'Smoker friendly'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSmokingPreference(opt)}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                    smokingPreference === opt
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Pets Preference
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Loves pets', 'No pets', 'Has a pet'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPetPreference(opt)}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                    petPreference === opt
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Food Preference
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['Vegetarian', 'Non-Veg', 'Vegan', 'Any'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFoodPreference(opt)}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                    foodPreference === opt
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleSubmitQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cleanlinessLevel,
          choresSharing,
          cookingHabit,
          sleepSchedule,
          workArrangement,
          noiseTolerance,
          guestComfort,
          partyHabit,
          smokingPreference,
          drinkingHabit,
          petPreference,
          foodPreference,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setCompletedSummary(data.summaryTags || ['Early Riser', 'Tidy', 'Non-Smoker']);
      }
    } catch (err) {
      console.error('Failed to submit quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-8 px-4">
      <div className="max-w-xl mx-auto w-full bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100">
        {/* Header with Progress Bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <BucolishLogo size="sm" showTagline={false} />
          {!completedSummary && (
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
              Question {currentIdx + 1} of {questions.length}
            </span>
          )}
        </div>

        {completedSummary ? (
          <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Sparkles size={32} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-gray-900">
                Compatibility Profile Created!
              </h2>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Bucolish will now compute live match compatibility across all 6 lifestyle pillars for each candidate in Gurugram.
              </p>
            </div>

            {/* Generated Tags */}
            <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-100">
              <div className="text-xs font-bold text-purple-900 mb-2">
                Your Lifestyle Profile Summary
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {completedSummary.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white border border-purple-200 text-purple-800 rounded-full text-xs font-bold shadow-sm"
                  >
                    • {tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => router.push('/discover')}
              className="w-full btn-primary !py-3.5 !rounded-xl text-sm justify-center"
            >
              <span>Launch Discovery Deck</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">
                {questions[currentIdx].category}
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-1">
                {questions[currentIdx].title}
              </h2>
            </div>

            {questions[currentIdx].render()}

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => i - 1)}
                className={`btn-outline text-xs ${
                  currentIdx === 0 ? 'opacity-40 pointer-events-none' : ''
                }`}
              >
                <ArrowLeft size={14} /> Back
              </button>

              {currentIdx < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIdx((i) => i + 1)}
                  className="btn-primary text-xs"
                >
                  Next <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  disabled={loading}
                  className="btn-primary text-xs"
                >
                  {loading ? 'Calculating Matches...' : 'Complete & Start Matching'}
                  <Sparkles size={14} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
