import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, FolderKanban, KeyRound } from 'lucide-react'
import api, { getErrorMessage } from '../lib/api'
import { useAuth } from '../context/useAuth'

export default function AuthPage({ mode }) {
  const { token } = useParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ fullname: '', username: '', email: '', password: '', confirmPassword: '' })
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (mode !== 'verify' || !token) return
    let active = true
    setBusy(true)
    api.get(`/auth/verify-email/${token}`)
      .then((response) => {
        if (active) {
          setNotice(response.data.message || 'Your email is verified. You can now sign in.')
          setVerified(true)
        }
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError))
      })
      .finally(() => active && setBusy(false))
    return () => { active = false }
  }, [mode, token])

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
    setError('')
    setNotice('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setNotice('')

    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password })
        navigate('/')
      } else if (mode === 'register') {
        const response = await api.post('/auth/register', {
          fullname: form.fullname,
          username: form.username.toLowerCase(),
          email: form.email,
          password: form.password,
        })
        setNotice(response.data.message || 'Account created. Check your email to verify your account.')
      } else if (mode === 'forgot') {
        const response = await api.post('/auth/forgot-password', { email: form.email })
        setNotice(response.data.message || 'If your account exists, a reset link is on its way.')
      } else if (mode === 'reset') {
        if (form.password !== form.confirmPassword) {
          setError('Passwords do not match.')
          return
        }
        const response = await api.post(`/auth/reset-password/${token}`, {
          newPassword: form.password,
          confirmPassword: form.confirmPassword,
        })
        setNotice(response.data.message || 'Password updated. You can sign in now.')
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setBusy(false)
    }
  }

  const title = {
    login: 'Sign in to your account',
    register: 'Create your account',
    forgot: 'Reset your password',
    reset: 'Choose a new password',
    verify: verified ? 'Email verified' : 'Verify your email',
  }[mode]

  const description = {
    login: 'Welcome back. Please enter your details.',
    register: 'Bring your projects and team into one calm workspace.',
    forgot: 'We will send a password reset link to your inbox.',
    reset: 'Use a new password with at least 8 characters.',
    verify: 'Confirming the email address linked to your account.',
  }[mode]

  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <Link to="/login" className="brand auth-brand"><span className="brand-mark"><FolderKanban size={20} /></span><span>Project Management Platform</span></Link>
        <div className="auth-brand-content">
          <h1>Bring your projects, tasks and teams together.</h1>
          <p>A modern workspace designed for execution, collaboration, and clarity.</p>
        </div>
        <div className="auth-panel-footer">Designed for teams that deliver.</div>
      </section>
      <section className="auth-form-panel">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand"><span className="brand-mark"><FolderKanban size={20} /></span> Project Management Platform</div>
          <span className="auth-icon"><KeyRound size={20} /></span>
          <h2>{title}</h2>
          <p className="auth-description">{description}</p>

          {error && <div className="alert alert-error" role="alert">{error}</div>}
          {notice && <div className="alert alert-success" role="status"><CheckCircle2 size={17} />{notice}</div>}

          {mode === 'verify' ? (
            <div className="verify-actions">
              {busy && <div className="inline-loading"><span className="spinner" /> Verifying your email...</div>}
              <Link className="button button-primary button-full" to="/login">Continue to sign in <ArrowRight size={17} /></Link>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === 'register' && <>
                <label>Full name <input name="fullname" value={form.fullname} onChange={updateField} placeholder="Alex Morgan" autoComplete="name" /></label>
                <label>Username <input name="username" value={form.username} onChange={updateField} placeholder="alexmorgan" autoComplete="username" minLength="3" required /></label>
              </>}
              {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
                <label>Email address <input name="email" type="email" value={form.email} onChange={updateField} placeholder="you@company.com" autoComplete="email" required /></label>
              )}
              {(mode === 'login' || mode === 'register' || mode === 'reset') && (
                <label>{mode === 'reset' ? 'New password' : 'Password'}
                  <input name="password" type="password" value={form.password} onChange={updateField} placeholder="At least 8 characters" minLength="8" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required />
                </label>
              )}
              {mode === 'reset' && (
                <label>Confirm password <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={updateField} placeholder="Enter your password again" minLength="8" autoComplete="new-password" required /></label>
              )}
              {mode === 'login' && <div className="form-meta"><span>Secure sign in</span><Link to="/forgot-password">Forgot password?</Link></div>}
              <button className="button button-primary button-full" type="submit" disabled={busy}>
                {busy ? <><span className="spinner spinner-light" /> Please wait...</> : <>{mode === 'login' ? 'Sign in' : mode === 'register' ? 'Create account' : mode === 'forgot' ? 'Send reset link' : 'Update password'} <ArrowRight size={17} /></>}
              </button>
            </form>
          )}

          <div className="auth-switch">
            {mode === 'login' && <>New to workspace? <Link to="/register">Create an account</Link></>}
            {mode === 'register' && <>Already have an account? <Link to="/login">Sign in</Link></>}
            {(mode === 'forgot' || mode === 'reset' || mode === 'verify') && <Link to="/login">Back to sign in</Link>}
          </div>
        </div>
        <div className="auth-legal">By continuing, you agree to use this workspace responsibly.</div>
      </section>
    </main>
  )
}
