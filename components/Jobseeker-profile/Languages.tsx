'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Globe, Plus, Trash2, Save } from 'lucide-react'

interface BackendLanguageOption {
  lang_id: string | number
  lang_name: string
}

interface LanguageRow {
  id: number
  languageId: number
  name: string
  proficiencyLevel: 1 | 2 | 3
}

const uiLevelToBackend = (level: UILanguageLevel): 1 | 2 | 3 => {
  switch (level) {
    case 'Beginner':
      return 1
    case 'Intermediate':
      return 2
    case 'Advanced':
    case 'Native':
      return 3
    default:
      return 1
  }
}

const backendLevelToUi = (level: number): UILanguageLevel => {
  if (level === 1) return 'Beginner'
  if (level === 2) return 'Intermediate'
  return 'Advanced'
}

type UILanguageLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Native'

export default function Languages() {
  const [languages, setLanguages] = useState<LanguageRow[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [languageOptions, setLanguageOptions] = useState<BackendLanguageOption[]>([])
  const [newLanguageId, setNewLanguageId] = useState<string>('')
  const [newLanguageLevel, setNewLanguageLevel] = useState<UILanguageLevel>('Beginner')

  const [proficiencyLevels, setProficiencyLevels] = useState<UILanguageLevel[]>(['Beginner', 'Intermediate', 'Advanced', 'Native'])
  const proficiencyColors = useMemo(
    () => ({
      Beginner: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      Intermediate: 'bg-blue-100 text-blue-700 border-blue-200',
      Advanced: 'bg-green-100 text-green-700 border-green-200',
      Native: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    }),
    []
  )

  useEffect(() => {
    const initialize = async () => {
      const jobseekerId = localStorage.getItem('jobseeker_id')
      if (!jobseekerId) return
      const [optionsRes, listRes, proficiencyRes] = await Promise.all([
        fetch('/api/seeker/profile/get_language_options'),
        fetch(`/api/seeker/profile/get_languages?jobseeker_id=${encodeURIComponent(jobseekerId)}`),
        fetch('/api/seeker/profile/get_language_proficiency'),
      ])
      const optionsPayload = await optionsRes.json()
      const listPayload = await listRes.json()
      const proficiencyPayload = await proficiencyRes.json()

      if (optionsPayload?.success && Array.isArray(optionsPayload.data)) {
        setLanguageOptions(optionsPayload.data)
      }

      if (proficiencyPayload?.success && Array.isArray(proficiencyPayload.data)) {
        const levels = proficiencyPayload.data.map((level: any) => level.name as UILanguageLevel)
        setProficiencyLevels(levels)
      }

      if (listPayload?.success && Array.isArray(listPayload.data)) {
        const rows: LanguageRow[] = listPayload.data.map((row: any) => ({
          id: Number(row.id),
          languageId: Number(row.language),
          name: row.lang_name ?? String(row.language),
          proficiencyLevel: (Number(row.proficiency) as 1 | 2 | 3) || 1,
        }))
        setLanguages(rows)
      }
    }
    initialize()
  }, [])

  const handleAdd = async () => {
    const jobseekerId = localStorage.getItem('jobseeker_id')
    if (!jobseekerId || !newLanguageId) return

    const optionsMap = new Map(languageOptions.map(o => [String(o.lang_id), o.lang_name]))
    const languageName = optionsMap.get(String(newLanguageId)) || String(newLanguageId)

    const res = await fetch('/api/seeker/profile/add_language', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: jobseekerId,
        language: languageName,
        lang_level: uiLevelToBackend(newLanguageLevel),
      }),
    })
    const payload = await res.json()
    if (payload?.success) {
      const id = Date.now()
      setLanguages(prev => [
        ...prev,
        {
          id,
          languageId: Number(newLanguageId),
          name: languageName,
          proficiencyLevel: uiLevelToBackend(newLanguageLevel),
        },
      ])
      setNewLanguageId('')
      setNewLanguageLevel('Beginner')
      setIsAdding(false)
    }
  }

  const handleDelete = async (rowId: number) => {
    const target = languages.find(l => l.id === rowId)
    if (!target) return
    await fetch('/api/seeker/profile/delete_language', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: target.id }),
    })
    setLanguages(prev => prev.filter(lang => lang.id !== rowId))
  }

  const updateProficiency = async (rowId: number, uiLevel: UILanguageLevel) => {
    const target = languages.find(l => l.id === rowId)
    if (!target) return

    const backendLevel = uiLevelToBackend(uiLevel)
    const res = await fetch('/api/seeker/profile/update_language', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: target.id,
        language: target.name,
        proficiency: backendLevel,
      }),
    })
    const payload = await res.json()
    if (payload?.success) {
      setLanguages(prev => prev.map(l => (l.id === rowId ? { ...l, proficiencyLevel: backendLevel } : l)))
    }
  }

  return (
    <Card className="border-emerald-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="h-5 w-5 text-emerald-600" />
            <div>
              <CardTitle className="text-emerald-800">Languages</CardTitle>
              <CardDescription className="text-emerald-600">
                Languages you speak and your proficiency level
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Language
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {isAdding && (
            <Card className="border-2 border-dashed border-emerald-300 bg-emerald-50/50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newLanguageSelect">Language</Label>
                      <Select value={newLanguageId} onValueChange={setNewLanguageId}>
                        <SelectTrigger id="newLanguageSelect" className="border-emerald-300 focus:border-emerald-500">
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.map(opt => (
                            <SelectItem key={String(opt.lang_id)} value={String(opt.lang_id)}>
                              {opt.lang_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newLanguageProficiency">Proficiency Level</Label>
                      <Select value={newLanguageLevel} onValueChange={(v: UILanguageLevel) => setNewLanguageLevel(v)}>
                        <SelectTrigger id="newLanguageProficiency" className="border-emerald-300 focus:border-emerald-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {proficiencyLevels.map(level => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
                      disabled={!newLanguageId}
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Add Language
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {languages.map(language => (
              <Card key={language.id} className="border-gray-200 hover:border-emerald-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-emerald-600" />
                      <h3 className="font-semibold text-gray-900">{language.name}</h3>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(language.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Proficiency Level</Label>
                    <Select
                      value={backendLevelToUi(language.proficiencyLevel)}
                      onValueChange={(value: UILanguageLevel) => updateProficiency(language.id, value)}
                    >
                      <SelectTrigger className="border-emerald-300 focus:border-emerald-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {proficiencyLevels.map(level => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Badge
                    variant="outline"
                    className={`mt-3 ${proficiencyColors[backendLevelToUi(language.proficiencyLevel)]}`}
                  >
                    {backendLevelToUi(language.proficiencyLevel)}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {languages.length === 0 && !isAdding && (
            <div className="text-center py-12 text-gray-500">
              <Globe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No languages added yet</p>
              <p className="mb-4">Add languages you speak to showcase your communication skills</p>
              <Button
                onClick={() => setIsAdding(true)}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Language
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
