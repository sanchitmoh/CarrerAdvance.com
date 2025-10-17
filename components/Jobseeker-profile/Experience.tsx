'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Briefcase, Plus, Edit, Trash2, Save, Building, Calendar } from 'lucide-react'

function monthInputToMonthYear(value: string): string {
  if (!value) return ''
  const [year, month] = value.split('-')
  if (!year || !month) return ''
  const date = new Date(Number(year), Number(month) - 1, 1)
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' })
}

function monthYearToMonthInput(value: string): string {
  if (!value || value === 'Present') return ''
  const [monthName, year] = value.split(' ')
  if (!monthName || !year) return ''
  const monthIndex = [
    'January','February','March','April','May','June','July','August','September','October','November','December'
  ].indexOf(monthName)
  if (monthIndex === -1) return ''
  const month = String(monthIndex + 1).padStart(2, '0')
  return `${year}-${month}`
}

interface ExperienceItem {
  id: string
  jobTitle: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  skills: string[]
}

type FormExperience = ExperienceItem & { startMonth: string; endMonth: string }

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([])
  const [loading, setLoading] = useState(true)

  // Load experiences
  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const jobseekerId = localStorage.getItem('jobseeker_id');
        if (!jobseekerId) { setLoading(false); return; }

        const response = await fetch(`/api/seeker/profile/get_experience?jobseeker_id=${jobseekerId}`);
        const data = await response.json();

        if (data.success && data.data) {
          const formatted = data.data.map((exp: any) => ({
            id: exp.id.toString(),
            jobTitle: exp.job_title,
            company: exp.company,
            location: exp.location,
            startDate: exp.start_date,
            endDate: exp.end_date || '',
            current: exp.current === 1,
            description: exp.description,
            skills: exp.skills ? JSON.parse(exp.skills) : []
          }));
          setExperiences(formatted);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    loadExperiences()
  }, [])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [editingExperience, setEditingExperience] = useState<FormExperience | null>(null)
  const [newExperience, setNewExperience] = useState<Omit<FormExperience, 'id'>>({
    jobTitle: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    startMonth: '',
    endMonth: '',
    current: false,
    description: '',
    skills: []
  })

  const handleEdit = (id: string) => {
    const experience = experiences.find(exp => exp.id === id)
    if (experience) {
      setEditingId(id)
      setEditingExperience({ 
        ...experience, 
        startMonth: monthYearToMonthInput(experience.startDate),
        endMonth: monthYearToMonthInput(experience.endDate)
      })
    }
  }

  const handleSave = async (id: string) => {
    if (!editingExperience) return
    try {
      try { (window as any).ProfileSave?.start('Saving experience...') } catch {}
      const jobseekerId = localStorage.getItem('jobseeker_id');
      if (!jobseekerId) return;

      const startDateStr = monthInputToMonthYear(editingExperience.startMonth)
      const endDateStr = editingExperience.current ? 'Present' : monthInputToMonthYear(editingExperience.endMonth)

      const response = await fetch('/api/seeker/profile/update_experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          jobseeker_id: jobseekerId,
          jobTitle: editingExperience.jobTitle,
          company: editingExperience.company,
          location: editingExperience.location,
          startDate: startDateStr,
          endDate: endDateStr,
          description: editingExperience.description
        })
      });

      const data = await response.json();
      if (data.success) {
        // reload
        const reloadResponse = await fetch(`/api/seeker/profile/get_experience?jobseeker_id=${jobseekerId}`);
        const reloadData = await reloadResponse.json();
        if (reloadData.success && reloadData.data) {
          const formatted = reloadData.data.map((exp: any) => ({
            id: exp.id.toString(),
            jobTitle: exp.job_title,
            company: exp.company,
            location: exp.location,
            startDate: exp.start_date,
            endDate: exp.end_date || '',
            current: exp.current === 1,
            description: exp.description,
            skills: exp.skills ? JSON.parse(exp.skills) : []
          }));
          setExperiences(formatted);
        }
        setEditingId(null)
        setEditingExperience(null)
        try { (window as any).ProfileSave?.success('Experience saved.') } catch {}
      } else { console.error(data.message); try { (window as any).ProfileSave?.error(data.message || 'Failed to save experience.') } catch {} }
    } catch (err) { console.error(err); try { (window as any).ProfileSave?.error('Failed to save experience.') } catch {} }
  }

  const handleCancel = () => { setEditingId(null); setEditingExperience(null) }

  const handleDelete = async (id: string) => {
    try {
      try { (window as any).ProfileSave?.start('Deleting experience...') } catch {}
      const jobseekerIdForDelete = localStorage.getItem('jobseeker_id');
      const deleteUrl = jobseekerIdForDelete
        ? `/api/seeker/profile/delete_experience?id=${id}&jobseeker_id=${jobseekerIdForDelete}`
        : `/api/seeker/profile/delete_experience?id=${id}`;
      const response = await fetch(deleteUrl, { method: 'GET', cache: 'no-store' });
      const data = await response.json();
      if (data.success) {
        // Ensure fresh data after deletion
        const jobseekerId = localStorage.getItem('jobseeker_id');
        if (jobseekerId) {
          const reloadResponse = await fetch(`/api/seeker/profile/get_experience?jobseeker_id=${jobseekerId}`, { cache: 'no-store' });
          const reloadData = await reloadResponse.json();
          if (reloadData.success && reloadData.data) {
            const formatted = reloadData.data.map((exp: any) => ({
              id: exp.id.toString(),
              jobTitle: exp.job_title,
              company: exp.company,
              location: exp.location,
              startDate: exp.start_date,
              endDate: exp.end_date || '',
              current: exp.current === 1,
              description: exp.description,
              skills: exp.skills ? JSON.parse(exp.skills) : []
            }));
            setExperiences(formatted);
          } else {
            // Fallback: optimistic update
            setExperiences(prev => prev.filter(e => e.id !== id));
          }
        } else {
          setExperiences(prev => prev.filter(e => e.id !== id));
        }
        try { (window as any).ProfileSave?.success('Experience deleted.') } catch {}
      }
      else { console.error(data.message); try { (window as any).ProfileSave?.error(data.message || 'Failed to delete experience.') } catch {} }
    } catch (err) { console.error(err); try { (window as any).ProfileSave?.error('Failed to delete experience.') } catch {} }
  }

  const handleAdd = async () => {
    try {
      try { (window as any).ProfileSave?.start('Adding experience...') } catch {}
      const jobseekerId = localStorage.getItem('jobseeker_id');
      if (!jobseekerId) return;

      const startDateStr = monthInputToMonthYear(newExperience.startMonth)
      const endDateStr = newExperience.current ? 'Present' : monthInputToMonthYear(newExperience.endMonth)

      const response = await fetch('/api/seeker/profile/add_experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobseeker_id: jobseekerId,
          jobTitle: newExperience.jobTitle,
          company: newExperience.company,
          location: newExperience.location,
          startDate: startDateStr,
          endDate: endDateStr,
          description: newExperience.description
        })
      });

      const data = await response.json();
      if (data.success) {
        const reloadResponse = await fetch(`/api/seeker/profile/get_experience?jobseeker_id=${jobseekerId}`);
        const reloadData = await reloadResponse.json();
        if (reloadData.success && reloadData.data) {
          const formatted = reloadData.data.map((exp: any) => ({
            id: exp.id.toString(),
            jobTitle: exp.job_title,
            company: exp.company,
            location: exp.location,
            startDate: exp.start_date,
            endDate: exp.end_date || '',
            current: exp.current === 1,
            description: exp.description,
            skills: exp.skills ? JSON.parse(exp.skills) : []
          }));
          setExperiences(formatted);
        }
        setNewExperience({
          jobTitle: '', company: '', location: '', startDate: '', endDate: '',
          startMonth: '', endMonth: '', current: false, description: '', skills: []
        })
        setIsAdding(false)
        try { (window as any).ProfileSave?.success('Experience added.') } catch {}
      } else { console.error(data.message); try { (window as any).ProfileSave?.error(data.message || 'Failed to add experience.') } catch {} }
    } catch (err) { console.error(err); try { (window as any).ProfileSave?.error('Failed to add experience.') } catch {} }
  }

  return (
    <Card className="border-emerald-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="flex items-center space-x-3">
            <Briefcase className="h-5 w-5 text-emerald-600" />
            <div>
              <CardTitle className="text-emerald-800">Work Experience</CardTitle>
              <CardDescription className="text-emerald-600">Your professional work history</CardDescription>
            </div>
          </div>
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Add Experience Form */}
        {isAdding && (
          <Card className="border-2 border-dashed border-emerald-300 bg-emerald-50/50">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Job Title</Label><Input value={newExperience.jobTitle} onChange={(e)=>setNewExperience({...newExperience,jobTitle:e.target.value})}/></div>
                <div className="space-y-2"><Label>Company</Label><Input value={newExperience.company} onChange={(e)=>setNewExperience({...newExperience,company:e.target.value})}/></div>
                <div className="space-y-2"><Label>Location</Label><Input value={newExperience.location} onChange={(e)=>setNewExperience({...newExperience,location:e.target.value})}/></div>
                <div className="space-y-2"><Label>Start Date</Label><Input type="month" value={newExperience.startMonth} onChange={(e)=>setNewExperience({...newExperience,startMonth:e.target.value})}/></div>
                <div className="space-y-2"><Label>End Date</Label><Input type="month" value={newExperience.endMonth} onChange={(e)=>setNewExperience({...newExperience,endMonth:e.target.value})} disabled={newExperience.current}/></div>
                <div className="flex items-center space-x-2 pt-6">
                  <input id="new-current" aria-label="I currently work here" type="checkbox" checked={newExperience.current} onChange={(e)=>setNewExperience({...newExperience,current:e.target.checked,endMonth:e.target.checked?'':newExperience.endMonth})}/>
                  <Label htmlFor="new-current">I currently work here</Label>
                </div>
              </div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={newExperience.description} onChange={(e)=>setNewExperience({...newExperience,description:e.target.value})} rows={3}/></div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={()=>setIsAdding(false)}>Cancel</Button>
                <Button onClick={handleAdd} className="bg-gradient-to-r from-emerald-600 to-green-600 text-white"><Save className="h-4 w-4 mr-2"/>Add Experience</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Experience List */}
        {experiences.map(exp => (
          <Card key={exp.id} className="border-gray-200 hover:border-emerald-300 transition-colors">
            <CardContent className="p-6">
              {editingId===exp.id && editingExperience ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Job Title</Label><Input value={editingExperience.jobTitle} onChange={(e)=>setEditingExperience({...editingExperience,jobTitle:e.target.value})}/></div>
                    <div className="space-y-2"><Label>Company</Label><Input value={editingExperience.company} onChange={(e)=>setEditingExperience({...editingExperience,company:e.target.value})}/></div>
                    <div className="space-y-2"><Label>Location</Label><Input value={editingExperience.location} onChange={(e)=>setEditingExperience({...editingExperience,location:e.target.value})}/></div>
                    <div className="space-y-2"><Label>Start Date</Label><Input type="month" value={editingExperience.startMonth} onChange={(e)=>setEditingExperience({...editingExperience,startMonth:e.target.value,startDate:monthInputToMonthYear(e.target.value)})}/></div>
                    <div className="space-y-2"><Label>End Date</Label><Input type="month" value={editingExperience.endMonth} onChange={(e)=>setEditingExperience({...editingExperience,endMonth:e.target.value,endDate:monthInputToMonthYear(e.target.value)})} disabled={editingExperience.current}/></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input id={`edit-current-${exp.id}`} aria-label="I currently work here" type="checkbox" checked={editingExperience.current} onChange={(e)=>setEditingExperience({...editingExperience,current:e.target.checked,endMonth:e.target.checked?'':editingExperience.endMonth,endDate:e.target.checked?'Present':editingExperience.endDate})}/>
                    <Label htmlFor={`edit-current-${exp.id}`}>I currently work here</Label>
                  </div>
                  <div className="space-y-2"><Label>Description</Label><Textarea value={editingExperience.description} onChange={(e)=>setEditingExperience({...editingExperience,description:e.target.value})} rows={3}/></div>
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={()=>handleSave(exp.id)} className="bg-gradient-to-r from-emerald-600 to-green-600 text-white"><Save className="h-4 w-4 mr-2"/>Save Changes</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-emerald-600"/>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{exp.jobTitle}</h3>
                        <p className="text-emerald-600 font-medium">{exp.company}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1"><Calendar className="h-4 w-4"/>{exp.startDate} - {exp.current?'Present':exp.endDate}</div>
                      <span>{exp.location}</span>
                      {exp.current && <Badge className="bg-green-100 text-green-700">Current</Badge>}
                    </div>
                    <p className="text-gray-700">{exp.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((s,i)=><Badge key={i} className="border-emerald-200 text-emerald-700">{s}</Badge>)}
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3 md:mt-0">
                    <Button variant="outline" size="sm" onClick={()=>handleEdit(exp.id)} className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"><Edit className="h-4 w-4"/></Button>
                    <Button variant="outline" size="sm" onClick={()=>handleDelete(exp.id)} className="border-red-200 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4"/></Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {experiences.length===0 && !isAdding && (
          <div className="text-center py-12 text-gray-500">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300"/>
            <p className="text-lg font-medium mb-2">No work experience added yet</p>
            <p className="mb-4">Add your professional experience to showcase your career journey</p>
            <Button onClick={()=>setIsAdding(true)} className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
              <Plus className="h-4 w-4 mr-2"/>Add Your First Experience
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
