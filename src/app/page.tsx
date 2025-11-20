'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Loader2, Download, History, Sparkles, FileText, GraduationCap, Settings, Search } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Question {
  id: string
  question: string
  type: string
  difficulty: string
  options?: string[]
  correctAnswer?: string
}

interface HistoryItem {
  id: string
  jenjang: string
  kelas: string
  mapel: string
  tipeSoal: string
  bahasa: string
  topic: string
  questions: Question[]
  createdAt: string
}

interface AIModel {
  id: string
  name: string
  provider: string
  free: boolean
  icon: string
}

const aiModels: AIModel[] = [
  // BigModel.cn - Default
  { 
    id: 'glm-4.5-flash', 
    name: 'GLM-4.5 Flash (Default)', 
    provider: 'BigModel', 
    free: true,
    icon: '/icons/ai-models/BigModel.png'
  },
  { 
    id: 'glm-4.5', 
    name: 'GLM-4.5', 
    provider: 'BigModel', 
    free: true,
    icon: '/icons/ai-models/BigModel.png'
  },
  { 
    id: 'glm-4.6', 
    name: 'GLM-4.6 (Latest)', 
    provider: 'BigModel', 
    free: true,
    icon: '/icons/ai-models/BigModel.png'
  },
  // Free Models - Web Search & Reasoning
  { 
    id: 'deepseek/deepseek-r1:free', 
    name: 'DeepSeek-R1 (Free)', 
    provider: 'DeepSeek', 
    free: true,
    icon: '/icons/ai-models/Deepseek-logo-icon.svg'
  },
  { 
    id: 'deepseek/deepseek-r1:0528:free', 
    name: 'DeepSeek-R1 0528 (Free)', 
    provider: 'DeepSeek', 
    free: true,
    icon: '/icons/ai-models/Deepseek-logo-icon.svg'
  },
  { 
    id: 'meta-llama/llama-3.1-8b-instruct', 
    name: 'Llama 3.1 8B', 
    provider: 'Meta', 
    free: true,
    icon: '/icons/ai-models/Meta_Platforms_logo.svg'
  },
  { 
    id: 'microsoft/phi-3-medium-128k-instruct', 
    name: 'Phi-3 Medium', 
    provider: 'Microsoft', 
    free: true,
    icon: '/icons/ai-models/Microsoft.svg'
  },
  { 
    id: 'qwen/qwen-2.5-7b-instruct', 
    name: 'Qwen 2.5 7B', 
    provider: 'Qwen', 
    free: true,
    icon: '/icons/ai-models/Qwen_logo.png'
  },
  { 
    id: 'google/gemma-2-9b-it', 
    name: 'Gemma 2 9B', 
    provider: 'Google', 
    free: true,
    icon: '/icons/ai-models/GoogleGemini.svg'
  },
  { 
    id: 'mistralai/mistral-7b-instruct', 
    name: 'Mistral 7B', 
    provider: 'Mistral', 
    free: true,
    icon: '/icons/ai-models/Mistral_AI_logo.svg'
  },
  { 
    id: 'huggingface/zephyr-7b-beta', 
    name: 'Zephyr 7B', 
    provider: 'HuggingFace', 
    free: true,
    icon: '/icons/ai-models/hf-logo.svg'
  },
  
  // Premium Models - Advanced Capabilities
  { 
    id: 'deepseek/deepseek-r1', 
    name: 'DeepSeek-R1 (Premium)', 
    provider: 'DeepSeek', 
    free: false,
    icon: '/icons/ai-models/Deepseek-logo-icon.svg'
  },
  { 
    id: 'deepseek/deepseek-chat', 
    name: 'DeepSeek Chat', 
    provider: 'DeepSeek', 
    free: false,
    icon: '/icons/ai-models/Deepseek-logo-icon.svg'
  },
  { 
    id: 'anthropic/claude-3.5-sonnet', 
    name: 'Claude 3.5 Sonnet', 
    provider: 'Anthropic', 
    free: false,
    icon: '/icons/ai-models/Anthropic.svg'
  },
  { 
    id: 'openai/gpt-4o', 
    name: 'GPT-4o', 
    provider: 'OpenAI', 
    free: false,
    icon: '/icons/ai-models/OpenAI.svg'
  },
  { 
    id: 'openai/gpt-4o-mini', 
    name: 'GPT-4o Mini', 
    provider: 'OpenAI', 
    free: false,
    icon: '/icons/ai-models/OpenAI.svg'
  },
  { 
    id: 'google/gemini-pro-1.5', 
    name: 'Gemini Pro 1.5', 
    provider: 'Google', 
    free: false,
    icon: '/icons/ai-models/GoogleGemini.svg'
  },
  { 
    id: 'meta-llama/llama-3.1-70b-instruct', 
    name: 'Llama 3.1 70B', 
    provider: 'Meta', 
    free: false,
    icon: '/icons/ai-models/Meta_Platforms_logo.svg'
  },
  { 
    id: 'microsoft/phi-3.5-mini-128k-instruct', 
    name: 'Phi-3.5 Mini', 
    provider: 'Microsoft', 
    free: false,
    icon: '/icons/ai-models/Microsoft.svg'
  },
  { 
    id: 'x-ai/grok-2-1212', 
    name: 'Grok 2', 
    provider: 'xAI', 
    free: false,
    icon: '/icons/ai-models/xAI.svg'
  }
]

