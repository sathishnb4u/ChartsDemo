'use client';

import React, { useState } from 'react';
import { Sidebar, Header } from '@/components/Layout/DashboardShell';
import PathogenChart from '@/components/Charts/PathogenChart';
import VariantEvolution from '@/components/Charts/VariantEvolution';
import PathogenHeatmap from '@/components/Charts/PathogenHeatmap';
import PathogenCorrelation from '@/components/Charts/PathogenCorrelation';
import PathogenRadar from '@/components/Charts/PathogenRadar';
import PipelineFunnel from '@/components/Charts/PipelineFunnel';
import AQICandlestick from '@/components/Charts/AQICandlestick';
import DataFlowSankey from '@/components/Charts/DataFlowSankey';
import SourceTreemap from '@/components/Charts/SourceTreemap';
import { TrendingUp, Users, Droplets, FlaskConical, Cpu, Layers, BarChart3, Activity, Microscope, Info, Terminal, Database, Palette, Zap, RefreshCw, Vote, Trophy, Gavel, Map as MapIcon } from 'lucide-react';
import surveillanceData from '@/data/surveillance.json';
import electionData from '@/data/election.json';

// Election Components
import MajoritySimulator from '@/components/Election/MajoritySimulator';
import { VoteShareChart, PartyDominationChart } from '@/components/Election/ElectionSummaryCharts';
import { AgeVoterDistribution, AgeGroupPartyShare } from '@/components/Election/AgeAnalysisCharts';
import RegionalHeatmap from '@/components/Election/RegionalHeatmap';
import ConstituencyMap from '@/components/Election/ConstituencyMap';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, trend, icon, color }: StatCardProps) => (
  <div className="glass-card p-6 flex items-start justify-between">
    <div>
      <p className="text-text-muted text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold mb-2">{value}</h3>
      <div className={`flex items-center gap-1 text-xs font-bold ${trend.startsWith('+') ? 'text-danger' : 'text-success'}`}>
        {trend} vs last week
      </div>
    </div>
    <div className={`p-3 rounded-xl bg-opacity-10`} style={{ backgroundColor: color + '22', color: color }}>
      {icon}
    </div>
  </div>
);

