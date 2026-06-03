import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Lightbulb, Trophy, Rocket, Users, ArrowRight, Star, ChevronRight, Zap } from 'lucide-react'

const STEPS = [
  { n: '01', label: 'Register',     desc: 'Create your account and complete your profile.' },
  { n: '02', label: 'Accept Terms', desc: 'Review and accept the Ideathon terms and conditions.' },
  { n: '03', label: 'Submit Idea',  desc: 'Fill in your idea with details, documents, and links.' },
  { n: '04', label: 'Evaluation',   desc: 'Expert panel reviews your submission.' },
  { n: '05', label: 'Shortlisting', desc: 'Top ideas are shortlisted for further discussion.' },
  { n: '06', label: 'Rewards',      desc: 'Winners receive rewards and incubation support.' },
]

const BENEFITS = [
  { icon: <Trophy size={18}/>,   title: 'Innovation Rewards',      desc: 'Monetary rewards for top-performing ideas.' },
  { icon: <Rocket size={18}/>,   title: 'Internal Incubation',     desc: 'Selected ideas get resourced and built internally.' },
  { icon: <Zap size={18}/>,      title: 'Productization Support',  desc: 'Turn your concept into a real product with our team.' },
  { icon: <Users size={18}/>,    title: 'Founder Mentorship',      desc: 'Direct access to PMRG founders for guidance.' },
  { icon: <Star size={18}/>,     title: 'Career Opportunities',    desc: 'Exceptional ideas may lead to co-founder opportunities.' },
  { icon: <Lightbulb size={18}/>,title: 'Recognition',             desc: 'Showcase your innovation and build your profile.' },
]