const jenjangList = [
  { value: 'sd', label: 'SD (Sekolah Dasar)' },
  { value: 'smp', label: 'SMP (Sekolah Menengah Pertama)' },
  { value: 'sma', label: 'SMA (Sekolah Menengah Atas)' }
]

const tipeSoalList = [
  { value: 'multiple-choice', label: 'Pilihan Ganda' },
  { value: 'essay', label: 'Essay' },
  { value: 'true-false', label: 'Benar/Salah (True/False)' }
]

const bahasaList = [
  { value: 'indonesia', label: 'Indonesia' },
  { value: 'english', label: 'English' }
]

const jumlahSoalList = [
  { value: '5', label: '5 Soal' },
  { value: '10', label: '10 Soal' },
  { value: '15', label: '15 Soal' },
  { value: '20', label: '20 Soal' },
  { value: '25', label: '25 Soal' }
]

const kelasList = [
  { value: '1', label: 'Kelas 1' },
  { value: '2', label: 'Kelas 2' },
  { value: '3', label: 'Kelas 3' },
  { value: '4', label: 'Kelas 4' },
  { value: '5', label: 'Kelas 5' },
  { value: '6', label: 'Kelas 6' },
  { value: '7', label: 'Kelas 7' },
  { value: '8', label: 'Kelas 8' },
  { value: '9', label: 'Kelas 9' },
  { value: '10', label: 'Kelas 10' },
  { value: '11', label: 'Kelas 11' },
  { value: '12', label: 'Kelas 12' }
]

const mapelByJenjang: Record<string, string[]> = {
  sd: [
    'Pendidikan Agama Islam', 'Pendidikan Agama Kristen', 'Pendidikan Agama Katolik', 
    'Pendidikan Agama Hindu', 'Pendidikan Agama Buddha', 'Pendidikan Agama Konghucu',
    'Pendidikan Pancasila dan Kewarganegaraan (PPKn)', 'Bahasa Indonesia', 
    'Matematika', 'Ilmu Pengetahuan Alam (IPA)', 'Ilmu Pengetahuan Sosial (IPS)', 
    'Seni Budaya dan Keterampilan (SBK)', 'Pendidikan Jasmani, Olahraga dan Kesehatan (PJOK)'
  ],
  smp: [
    'Pendidikan Agama Islam', 'Pendidikan Agama Kristen', 'Pendidikan Agama Katolik', 
    'Pendidikan Agama Hindu', 'Pendidikan Agama Buddha', 'Pendidikan Agama Konghucu',
    'Pendidikan Pancasila dan Kewarganegaraan (PPKn)', 'Bahasa Indonesia', 
    'Bahasa Inggris', 'Matematika', 'Ilmu Pengetahuan Alam (IPA) - Fisika', 
    'Ilmu Pengetahuan Alam (IPA) - Biologi', 'Ilmu Pengetahuan Sosial (IPS) - Sejarah', 
    'Ilmu Pengetahuan Sosial (IPS) - Geografi', 'Ilmu Pengetahuan Sosial (IPS) - Ekonomi', 
    'Seni Budaya dan Keterampilan (SBK)', 'Pendidikan Jasmani, Olahraga dan Kesehatan (PJOK)', 
    'Teknologi Informasi dan Komunikasi (TIK)', 'Prakarya dan Kewirausahaan (PKWU)'
  ],
  sma: [
    'Pendidikan Agama Islam', 'Pendidikan Agama Kristen', 'Pendidikan Agama Katolik', 
    'Pendidikan Agama Hindu', 'Pendidikan Agama Buddha', 'Pendidikan Agama Konghucu',
    'Pendidikan Pancasila dan Kewarganegaraan (PPKn)', 'Bahasa Indonesia', 
    'Bahasa Inggris', 'Matematika Wajib', 'Matematika Peminatan', 
    'Fisika', 'Biologi', 'Kimia', 'Sejarah Indonesia', 'Sejarah Dunia', 
    'Geografi', 'Ekonomi', 'Sosiologi', 'Antropologi', 
    'Seni Budaya', 'Pendidikan Jasmani, Olahraga dan Kesehatan (PJOK)', 
    'Teknologi Informasi dan Komunikasi (TIK)', 'Bahasa Arab', 'Bahasa Mandarin', 
    'Bahasa Jepang', 'Bahasa Jerman', 'Bahasa Prancis', 'Bimbingan dan Konseling (BK)'
  ]
}

