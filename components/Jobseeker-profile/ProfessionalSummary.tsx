'use client'

import { useState ,useEffect} from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileText, Edit, Save, X, Plus, Target, Award, Sparkles } from 'lucide-react'

function normalizeSkills(raw: unknown): string[] {
  try {
    if (!raw) return []
    if (Array.isArray(raw)) return raw.filter((item) => typeof item === 'string')
    if (typeof raw === 'string') {
      const trimmed = raw.trim()
      if (trimmed.length === 0) return []
      if (trimmed.startsWith('[')) {
        const parsed = JSON.parse(trimmed)
        return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : []
      }
      return trimmed.split(',').map((s) => s.trim()).filter(Boolean)
    }
    return []
  } catch {
    return []
  }
}

export default function ProfessionalSummary() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [initialSkills, setInitialSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  // Load professional summary on component mount
  useEffect(() => {
    const loadProfessionalSummary = async () => {
      try {
        // Get jobseeker ID from localStorage (set after login)
        const jobseekerId = localStorage.getItem('jobseeker_id');
        
        if (!jobseekerId) {
          console.error('No jobseeker ID found. Please login again.');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/seeker/profile/get_professional_summary?jobseeker_id=${jobseekerId}`);
        const data = await response.json();
        
        if (data?.success && data?.data) {
          setSummary(data.data.summary || "");
          const loadedSkills = normalizeSkills(data.data.skills)
          setSkills(loadedSkills);
          setInitialSkills(loadedSkills);
        }
      } catch (error) {
        console.error('Error loading professional summary:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfessionalSummary();
  }, []);

  const handleSave = async () => {
    try {
      try { (window as any).ProfileSave?.start('Saving professional summary...') } catch {}
      const jobseekerId = localStorage.getItem('jobseeker_id');
      
      if (!jobseekerId) {
        console.error('No jobseeker ID found. Please login again.');
        return;
      }

      const response = await fetch('/api/seeker/profile/update_professional_summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobseeker_id: jobseekerId,
          professional_summary: summary,
          skills: JSON.stringify(skills)
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        console.error('Failed to save:', data.message);
        try { (window as any).ProfileSave?.error(data.message || 'Failed to save summary.') } catch {}
        return;
      }

      // Backend update_professional_summary ignores skills persistence.
      // Add only newly added skills via add_skill endpoint.
      const normalizedCurrent = Array.from(new Set(skills.map((s) => s.trim()).filter(Boolean)))
      const normalizedInitial = new Set(initialSkills.map((s) => s.trim()).filter(Boolean))
      const toAdd = normalizedCurrent.filter((s) => !normalizedInitial.has(s))
      const toRemove = Array.from(normalizedInitial).filter((s) => !normalizedCurrent.includes(s))

      if (toAdd.length > 0) {
        await Promise.all(
          toAdd.map((skill) =>
            fetch('/api/seeker/profile/add_skill', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jobseeker_id: jobseekerId,
                skill_name: skill,
                experience_level: ''
              })
            }).then((r) => r.json()).catch(() => ({}))
          )
        )
      }

      if (toRemove.length > 0) {
        await Promise.all(
          toRemove.map((skill) =>
            fetch('/api/seeker/profile/delete_skill', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jobseeker_id: jobseekerId,
                skill_name: skill
              })
            }).then((r) => r.json()).catch(() => ({}))
          )
        )
      }

      // Re-fetch from server to ensure UI reflects backend state
      try {
        const refresh = await fetch(`/api/seeker/profile/get_professional_summary?jobseeker_id=${jobseekerId}`)
        const refreshed = await refresh.json()
        if (refreshed?.success && refreshed?.data) {
          setSummary(refreshed.data.summary || "")
          const loadedSkills = normalizeSkills(refreshed.data.skills)
          setSkills(loadedSkills)
          setInitialSkills(loadedSkills)
        } else {
          setInitialSkills(normalizedCurrent)
        }
      } catch {
        setInitialSkills(normalizedCurrent)
      }
      setIsEditing(false);
      try { (window as any).ProfileSave?.success('Professional summary saved.') } catch {}
    } catch (error) {
      console.error('Error saving professional summary:', error);
      try { (window as any).ProfileSave?.error('Failed to save summary.') } catch {}
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  const handleAIGeneration = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setSummary("Dynamic and results-driven professional with extensive experience in customer service and team leadership. Proven track record of exceeding performance targets, resolving complex customer issues, and fostering positive team environments. Skilled in communication, problem-solving, and process optimization. Committed to delivering exceptional service experiences while driving operational excellence and continuous improvement initiatives.")
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <Card className="border-emerald-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-emerald-600" />
            <div>
              <CardTitle className="text-emerald-800">Professional Summary</CardTitle>
              <CardDescription className="text-emerald-600">
                Your professional overview and key skills
              </CardDescription>
            </div>
          </div>
          <Button
            variant={isEditing ? "destructive" : "outline"}
            size="sm"
            onClick={isEditing ? handleCancel : () => setIsEditing(true)}
            className={isEditing ? "border-red-200 text-white hover:bg-red-50 hover:text-red-500" : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"}
          >
            {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Professional Summary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-emerald-600" />
                <Label className="text-gray-700 font-medium">Professional Summary</Label>
              </div>
              {isEditing && (
                <Button
                  onClick={handleAIGeneration}
                  disabled={isGenerating}
                  variant="outline"
                  size="sm"
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'AI Generate'}
                </Button>
              )}
            </div>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              disabled={!isEditing}
              rows={4}
              className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50 border-gray-200"}
              placeholder="Write a brief summary of your professional background and expertise..."
            />
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-emerald-600" />
              <Label className="text-gray-700 font-medium">Key Skills</Label>
            </div>
            
            {/* Add New Skill */}
            {isEditing && (
              <div className="flex space-x-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a skill..."
                  className="border-emerald-300 focus:border-emerald-500"
                />
                <Button
                  onClick={addSkill}
                  size="sm"
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Skills List */}
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors relative group"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-emerald-600 hover:text-red-600 transition-colors"
                      title={`Remove ${skill}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>

            {skills.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Award className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No skills added yet. Add your key skills to showcase your expertise.</p>
              </div>
            )}
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}