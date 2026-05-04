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
    <div className="glass-card p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Coalition Builder</h3>
          <p className="text-text-muted text-sm">Select parties to form a government (118 needed)</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm border ${isMajority ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
          {isMajority ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {isMajority ? 'MAJORITY REACHED' : 'MINORITY STATUS'}
        </div>
      </div>

      <div className="flex-1 space-y-6">
        {/* Majority Party (Lead) */}
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-background font-bold text-lg shadow-lg shadow-primary/20">
              {leadParty.party}
            </div>
            <div>
              <p className="font-bold text-lg">{leadParty.fullName}</p>
              <p className="text-xs text-text-muted uppercase tracking-widest">Lead Party (Baseline)</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-primary">{leadParty.total}</p>
            <p className="text-[10px] text-text-muted">SEATS</p>
          </div>
        </div>

        {/* Selection List */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {otherParties.map((p) => {
            const isSelected = selectedParties.includes(p.party);
            return (
              <button
                key={p.party}
                onClick={() => toggleParty(p.party)}
                className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between group ${
                  isSelected 
                    ? 'bg-surface border-secondary shadow-lg scale-[1.02]' 
                    : 'bg-surface/30 border-border/50 hover:border-border hover:bg-surface/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-background transition-transform group-active:scale-95"
                    style={{ backgroundColor: isSelected ? '#7042ff' : '#2d3748' }}
                  >
                    {isSelected ? <CheckCircle2 size={20} /> : p.party.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className={`font-bold transition-colors ${isSelected ? 'text-secondary' : 'text-foreground'}`}>
                      {p.party}
                    </p>
                    <p className="text-[10px] text-text-muted truncate max-w-[150px]">{p.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-lg font-bold transition-colors ${isSelected ? 'text-secondary' : 'text-text-muted'}`}>
                      +{p.total}
                    </p>
                  </div>
                  <div className={`p-1.5 rounded-lg border transition-colors ${isSelected ? 'bg-secondary/10 border-secondary/20 text-secondary' : 'border-border text-text-muted'}`}>
                    {isSelected ? <Minus size={14} /> : <Plus size={14} />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-8 pt-8 border-t border-border">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-sm text-text-muted font-medium">Coalition Strength</p>
            <h4 className="text-4xl font-black text-foreground">
              {currentTotal} <span className="text-lg font-normal text-text-muted">/ 234</span>
            </h4>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-muted uppercase font-bold mb-1">Target: 118</p>
            <p className={`text-sm font-black ${isMajority ? 'text-success' : 'text-danger'}`}>
              {isMajority ? `+${currentTotal - 118} Surplus` : `${118 - currentTotal} Needed`}
            </p>
          </div>
        </div>
        <div className="h-4 bg-surface rounded-full overflow-hidden border border-border p-0.5 shadow-inner">
          <div 
            className={`h-full rounded-full transition-all duration-700 ease-out relative ${isMajority ? 'bg-gradient-to-r from-primary to-success shadow-[0_0_15px_rgba(0,212,255,0.5)]' : 'bg-gradient-to-r from-primary to-secondary shadow-[0_0_15px_rgba(112,66,255,0.5)]'}`}
            style={{ width: `${(currentTotal / 234) * 100}%` }}
          >
            {/* Majority Mark */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white/50 backdrop-blur-sm z-10 shadow-[0_0_10px_white]" 
              style={{ left: `${(118 / currentTotal) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MajoritySimulator;