export default function Home() {
  const [jenjang, setJenjang] = useState('')
  const [kelas, setKelas] = useState('')
  const [mapel, setMapel] = useState('')
  const [tipeSoal, setTipeSoal] = useState('')
  const [jumlahSoal, setJumlahSoal] = useState('5')
  const [topic, setTopic] = useState('')
  const [selectedBahasa, setSelectedBahasa] = useState('indonesia')
  const [selectedModel, setSelectedModel] = useState('glm-4.5-flash')
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [activeTab, setActiveTab] = useState('generator')
  const { toast } = useToast()
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Filter models based on search query
  const filteredModels = aiModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.provider.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // Pagination logic for history
  const totalPages = Math.ceil(history.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedHistory = history.slice(startIndex, endIndex)

  // Reset page when history changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [history.length])

  // Load history on component mount
  React.useEffect(() => {
    loadHistory()
  }, [])

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.model-dropdown-container')) {
        setShowModelDropdown(false)
      }
    }

    if (showModelDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showModelDropdown])

  // Close dropdown on Escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowModelDropdown(false)
      }
    }

    if (showModelDropdown) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [showModelDropdown])

  const loadHistory = async () => {
    setLoadingHistory(true)
    try {
      const response = await fetch('/api/history')
      if (response.ok) {
        const data = await response.json()
        setHistory(data.history || [])
      }
    } catch (error) {
      console.error('Error loading history:', error)
    } finally {
      setLoadingHistory(false)
    }
  }

  const generateQuestions = async () => {
    if (!jenjang || !mapel || !tipeSoal || !selectedBahasa || !topic.trim()) {
      toast({
        title: "Form Tidak Lengkap",
        description: "Mohon lengkapi semua field terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jenjang, kelas, mapel, tipeSoal, bahasa: selectedBahasa, model: selectedModel, topic, jumlahSoal }),
      })

      if (!response.ok) {
        throw new Error('Gagal generate pertanyaan')
      }

      const data = await response.json()
      setQuestions(data.questions)
      
      // Show success toast
      toast({
        title: "Generate Berhasil!",
        description: `${data.questions.length} pertanyaan berhasil dibuat.`,
        variant: "default",
      })
      
      // Reload history to get the latest data
      await loadHistory()
      
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Generate Gagal",
        description: "Terjadi kesalahan saat generate pertanyaan. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const exportToWord = async (questionsToExport: Question[], kelasValue: string = '', filename: string = 'questions.docx', jenjangValue: string = '', mapelValue: string = '', tipeSoalValue: string = '', bahasaValue: string = 'indonesia') => {
    try {
      console.log('Starting export to Word...')
      console.log('Questions to export:', questionsToExport.length)
      
      // Try direct imports first
      let saveAs, Document, Packer, Paragraph, TextRun, HeadingLevel
      
      try {
        const fileSaverModule = await import('file-saver')
        saveAs = fileSaverModule.default || fileSaverModule.saveAs
        console.log('file-saver imported successfully')
      } catch (importError) {
        console.error('Failed to import file-saver:', importError)
        throw new Error('Failed to import file-saver module')
      }
      
      try {
        const docxModule = await import('docx')
        Document = docxModule.default?.Document || docxModule.Document
        Packer = docxModule.default?.Packer || docxModule.Packer
        Paragraph = docxModule.default?.Paragraph || docxModule.Paragraph
        TextRun = docxModule.default?.TextRun || docxModule.TextRun
        HeadingLevel = docxModule.default?.HeadingLevel || docxModule.HeadingLevel
        console.log('docx imported successfully')
      } catch (importError) {
        console.error('Failed to import docx:', importError)
        throw new Error('Failed to import docx module')
      }

      if (!saveAs || !Document || !Packer || !Paragraph || !TextRun || !HeadingLevel) {
        console.error('Missing required exports:', { saveAs: !!saveAs, Document: !!Document, Packer: !!Packer })
        throw new Error('Required modules not available')
      }

      console.log('Creating document...')
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Generated Questions",
                  bold: true,
                  size: 32
                })
              ],
              heading: HeadingLevel.TITLE
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Jenjang: ${jenjangValue.toUpperCase()} | Kelas: ${kelasValue || '-'} | Mapel: ${mapelValue} | Tipe: ${tipeSoalValue === 'multiple-choice' ? 'Pilihan Ganda' : tipeSoalValue === 'essay' ? 'Essay' : 'Benar/Salah'} | Bahasa: ${bahasaValue === 'english' ? 'English' : 'Indonesia'}`,
                  size: 24
                })
              ],
              heading: HeadingLevel.HEADING_1
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Topic: ${topic}`,
                  size: 20
                })
              ],
              heading: HeadingLevel.HEADING_2
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Generated: ${new Date().toLocaleString('id-ID')}`,
                  size: 20
                })
              ],
              heading: HeadingLevel.HEADING_2
            }),
            ...questionsToExport.map((q, index) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${index + 1}. ${q.question}`,
                    bold: true,
                    break: 1
                  })
                ]
              }),
              // Multiple Choice Options
              ...(q.type === 'Pilihan Ganda' && q.options ? q.options.map((option, optIndex) => 
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `   ${String.fromCharCode(65 + optIndex)}. ${option}`,
                      size: 20
                    })
                  ]
                })
              ) : []),
              // True/False Options
              ...(q.type === 'Benar/Salah' ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `   A. Benar`,
                      size: 20
                    })
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `   B. Salah`,
                      size: 20
                    })
                  ]
                })
              ] : []),
              // Correct Answer
              q.correctAnswer ? new Paragraph({
                children: [
                  new TextRun({
                    text: `Jawaban Benar: ${q.correctAnswer}`,
                    italics: true,
                    color: '2E7D32',
                    size: 20,
                    break: 1
                  })
                ]
              }) : null,
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Type: ${q.type} | Difficulty: ${q.difficulty}`,
                    italics: true,
                    size: 18,
                    break: 2
                  })
                ]
              })
            ]).flat()
          ]
        }]
      })

      console.log('Packing document...')
      const buffer = await Packer.toBuffer(doc)
      console.log('Buffer created, size:', buffer.length)
      
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      })
      
      console.log('Saving file...')
      saveAs(blob, filename)
      
      console.log('File saved successfully')
      
      // Show success toast
      toast({
        title: "Export Berhasil!",
        description: "File Word berhasil diunduh.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error exporting to Word:', error)
      toast({
        title: "Export Gagal",
        description: `Gagal export ke Word: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  const loadHistoryItem = (item: HistoryItem) => {
    setJenjang(item.jenjang)
    setKelas(item.kelas || '')
    setMapel(item.mapel)
    setTipeSoal(item.tipeSoal)
    // Set language radio based on saved bahasa
    setSelectedBahasa(item.bahasa)
    setTopic(item.topic)
    setQuestions(item.questions)
    setActiveTab('generator')
    
    // Show info toast
    toast({
      title: "Riwayat Dimuat",
      description: `${item.mapel} - ${item.topic} berhasil dimuat.`,
      variant: "default",
    })
  }

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModelDropdown(false)
        setSearchQuery('')
      }
    }

    if (showModelDropdown) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [showModelDropdown])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2 sm:p-4">
      {showModelDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowModelDropdown(false)
            setSearchQuery('')
          }}
        />
      )}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-4 sm:mb-6 lg:mb-8 pt-4 sm:pt-6 lg:pt-8 gap-3 xl:gap-0">
          <div className="text-center lg:text-left flex-1 w-full">
            <div className="flex items-center justify-center lg:justify-start gap-1.5 sm:gap-2 lg:gap-3 mb-2 lg:mb-4">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 xl:h-8 xl:w-8 text-primary flex-shrink-0" />
              <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-4xl font-bold text-gray-900 break-words">AI Question Generator</h1>
            </div>
            <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-gray-600 px-2 lg:px-0">Generate pertanyaan berkualitas dengan AI dan export ke Word</p>
          </div>
          
          {/* AI Model Selector */}
          <div className="w-full lg:w-auto xl:flex-shrink-0">
            <div className="relative model-dropdown-container">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md w-full lg:w-auto justify-between group min-w-0"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-4 h-4 lg:w-5 lg:h-5 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    {aiModels.find(m => m.id === selectedModel) ? (
                      <img 
                        src={aiModels.find(m => m.id === selectedModel)?.icon || ''} 
                        alt={aiModels.find(m => m.id === selectedModel)?.provider || 'AI'}
                        className="w-3 h-3 lg:w-4 lg:h-4 opacity-90"
                      />
                    ) : (
                      <Settings className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-gray-400" />
                    )}
                  </div>
                  <div className="hidden sm:block min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                      {aiModels.find(m => m.id === selectedModel)?.name || 'Select Model'}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {aiModels.find(m => m.id === selectedModel)?.provider || 'AI Provider'}
                    </div>
                  </div>
                  <div className="sm:hidden text-xs sm:text-sm font-medium text-gray-900 truncate">
                    {aiModels.find(m => m.id === selectedModel)?.name || 'Pilih Model'}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {aiModels.find(m => m.id === selectedModel) && (
                    <img 
                      src={aiModels.find(m => m.id === selectedModel)?.icon || ''} 
                      alt={aiModels.find(m => m.id === selectedModel)?.provider || 'AI'}
                      className="w-4 h-4 sm:w-5 sm:h-5 opacity-80"
                    />
                  )}
                  {aiModels.find(m => m.id === selectedModel)?.free && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 sm:px-2 sm:py-0.5">
                      Free
                    </Badge>
                  )}
                  <svg 
                    className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform duration-200 ${showModelDropdown ? 'rotate-180' : ''} group-hover:text-gray-600 flex-shrink-0`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {showModelDropdown && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 lg:w-96 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-[70vh]">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 sm:p-4 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Pilih Model AI</h3>
                    <p className="text-xs text-gray-600">Pilih model yang sesuai dengan kebutuhan Anda</p>
                  </div>
                  
                  {/* Search Input */}
                  <div className="p-2 sm:p-3 border-b border-gray-200 bg-gray-50">
                    <div className="relative">
                      <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Cari model..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Model List */}
                  <div className="max-h-60 sm:max-h-80 overflow-y-auto">
                    {filteredModels.length === 0 ? (
                      <div className="text-center py-6 sm:py-8 text-gray-500">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                        </div>
                        <p className="text-xs sm:text-sm font-medium">Tidak ada model ditemukan</p>
                        <p className="text-xs text-gray-400 mt-1">Coba ubah kata kunci pencarian</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {filteredModels.map((model) => (
                          <button
                            key={model.id}
                            onClick={() => {
                              setSelectedModel(model.id)
                              setShowModelDropdown(false)
                              setSearchQuery('')
                            }}
                            className={`w-full text-left px-3 py-2.5 sm:px-4 sm:py-3 hover:bg-gray-50 transition-all duration-200 flex items-center justify-between group ${
                              selectedModel === model.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                selectedModel === model.id 
                                  ? 'bg-blue-500' 
                                  : 'bg-white border border-gray-200'
                              }`}>
                                <img 
                                  src={model.icon} 
                                  alt={model.provider}
                                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                    selectedModel === model.id ? 'opacity-80' : 'opacity-90'
                                  }`}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`font-medium text-xs sm:text-sm truncate ${
                                  selectedModel === model.id ? 'text-blue-600' : 'text-gray-900'
                                }`}>
                                  {model.name}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-1 sm:gap-2">
                                  <span className="truncate">{model.provider}</span>
                                  {model.free && (
                                    <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 flex-shrink-0">
                                      Gratis
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {selectedModel === model.id && (
                              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Footer */}
                  <div className="p-2 sm:p-3 bg-gray-50 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center truncate">
                      Model: <span className="font-medium text-gray-700">{aiModels.find(m => m.id === selectedModel)?.name}</span>
                    </p>
                    <p className="text-xs text-gray-400 text-center truncate">
                      {aiModels.find(m => m.id === selectedModel)?.provider}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-4 sm:mb-6">
            <TabsTrigger value="generator" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              Generator
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <History className="h-3 w-3 sm:h-4 sm:w-4" />
              Riwayat ({history.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">Buat Pertanyaan Baru</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Isi topik dan prompt untuk generate pertanyaan menggunakan AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {/* 1. Jenjang Pendidikan */}
                  <div className="space-y-2">
                    <Label htmlFor="jenjang">Jenjang Pendidikan</Label>
                    <Select value={jenjang} onValueChange={(value) => {
                      setJenjang(value)
                      setMapel('') // Reset mapel when jenjang changes
                      setKelas('') // Reset kelas when jenjang changes
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenjang" />
                      </SelectTrigger>
                      <SelectContent>
                        {jenjangList.map((j) => (
                          <SelectItem key={j.value} value={j.value}>
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4" />
                              <span className="text-sm">{j.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* 2. Kelas */}
                  <div className="space-y-2">
                    <Label htmlFor="kelas">Kelas</Label>
                    <Select value={kelas} onValueChange={setKelas} disabled={!jenjang}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        {jenjang && kelasList
                          .filter(k => {
                            if (jenjang === 'sd') return parseInt(k.value) <= 6
                            if (jenjang === 'smp') return parseInt(k.value) >= 7 && parseInt(k.value) <= 9
                            if (jenjang === 'sma') return parseInt(k.value) >= 10 && parseInt(k.value) <= 12
                            return true
                          })
                          .map((k) => (
                            <SelectItem key={k.value} value={k.value}>
                              <span className="text-sm">{k.label}</span>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* 3. Mata Pelajaran */}
                  <div className="space-y-2">
                    <Label htmlFor="mapel">Mata Pelajaran</Label>
                    <Select value={mapel} onValueChange={setMapel} disabled={!jenjang}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih mapel" />
                      </SelectTrigger>
                      <SelectContent>
                        {jenjang && mapelByJenjang[jenjang].map((m) => (
                          <SelectItem key={m} value={m}>
                            <span className="text-sm">{m}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* 4. Tipe Soal */}
                  <div className="space-y-2">
                    <Label htmlFor="tipeSoal">Tipe Soal</Label>
                    <Select value={tipeSoal} onValueChange={setTipeSoal} disabled={!jenjang}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe soal" />
                      </SelectTrigger>
                      <SelectContent>
                        {tipeSoalList.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            <span className="text-sm">{t.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* 5. Jumlah Soal */}
                  <div className="space-y-2">
                    <Label htmlFor="jumlahSoal">Jumlah Soal</Label>
                    <Select value={jumlahSoal} onValueChange={setJumlahSoal}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jumlah soal" />
                      </SelectTrigger>
                      <SelectContent>
                        {jumlahSoalList.map((j) => (
                          <SelectItem key={j.value} value={j.value}>
                            <span className="text-sm">{j.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* 6. Topik/Subtopik */}
                  <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                    <Label htmlFor="topic" className="text-sm">Topik/Subtopik</Label>
                    <Textarea
                      id="topic"
                      placeholder="Contoh: PKN, Hukum Newton, Sejarah Indonesia. Isi hanya jika ingin menambahkan instruksi khusus."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="text-sm min-h-[80px] resize-y"
                      rows={3}
                    />
                  </div>
                </div>
                
                {/* 7. Bahasa dengan Radio Button */}
                <div className="space-y-2">
                  <Label className="text-sm">Bahasa</Label>
                  <RadioGroup value={selectedBahasa} onValueChange={setSelectedBahasa}>
                    <div className="flex items-center space-x-4 sm:space-x-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="indonesia" id="bahasa-indonesia" />
                        <Label htmlFor="bahasa-indonesia" className="text-sm font-medium cursor-pointer">
                          Indonesia
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="english" id="bahasa-english" />
                        <Label htmlFor="bahasa-english" className="text-sm font-medium cursor-pointer">
                          English
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Generate Button */}
                <div className="flex justify-start">
                  <Button 
                    onClick={generateQuestions} 
                    disabled={loading || !jenjang || !mapel || !tipeSoal}
                    className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        {(selectedBahasa === 'english') ? 'Generate Questions' : 'Generate Pertanyaan'}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {questions.length > 0 && (
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg sm:text-xl">Hasil Pertanyaan</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">{questions.length} pertanyaan berhasil dihasilkan</CardDescription>
                    </div>
                    <Button
                      onClick={() => exportToWord(questions, kelas, `questions-${topic.replace(/\s+/g, '-').toLowerCase()}.docx`, jenjang, mapel, tipeSoal, selectedBahasa)}
                      variant="outline"
                      className="flex items-center gap-2 text-xs sm:text-sm px-3 py-2 sm:px-4"
                    >
                      <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                      Export Word
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80 sm:h-96">
                    <div className="space-y-3 sm:space-y-4">
                      {questions.map((q, index) => (
                        <div key={q.id} className="p-3 sm:p-4 border rounded-lg bg-white">
                          <div className="flex items-start justify-between mb-2 sm:mb-3">
                            <h3 className="font-medium text-sm sm:text-base text-gray-900 pr-2">
                              {index + 1}. {q.question}
                            </h3>
                          </div>
                          
                          {q.options && q.options.length > 0 && (
                            <div className="ml-2 sm:ml-4 mb-2 sm:mb-3 space-y-1 sm:space-y-2">
                              {q.options.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-2">
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                                    q.correctAnswer === String.fromCharCode(65 + optIndex)
                                      ? 'bg-green-100 border-green-500 text-green-700'
                                      : 'border-gray-300 text-gray-600'
                                  }`}>
                                    {String.fromCharCode(65 + optIndex)}
                                  </div>
                                  <span className={`text-sm ${
                                    q.correctAnswer === String.fromCharCode(65 + optIndex)
                                      ? 'font-medium text-green-700'
                                      : 'text-gray-700'
                                  }`}>
                                    {option}
                                  </span>
                                  {q.correctAnswer === String.fromCharCode(65 + optIndex) && (
                                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                      ✓ {selectedBahasa === 'english' ? 'Correct' : 'Benar'}
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {q.type === 'Benar/Salah' && (
                            <div className="ml-4 mb-3 space-y-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                                  q.correctAnswer === 'Benar'
                                    ? 'bg-green-100 border-green-500 text-green-700'
                                    : 'border-gray-300 text-gray-600'
                                }`}>
                                  A
                                </div>
                                <span className={`text-sm ${
                                  q.correctAnswer === 'Benar'
                                    ? 'font-medium text-green-700'
                                    : 'text-gray-700'
                                }`}>
                                  {selectedBahasa === 'english' ? 'True' : 'Benar'}
                                </span>
                                {q.correctAnswer === 'Benar' && (
                                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                    ✓ {selectedBahasa === 'english' ? 'Correct' : 'Benar'}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                                  q.correctAnswer === 'Salah'
                                    ? 'bg-green-100 border-green-500 text-green-700'
                                    : 'border-gray-300 text-gray-600'
                                }`}>
                                  B
                                </div>
                                <span className={`text-sm ${
                                  q.correctAnswer === 'Salah'
                                    ? 'font-medium text-green-700'
                                    : 'text-gray-700'
                                }`}>
                                  {selectedBahasa === 'english' ? 'False' : 'Salah'}
                                </span>
                                {q.correctAnswer === 'Salah' && (
                                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                    ✓ {selectedBahasa === 'english' ? 'Correct' : 'Benar'}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {q.type === 'Essay' && q.correctAnswer && (
                            <div className="ml-4 mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-sm font-medium text-blue-800 mb-1">{selectedBahasa === 'english' ? 'Answer Key:' : 'Kunci Jawaban:'}</p>
                              <p className="text-sm text-blue-700">{q.correctAnswer}</p>
                            </div>
                          )}
                          
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="secondary">{q.type}</Badge>
                            <Badge variant="outline">{q.difficulty}</Badge>
                            {q.options && (
                              <Badge variant="outline">
                                {q.options.length} pilihan jawaban
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Riwayat Pertanyaan</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Total {history.length} riwayat pertanyaan
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="items-per-page" className="text-xs sm:text-sm">Tampilkan:</Label>
                    <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                      setItemsPerPage(Number(value))
                      setCurrentPage(1)
                    }}>
                      <SelectTrigger className="w-16 sm:w-20 h-8 text-xs sm:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loadingHistory ? (
                  <div className="flex items-center justify-center py-8 sm:py-12">
                    <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-gray-400" />
                    <span className="ml-2 text-sm sm:text-base text-gray-500">Loading riwayat...</span>
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <History className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base text-gray-500">Belum ada riwayat pertanyaan</p>
                  </div>
                ) : (
                  <>
                    {/* Table */}
                    <div className="rounded-md border overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mata Pelajaran
                              </th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Jenjang
                              </th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kelas
                              </th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tipe
                              </th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Bahasa
                              </th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Jumlah
                              </th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Topik
                              </th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tanggal
                              </th>
                              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedHistory.map((item) => (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  <div className="max-w-[120px] truncate" title={item.mapel}>
                                    {item.mapel}
                                  </div>
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap">
                                  <Badge variant="outline" className="text-xs">
                                    {item.jenjang.toUpperCase()}
                                  </Badge>
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap">
                                  {item.kelas ? (
                                    <Badge variant="outline" className="text-xs">
                                      Kelas {item.kelas}
                                    </Badge>
                                  ) : (
                                    <span className="text-xs text-gray-400">-</span>
                                  )}
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap">
                                  <Badge variant="outline" className="text-xs">
                                    {item.tipeSoal === 'multiple-choice' ? 'PG' : 
                                     item.tipeSoal === 'essay' ? 'Essay' : 'B/S'}
                                  </Badge>
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap">
                                  <Badge variant="outline" className="text-xs">
                                    {item.bahasa === 'english' ? 'EN' : 'ID'}
                                  </Badge>
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {item.questions.length}
                                </td>
                                <td className="px-3 py-4 text-sm text-gray-900">
                                  <div className="max-w-[150px] truncate" title={item.topic}>
                                    {item.topic}
                                  </div>
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap text-xs text-gray-500">
                                  {item.createdAt}
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => loadHistoryItem(item)}
                                      className="h-7 w-7 p-0 text-xs"
                                      title="Load"
                                    >
                                      <FileText className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => exportToWord(
                                        item.questions, 
                                        item.kelas || '',
                                        `questions-${item.jenjang}-${item.mapel.replace(/\s+/g, '-').toLowerCase()}.docx`,
                                        item.jenjang,
                                        item.mapel,
                                        item.tipeSoal,
                                        item.bahasa
                                      )}
                                      className="h-7 w-7 p-0 text-xs"
                                      title="Export Word"
                                    >
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-4 px-2">
                        <div className="text-sm text-gray-700">
                          Menampilkan {startIndex + 1} hingga {Math.min(endIndex, history.length)} dari {history.length} riwayat
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="h-8 w-8 p-0"
                          >
                            &laquo;
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="h-8 w-8 p-0"
                          >
                            &lsaquo;
                          </Button>
                          
                          {/* Page numbers */}
                          <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }
                              
                              return (
                                <Button
                                  key={pageNum}
                                  variant={currentPage === pageNum ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setCurrentPage(pageNum)}
                                  className="h-8 w-8 p-0 text-xs"
                                >
                                  {pageNum}
                                </Button>
                              );
                            })}
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="h-8 w-8 p-0"
                          >
                            &rsaquo;
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="h-8 w-8 p-0"
                          >
                            &raquo;
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}