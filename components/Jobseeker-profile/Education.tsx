'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Plus, Edit, Trash2, Save, X, School, Calendar, Award } from 'lucide-react'

interface EducationItem {
  id: string
  degree: string
  field: string
  institution: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  gpa: string
  description: string
  achievements: string[]
}

export default function Education() {
  const [educations, setEducations] = useState<EducationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [editingEducation, setEditingEducation] = useState<EducationItem | null>(null)
  const [newEducation, setNewEducation] = useState<Omit<EducationItem, 'id'>>({
    degree: '',
    field: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    gpa: '',
    description: '',
    achievements: []
  })

  // Load education on component mount
  useEffect(() => {
    const loadEducation = async () => {
      try {
        const jobseekerId = localStorage.getItem('jobseeker_id');
        if (!jobseekerId) {
          console.error('No jobseeker ID found. Please login again.');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/seeker/profile/get_education?jobseeker_id=${jobseekerId}`);
        const data = await response.json();

        if (data.success && data.data) {
          const formattedEducation = data.data.map((edu: any) => ({
            id: edu.id.toString(),
            degree: edu.degree,
            field: edu.field,
            institution: edu.institution,
            location: edu.location,
            startDate: edu.start_date,
            endDate: edu.end_date || '',
            current: edu.current === 1,
            gpa: edu.gpa || '',
            description: edu.description,
            achievements: edu.achievements ? JSON.parse(edu.achievements) : []
          }));
          setEducations(formattedEducation);
        }
      } catch (error) {
        console.error('Error loading education:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEducation();
  }, []);

  const degreeTypes = [
    'High School Diploma',
    'Associate Degree',
    'Bachelor of Arts',
    'Bachelor of Science',
    'Master of Arts',
    'Master of Science',
    'Master of Business Administration',
    'Doctor of Philosophy',
    'Professional Certificate',
    'Other'
  ]

  const handleEdit = (id: string) => {
    const education = educations.find(edu => edu.id === id)
    if (education) {
      setEditingId(id)
      setEditingEducation({ ...education })
    }
  }

  const handleSave = async (id: string) => {
    try {
      try { (window as any).ProfileSave?.start('Saving education...') } catch {}
      if (!editingEducation) return;
      const jobseekerId = localStorage.getItem('jobseeker_id');
      if (!jobseekerId) {
        console.error('No jobseeker ID found. Please login again.');
        return;
      }

      const response = await fetch('/api/seeker/profile/update_education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id,
          jobseeker_id: jobseekerId,
          degree: editingEducation.degree,
          field: editingEducation.field,
          institution: editingEducation.institution,
          location: editingEducation.location,
          endDate: editingEducation.endDate,
          description: editingEducation.description,
          gpa: editingEducation.gpa
        }),
      });

      const data = await response.json();

      if (data.success) {
        const reloadResponse = await fetch(`/api/seeker/profile/get_education?jobseeker_id=${jobseekerId}`);
        const reloadData = await reloadResponse.json();
        if (reloadData.success && reloadData.data) {
          const formattedEducation = reloadData.data.map((edu: any) => ({
            id: edu.id.toString(),
            degree: edu.degree,
            field: edu.field,
            institution: edu.institution,
            location: edu.location,
            startDate: edu.start_date,
            endDate: edu.end_date || '',
            current: edu.current === 1,
            gpa: edu.gpa || '',
            description: edu.description,
            achievements: edu.achievements ? JSON.parse(edu.achievements) : []
          }));
          setEducations(formattedEducation);
        }
        setEditingId(null);
        setEditingEducation(null);
        try { (window as any).ProfileSave?.success('Education saved.') } catch {}
      } else {
        console.error('Failed to update education:', data.message);
        try { (window as any).ProfileSave?.error(data.message || 'Failed to update education.') } catch {}
      }
    } catch (error) {
      console.error('Error updating education:', error);
      try { (window as any).ProfileSave?.error('Failed to update education.') } catch {}
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditingEducation(null)
  }

  const handleDelete = async (id: string) => {
    try {
      try { (window as any).ProfileSave?.start('Deleting education...') } catch {}
      const jobseekerId = localStorage.getItem('jobseeker_id');
      if (!jobseekerId) {
        console.error('No jobseeker ID found. Please login again.');
        return;
      }

      const response = await fetch(`/api/seeker/profile/delete_education?id=${id}&jobseeker_id=${jobseekerId}` , {
        method: 'GET',
      });
      const data = await response.json();
      if (data.success) { setEducations(educations.filter(edu => edu.id !== id)); try { (window as any).ProfileSave?.success('Education deleted.') } catch {} }
      else { console.error('Failed to delete education:', data.message); try { (window as any).ProfileSave?.error(data.message || 'Failed to delete education.') } catch {} }
    } catch (error) {
      console.error('Error deleting education:', error);
      try { (window as any).ProfileSave?.error('Failed to delete education.') } catch {}
    }
  }

  const handleAdd = async () => {
    try {
      try { (window as any).ProfileSave?.start('Adding education...') } catch {}
      const jobseekerId = localStorage.getItem('jobseeker_id');
      if (!jobseekerId) {
        console.error('No jobseeker ID found. Please login again.');
        return;
      }

      const response = await fetch('/api/seeker/profile/add_education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobseeker_id: jobseekerId,
          degree: newEducation.degree,
          field: newEducation.field,
          institution: newEducation.institution,
          location: newEducation.location,
          endDate: newEducation.endDate,
          description: newEducation.description
        }),
      });

      const data = await response.json();

      if (data.success) {
        const reloadResponse = await fetch(`/api/seeker/profile/get_education?jobseeker_id=${jobseekerId}`);
        const reloadData = await reloadResponse.json();
        if (reloadData.success && reloadData.data) {
          const formattedEducation = reloadData.data.map((edu: any) => ({
            id: edu.id.toString(),
            degree: edu.degree,
            field: edu.field,
            institution: edu.institution,
            location: edu.location,
            startDate: edu.start_date,
            endDate: edu.end_date || '',
            current: edu.current === 1,
            gpa: edu.gpa || '',
            description: edu.description,
            achievements: edu.achievements ? JSON.parse(edu.achievements) : []
          }));
          setEducations(formattedEducation);
        }

        setNewEducation({
          degree: '',
          field: '',
          institution: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          gpa: '',
          description: '',
          achievements: []
        });
        setIsAdding(false);
        try { (window as any).ProfileSave?.success('Education added.') } catch {}
      } else {
        console.error('Failed to add education:', data.message);
        try { (window as any).ProfileSave?.error(data.message || 'Failed to add education.') } catch {}
      }
    } catch (error) {
      console.error('Error adding education:', error);
      try { (window as any).ProfileSave?.error('Failed to add education.') } catch {}
    }
  }

  if (loading) {
    return (
      <Card className="border-emerald-200 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading education...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-emerald-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-5 w-5 text-emerald-600" />
            <div>
              <CardTitle className="text-emerald-800">Education</CardTitle>
              <CardDescription className="text-emerald-600">
                Your educational background and qualifications
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={() => setIsAdding(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-6">
          {/* Add New Education Form */}
          {isAdding && (
            <Card className="border-2 border-dashed border-emerald-300 bg-emerald-50/50">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Responsive form inputs */}
                    <div className="space-y-2">
                      <Label htmlFor="newDegree">Degree</Label>
                      <Select
                        value={newEducation.degree}
                        onValueChange={(value) => setNewEducation({ ...newEducation, degree: value })}
                      >
                        <SelectTrigger className="w-full border-emerald-300 focus:border-emerald-500">
                          <SelectValue placeholder="Select degree type" />
                        </SelectTrigger>
                        <SelectContent>
                          {degreeTypes.map((degree) => (
                            <SelectItem key={degree} value={degree}>
                              {degree}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newField">Field of Study</Label>
                      <Input
                        id="newField"
                        value={newEducation.field}
                        onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })}
                        className="w-full border-emerald-300 focus:border-emerald-500"
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newInstitution">Institution</Label>
                      <Input
                        id="newInstitution"
                        value={newEducation.institution}
                        onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                        className="w-full border-emerald-300 focus:border-emerald-500"
                        placeholder="e.g., University of Technology"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newLocation">Location</Label>
                      <Input
                        id="newLocation"
                        value={newEducation.location}
                        onChange={(e) => setNewEducation({ ...newEducation, location: e.target.value })}
                        className="w-full border-emerald-300 focus:border-emerald-500"
                        placeholder="e.g., New York, NY"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newStartDate">Completion Year</Label>
                      <Input
                        id="newStartDate"
                        type="number"
                        min="1900"
                        max="2099"
                        step="1"
                        value={newEducation.endDate}
                        onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
                        className="w-full border-emerald-300 focus:border-emerald-500"
                        placeholder="e.g., 2024"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newGpa">GPA (Optional)</Label>
                      <Input
                        id="newGpa"
                        value={newEducation.gpa}
                        onChange={(e) => setNewEducation({ ...newEducation, gpa: e.target.value })}
                        className="w-full border-emerald-300 focus:border-emerald-500"
                        placeholder="e.g., 3.8"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newDescription">Description</Label>
                    <Textarea
                      id="newDescription"
                      value={newEducation.description}
                      onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
                      rows={3}
                      className="w-full border-emerald-300 focus:border-emerald-500"
                      placeholder="Describe your studies, achievements, or relevant coursework..."
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsAdding(false)}
                      className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAdd}
                      className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Education List */}
          <div className="space-y-4">
            {educations.map((education) => (
              <Card key={education.id} className="border-gray-200 hover:border-emerald-300 transition-colors">
                <CardContent className="p-4 sm:p-6">
                  {editingId === education.id && editingEducation ? (
                    // Edit Form
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Degree</Label>
                          <Select
                            value={editingEducation.degree}
                            onValueChange={(value) => setEditingEducation({ ...editingEducation, degree: value })}
                          >
                            <SelectTrigger className="w-full border-emerald-300 focus:border-emerald-500">
                              <SelectValue placeholder="Select degree type" />
                            </SelectTrigger>
                            <SelectContent>
                              {degreeTypes.map((degree) => (
                                <SelectItem key={degree} value={degree}>
                                  {degree}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Field of Study</Label>
                          <Input
                            value={editingEducation.field}
                            onChange={(e) => setEditingEducation({ ...editingEducation, field: e.target.value })}
                            className="w-full border-emerald-300 focus:border-emerald-500"
                            placeholder="e.g., Computer Science"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Institution</Label>
                          <Input
                            value={editingEducation.institution}
                            onChange={(e) => setEditingEducation({ ...editingEducation, institution: e.target.value })}
                            className="w-full border-emerald-300 focus:border-emerald-500"
                            placeholder="e.g., University of Technology"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={editingEducation.location}
                            onChange={(e) => setEditingEducation({ ...editingEducation, location: e.target.value })}
                            className="w-full border-emerald-300 focus:border-emerald-500"
                            placeholder="e.g., New York, NY"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Completion Year</Label>
                          <Input
                            type="number"
                            min="1900"
                            max="2099"
                            step="1"
                            value={editingEducation.endDate}
                            onChange={(e) => setEditingEducation({ ...editingEducation, endDate: e.target.value })}
                            className="w-full border-emerald-300 focus:border-emerald-500"
                            placeholder="e.g., 2024"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>GPA (Optional)</Label>
                          <Input
                            value={editingEducation.gpa}
                            onChange={(e) => setEditingEducation({ ...editingEducation, gpa: e.target.value })}
                            className="w-full border-emerald-300 focus:border-emerald-500"
                            placeholder="e.g., 3.8"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={editingEducation.description}
                          onChange={(e) => setEditingEducation({ ...editingEducation, description: e.target.value })}
                          rows={3}
                          className="w-full border-emerald-300 focus:border-emerald-500"
                          placeholder="Describe your studies, achievements, or relevant coursework..."
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleSave(education.id)}
                          className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <School className="h-5 w-5 text-emerald-600" />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {education.degree} in {education.field}
                            </h3>
                            <p className="text-emerald-600 font-medium">{education.institution}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{education.endDate}</span>
                          </div>
                          <span>{education.location}</span>
                          {education.gpa && <span>GPA: {education.gpa}</span>}
                          {education.current && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              Current
                            </Badge>
                          )}
                        </div>
                        {education.description && (
                          <p className="text-gray-700 mb-4">{education.description}</p>
                        )}
                        {education.achievements.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Award className="h-4 w-4 text-emerald-600" />
                              <span className="text-sm font-medium text-gray-700">Achievements</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {education.achievements.map((achievement, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="border-emerald-200 text-emerald-700"
                                >
                                  {achievement}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(education.id)}
                          className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(education.id)}
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
          </div>

          {educations.length === 0 && !isAdding && (
            <div className="text-center py-12 text-gray-500">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No education added yet</p>
              <p className="mb-4">Add your educational background to showcase your qualifications</p>
              <Button
                onClick={() => setIsAdding(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Education
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
