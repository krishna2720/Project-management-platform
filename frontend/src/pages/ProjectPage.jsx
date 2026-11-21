import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, CheckCircle2, Circle, FileText, Plus, Trash2, Users, X } from 'lucide-react'
import api, { getErrorMessage } from '../lib/api'
import { useAuth } from '../context/useAuth'

const statuses = ['todo', 'in_progress', 'done']

function TaskStatus({ value }) {
  return <span className={`status-pill status-pill-${value || 'todo'}`}>{(value || 'todo').replace('_', ' ')}</span>
}

export default function ProjectPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [role, setRole] = useState('')
  const [tasks, setTasks] = useState([])
  const [notes, setNotes] = useState([])
  const [members, setMembers] = useState([])
  const [activeTab, setActiveTab] = useState('tasks')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedTo: '' })
  const [projectForm, setProjectForm] = useState({ name: '', description: '' })
  const [noteContent, setNoteContent] = useState('')
  const [memberForm, setMemberForm] = useState({ email: '', role: 'member' })
  const [saving, setSaving] = useState(false)

  const loadProject = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [projectResponse, taskResponse, noteResponse, memberResponse, projectsResponse] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get(`/tasks/${projectId}`),
        api.get(`/notes/${projectId}`),
        api.get(`/projects/${projectId}/members`),
        api.get('/projects'),
      ])
      setProject(projectResponse.data.data)
      setTasks(taskResponse.data.data || [])
      setNotes(noteResponse.data.data || [])
      setMembers(memberResponse.data.data || [])
      setRole(projectsResponse.data.data.find((item) => item.project._id === projectId)?.role || '')
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => { loadProject() }, [loadProject])

  const canManage = role === 'admin'
  const completed = tasks.filter((task) => task.status === 'done').length
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0

  function showSuccess(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3500)
  }

  async function createTask(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { title: taskForm.title, description: taskForm.description }
      if (taskForm.assignedTo) payload.assignedTo = taskForm.assignedTo
      const response = await api.post(`/tasks/${projectId}`, payload)
      setTasks((current) => [response.data.data, ...current])
      setTaskForm({ title: '', description: '', assignedTo: '' })
      setShowTaskForm(false)
      showSuccess('Task added to the project.')
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setSaving(false)
    }
  }

  async function updateTaskStatus(task, status) {
    if (task.status === status || !canManage) return
    try {
      const response = await api.put(`/tasks/${projectId}/${task._id}`, { status })
      setTasks((current) => current.map((item) => item._id === task._id ? response.data.data : item))
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    }
  }

  async function deleteTask(taskId) {
    if (!window.confirm('Delete this task? This cannot be undone.')) return
    try {
      await api.delete(`/tasks/${projectId}/${taskId}`)
      setTasks((current) => current.filter((task) => task._id !== taskId))
      showSuccess('Task deleted.')
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    }
  }

  async function saveProject(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const response = await api.put(`/projects/${projectId}`, projectForm)
      setProject(response.data.data)
      setShowProjectForm(false)
      showSuccess('Project details updated.')
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setSaving(false)
    }
  }

  async function deleteProject() {
    if (!window.confirm('Delete this project and its membership records? The backend may leave existing tasks and notes behind. This cannot be undone.')) return
    try {
      await api.delete(`/projects/${projectId}`)
      navigate('/')
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    }
  }

  async function createNote(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const response = await api.post(`/notes/${projectId}`, { content: noteContent })
      setNotes((current) => [response.data.data, ...current])
      setNoteContent('')
      setShowNoteForm(false)
      showSuccess('Note added.')
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setSaving(false)
    }
  }

  async function saveNote(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const response = await api.put(`/notes/${projectId}/${editingNote._id}`, { content: editingNote.content })
      setNotes((current) => current.map((note) => note._id === editingNote._id ? response.data.data : note))
      setEditingNote(null)
      showSuccess('Note updated.')
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setSaving(false)
    }
  }

  async function deleteNote(noteId) {
    if (!window.confirm('Delete this note? This cannot be undone.')) return
    try {
      await api.delete(`/notes/${projectId}/${noteId}`)
      setNotes((current) => current.filter((note) => note._id !== noteId))
      showSuccess('Note deleted.')
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    }
  }

  async function addMember(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.post(`/projects/${projectId}/members`, memberForm)
      setShowMemberForm(false)
      setMemberForm({ email: '', role: 'member' })
      await loadProject()
      showSuccess('Team member added.')
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setSaving(false)
    }
  }

  async function updateMemberRole(member, newrole) {
    try {
      await api.put(`/projects/${projectId}/members/${member.user?._id || member.user}`, { newrole })
      setMembers((current) => current.map((item) => item._id === member._id ? { ...item, role: newrole } : item))
      showSuccess('Member role updated.')
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    }
  }

  async function removeMember(member) {
    if (!window.confirm('Remove this member from the project?')) return
    try {
      await api.delete(`/projects/${projectId}/members/${member.user?._id || member.user}`)
      setMembers((current) => current.filter((item) => item._id !== member._id))
      showSuccess('Member removed.')
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    }
  }

  const memberOptions = useMemo(() => members.map((member) => ({
    id: member.user?._id || member.user,
    role: member.role,
  })).filter((member) => member.id), [members])

  if (loading) return <div className="loading-panel project-loading"><span className="spinner" /> Loading project...</div>

  return (
    <>
      <div className="project-back"><Link to="/"><ArrowLeft size={16} /> All projects</Link></div>
      {error && <div className="alert alert-error dashboard-alert" role="alert">{error}</div>}
      {notice && <div className="toast"><CheckCircle2 size={18} />{notice}</div>}
      {!project ? <div className="empty-state"><h3>Project could not be loaded</h3><p>Check that you have access and try again.</p><button className="button button-secondary" onClick={loadProject}>Try again</button></div> : <>
        <section className="project-hero">
          <div className="project-hero-main">
            <span className="eyebrow">PROJECT WORKSPACE</span>
            <h1>{project.name}</h1>
            <p>{project.description || 'No project description has been added.'}</p>
            <div className="project-hero-meta"><span className="role-pill role-admin">{role || 'member'}</span><span><Users size={15} /> {members.length} {members.length === 1 ? 'member' : 'members'}</span></div>
          </div>
          <div className="project-progress-card"><div className="progress-label"><span>Overall progress</span><strong>{progress}%</strong></div><div className="progress-track progress-large"><span style={{ width: `${progress}%` }} /></div><small>{completed} of {tasks.length} tasks completed</small></div>
        </section>
        {canManage && <div className="project-header-actions">
            <button className="button button-secondary button-compact" onClick={() => { setProjectForm({ name: project.name, description: project.description || '' }); setShowProjectForm(true) }}>Edit project</button>
            {project.createdBy?.toString() === user?._id?.toString() && <button className="button button-danger button-compact" onClick={deleteProject}><Trash2 size={14} /> Delete project</button>}
        </div>}
        {showProjectForm && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setShowProjectForm(false)}>
            <div className="modal">
              <div className="modal-heading"><div><span className="eyebrow">PROJECT SETTINGS</span><h2>Edit project</h2></div><button className="icon-button" onClick={() => setShowProjectForm(false)} aria-label="Close"><X size={19} /></button></div>
              <form onSubmit={saveProject} className="stack-form">
                <label>Project name<input autoFocus required value={projectForm.name} onChange={(event) => setProjectForm({ ...projectForm, name: event.target.value })} /></label>
                <label>Description<textarea rows="3" value={projectForm.description} onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })} placeholder="What are you working on?" /></label>
                <div className="modal-actions"><button type="button" className="button button-secondary" onClick={() => setShowProjectForm(false)}>Cancel</button><button type="submit" className="button button-primary" disabled={saving}>{saving ? 'Saving...' : 'Save changes'} <Check size={15} /></button></div>
              </form>
            </div>
        </div>}

        <div className="project-tabs">
          <button className={activeTab === 'tasks' ? 'tab-active' : ''} onClick={() => setActiveTab('tasks')}><CheckCircle2 size={17} /> Tasks <span>{tasks.length}</span></button>
          <button className={activeTab === 'notes' ? 'tab-active' : ''} onClick={() => setActiveTab('notes')}><FileText size={17} /> Notes <span>{notes.length}</span></button>
          <button className={activeTab === 'team' ? 'tab-active' : ''} onClick={() => setActiveTab('team')}><Users size={17} /> Team <span>{members.length}</span></button>
        </div>

        {activeTab === 'tasks' && <section className="section-block project-section">
          <div className="section-heading"><div><h2>Project tasks</h2><p>Manage the next steps for this project.</p></div>{canManage && <button className="button button-primary" onClick={() => { setShowTaskForm(!showTaskForm); setError('') }}><Plus size={17} /> Add task</button>}</div>
          {showTaskForm && <form className="inline-form task-create-form" onSubmit={createTask}>
            <div className="inline-form-title"><strong>New task</strong><button type="button" className="icon-button" onClick={() => setShowTaskForm(false)} aria-label="Close"><X size={18} /></button></div>
            <label>Task title<input autoFocus required value={taskForm.title} onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })} placeholder="What needs to be done?" /></label>
            <label>Description <span className="optional-label">Optional</span><textarea rows="2" value={taskForm.description} onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })} placeholder="Add a few details" /></label>
            {memberOptions.length > 0 && <label>Assign to <span className="optional-label">Optional</span><select value={taskForm.assignedTo} onChange={(event) => setTaskForm({ ...taskForm, assignedTo: event.target.value })}><option value="">Unassigned</option>{memberOptions.map((member) => <option key={member.id} value={member.id}>{member.id === user?._id ? 'You' : `Member ${member.id.slice(-5)}`} · {member.role}</option>)}</select></label>}
            <div className="inline-form-footer"><button className="button button-primary button-compact" disabled={saving}>{saving ? 'Adding...' : 'Add task'} <Plus size={15} /></button></div>
          </form>}
          {tasks.length ? <div className="project-task-list">{tasks.map((task) => <article className="project-task-row" key={task._id}>
            <span className={`task-status-mark status-${task.status || 'todo'}`}>{task.status === 'done' ? <CheckCircle2 size={18} /> : <Circle size={17} />}</span>
            <div className="project-task-copy"><strong>{task.title}</strong><p>{task.description || 'No description'}</p><small>{task.assignedTo?.username ? `Assigned to ${task.assignedTo.username}` : task.assignedTo?._id || task.assignedTo ? `Assigned · ${(task.assignedTo?._id || task.assignedTo).toString().slice(-6)}` : 'Unassigned'}</small></div>
            <div className="project-task-actions"><TaskStatus value={task.status} />{canManage && <select aria-label={`Update status for ${task.title}`} value={task.status || 'todo'} onChange={(event) => updateTaskStatus(task, event.target.value)}>{statuses.map((status) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}</select>}{canManage && <button className="icon-button danger-hover" onClick={() => deleteTask(task._id)} title="Delete task"><Trash2 size={16} /></button>}</div>
          </article>)}</div> : <div className="empty-state compact-empty"><div className="empty-icon"><CheckCircle2 size={22} /></div><h3>No tasks yet</h3><p>Tasks help the team turn this project into progress.</p>{canManage && <button className="button button-primary" onClick={() => setShowTaskForm(true)}><Plus size={16} /> Add your first task</button>}</div>}
        </section>}

        {activeTab === 'notes' && <section className="section-block project-section">
          <div className="section-heading"><div><h2>Project notes</h2><p>Keep important decisions and details together.</p></div>{canManage && <button className="button button-primary" onClick={() => { setShowNoteForm(!showNoteForm); setError('') }}><Plus size={17} /> Add note</button>}</div>
          {showNoteForm && <form className="inline-form" onSubmit={createNote}><div className="inline-form-title"><strong>New note</strong><button type="button" className="icon-button" onClick={() => setShowNoteForm(false)} aria-label="Close"><X size={18} /></button></div><label>Note content<textarea rows="5" required value={noteContent} onChange={(event) => setNoteContent(event.target.value)} placeholder="Write an update, decision, or useful detail..." /></label><div className="inline-form-footer"><button className="button button-primary button-compact" disabled={saving}>{saving ? 'Saving...' : 'Save note'} <Check size={15} /></button></div></form>}
          {notes.length ? <div className="notes-grid">{notes.map((note) => <article className="note-card" key={note._id}>
            {editingNote?._id === note._id ? <form onSubmit={saveNote} className="note-edit-form"><label>Edit note<textarea rows="5" required value={editingNote.content} onChange={(event) => setEditingNote({ ...editingNote, content: event.target.value })} /></label><div className="note-edit-actions"><button type="button" className="button button-secondary button-compact" onClick={() => setEditingNote(null)}>Cancel</button><button className="button button-primary button-compact" disabled={saving}>{saving ? 'Saving...' : 'Save'} <Check size={14} /></button></div></form> : <>
              <div className="note-card-top"><span><FileText size={17} /> Project note</span>{canManage && <div className="note-actions"><button className="icon-button" onClick={() => setEditingNote({ _id: note._id, content: note.content })} title="Edit note"><FileText size={15} /></button><button className="icon-button danger-hover" onClick={() => deleteNote(note._id)} title="Delete note"><Trash2 size={16} /></button></div>}</div><p>{note.content}</p><small>{note.createdBy?.username ? `Added by ${note.createdBy.username}` : 'Project team'} · {new Date(note.createdAt).toLocaleDateString()}</small>
            </>}</article>)}</div> : <div className="empty-state compact-empty"><div className="empty-icon"><FileText size={22} /></div><h3>No notes yet</h3><p>Capture project context so everyone stays on the same page.</p>{canManage && <button className="button button-primary" onClick={() => setShowNoteForm(true)}><Plus size={16} /> Add a note</button>}</div>}
        </section>}

        {activeTab === 'team' && <section className="section-block project-section">
          <div className="section-heading"><div><h2>Project team</h2><p>People collaborating in this workspace.</p></div>{canManage && <button className="button button-primary" onClick={() => { setShowMemberForm(!showMemberForm); setError('') }}><Plus size={17} /> Add member</button>}</div>
          {showMemberForm && <form className="inline-form member-form" onSubmit={addMember}><div className="inline-form-title"><strong>Invite a teammate</strong><button type="button" className="icon-button" onClick={() => setShowMemberForm(false)} aria-label="Close"><X size={18} /></button></div><label>Account email<input type="email" required value={memberForm.email} onChange={(event) => setMemberForm({ ...memberForm, email: event.target.value })} placeholder="teammate@company.com" /></label><label>Project role<select value={memberForm.role} onChange={(event) => setMemberForm({ ...memberForm, role: event.target.value })}><option value="member">Member</option><option value="project_admin">Project admin</option><option value="admin">Admin</option></select></label><div className="inline-form-footer"><button className="button button-primary button-compact" disabled={saving}>{saving ? 'Adding...' : 'Add member'} <Plus size={15} /></button></div></form>}
          <div className="member-list">{members.map((member) => {
            const memberId = member.user?._id || member.user
            const isSelf = memberId?.toString() === user?._id?.toString()
            return <article className="member-row" key={member._id}><div className="avatar">{isSelf ? (user?.username || 'U').slice(0, 2).toUpperCase() : <Users size={16} />}</div><div className="member-copy"><strong>{isSelf ? user?.fullname || user?.username : `Member ${memberId?.toString().slice(-6)}`}{isSelf && <span className="you-label">You</span>}</strong><small>{isSelf ? user?.email : `Account ID · ${memberId}`}</small></div>{canManage ? <select aria-label="Member role" value={member.role} onChange={(event) => updateMemberRole(member, event.target.value)}><option value="member">Member</option><option value="project_admin">Project admin</option><option value="admin">Admin</option></select> : <span className="role-pill">{member.role}</span>}{canManage && !isSelf && <button className="icon-button danger-hover" onClick={() => removeMember(member)} title="Remove member"><Trash2 size={16} /></button>}</article>
          })}</div>
          {!members.length && <div className="empty-state compact-empty"><h3>No members found</h3><p>Team membership will appear here.</p></div>}
        </section>}
      </>}
    </>
  )
}