export default function Landing() {
  const { user } = useAuth()

  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ── */}
        <section style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          paddingTop: 52, borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(135deg, #faf9fc 0%, #f0ebfd 60%, #e8e0fa 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* soft blobs */}
          <div style={{ position:'absolute', top:'-80px', right:'-80px', width:420, height:420, borderRadius:'50%', background:'rgba(108,61,224,0.07)', filter:'blur(60px)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:320, height:320, borderRadius:'50%', background:'rgba(108,61,224,0.05)', filter:'blur(50px)', pointerEvents:'none' }}/>

          <div style={{ width:'100%', padding:'clamp(48px,8vw,100px) clamp(20px,5vw,72px)', position:'relative', zIndex:1 }}>
            <div style={{ maxWidth:660 }}>
              {/* pill */}
              <div style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'5px 14px', background:'rgba(108,61,224,0.08)', border:'1px solid rgba(108,61,224,0.18)', borderRadius:100, marginBottom:22 }}>
                <span style={{ width:6, height:6, background:'var(--gold)', borderRadius:'50%', flexShrink:0 }}/>
                <span style={{ fontSize:11, color:'var(--gold)', fontWeight:600, letterSpacing:'0.07em', textTransform:'uppercase' }}>Now Accepting Submissions</span>
              </div>

              <h1 style={{ fontSize:'clamp(34px,7vw,66px)', fontWeight:700, lineHeight:1.07, letterSpacing:'-0.04em', marginBottom:18, color:'var(--text)' }}>
                PMRG Solution<br/>
                <span style={{ color:'var(--gold)' }}>Ideathon</span> &<br/>
                Innovation Challenge
              </h1>

              <p style={{ fontSize:'clamp(13px,2vw,16px)', color:'var(--text-dim)', maxWidth:480, lineHeight:1.75, marginBottom:32 }}>
                Transform your boldest ideas into impactful innovations. Submit your concept and get access to mentorship, incubation, and real opportunities.
              </p>

              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                {user ? (
                  <Link to="/submit" className="btn btn-gold btn-lg">Submit Your Idea <ArrowRight size={16}/></Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-gold btn-lg">Submit Your Idea <ArrowRight size={16}/></Link>
                    <Link to="/login" className="btn btn-ghost btn-lg">Sign In</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <section style={{ padding:'clamp(48px,8vw,80px) clamp(20px,5vw,72px)', borderBottom:'1px solid var(--border)', background:'#fff' }}>
          <div style={{ maxWidth:1000, margin:'0 auto' }}>
            <p className="section-title">About the Program</p>
            <h2 style={{ fontSize:'clamp(20px,4vw,28px)', fontWeight:700, letterSpacing:'-0.03em', lineHeight:1.2, marginBottom:16 }}>
              Where Ideas Meet Opportunity
            </h2>
            <p style={{ color:'var(--text-dim)', lineHeight:1.8, fontSize:14, maxWidth:580, marginBottom:12 }}>
              PMRG Solution's Ideathon is an open innovation platform for individuals who dare to think differently. We seek breakthrough ideas across AI, SaaS, FinTech, EdTech, and more.
            </p>
            <p style={{ color:'var(--text-dim)', lineHeight:1.8, fontSize:14, maxWidth:580, marginBottom:28 }}>
              Every submission gets evaluated by experienced mentors committed to bringing the best ideas to life.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:10 }}>
              {['Internal Ideathons','Innovation Challenges','Prototype Contests','Founder Sessions'].map(t => (
                <div key={t} style={{ padding:'12px 14px', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:9, display:'flex', alignItems:'center', gap:8 }}>
                  <ChevronRight size={13} color="var(--gold)"/>
                  <span style={{ fontSize:13, fontWeight:500 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Benefits ── */}
        <section style={{ padding:'clamp(48px,8vw,80px) clamp(20px,5vw,72px)', borderBottom:'1px solid var(--border)', background:'var(--bg)' }}>
          <div style={{ maxWidth:1000, margin:'0 auto' }}>
            <p className="section-title">What You Get</p>
            <h2 style={{ fontSize:'clamp(20px,4vw,28px)', fontWeight:700, letterSpacing:'-0.03em', marginBottom:32 }}>Benefits & Rewards</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px,1fr))', gap:14 }}>
              {BENEFITS.map(b => (
                <div key={b.title} style={{ padding:'20px', background:'#fff', border:'1px solid var(--border)', borderRadius:12, boxShadow:'var(--shadow)', transition:'transform 0.18s, box-shadow 0.18s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(108,61,224,0.13)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='var(--shadow)' }}>
                  <div style={{ width:36, height:36, background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--gold)', marginBottom:12 }}>
                    {b.icon}
                  </div>
                  <div style={{ fontWeight:600, fontSize:13, marginBottom:4 }}>{b.title}</div>
                  <div style={{ fontSize:12, color:'var(--text-dim)', lineHeight:1.65 }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Process ── */}
        <section style={{ padding:'clamp(48px,8vw,80px) clamp(20px,5vw,72px)', borderBottom:'1px solid var(--border)', background:'#fff' }}>
          <div style={{ maxWidth:1000, margin:'0 auto' }}>
            <p className="section-title">How It Works</p>
            <h2 style={{ fontSize:'clamp(20px,4vw,28px)', fontWeight:700, letterSpacing:'-0.03em', marginBottom:32 }}>Six Steps to Innovation</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px,1fr))', gap:14 }}>
              {STEPS.map(s => (
                <div key={s.n} style={{ padding:'20px', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:12, position:'relative', overflow:'hidden' }}>
                  <div style={{ fontFamily:'monospace', fontSize:28, fontWeight:700, color:'rgba(108,61,224,0.07)', position:'absolute', top:8, right:12, lineHeight:1, userSelect:'none' }}>{s.n}</div>
                  <div style={{ fontSize:11, color:'var(--gold)', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:8 }}>{s.n}</div>
                  <div style={{ fontWeight:600, fontSize:14, marginBottom:5 }}>{s.label}</div>
                  <div style={{ fontSize:12, color:'var(--text-dim)', lineHeight:1.65 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding:'clamp(48px,8vw,72px) clamp(20px,5vw,72px)', background:'linear-gradient(135deg, #5a2fcf 0%, #7c4de8 100%)', textAlign:'center', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-40px', right:'-40px', width:280, height:280, borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:'-60px', left:'-30px', width:240, height:240, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }}/>
          <div style={{ position:'relative', zIndex:1 }}>
            <h2 style={{ fontSize:'clamp(20px,4vw,30px)', fontWeight:700, letterSpacing:'-0.03em', marginBottom:10, color:'#fff' }}>Ready to Submit Your Idea?</h2>
            <p style={{ color:'rgba(255,255,255,0.65)', marginBottom:28, fontSize:14 }}>Join PMRG's innovation ecosystem and turn your vision into reality.</p>
            {user
              ? <Link to="/submit" className="btn btn-lg" style={{ background:'#fff', color:'var(--gold)', boxShadow:'0 4px 20px rgba(0,0,0,0.15)' }}>Submit Your Idea <ArrowRight size={16}/></Link>
              : <Link to="/register" className="btn btn-lg" style={{ background:'#fff', color:'var(--gold)', boxShadow:'0 4px 20px rgba(0,0,0,0.15)' }}>Get Started <ArrowRight size={16}/></Link>
            }
          </div>
        </section>

      </main>

      {/* Shared Footer component — replaces old inline footer */}
      <Footer />
    </>
  )
}