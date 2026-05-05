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
  const [activeTab, setActiveTab] = useState('about');
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
               <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Air Quality Trends</h2><TechBadge tech="ECharts" /></div>
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
              <button onClick={() => alert('Refreshing data...')} className="flex items-center gap-3 px-6 py-3 bg-primary text-white hover:opacity-90 rounded-2xl transition-all font-bold text-sm group shadow-lg shadow-primary/20">
                <RefreshCw size={18} className="group-active:rotate-180 transition-transform duration-500" />
                REFRESH ECI DATA
              </button>
            </div>
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard title="Lead Party (TVK)" value="107 / 234" trend="+TVK" icon={<Trophy size={24} />} color="#ff42b3" />
              <StatCard title="Majority Mark" value="118 Seats" trend="Fixed" icon={<Gavel size={24} />} color="#7042ff" />
              <StatCard title="Voter Turnout" value="78.4%" trend="+4.2%" icon={<Users size={24} />} color="#00d4ff" />
              <StatCard title="Result Status" value="In Progress" trend="85% Decided" icon={<Activity size={24} />} color="#ffb800" />
            </div>
            <div className="col-span-12 lg:col-span-6"><MajoritySimulator /></div>
            <div className="col-span-12 lg:col-span-6 grid grid-cols-1 gap-6"><VoteShareChart /><PartyDominationChart /></div>
            <div className="col-span-12">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2"><MapIcon size={20} className="text-secondary" /> Regional Majority Heatmap</h2>
                <TechBadge tech="D3" />
              </div>
              <RegionalHeatmap />
            </div>
            <div className="col-span-12 lg:col-span-6"><AgeVoterDistribution /></div>
            <div className="col-span-12 lg:col-span-6"><AgeGroupPartyShare /></div>
            <div className="col-span-12 mt-8"><ConstituencyMap /></div>
          </div>
        );
      case 'about':
        return (
          <div className="col-span-12 flex flex-col gap-8 pb-12">
            <div className="glass-card p-12 text-center flex flex-col items-center gap-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-none">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-background shadow-lg shadow-primary/20"><Info size={32} /></div>
              <div>
                <h2 className="text-4xl font-black mb-2 tracking-tighter">DASHBOARD DIRECTORY</h2>
                <p className="text-text-muted max-w-2xl mx-auto font-medium">A comprehensive guide to the modules and visualization engines powering Chart Viz Pro.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Election */}
              <div className="glass-card p-6 flex flex-col gap-4 border-l-4 border-primary">
                <div className="flex items-center gap-3"><Zap className="text-primary" size={20} /><h3 className="font-bold uppercase tracking-tight">Election 2026</h3></div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-primary uppercase mb-1">Interactive Simulator</p>
                    <p className="text-xs text-text-muted">D3-based coalition builder with dynamic seat threshold logic.</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-primary uppercase mb-1">Geospatial Mapping</p>
                    <p className="text-xs text-text-muted">High-precision GeoJSON boundaries with district-level Lat/Lng plotting.</p>
                  </div>
                </div>
              </div>

              {/* Surveillance */}
              <div className="glass-card p-6 flex flex-col gap-4 border-l-4 border-secondary">
                <div className="flex items-center gap-3"><Activity className="text-secondary" size={20} /><h3 className="font-bold uppercase tracking-tight">Surveillance</h3></div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-secondary uppercase mb-1">Pathogen Trends</p>
                    <p className="text-xs text-text-muted">ECharts multi-series area charts for real-time viral load tracking.</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-secondary uppercase mb-1">Regional Alerts</p>
                    <p className="text-xs text-text-muted">Priority-sorted status cards for county-level pathogen detection.</p>
                  </div>
                </div>
              </div>

              {/* Environmental */}
              <div className="glass-card p-6 flex flex-col gap-4 border-l-4 border-accent">
                <div className="flex items-center gap-3"><Droplets className="text-accent" size={20} /><h3 className="font-bold uppercase tracking-tight">Environmental</h3></div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-accent uppercase mb-1">AQI Volatility</p>
                    <p className="text-xs text-text-muted">Candlestick charts (ECharts) visualizing air quality index fluctuations.</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-accent uppercase mb-1">Detection Matrix</p>
                    <p className="text-xs text-text-muted">Heatmap-based density matrix for pathogen concentration levels.</p>
                  </div>
                </div>
              </div>

              {/* Lab Metrics */}
              <div className="glass-card p-6 flex flex-col gap-4 border-l-4 border-primary">
                <div className="flex items-center gap-3"><Database className="text-primary" size={20} /><h3 className="font-bold uppercase tracking-tight">Lab Metrics</h3></div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-primary uppercase mb-1">Pipeline Throughput</p>
                    <p className="text-xs text-text-muted">ECharts funnel diagrams for sample processing efficiency.</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-primary uppercase mb-1">Data Synchronization</p>
                    <p className="text-xs text-text-muted">Sankey flow diagrams visualizing internal data sync between nodes.</p>
                  </div>
                </div>
              </div>

              {/* Public Health */}
              <div className="glass-card p-6 flex flex-col gap-4 border-l-4 border-secondary">
                <div className="flex items-center gap-3"><Users className="text-secondary" size={20} /><h3 className="font-bold uppercase tracking-tight">Public Health</h3></div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-secondary uppercase mb-1">Variant Waves</p>
                    <p className="text-xs text-text-muted">Bespoke D3-mathematical wave modeling for genomic evolution.</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-secondary uppercase mb-1">Health Correlation</p>
                    <p className="text-xs text-text-muted">D3 scatter plotting with integrated linear regression lines.</p>
                  </div>
                </div>
              </div>

              {/* Geospatial */}
              <div className="glass-card p-6 flex flex-col gap-4 border-l-4 border-accent">
                <div className="flex items-center gap-3"><MapIcon className="text-accent" size={20} /><h3 className="font-bold uppercase tracking-tight">Geospatial</h3></div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-accent uppercase mb-1">Spatial Projection</p>
                    <p className="text-xs text-text-muted">Custom D3-geo projections for Wisconsin county-level distribution.</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-accent uppercase mb-1">Heat Intensity</p>
                    <p className="text-xs text-text-muted">Area-weighted intensity mapping for geographic pathogen load.</p>
                  </div>
                </div>
              </div>

              {/* Analytics */}
              <div className="glass-card p-6 flex flex-col gap-4 border-l-4 border-primary">
                <div className="flex items-center gap-3"><BarChart3 className="text-primary" size={20} /><h3 className="font-bold uppercase tracking-tight">Analytics</h3></div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-primary uppercase mb-1">Multi-Domain Synthesis</p>
                    <p className="text-xs text-text-muted">Aggregated views synthesizing environmental and genomic datasets.</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-primary uppercase mb-1">Pathogen Profiles</p>
                    <p className="text-xs text-text-muted">Radar charts visualizing multidimensional biological characteristics.</p>
                  </div>
                </div>
              </div>

              {/* Hierarchy */}
              <div className="glass-card p-6 flex flex-col gap-4 border-l-4 border-secondary">
                <div className="flex items-center gap-3"><Layers className="text-secondary" size={20} /><h3 className="font-bold uppercase tracking-tight">Hierarchy</h3></div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-secondary uppercase mb-1">Source Distribution</p>
                    <p className="text-xs text-text-muted">D3 hierarchical Treemaps visualizing data source weights.</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-secondary uppercase mb-1">Engine Balance</p>
                    <p className="text-xs text-text-muted">Optimized hybrid usage of SVG (D3) and Canvas (ECharts) rendering.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Footer */}
            <div className="glass-card p-8 bg-surface border-none shadow-inner">
               <div className="flex flex-col md:flex-row items-center gap-12">
                 <div className="flex-1 space-y-4">
                    <h4 className="text-xl font-bold flex items-center gap-2"><Terminal size={20} className="text-primary" /> Technical Architecture</h4>
                    <p className="text-sm text-text-muted leading-relaxed">Chart Viz Pro is built on <strong>Next.js 15</strong> and <strong>TypeScript</strong>. It employs a sophisticated state-sharing architecture that enables cross-component interaction, where selecting a data point in an ECharts area chart instantly re-projects a D3 geospatial map.</p>
                 </div>
                 <div className="flex gap-4">
                    <div className="px-6 py-4 rounded-2xl bg-white border border-soft flex flex-col items-center">
                      <span className="text-2xl font-black text-primary">12+</span>
                      <span className="text-[10px] font-bold text-text-muted uppercase">Advanced Charts</span>
                    </div>
                    <div className="px-6 py-4 rounded-2xl bg-white border border-soft flex flex-col items-center">
                      <span className="text-2xl font-black text-secondary">2</span>
                      <span className="text-[10px] font-bold text-text-muted uppercase">Render Engines</span>
                    </div>
                    <div className="px-6 py-4 rounded-2xl bg-white border border-soft flex flex-col items-center">
                      <span className="text-2xl font-black text-accent">100%</span>
                      <span className="text-[10px] font-bold text-text-muted uppercase">Type Safe</span>
                    </div>
                 </div>
               </div>
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
