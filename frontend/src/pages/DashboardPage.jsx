import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, CheckCircle2, Circle, FolderKanban, Plus, Search, Users } from 'lucide-react'
import api, { getErrorMessage } from '../lib/api'
import { useAuth } from '../context/useAuth'

function StatCard({ icon: Icon, label, value, detail, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={19} /></div>
      <div className="stat-copy"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')

  async function loadDashboard() {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/projects')
      const projectList = response.data.data || []
      setProjects(projectList)
      const taskResults = await Promise.all(projectList.map(async ({ project }) => {
        try {
          const taskResponse = await api.get(`/tasks/${project._id}`)
          return { tasks: (taskResponse.data.data || []).map((task) => ({ ...task, projectName: project.name, projectId: project._id })) }
        } catch (taskError) {
          return { tasks: [], error: getErrorMessage(taskError) }
        }
      }))
      setTasks(taskResults.flatMap((result) => result.tasks))
      const taskFailure = taskResults.find((result) => result.error)
      if (taskFailure) setError(`Some project tasks could not be loaded: ${taskFailure.error}`)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadDashboard() }, [])

  const visibleProjects = useMemo(() => projects.filter(({ project }) =>
    `${project.name} ${project.description || ''}`.toLowerCase().includes(search.toLowerCase())
  ), [projects, search])

  async function createProject(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const response = await api.post('/projects', form)
      setProjects((current) => [...current, { project: { ...response.data.data, members: 1 }, role: 'admin' }])
      setForm({ name: '', description: '' })
      setShowCreate(false)
      setNotice('Project created successfully.')
      window.setTimeout(() => setNotice(''), 3500)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setSaving(false)
    }
  }

  const completedTasks = tasks.filter((task) => task.status === 'done').length
  const openTasks = tasks.length - completedTasks
  const greetingName = user?.fullname?.split(' ')[0] || user?.username || 'there'

  return (
    <>
      <section className="welcome-row">
        <div><span className="eyebrow">YOUR WORKSPACE</span><h1>Good to see you, {greetingName} <span className="wave">✦</span></h1><p>Here’s what’s happening across your projects.</p></div>
        <button className="button button-primary" onClick={() => { setShowCreate(true); setError('') }}><Plus size={17} /> New project</button>
      </section>

      {notice && <div className="toast"><CheckCircle2 size={18} />{notice}</div>}
      {error && <div className="alert alert-error dashboard-alert" role="alert">{error}</div>}

      <section className="stats-grid">
        <StatCard icon={FolderKanban} label="Your projects" value={loading ? '—' : projects.length} detail="Active workspaces" tone="blue" />
        <StatCard icon={Circle} label="Open tasks" value={loading ? '—' : openTasks} detail="Across all projects" tone="amber" />
        <StatCard icon={CheckCircle2} label="Completed" value={loading ? '—' : completedTasks} detail="Tasks finished" tone="green" />
        <StatCard icon={Users} label="Team spaces" value={loading ? '—' : projects.length} detail="Projects you belong to" tone="violet" />
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><h2>Your projects</h2><p>Keep your team’s work moving forward.</p></div>
          <div className="project-tools">
            <label className="search-field"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects" /></label>
            <button className="button button-secondary button-compact" onClick={() => setShowCreate(true)}><Plus size={16} /> Create</button>
          </div>
        </div>

        {loading ? <div className="loading-panel"><span className="spinner" /> Loading your projects...</div> : visibleProjects.length ? (
          <div className="project-grid">
            {visibleProjects.map(({ project, role }) => {
              const projectTasks = tasks.filter((task) => task.projectId === project._id)
              const done = projectTasks.filter((task) => task.status === 'done').length
              const progress = projectTasks.length ? Math.round((done / projectTasks.length) * 100) : 0
              return (
                <Link to={`/projects/${project._id}`} className="project-card" key={project._id}>
                  <div className="project-card-top"><span className="project-card-icon"><FolderKanban size={19} /></span><span className={`role-pill ${role === 'admin' ? 'role-admin' : ''}`}>{role || 'member'}</span></div>
                  <h3>{project.name}</h3>
                  <p>{project.description || 'No description yet. Open the project to add details.'}</p>
                  <div className="project-card-meta"><span><Users size={15} /> {project.members ?? 1} {project.members === 1 ? 'member' : 'members'}</span><span>{projectTasks.length} tasks</span></div>
                  <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
                  <div className="project-card-footer"><span>{progress}% complete</span><ArrowUpRight size={17} /></div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="empty-state"><div className="empty-icon"><FolderKanban size={23} /></div><h3>{search ? 'No matching projects' : 'Your first project starts here'}</h3><p>{search ? 'Try another search term.' : 'Create a project to bring tasks and teammates together.'}</p>{!search && <button className="button button-primary" onClick={() => setShowCreate(true)}><Plus size={16} /> Create a project</button>}</div>
        )}
      </section>

      <section className="section-block task-overview">
        <div className="section-heading"><div><h2>Recent tasks</h2><p>A quick look at work across your projects.</p></div></div>
        {loading ? <div className="loading-panel"><span className="spinner" /> Loading tasks...</div> : tasks.length ? (
          <div className="task-list">
            {tasks.slice(0, 5).map((task) => <Link className="task-row" key={task._id} to={`/projects/${task.projectId}`}>
              <span className={`task-status-mark status-${task.status || 'todo'}`}>{task.status === 'done' ? <CheckCircle2 size={17} /> : <Circle size={17} />}</span>
              <span className="task-row-title">{task.title}<small>{task.projectName}</small></span>
              <span className={`status-pill status-pill-${task.status || 'todo'}`}>{(task.status || 'todo').replace('_', ' ')}</span>
            </Link>)}
          </div>
        ) : <p className="muted-copy task-empty">{projects.length ? 'No tasks yet. Open a project to add the first one.' : 'Create a project to start organizing your tasks.'}</p>}
      </section>

      {showCreate && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setShowCreate(false)}>
        <div className="modal">
          <div className="modal-heading"><div><span className="eyebrow">NEW WORKSPACE</span><h2>Create a project</h2></div><button className="icon-button" onClick={() => setShowCreate(false)} aria-label="Close"><Plus className="close-icon" size={20} /></button></div>
          <form onSubmit={createProject} className="stack-form">
            <label>Project name<input autoFocus required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Website redesign" /></label>
            <label>Description <span className="optional-label">Optional</span><textarea rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="What are you working on?" /></label>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="modal-actions"><button type="button" className="button button-secondary" onClick={() => setShowCreate(false)}>Cancel</button><button type="submit" disabled={saving} className="button button-primary">{saving ? 'Creating...' : 'Create project'} <ArrowUpRight size={16} /></button></div>
          </form>
        </div>
      </div>}
    </>
  )
}