const TechBadge = ({ tech }: { tech: 'D3' | 'ECharts' }) => (
  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold border ${tech === 'D3' ? 'border-secondary/30 text-secondary bg-secondary/5' : 'border-primary/30 text-primary bg-primary/5'}`}>
    {tech === 'D3' ? <Cpu size={12} /> : <Layers size={12} />}
    ENGINE: {tech}
  </div>
);

export default function Home() {
  const [activeTab, setActiveTab] = useState('surveillance');
  const [selectedPathogen, setSelectedPathogen] = useState<string | null>(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'surveillance':
        return (
          <>
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard title="Avg. SARS-CoV-2 Load" value="1,420 c/L" trend="+12.4%" icon={<Droplets size={24} />} color="#00d4ff" />
              <StatCard title="Active Variants" value="4 Major" trend="-5.1%" icon={<FlaskConical size={24} />} color="#7042ff" />
              <StatCard title="Population At Risk" value="5.8M" trend="+0.0%" icon={<Users size={24} />} color="#ffb800" />
              <StatCard title="Positivity Rate" value="18.2%" trend="+2.3%" icon={<TrendingUp size={24} />} color="#ff42b3" />
            </div>
            <div className="col-span-12 lg:col-span-8">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2"><Activity className="text-primary" size={20} /><h2 className="text-xl font-bold">Pathogen Surveillance</h2></div>
                <TechBadge tech="ECharts" />
              </div>
              <PathogenChart selectedPathogen={selectedPathogen} onPathogenSelect={setSelectedPathogen} />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <div className="glass-card p-6 h-full">
                <h3 className="text-lg font-bold mb-4">Regional Alert Status</h3>
                <div className="space-y-4">
                  {surveillanceData.geo.slice(0, 6).map((region, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface-hover border border-soft">
                      <div><p className="text-sm font-bold">{region.county} County</p><p className="text-[10px] text-text-muted uppercase tracking-wider">{region.trend} TREND</p></div>
                      <span className={`badge ${region.viral_level === 'High' ? 'badge-danger' : 'badge-success'}`}>{region.viral_level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
      case 'environmental':
        return (
          <div className="col-span-12 grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-6">
               <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Air Quality Trends (Madison)</h2><TechBadge tech="ECharts" /></div>
               <AQICandlestick />
            </div>
            <div className="col-span-12 lg:col-span-6">
               <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Detection Density Matrix</h2><TechBadge tech="ECharts" /></div>
               <PathogenHeatmap />
            </div>
            <div className="col-span-12">
               <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Hierarchical Source Distribution</h2><TechBadge tech="D3" /></div>
               <SourceTreemap />
            </div>
          </div>
        );
      case 'public-health':
        return (
          <div className="col-span-12 grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8">
               <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Variant Evolution</h2><TechBadge tech="D3" /></div>
               <VariantEvolution />
            </div>
            <div className="col-span-12 lg:col-span-4">
               <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Pathogen Profile</h2><TechBadge tech="ECharts" /></div>
               <PathogenRadar selectedPathogen={selectedPathogen} />
            </div>
            <div className="col-span-12">
               <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Wastewater vs Clinical Correlation</h2><TechBadge tech="D3" /></div>
               <PathogenCorrelation />
            </div>
          </div>
        );
      case 'labkey':
        return (
          <div className="col-span-12 grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-5">
               <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Pipeline Throughput</h2><TechBadge tech="ECharts" /></div>
               <PipelineFunnel />
            </div>
            <div className="col-span-12 lg:col-span-7">
               <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Internal Data Flow</h2><TechBadge tech="ECharts" /></div>
               <DataFlowSankey />
            </div>
            <div className="col-span-12 glass-card p-12 text-center flex flex-col items-center gap-6">
              <Microscope size={48} className="text-primary" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Lab Performance Metrics</h2>
                <p className="text-text-muted max-w-xl mx-auto">Tracking sequencing turnaround time, sample quality passing rates, and multi-lab synchronization status.</p>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="col-span-12 flex flex-col gap-8">
            <div className="glass-card p-12 text-center flex flex-col items-center gap-6">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center"><BarChart3 size={32} /></div>
              <div><h2 className="text-3xl font-bold mb-2">Cross-Domain Data Synthesis</h2><p className="text-text-muted max-w-xl mx-auto">Integrating environmental, genomic, and clinical datasets for holistic public health intelligence.</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PathogenCorrelation />
              <PathogenRadar selectedPathogen={selectedPathogen} />
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="col-span-12 flex flex-col gap-8">
            <div className="glass-card p-12 text-center flex flex-col items-center gap-6">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-background shadow-lg shadow-primary/20"><Info size={32} /></div>
              <div>
                <h2 className="text-3xl font-bold mb-2">About Lungfish Portal</h2>
                <p className="text-text-muted max-w-2xl mx-auto">A state-of-the-art surveillance platform designed for the O&apos;Connor Lab to monitor environmental pathogens and laboratory throughput.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Terminal className="text-primary" size={24} />
                  <h3 className="text-xl font-bold">Technical Architecture</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-primary mb-2 flex items-center gap-2"><Layers size={16} /> Visualization Engines</h4>
                    <p className="text-sm text-text-muted">Dual-engine strategy using <strong>D3.js</strong> for bespoke mathematical SVGs and <strong>Apache ECharts</strong> for high-density canvas-based dashboards.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary mb-2 flex items-center gap-2"><Cpu size={16} /> Framework & State</h4>
                    <p className="text-sm text-text-muted">Built with <strong>Next.js 15+</strong> (App Router) and <strong>TypeScript</strong>. State is managed via React Hooks with strict type safety for scientific data models.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary mb-2 flex items-center gap-2"><Palette size={16} /> UI/UX Philosophy</h4>
                    <p className="text-sm text-text-muted">Modern <strong>Glassmorphism</strong> design system using vanilla CSS. Custom utility classes for responsive grids and high-contrast accessibility.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary mb-2 flex items-center gap-2"><Zap size={16} /> Real-time Interactivity</h4>
                    <p className="text-sm text-text-muted">Cross-chart filtering using shared React state. Selecting a pathogen in one series filters all related dashboard components instantly.</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Database className="text-secondary" size={24} />
                  <h3 className="text-xl font-bold">Data & Page Logic</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-surface-hover border border-soft">
                    <h4 className="text-sm font-bold mb-1">Surveillance Page</h4>
                    <p className="text-xs text-text-muted">Real-time pathogen tracking (ECharts) + Variant wave modeling (D3).</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-hover border border-soft">
                    <h4 className="text-sm font-bold mb-1">Environmental Page</h4>
                    <p className="text-xs text-text-muted">Air quality index analysis using Candlestick and Density Heatmaps.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-hover border border-soft">
                    <h4 className="text-sm font-bold mb-1">Public Health Page</h4>
                    <p className="text-xs text-text-muted">Clinical-Environmental correlation with mathematical regression plotting.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-hover border border-soft">
                    <h4 className="text-sm font-bold mb-1">Lab Metrics Page</h4>
                    <p className="text-xs text-text-muted">Throughput analysis using Funnel and Sankey flow diagrams.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'geospatial':
        return (
          <div className="col-span-12 grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8"><VariantEvolution /></div>
            <div className="col-span-12 lg:col-span-4 glass-card p-8 flex flex-col justify-center bg-secondary/5">
              <h3 className="text-xl font-bold mb-4 text-secondary">Geospatial Intelligence</h3>
              <p className="text-sm text-text-muted leading-relaxed">Mapping pathogen distribution across Wisconsin counties using custom D3-geo projections.</p>
            </div>
          </div>
        );
      case 'election':
        return (
          <div className="col-span-12 grid grid-cols-12 gap-8">
            {/* Header & Refresh */}
            <div className="col-span-12 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg"><Vote size={24} /></div>
                  <h2 className="text-3xl font-black tracking-tighter">TN ELECTION 2026</h2>
                  <span className="badge badge-success animate-pulse">LIVE RESULTS</span>
                </div>
                <p className="text-text-muted font-medium flex items-center gap-2">
                  <Database size={14} /> Source: Election Commission of India (Official)
                </p>
              </div>
              <button 
                onClick={() => {
                  alert('Refreshing data from ECI servers...');
                }}
                className="flex items-center gap-3 px-6 py-3 bg-primary text-white hover:opacity-90 rounded-2xl transition-all font-bold text-sm group shadow-lg shadow-primary/20"
              >
                <RefreshCw size={18} className="group-active:rotate-180 transition-transform duration-500" />
                REFRESH ECI DATA
              </button>
            </div>

            {/* Key Stats */}
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard title="Lead Party (TVK)" value="107 / 234" trend="+TVK" icon={<Trophy size={24} />} color="#ff42b3" />
              <StatCard title="Majority Mark" value="118 Seats" trend="Fixed" icon={<Gavel size={24} />} color="#7042ff" />
              <StatCard title="Voter Turnout" value="78.4%" trend="+4.2%" icon={<Users size={24} />} color="#00d4ff" />
              <StatCard title="Result Status" value="In Progress" trend="85% Decided" icon={<Activity size={24} />} color="#ffb800" />
            </div>

            {/* Main Section: Majority Simulator */}
            <div className="col-span-12 lg:col-span-6">
              <MajoritySimulator />
            </div>

            {/* Side Section: Summary Charts */}
            <div className="col-span-12 lg:col-span-6 grid grid-cols-1 gap-6">
              <VoteShareChart />
              <PartyDominationChart />
            </div>

            {/* Heatmap Section */}
            <div className="col-span-12">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2"><MapIcon size={20} className="text-secondary" /> Regional Majority Heatmap</h2>
                <TechBadge tech="D3" />
              </div>
              <RegionalHeatmap />
            </div>

            {/* Age Analysis Section */}
            <div className="col-span-12 lg:col-span-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2"><Users size={20} className="text-primary" /> Age Demographics</h2>
                <TechBadge tech="ECharts" />
              </div>
              <AgeVoterDistribution />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2"><BarChart3 size={20} className="text-secondary" /> Party Share by Age</h2>
                <TechBadge tech="ECharts" />
              </div>
              <AgeGroupPartyShare />
            </div>

            {/* Constituency Map Section */}
            <div className="col-span-12 mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2"><MapIcon size={20} className="text-primary" /> Constituency Strength Map</h2>
                <TechBadge tech="D3" />
              </div>
              <ConstituencyMap />
            </div>
          </div>
        );
      default:
        return <div className="col-span-12 p-12 glass-card text-center text-text-muted">Module Coming Soon</div>;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="dashboard-grid">{renderContent()}</main>
      </div>
    </div>
  );
}
