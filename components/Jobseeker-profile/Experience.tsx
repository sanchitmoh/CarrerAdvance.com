'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Briefcase, Plus, Edit, Trash2, Save, X, Building, Calendar } from 'lucide-react'

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

  // Load experiences on component mount
  useEffect(() => {
    const loadExperiences = async () => {
      try {
        // Get jobseeker ID from localStorage (set after login)
        const jobseekerId = localStorage.getItem('jobseeker_id');
        
        if (!jobseekerId) {
          console.error('No jobseeker ID found. Please login again.');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/seeker/profile/get_experience?jobseeker_id=${jobseekerId}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const formattedExperiences = data.data.map((exp: any) => ({
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
          setExperiences(formattedExperiences);
        }
      } catch (error) {
        console.error('Error loading experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExperiences();
  }, []);

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
    try {
      if (!editingExperience) {
        return
      }
      const jobseekerId = localStorage.getItem('jobseeker_id');
      
      if (!jobseekerId) {
        console.error('No jobseeker ID found. Please login again.');
        return;
      }

      const startDateStr = monthInputToMonthYear(editingExperience.startMonth)
      const endDateStr = editingExperience.current ? 'Present' : monthInputToMonthYear(editingExperience.endMonth)

      const response = await fetch('/api/seeker/profile/update_experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          jobseeker_id: jobseekerId,
          jobTitle: editingExperience.jobTitle,
          company: editingExperience.company,
          location: editingExperience.location,
          startDate: startDateStr,
          endDate: endDateStr,
          description: editingExperience.description
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Reload experiences
        const reloadResponse = await fetch(`/api/seeker/profile/get_experience?jobseeker_id=${jobseekerId}`);
        const reloadData = await reloadResponse.json();
        
        if (reloadData.success && reloadData.data) {
          const formattedExperiences = reloadData.data.map((exp: any) => ({
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
          setExperiences(formattedExperiences);
        }
        
        setEditingId(null);
        setEditingExperience(null);
      } else {
        console.error('Failed to update experience:', data.message);
      }
    } catch (error) {
      console.error('Error updating experience:', error);
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditingExperience(null)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/seeker/profile/delete_experience?id=${id}`, {
        method: 'GET',
      });

      const data = await response.json();
      
      if (data.success) {
        setExperiences(experiences.filter(exp => exp.id !== id));
      } else {
        console.error('Failed to delete experience:', data.message);
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  }

  const handleAdd = async () => {
    try {
      const jobseekerId = localStorage.getItem('jobseeker_id');
      
      if (!jobseekerId) {
        console.error('No jobseeker ID found. Please login again.');
        return;
      }

      const startDateStr = monthInputToMonthYear(newExperience.startMonth)
      const endDateStr = newExperience.current ? 'Present' : monthInputToMonthYear(newExperience.endMonth)

      const response = await fetch('/api/seeker/profile/add_experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobseeker_id: jobseekerId,
          jobTitle: newExperience.jobTitle,
          company: newExperience.company,
          location: newExperience.location,
          startDate: startDateStr,
          endDate: endDateStr,
          description: newExperience.description
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Reload experiences
        const reloadResponse = await fetch(`/api/seeker/profile/get_experience?jobseeker_id=${jobseekerId}`);
        const reloadData = await reloadResponse.json();
        
        if (reloadData.success && reloadData.data) {
          const formattedExperiences = reloadData.data.map((exp: any) => ({
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
          setExperiences(formattedExperiences);
        }
        
        setNewExperience({
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
        });
        setIsAdding(false);
      } else {
        console.error('Failed to add experience:', data.message);
      }
    } catch (error) {
      console.error('Error adding experience:', error);
    }
  }

  const formatDate = (dateString: string) => {
    return dateString || 'Present'
  }

  return (
    <Card className="border-emerald-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Briefcase className="h-5 w-5 text-emerald-600" />
            <div>
              <CardTitle className="text-emerald-800">Work Experience</CardTitle>
              <CardDescription className="text-emerald-600">
                Your professional work history
              </CardDescription>
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
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Add New Experience Form */}
          {isAdding && (
            <Card className="border-2 border-dashed border-emerald-300 bg-emerald-50/50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newJobTitle">Job Title</Label>
                      <Input
                        id="newJobTitle"
                        value={newExperience.jobTitle}
                        onChange={(e) => setNewExperience({...newExperience, jobTitle: e.target.value})}
                        className="border-emerald-300 focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newCompany">Company</Label>
                      <Input
                        id="newCompany"
                        value={newExperience.company}
                        onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                        className="border-emerald-300 focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newLocation">Location</Label>
                      <Input
                        id="newLocation"
                        value={newExperience.location}
                        onChange={(e) => setNewExperience({...newExperience, location: e.target.value})}
                        className="border-emerald-300 focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newStartDate">Start Date</Label>
                      <Input
                        id="newStartDate"
                        type="month"
                        value={newExperience.startMonth}
                        onChange={(e) => setNewExperience({...newExperience, startMonth: e.target.value})}
                        className="border-emerald-300 focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newEndDate">End Date</Label>
                      <Input
                        id="newEndDate"
                        type="month"
                        value={newExperience.endMonth}
                        onChange={(e) => setNewExperience({...newExperience, endMonth: e.target.value})}
                        className="border-emerald-300 focus:border-emerald-500"
                        disabled={newExperience.current}
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <input
                        id="newCurrent"
                        type="checkbox"
                        checked={newExperience.current}
                        onChange={(e) => setNewExperience({
                          ...newExperience,
                          current: e.target.checked,
                          endMonth: e.target.checked ? '' : newExperience.endMonth
                        })}
                        aria-labelledby="newCurrentLabel"
                        title="I currently work here"
                      />
                      <Label id="newCurrentLabel" htmlFor="newCurrent">I currently work here</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newDescription">Description</Label>
                    <Textarea
                      id="newDescription"
                      value={newExperience.description}
                      onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                      rows={3}
                      className="border-emerald-300 focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsAdding(false)}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAdd}
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Experience List */}
          {experiences.map((experience) => (
            <Card key={experience.id} className="border-gray-200 hover:border-emerald-300 transition-colors">
              <CardContent className="p-6">
                {editingId === experience.id && editingExperience ? (
                  // Edit Form
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Job Title</Label>
                        <Input
                          value={editingExperience.jobTitle}
                          onChange={(e) => setEditingExperience({...editingExperience, jobTitle: e.target.value})}
                          className="border-emerald-300 focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input
                          value={editingExperience.company}
                          onChange={(e) => setEditingExperience({...editingExperience, company: e.target.value})}
                          className="border-emerald-300 focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={editingExperience.location}
                          onChange={(e) => setEditingExperience({...editingExperience, location: e.target.value})}
                          className="border-emerald-300 focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="month"
                          value={editingExperience.startMonth}
                          onChange={(e) => setEditingExperience({
                            ...editingExperience,
                            startMonth: e.target.value,
                            startDate: monthInputToMonthYear(e.target.value)
                          })}
                          className="border-emerald-300 focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="month"
                          value={editingExperience.endMonth}
                          onChange={(e) => setEditingExperience({
                            ...editingExperience,
                            endMonth: e.target.value,
                            endDate: monthInputToMonthYear(e.target.value)
                          })}
                          className="border-emerald-300 focus:border-emerald-500"
                          disabled={editingExperience.current}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        id="editCurrent"
                        type="checkbox"
                        checked={editingExperience.current}
                        onChange={(e) => setEditingExperience({
                          ...editingExperience,
                          current: e.target.checked,
                          endMonth: e.target.checked ? '' : editingExperience.endMonth,
                          endDate: e.target.checked ? 'Present' : editingExperience.endDate
                        })}
                        aria-labelledby="editCurrentLabel"
                        title="I currently work here"
                      />
                      <Label id="editCurrentLabel" htmlFor="editCurrent">I currently work here</Label>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={editingExperience.description}
                        onChange={(e) => setEditingExperience({...editingExperience, description: e.target.value})}
                        rows={3}
                        className="border-emerald-300 focus:border-emerald-500"
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleSave(experience.id)}
                        className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Building className="h-5 w-5 text-emerald-600" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{experience.jobTitle}</h3>
                          <p className="text-emerald-600 font-medium">{experience.company}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{experience.startDate} - {experience.current ? 'Present' : experience.endDate}</span>
                        </div>
                        <span>•</span>
                        <span>{experience.location}</span>
                        {experience.current && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Current
                          </Badge>
                        )}
                      </div>

                      <p className="text-gray-700 mb-4">{experience.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {experience.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="border-emerald-200 text-emerald-700">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(experience.id)}
                        className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(experience.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {experiences.length === 0 && !isAdding && (
            <div className="text-center py-12 text-gray-500">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No work experience added yet</p>
              <p className="mb-4">Add your professional experience to showcase your career journey</p>
              <Button
                onClick={() => setIsAdding(true)}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Experience
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
