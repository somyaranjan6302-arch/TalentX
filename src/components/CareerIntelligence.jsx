import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  Check, 
  ShieldCheck,
  Info
} from 'lucide-react';
import { ROLES_CATALOG } from '../data/mockData';
import { getCareerRecommendations, skillsMatch } from '../utils/careerRecommendations';
import { predictCareer } from '../services/career';

export function CareerIntelligence({ 
  user, 
  openVerificationModal, 
  navigateToProjects, 
  navigateToOpportunities,
  initialTab = 'intelligence'
}) {
  const [activeSubTab, setActiveSubTab] = useState(initialTab); // 'intelligence' | 'gap' | 'roadmap' | 'simulator'
  const [targetRole, setTargetRole] = useState(
    () => ROLES_CATALOG[user.targetRole] ? user.targetRole : 'Data Scientist'
  );
  const [skillInput, setSkillInput] = useState('');
  const [additionalSkills, setAdditionalSkills] = useState([]);
  const [modelPrediction, setModelPrediction] = useState(null);
  const [modelError, setModelError] = useState('');
  const [isModelLoading, setIsModelLoading] = useState(false);

  // Career Simulator State (Slide 12)
  const [simulatedSkills, setSimulatedSkills] = useState([]);

  const profileSkills = Array.isArray(user.skills) ? user.skills : [];
  const currentSkillNames = profileSkills.map(skill => skill.name).filter(Boolean);
  const candidateSkillNames = [...new Set([...currentSkillNames, ...additionalSkills])];
  const recommendations = getCareerRecommendations(candidateSkillNames);
  const topRecommendation = recommendations[0];
  const selectedRoleData = ROLES_CATALOG[targetRole] || ROLES_CATALOG["Data Scientist"];

  // Calculate Match for Target Role
  const allTargetSkills = [...selectedRoleData.requiredSkills, ...selectedRoleData.advancedSkills];
  const matchedTargetSkills = allTargetSkills.filter(skill => candidateSkillNames.some(candidateSkill => skillsMatch(candidateSkill, skill)));
  const missingTargetSkills = allTargetSkills.filter(s => !matchedTargetSkills.includes(s));
  const baseMatchPercent = recommendations.find(role => role.title === targetRole)?.score ?? 0;

  // Simulation Calculations
  const combinedCurrentAndSim = [...candidateSkillNames, ...simulatedSkills];
  const simulatedMatchPercent = getCareerRecommendations(combinedCurrentAndSim)
    .find(role => role.title === targetRole)?.score ?? 0;

  const toggleSimulatedSkill = (skill) => {
    if (simulatedSkills.includes(skill)) {
      setSimulatedSkills(prev => prev.filter(s => s !== skill));
    } else {
      setSimulatedSkills(prev => [...prev, skill]);
    }
  };

  // Interactive Roadmap State
  const [completedSteps, setCompletedSteps] = useState([1]); // step 1 is done by default

  const toggleRoadmapStep = (stepNum) => {
    setCompletedSteps(prev => 
      prev.includes(stepNum) ? prev.filter(s => s !== stepNum) : [...prev, stepNum]
    );
  };

  const roadmapReadiness = Math.round((completedSteps.length / 5) * 100);

  const analyzeSkills = async event => {
    event.preventDefault();
    const parsedSkills = [...new Set(
      skillInput.split(/[,|]/).map(skill => skill.trim()).filter(Boolean)
    )];
    const skillsToAnalyze = [...new Set([...currentSkillNames, ...parsedSkills])];
    if (skillsToAnalyze.length === 0) {
      setModelError('Add at least one skill or save skills to your profile before analyzing.');
      return;
    }

    setAdditionalSkills(parsedSkills);
    setModelError('');
    setModelPrediction(null);
    setIsModelLoading(true);
    try {
      setModelPrediction(await predictCareer(skillsToAnalyze));
    } catch (error) {
      setModelError(error.message);
    } finally {
      setIsModelLoading(false);
    }
  };

  return (
    <div className="career-ai-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Sub Header Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={24} color="#35A36A" /> AI Career Intelligence & Gap Analysis
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Skill-based career recommendations, explainable gap diagnostics, a personalized roadmap, and an interactive simulator.
          </p>
        </div>

        <div style={{
          display: 'flex',
          background: 'var(--surface-tint)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)',
          gap: '4px'
        }}>
          {[
            { id: 'intelligence', label: 'Career AI' },
            { id: 'gap', label: 'Skill Gap Matrix' },
            { id: 'roadmap', label: 'Roadmap' },
            { id: 'simulator', label: 'Simulator' },
          ].map(tab => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: isActive ? 'var(--grad-primary)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW 1: AI CAREER INTELLIGENCE (Slide 9) */}
      {activeSubTab === 'intelligence' && (
        <div className="career-ai-content">
          <div style={{
            background: 'rgba(34, 128, 74, 0.08)',
            border: '1px solid rgba(34, 128, 74, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Sparkles size={18} color="#35B879" />
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.04em' }}>
                  TALENTX CAREER MATCH ENGINE
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                Find the career that fits your skills
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '650px' }}>
                Compare your profile with TalentX role requirements. Your match score is based on skill coverage, with core requirements weighted higher; it is not a hiring probability.
              </p>
            </div>

            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CURRENT READINESS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-emerald)' }}>
                {user.careerReadiness}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Target: {topRecommendation?.title || targetRole}</div>
            </div>
          </div>

          <form className="career-ai-skill-form" onSubmit={analyzeSkills}>
            <div>
              <h3>Personalize your recommendations</h3>
              <p>Use your saved profile skills, or add skills just for this analysis.</p>
              {currentSkillNames.length > 0 && (
                <div className="career-ai-skill-list" aria-label="Skills from your profile">
                  {profileSkills.filter(skill => skill.name).map(skill => (
                    <span key={skill.name} className="career-ai-skill-chip">
                      {skill.name}
                      {skill.verified && <ShieldCheck size={13} aria-label="Verified" />}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <label className="career-ai-skill-input">
              <input
                aria-label="Additional skills to analyze"
                value={skillInput}
                onChange={event => setSkillInput(event.target.value)}
                placeholder="Add skills, e.g. Python, SQL, machine learning"
                required
              />
            </label>
            <div className="career-ai-skill-actions">
              <button className="btn-primary" type="submit" disabled={isModelLoading}>
                <Sparkles size={16} /> {isModelLoading ? 'Analyzing…' : 'Run trained model'}
              </button>
              {additionalSkills.length > 0 && (
                <button
                  className="btn-secondary"
                  type="button"
                  onClick={() => {
                    setAdditionalSkills([]);
                    setSkillInput('');
                    setModelPrediction(null);
                    setModelError('');
                  }}
                >
                  Reset analysis
                </button>
              )}
            </div>
          </form>

          {(isModelLoading || modelError || modelPrediction) && (
            <section className="career-model-result" aria-live="polite">
              <div className="career-model-heading">
                <div>
                  <span className="career-ai-summary-label">TRAINED ON YOUR CAREER DATASET</span>
                  <h3>{modelPrediction?.modelName || 'Dataset-trained'} career prediction</h3>
                </div>
                {modelPrediction && (
                  <span className="career-model-record-count">
                    {modelPrediction.datasetRecords.toLocaleString()} postings · {modelPrediction.validationAccuracyPercent}% holdout accuracy
                  </span>
                )}
              </div>

              {isModelLoading && (
                <p className="career-model-message">Analyzing your skills against the cleaned job dataset…</p>
              )}
              {modelError && <p className="career-model-error" role="alert">{modelError}</p>}

              {modelPrediction && (
                <div className="career-model-grid">
                  <div className="career-model-prediction">
                    <span>Best-fit career category</span>
                    <strong>{modelPrediction.predictedRole}</strong>
                    <b>{modelPrediction.confidencePercent}% model score</b>
                    <small>
                      Model score from job-skill patterns; not a hiring guarantee.
                    </small>
                  </div>
                  <div className="career-model-probabilities">
                    <h4>Career category scores</h4>
                    {modelPrediction.roleProbabilities.map(({ role, probabilityPercent }) => (
                      <div className="career-model-probability" key={role}>
                        <div><span>{role}</span><b>{probabilityPercent}%</b></div>
                        <div className="career-model-track">
                          <span style={{ width: `${probabilityPercent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="career-model-salaries">
                    <h4>Salary ranges in this career category</h4>
                    <p>Share of matching dataset postings. This is historical data, not a personal salary estimate.</p>
                    {modelPrediction.salaryDistribution.map(salary => (
                      <div className="career-model-salary" key={salary.code}>
                        <span>{salary.range}</span>
                        <div className="career-model-track">
                          <span style={{ width: `${salary.percentage}%` }} />
                        </div>
                        <b>{salary.percentage}%</b>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {topRecommendation && (
            <div className="career-ai-summary" aria-live="polite">
              <div className="career-ai-summary-icon"><Sparkles size={19} /></div>
              <div>
                <span className="career-ai-summary-label">TOP SKILL MATCH</span>
                <strong>{topRecommendation.title}</strong>
                <span>
                  {topRecommendation.matchedSkills.length
                    ? `${topRecommendation.matchedSkills.length} matching skills, including ${topRecommendation.matchedSkills.slice(0, 3).join(', ')}.`
                    : 'Add profile or analysis skills to receive a personalized match.'}
                </span>
              </div>
              <div className="career-ai-summary-score">
                <strong>{topRecommendation.score}%</strong>
                <span>role fit</span>
              </div>
            </div>
          )}

          {/* Recommended Roles Grid */}
          <div className="career-ai-role-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '20px' }}>
            {recommendations.map((recommendation, index) => {
              const role = recommendation;
              const isTarget = targetRole === role.title;
              const matches = recommendation.matchedSkills;
              const score = recommendation.score;
              const nextSkills = recommendation.missingSkills.slice(0, 2);

              return (
                <div
                  key={role.title}
                  className="glass-panel glass-panel-interactive"
                  data-top-match={index === 0 ? 'true' : undefined}
                  style={{
                    padding: '24px',
                    border: isTarget ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    background: isTarget ? '#F0FDF4' : 'var(--bg-card)',
                    position: 'relative'
                  }}
                >
                  {index === 0 && (
                    <span className="badge-pill badge-verified" style={{ position: 'absolute', top: '16px', right: '16px' }}>
                      Best match
                    </span>
                  )}
                  {isTarget && index !== 0 && (
                    <span className="badge-pill badge-indigo" style={{ position: 'absolute', top: '16px', right: '16px' }}>
                      Active Target
                    </span>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="badge-pill badge-cyan" style={{ fontSize: '0.7rem' }}>{role.category}</span>
                    <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>{role.hiringDemand}</span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {role.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '1.7rem', fontWeight: 900, color: score > 75 ? '#047857' : '#B45309' }}>
                      {score}%
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Capability Alignment</span>
                  </div>

                  {/* Compensation benchmark */}
                  <div style={{
                    background: 'var(--surface-tint)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    marginBottom: '14px',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ color: 'var(--text-muted)' }}>Avg. India Comp:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{role.averageSalaryIndia}</span>
                  </div>

                  {/* Transparent Why Recommended (Slide 9 requirement) */}
                  <div style={{
                    background: 'rgba(21, 128, 61, 0.08)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px',
                    borderLeft: '3px solid var(--primary)',
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Info size={13} /> WHY TALENTX RECOMMENDS THIS:
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: 500 }}>
                      {matches.length
                        ? `Your skills match ${matches.slice(0, 3).join(', ')}${nextSkills.length ? `. Build ${nextSkills.join(' and ')} to strengthen this fit.` : ', covering the listed requirements.'}`
                        : `Start with ${role.requiredSkills.slice(0, 3).join(', ')} to build a foundation for this role.`}
                    </p>
                  </div>

                  {/* Required Skills preview */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Core Skills ({recommendation.matchedRequiredSkills.length}/{role.requiredSkills.length} matched):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {role.requiredSkills.map((s, idx) => {
                        const isMatched = candidateSkillNames.some(cs => skillsMatch(cs, s));
                        return (
                          <span
                            key={idx}
                            style={{
                              fontSize: '0.72rem',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: isMatched ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                              color: isMatched ? '#047857' : 'var(--text-muted)',
                              border: isMatched ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)'
                            }}
                          >
                            {isMatched ? '✓' : '•'} {s}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setTargetRole(role.title);
                        setActiveSubTab('gap');
                      }}
                      className={isTarget ? "btn-primary" : "btn-secondary"}
                      style={{ width: '100%', fontSize: '0.82rem', padding: '8px 12px' }}
                    >
                      {isTarget ? 'Inspect Skill Gaps' : 'Set as Target & Analyze'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: SKILL GAP ANALYSIS (Slide 10) */}
      {activeSubTab === 'gap' && (
        <div>
          {/* Target Role Selector Bar */}
          <div style={{
            background: 'var(--bg-card)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                TARGET CAREER:
              </span>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                style={{
                  background: 'var(--surface-tint)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-medium)',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}
              >
                {Object.keys(ROLES_CATALOG).map(roleKey => (
                  <option key={roleKey} value={roleKey} style={{ background: '#FFFFFF', color: 'var(--text-primary)' }}>
                    {roleKey}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Match Alignment: </span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: baseMatchPercent > 70 ? '#34D399' : '#F59E0B' }}>
                  {baseMatchPercent}%
                </span>
              </div>
              <button
                onClick={() => setActiveSubTab('roadmap')}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.82rem' }}
              >
                View Generated Roadmap <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Slide 10 Exact Comparison: Current Skills vs Skill Gaps */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            {/* CURRENT MATCHED SKILLS */}
            <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid #10B981' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={20} color="#10B981" /> Current Skills ({matchedTargetSkills.length})
                </h3>
                <span className="badge-pill badge-verified">Ready</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Skills already confirmed on your profile and verified through assessments:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {matchedTargetSkills.map((skill, idx) => {
                  const userSkill = profileSkills.find(profileSkill => skillsMatch(profileSkill.name, skill));
                  const isAdditionalSkill = additionalSkills.some(additionalSkill => skillsMatch(additionalSkill, skill));
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(16, 185, 129, 0.08)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'rgba(16, 185, 129, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Check size={14} color="#34D399" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{skill}</div>
                          <div style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 600 }}>
                            {userSkill?.verified
                              ? `Verified (${userSkill.score}%) • ${userSkill.level}`
                              : userSkill
                                ? 'Claimed on Profile'
                                : isAdditionalSkill
                                  ? 'Added for this analysis'
                                  : 'Profile skill'}
                          </div>
                        </div>
                      </div>

                      {userSkill?.verified ? (
                        <span className="badge-pill badge-verified" style={{ fontSize: '0.68rem' }}>
                          Verified ✓
                        </span>
                      ) : (
                        <button
                          onClick={() => openVerificationModal(skill)}
                          className="btn-verified"
                          style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                        >
                          Prove It
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* IDENTIFIED SKILL GAPS */}
            <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid #B45309' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={20} color="#B45309" /> Skill Gaps ({missingTargetSkills.length})
                </h3>
                <span className="badge-pill badge-warning">High Impact</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                High-priority competencies required by top employers hiring for {targetRole}:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {missingTargetSkills.map((gap, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(245, 158, 11, 0.08)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'rgba(245, 158, 11, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#B45309',
                        fontSize: '0.8rem',
                        fontWeight: 700
                      }}>
                        ⚠
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{gap}</div>
                        <div style={{ fontSize: '0.72rem', color: '#B45309', fontWeight: 600 }}>
                          Missing in 82% of entry candidate applications
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => openVerificationModal(gap)}
                        className="btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                      >
                        Verify Now
                      </button>
                      <button
                        onClick={() => setActiveSubTab('roadmap')}
                        className="btn-primary"
                        style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                      >
                        Learn
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: PERSONALIZED CAREER ROADMAP (Slide 11) */}
      {activeSubTab === 'roadmap' && (
        <div>
          <div style={{
            background: 'var(--bg-card)',
            padding: '20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <span className="badge-pill badge-indigo" style={{ marginBottom: '6px' }}>Personalized Action Plan</span>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                Actionable Learning & Verification Roadmap
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Targeting: <strong style={{ color: 'var(--primary)' }}>{targetRole}</strong>. Check off completed milestones to update your platform readiness score.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Roadmap Progress</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{roadmapReadiness}%</div>
              </div>
              <div style={{
                width: '120px',
                height: '10px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '999px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${roadmapReadiness}%`,
                  height: '100%',
                  background: 'var(--grad-verified)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          </div>

          {/* Sequential Steps (Slide 11) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              {
                step: 1,
                title: "Current Foundation: Python + SQL + Statistics",
                description: "Master foundational scripting, algorithmic thinking, and relational database querying.",
                badge: "COMPLETED",
                badgeType: "verified",
                details: "You scored 88% in Python and 82% in SQL. Baseline verified.",
                actionText: "Review Scores",
                actionFn: () => {}
              },
              {
                step: 2,
                title: "Learn Machine Learning & Supervised Algorithms",
                description: "Scikit-Learn, Gradient Boosted Decision Trees, Regularization, and Cross-Validation architectures.",
                badge: "RECOMMENDED LEARNING",
                badgeType: "indigo",
                details: "Modules: Feature Engineering, Imbalanced Datasets, Metrics (PR-AUC, F1).",
                actionText: "Open Free Course Track",
                actionFn: () => window.open('https://scikit-learn.org', '_blank')
              },
              {
                step: 3,
                title: "Build Production ML Portfolio Projects",
                description: "Bridge theoretical knowledge by shipping full-stack end-to-end applications with live demos.",
                badge: "HANDS-ON BUILD",
                badgeType: "cyan",
                details: "Recommended: AgriVision AI or Real-time UPI Fraud Detection pipeline.",
                actionText: "Explore Projects Hub",
                actionFn: navigateToProjects
              },
              {
                step: 4,
                title: "Take ML Verification Assessment",
                description: "Prove your ability under timed scenario-based evaluations with code debugging questions.",
                badge: "VERIFICATION BADGE",
                badgeType: "warning",
                details: "Score ≥ 70/100 to earn the official cryptographic TalentX Verified Badge.",
                actionText: "Take Assessment Now",
                actionFn: () => openVerificationModal("Machine Learning")
              },
              {
                step: 5,
                title: "Apply for Verified Data Science Roles & Hackathons",
                description: "Fast-track interviews with Swiggy AI Labs, Razorpay, and Microsoft Research India.",
                badge: "HIRED & GROW",
                badgeType: "verified",
                details: "TalentX Verified candidates bypass initial recruiter resume screening rounds.",
                actionText: "Browse Matched Roles",
                actionFn: navigateToOpportunities
              }
            ].map(item => {
              const isChecked = completedSteps.includes(item.step);
              return (
                <div
                  key={item.step}
                  className="glass-panel"
                  style={{
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '18px',
                    background: isChecked ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-card)',
                    border: isChecked ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Step Checkbox */}
                  <button
                    onClick={() => toggleRoadmapStep(item.step)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isChecked ? 'var(--accent-emerald)' : 'rgba(255, 255, 255, 0.08)',
                      border: isChecked ? 'none' : '2px solid var(--border-medium)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                      color: isChecked ? '#fff' : 'transparent'
                    }}
                  >
                    <Check size={18} strokeWidth={3} />
                  </button>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                        STEP 0{item.step}
                      </span>
                      <span className={`badge-pill badge-${item.badgeType}`} style={{ fontSize: '0.68rem' }}>
                        {item.badge}
                      </span>
                    </div>

                    <h4 style={{
                      fontSize: '1.05rem',
                      color: 'var(--text-primary)',
                      marginBottom: '4px',
                      textDecoration: isChecked ? 'line-through' : 'none',
                      opacity: isChecked ? 0.9 : 1
                    }}>
                      {item.title}
                    </h4>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      {item.description}
                    </p>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--surface-tint)', padding: '6px 10px', borderRadius: '4px', display: 'inline-block' }}>
                      💡 {item.details}
                    </div>
                  </div>

                  <button
                    onClick={item.actionFn}
                    className={isChecked ? "btn-secondary" : "btn-primary"}
                    style={{ padding: '8px 16px', fontSize: '0.8rem', flexShrink: 0 }}
                  >
                    {item.actionText}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 4: CAREER SIMULATOR (Slide 12) */}
      {activeSubTab === 'simulator' && (
        <div>
          <div style={{
            background: 'linear-gradient(135deg, rgba(34, 128, 74, 0.15) 0%, rgba(34, 160, 107, 0.1) 100%)',
            border: '1px solid rgba(34, 128, 74, 0.4)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Cpu size={20} color="#35B879" />
              <span className="badge-pill badge-indigo">Career Simulator Sandbox</span>
            </div>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
              "What If I Learn This Skill?"
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '680px' }}>
              Simulate high-impact learning decisions before investing hundreds of hours. Select potential skills below to observe how the TalentX engine recalculates your capability alignment, unlocked roles, and market compensation.
            </p>
          </div>

          {/* Interactive Skill Sandbox Selector */}
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px' }}>
              CLICK SKILLS TO SIMULATE LEARNING:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {[
                { name: "Machine Learning", category: "Core AI", salaryBoost: "+25%" },
                { name: "Deep Learning & PyTorch", category: "Advanced AI", salaryBoost: "+35%" },
                { name: "MLOps & CI/CD", category: "Production AI", salaryBoost: "+40%" },
                { name: "Cloud (AWS & GCP)", category: "Infrastructure", salaryBoost: "+30%" },
                { name: "Docker & Kubernetes", category: "DevOps", salaryBoost: "+28%" },
                { name: "Vector Databases & LLMs", category: "GenAI", salaryBoost: "+45%" },
                { name: "Power BI & Tableau", category: "BI", salaryBoost: "+18%" }
              ].map(item => {
                const isSelected = simulatedSkills.includes(item.name);
                return (
                  <button
                    key={item.name}
                    onClick={() => toggleSimulatedSkill(item.name)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-full)',
                      background: isSelected ? 'var(--grad-primary)' : 'rgba(255, 255, 255, 0.05)',
                      border: isSelected ? '1px solid #35B879' : '1px solid var(--border-medium)',
                      color: isSelected ? '#fff' : 'var(--text-primary)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: isSelected ? '0 0 15px rgba(34, 128, 74, 0.5)' : 'none'
                    }}
                  >
                    <span>{isSelected ? '✓ Added:' : '+ Add:'} {item.name}</span>
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: isSelected ? 'rgba(0, 0, 0, 0.3)' : 'rgba(16, 185, 129, 0.15)',
                      color: isSelected ? '#fff' : '#34D399'
                    }}>
                      {item.salaryBoost}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SIMULATION RECALCULATION ENGINE OUTPUT (Slide 12) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {/* Metric 1: Skill Alignment Delta */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                TARGET ROLE ALIGNMENT
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  {baseMatchPercent}%
                </span>
                <ArrowRight size={18} color="#35B879" />
                <span style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--accent-emerald)' }}>
                  {simulatedMatchPercent}%
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', fontWeight: 600, marginTop: '4px' }}>
                +{simulatedMatchPercent - baseMatchPercent}% match boost with simulated skills
              </div>
            </div>

            {/* Metric 2: Unlocked Roles */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                POTENTIAL ROLES UNLOCKED
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--primary)' }}>
                +{simulatedSkills.length > 0 ? simulatedSkills.length + 1 : 0} Roles
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {simulatedSkills.length > 0 ? 'Now qualified for ML Engineer & AI Solutions' : 'Select skills to see new roles'}
              </div>
            </div>

            {/* Metric 3: Estimated Salary Projection */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                PROJECTED COMPENSATION
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#B45309' }}>
                ₹{14 + simulatedSkills.length * 4} - {28 + simulatedSkills.length * 6} LPA
              </div>
              <div style={{ fontSize: '0.78rem', color: '#B45309', fontWeight: 700, marginTop: '4px' }}>
                Estimated market premium: +{simulatedSkills.length * 15}%
              </div>
            </div>
          </div>

          {/* Recalculated Next Action Steps */}
          {simulatedSkills.length > 0 && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--accent-emerald)', fontSize: '0.9rem' }}>
                  Ready to turn this simulation into reality?
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Take the verified assessment for {simulatedSkills[0]} to permanently unlock these roles on your TalentX identity.
                </div>
              </div>
              <button
                onClick={() => openVerificationModal(simulatedSkills[0])}
                className="btn-verified"
                style={{ padding: '8px 18px', fontSize: '0.82rem' }}
              >
                Verify {simulatedSkills[0]} Now
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
