import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  TrendingUp,
  Bell,
  LogOut,
  Search,
  CheckCircle2,
  Sparkles,
  Compass,
  Cpu,
  Code2,
  MoreHorizontal,
  BarChart2,
  Map,
} from 'lucide-react';

export function Navbar({
  role,
  authUser,
  onLogout,
  activeView,
  setActiveView,
  talentTab,
  setTalentTab,
  user,
  unreadNotifications,
  setShowNotifications,
  openResumeParser
}) {
  const [query, setQuery] = useState('');
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const goDefaultView = () => {
    if (role === 'recruiter') {
      setActiveView('employer');
    } else {
      setActiveView('talent');
      setTalentTab('career_ai');
    }
  };

  const goProfile = () => {
    if (role === 'recruiter') {
      setActiveView('recruiter-profile');
    } else {
      setActiveView('talent');
      setTalentTab('profile');
    }
  };

  // Candidate navigation stays focused on distinct destinations; Career AI is the landing view.
  const candidateNav = [
    {
      id: 'network',
      label: 'Networking',
      icon: Users,
      action: () => { setActiveView('talent'); setTalentTab('networking'); },
      active: activeView === 'talent' && talentTab === 'networking',
    },
    {
      id: 'jobs',
      label: 'Jobs',
      icon: Briefcase,
      action: () => { setActiveView('talent'); setTalentTab('opportunities'); },
      active: activeView === 'talent' && talentTab === 'opportunities',
    },
    {
      id: 'career_ai',
      label: 'Career AI',
      icon: Compass,
      action: () => { setActiveView('talent'); setTalentTab('career_ai'); },
      active: activeView === 'talent' && talentTab === 'career_ai',
    },
    {
      id: 'roadmap',
      label: 'Roadmap',
      icon: Map,
      action: () => { setActiveView('talent'); setTalentTab('roadmap'); },
      active: activeView === 'talent' && talentTab === 'roadmap',
    },
    {
      id: 'simulator',
      label: 'Simulator',
      icon: Cpu,
      action: () => { setActiveView('talent'); setTalentTab('simulator'); },
      active: activeView === 'talent' && talentTab === 'simulator',
    },
    {
      id: 'skill_gap',
      label: 'Skill Gap',
      icon: BarChart2,
      action: () => { setActiveView('talent'); setTalentTab('skill_gap'); },
      active: activeView === 'talent' && talentTab === 'skill_gap',
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: Code2,
      action: () => { setActiveView('talent'); setTalentTab('projects'); },
      active: activeView === 'talent' && talentTab === 'projects',
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: TrendingUp,
      action: () => setActiveView('skillgraph'),
      active: activeView === 'skillgraph',
    },
  ];

  const onSearch = (e) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;
    if (q.includes('job') || q.includes('hire') || q.includes('opportunit')) {
      setActiveView('talent'); setTalentTab('opportunities');
    } else if (q.includes('network') || q.includes('feed')) {
      setActiveView('talent'); setTalentTab('networking');
    } else if (q.includes('skill gap')) {
      setActiveView('talent'); setTalentTab('skill_gap');
    } else if (q.includes('roadmap')) {
      setActiveView('talent'); setTalentTab('roadmap');
    } else if (q.includes('simulator')) {
      setActiveView('talent'); setTalentTab('simulator');
    } else if (q.includes('project')) {
      setActiveView('talent'); setTalentTab('projects');
    } else if (q.includes('employer') || q.includes('hiring')) {
      setActiveView('employer');
    } else if (q.includes('insight') || q.includes('graph')) {
      setActiveView('skillgraph');
    } else {
      setActiveView('talent'); setTalentTab('career_ai');
    }
  };

  return (
    <header className="header-container">
      <div className="header-main-row" style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 12px',
        display: 'flex',
        alignItems: 'stretch',
        gap: '0',
        minHeight: '60px'
      }}>
        {/* Brand Logo */}
        <button className="header-brand" onClick={goDefaultView} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', flexShrink: 0, paddingRight: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: '#1ba83a',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: '1rem',
            letterSpacing: '-0.04em'
          }}>
            tX
          </div>
          <div style={{ lineHeight: 1.1, textAlign: 'left' }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.04em', color: 'var(--primary)' }}>
              TalentX
            </div>
          </div>
        </button>

        {/* Search */}
        {role === 'candidate' && (
          <form className="nav-search" onSubmit={onSearch} style={{ margin: '0 8px' }}>
            <Search size={15} color="#666666" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              aria-label="Search"
            />
          </form>
        )}

        {/* Flat nav - ALL items in one row */}
        {role === 'candidate' && (
          <nav className="primary-nav" style={{ display: 'flex', alignItems: 'stretch', flex: 1 }}>
            {candidateNav.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`nav-item nav-feature-item${item.active ? ' active' : ''}`}
                  onClick={item.action}
                  style={{ minWidth: 'unset', padding: '0 10px' }}
                >
                  <Icon className="nav-icon" size={20} strokeWidth={item.active ? 2.2 : 1.8} />
                  <span className="label" style={{ fontSize: '0.72rem' }}>{item.label}</span>
                </button>
              );
            })}

            {/* Upload Resume */}
            <button
              onClick={openResumeParser}
              className="nav-item"
              style={{ minWidth: 'unset', padding: '0 10px' }}
            >
              <Sparkles className="nav-icon" size={20} strokeWidth={1.8} />
              <span className="label" style={{ fontSize: '0.72rem' }}>Resume</span>
            </button>

            {/* Alerts */}
            <button
              className="nav-item"
              onClick={() => setShowNotifications(prev => !prev)}
              style={{ position: 'relative', minWidth: 'unset', padding: '0 10px' }}
            >
              <Bell className="nav-icon" size={20} strokeWidth={1.8} />
              <span className="label" style={{ fontSize: '0.72rem' }}>Alerts</span>
              {unreadNotifications > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '6px',
                  right: '4px',
                  minWidth: '15px',
                  height: '15px',
                  padding: '0 3px',
                  background: '#CC1016',
                  color: '#fff',
                  borderRadius: '8px',
                  fontSize: '0.58rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Profile */}
            <button
              onClick={goProfile}
              className={`nav-item${activeView === 'talent' && talentTab === 'profile' ? ' active' : ''}`}
              style={{ borderLeft: '1px solid var(--border-subtle)', minWidth: 'unset', padding: '0 10px' }}
            >
              <img
                src={user.avatar}
                alt={authUser.name}
                style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span className="label" style={{ fontSize: '0.72rem' }}>Profile</span>
            </button>

            {/* Sign out */}
            <button onClick={onLogout} className="nav-item" style={{ minWidth: 'unset', padding: '0 10px' }}>
              <LogOut className="nav-icon" size={19} />
              <span className="label" style={{ fontSize: '0.72rem' }}>Sign out</span>
            </button>
          </nav>
        )}

        {/* Recruiter nav */}
        {role === 'recruiter' && (
          <nav className="primary-nav" style={{ display: 'flex', alignItems: 'stretch', marginLeft: 'auto' }}>
            <button className={`nav-item${activeView === 'employer' ? ' active' : ''}`} onClick={goDefaultView}>
              <CheckCircle2 className="nav-icon" size={22} strokeWidth={1.8} />
              <span className="label">Hiring</span>
            </button>
            <button
              onClick={goProfile}
              className={`nav-item${activeView === 'recruiter-profile' ? ' active' : ''}`}
              style={{ borderLeft: '1px solid var(--border-subtle)' }}
            >
              <img src={user.avatar} alt={authUser.name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
              <span className="label">Profile</span>
            </button>
            <button onClick={onLogout} className="nav-item">
              <LogOut className="nav-icon" size={20} />
              <span className="label">Sign out</span>
            </button>
          </nav>
        )}
      </div>

      {/* Mobile bottom nav */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {role === 'candidate' ? (
          <>
            <button
              className={`mobile-tab${activeView === 'talent' && talentTab === 'career_ai' ? ' active' : ''}`}
              onClick={() => { setActiveView('talent'); setTalentTab('career_ai'); }}
              aria-label="Career AI"
            >
              <Compass size={21} />
              <span>Career AI</span>
            </button>
            <button
              className={`mobile-tab${activeView === 'talent' && talentTab === 'networking' ? ' active' : ''}`}
              onClick={() => { setActiveView('talent'); setTalentTab('networking'); }}
              aria-label="Networking"
            >
              <Users size={21} />
              <span>Networking</span>
            </button>
            <button
              className={`mobile-tab${activeView === 'talent' && talentTab === 'opportunities' ? ' active' : ''}`}
              onClick={() => { setActiveView('talent'); setTalentTab('opportunities'); }}
              aria-label="Jobs"
            >
              <Briefcase size={21} />
              <span>Jobs</span>
            </button>
            <button
              className={`mobile-tab${activeView === 'talent' && talentTab === 'profile' ? ' active' : ''}`}
              onClick={goProfile}
              aria-label="Profile"
            >
              <img src={user.avatar} alt="" />
              <span>Profile</span>
            </button>
            <button
              className={`mobile-tab${isMoreMenuOpen ? ' active' : ''}`}
              onClick={() => setIsMoreMenuOpen(open => !open)}
              aria-expanded={isMoreMenuOpen}
              aria-label="More"
            >
              <MoreHorizontal size={21} />
              <span>More</span>
            </button>
          </>
        ) : (
          <>
            <button className={`mobile-tab${activeView === 'employer' ? ' active' : ''}`} onClick={goDefaultView}>
              <CheckCircle2 size={21} />
              <span>Hiring</span>
            </button>
            <button className={`mobile-tab${activeView === 'recruiter-profile' ? ' active' : ''}`} onClick={goProfile}>
              <img src={user.avatar} alt="" />
              <span>Profile</span>
            </button>
            <button className="mobile-tab" onClick={onLogout}>
              <LogOut size={21} />
              <span>Sign out</span>
            </button>
          </>
        )}
      </nav>

      {isMoreMenuOpen && (
        <>
          <button
            className="mobile-menu-backdrop"
            aria-label="Close more menu"
            onClick={() => setIsMoreMenuOpen(false)}
          />
          <div className="mobile-more-menu" role="group" aria-label="More navigation">
            <button onClick={() => { setActiveView('talent'); setTalentTab('career_ai'); setIsMoreMenuOpen(false); }}>
              <Compass size={18} /> Career AI
            </button>
            <button onClick={() => { setActiveView('talent'); setTalentTab('roadmap'); setIsMoreMenuOpen(false); }}>
              <Map size={18} /> Roadmap
            </button>
            <button onClick={() => { setActiveView('talent'); setTalentTab('simulator'); setIsMoreMenuOpen(false); }}>
              <Cpu size={18} /> Simulator
            </button>
            <button onClick={() => { setActiveView('talent'); setTalentTab('skill_gap'); setIsMoreMenuOpen(false); }}>
              <BarChart2 size={18} /> Skill Gap
            </button>
            <button onClick={() => { setActiveView('talent'); setTalentTab('projects'); setIsMoreMenuOpen(false); }}>
              <Code2 size={18} /> Projects
            </button>
            <button onClick={() => { setActiveView('skillgraph'); setIsMoreMenuOpen(false); }}>
              <TrendingUp size={18} /> Insights
            </button>
            <button onClick={() => { setShowNotifications(true); setIsMoreMenuOpen(false); }}>
              <Bell size={18} /> Alerts
              {unreadNotifications > 0 && <span className="mobile-alert-count">{unreadNotifications}</span>}
            </button>
            <button onClick={() => { openResumeParser(); setIsMoreMenuOpen(false); }}>
              <Sparkles size={18} /> Upload resume
            </button>
            <button onClick={onLogout}>
              <LogOut size={18} /> Sign out
            </button>
          </div>
        </>
      )}
    </header>
  );
}
