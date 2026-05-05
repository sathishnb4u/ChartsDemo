'use client';

import React from 'react';
import { Activity, Shield, Map as MapIcon, BarChart3, Database, Search, Settings, Droplets, Users, Zap, RefreshCw } from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const items = [
    { id: 'surveillance', icon: <Activity size={20} />, label: 'Surveillance' },
    { id: 'geospatial', icon: <MapIcon size={20} />, label: 'Geospatial' },
    { id: 'environmental', icon: <Droplets size={20} />, label: 'Environmental' },
    { id: 'public-health', icon: <Users size={20} />, label: 'Public Health' },
    { id: 'analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { id: 'labkey', icon: <Database size={20} />, label: 'Lab Metrics' },
    { id: 'election', icon: <Zap size={20} />, label: 'TN Election 2026' },
    { id: 'about', icon: <Shield size={20} />, label: 'About Portal' },
  ];

  return (
    <aside className="w-64 border-r border-border p-6 flex flex-col h-screen sticky top-0 bg-white">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,212,255,0.5)]">
          <Shield className="text-background" size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tighter">LUNGFISH</h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {items.map((item) => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-primary/5 text-primary border border-primary/20 shadow-sm' : 'text-text-muted hover:bg-surface-hover hover:text-foreground'}`}
          >
            {item.icon}
            <span className="font-semibold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-border space-y-4">
        <div className="flex items-center gap-3 text-text-muted hover:text-foreground cursor-pointer">
          <Settings size={20} />
          <span className="text-sm font-medium">Settings</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-border">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">SN</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">Sathish N.</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Developer</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export const Header = () => {
  return (
    <header className="h-20 border-b border-border px-8 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search by county, pathogen, or variant..." 
            className="w-full bg-white border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <p className="text-xs text-text-muted">Last Updated</p>
          <p className="text-sm font-mono text-success font-bold">MAY 02, 2026 - 14:21 CST</p>
        </div>
        <div className="w-px h-8 bg-border mx-2"></div>
        <button 
          onClick={() => alert('Refreshing data from external sources...')}
          className="flex items-center gap-2 bg-primary text-background font-bold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 group"
        >
          <RefreshCw size={16} className="group-active:rotate-180 transition-transform duration-500" />
          Refresh Data
        </button>
        <button className="bg-primary text-background font-bold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          Export Report
        </button>
      </div>
    </header>
  );
};
