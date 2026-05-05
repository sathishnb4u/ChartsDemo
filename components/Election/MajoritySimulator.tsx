'use client';

import React, { useState, useEffect } from 'react';
import electionData from '@/data/election.json';
import { Users, CheckCircle2, AlertCircle, Plus, Minus } from 'lucide-react';

const MajoritySimulator = () => {
  const [selectedParties, setSelectedParties] = useState<string[]>([]);
  const leadParty = electionData.party_wise[0]; // TVK
  const otherParties = electionData.party_wise.slice(1);

  const toggleParty = (party: string) => {
    setSelectedParties(prev => 
      prev.includes(party) ? prev.filter(p => p !== party) : [...prev, party]
    );
  };

  const currentTotal = leadParty.total + otherParties
    .filter(p => selectedParties.includes(p.party))
    .reduce((sum, p) => sum + p.total, 0);

  const isMajority = currentTotal >= electionData.summary.majority_mark;

  return (
    <div className="glass-card p-8 h-full flex flex-col border-t-8 border-primary shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase">Coalition Builder</h3>
          <p className="text-text-muted text-sm font-medium">Select parties to reach the {electionData.summary.majority_mark} majority mark</p>
        </div>
        <div className={`flex items-center gap-2 px-6 py-2 rounded-xl font-black text-xs border-2 ${isMajority ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'} tracking-widest uppercase`}>
          {isMajority ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {isMajority ? 'Majority Reached' : 'Minority Status'}
        </div>
      </div>

      <div className="flex-1 space-y-6">
        {/* Majority Party (Lead) */}
        <div className="p-6 rounded-3xl bg-surface border-2 border-primary/20 flex items-center justify-between shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
          <div className="flex items-center gap-6">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg transition-transform group-hover:scale-110"
              style={{ backgroundColor: leadParty.color }}
            >
              {leadParty.party}
            </div>
            <div>
              <p className="font-black text-2xl text-foreground tracking-tight">{leadParty.fullName}</p>
              <p className="text-xs text-primary font-black uppercase tracking-[0.2em] mt-1">Lead Party (Baseline)</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black text-foreground">{leadParty.total}</p>
            <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Seats</p>
          </div>
        </div>

        {/* Selection List */}
        <div className="space-y-4 max-h-[320px] overflow-y-auto pr-4 custom-scrollbar">
          {otherParties.map((p) => {
            const isSelected = selectedParties.includes(p.party);
            return (
              <button
                key={p.party}
                onClick={() => toggleParty(p.party)}
                className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between group relative ${
                  isSelected 
                    ? 'bg-primary border-primary shadow-lg shadow-primary/30 scale-[1.01] z-10' 
                    : 'bg-white border-border hover:border-primary/40 hover:bg-surface-hover shadow-sm'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white transition-all shadow-md group-active:scale-95"
                    style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : p.color }}
                  >
                    {isSelected ? <CheckCircle2 size={24} /> : p.party.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className={`font-black text-lg tracking-tight transition-colors ${isSelected ? 'text-white' : 'text-foreground'}`}>
                      {p.party}
                    </p>
                    <p className={`text-xs font-bold truncate max-w-[200px] transition-colors ${isSelected ? 'text-white-muted' : 'text-text-muted'}`}>{p.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className={`text-2xl font-black transition-colors ${isSelected ? 'text-white' : 'text-foreground'}`}>
                      +{p.total}
                    </p>
                  </div>
                  <div className={`p-2 rounded-xl border-2 transition-all shadow-sm ${isSelected ? 'bg-white text-primary border-white' : 'bg-background border-border text-text-muted'}`}>
                    {isSelected ? <Minus size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-8 pt-8 border-t-2 border-border">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-xs text-text-muted font-black uppercase tracking-[0.2em] mb-2">Coalition Strength</p>
            <h4 className="text-6xl font-black text-foreground leading-none">
              {currentTotal} <span className="text-xl font-bold text-text-muted">/ 234</span>
            </h4>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mb-2">Target: {electionData.summary.majority_mark}</p>
            <p className={`text-lg font-black ${isMajority ? 'text-success' : 'text-danger'} tracking-tight`}>
              {isMajority ? `+${currentTotal - electionData.summary.majority_mark} Surplus Seats` : `${electionData.summary.majority_mark - currentTotal} Seats to Majority`}
            </p>
          </div>
        </div>
        <div className="h-6 bg-track rounded-full overflow-hidden border-2 border-border p-1 shadow-inner relative">
          <div 
            className={`h-full rounded-full transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) relative ${isMajority ? 'bg-gradient-to-r from-primary via-secondary to-success shadow-lg' : 'bg-gradient-to-r from-primary to-secondary shadow-lg'}`}
            style={{ width: `${(currentTotal / 234) * 100}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
          </div>
          {/* Majority Threshold Marker */}
          <div 
            className="absolute top-0 bottom-0 w-1.5 bg-slate-400 z-10" 
            style={{ left: `${(electionData.summary.majority_mark / 234) * 100}%` }}
          >
            <div className="absolute -top-1 -left-1.5 w-4 h-4 bg-slate-400 rotate-45"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MajoritySimulator;
