"use client"

import { useEffect, useMemo, useState } from "react"
import { API_BASE_URL } from "@/lib/api-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import {
  DollarSign,
  Calculator,
  FileText,
  Download,
  Send,
  CreditCard,
  TrendingUp,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit,
  Printer,
  Mail,
  Phone,
  ArrowLeft,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

// PayrollRow type definition
type PayrollRow = {
  id: number
  payroll_cycle_id: number
  employee_id: number
  company_id: number
  base_salary: number
  working_days: number
  present_days: number
  absent_days: number
  leave_days: number
  total_work_hours: number
  overtime_hours: number
  gross_salary: number
  deductions: number
  tax: number
  net_salary: number
  payment_status: string
  paid_on?: string | null
  created_at: string
  updated_at: string
  employee_name?: string
  employee_email?: string
  department_name?: string
  designation_name?: string
  hourly_rate?: number
  hours_amount?: number
  overtime_amount?: number
  pay_period?: string
}

export default function PayrollManagementPage() {
  // State variables - payroll moved to the top
  const [selectedMonth, setSelectedMonth] = useState("2024-01")
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [showPayslipDialog, setShowPayslipDialog] = useState(false)
  const [selectedPayslip, setSelectedPayslip] = useState<any>(null)
  const [overtimeSettings, setOvertimeSettings] = useState("global")
  const [showCycleDialog, setShowCycleDialog] = useState(false)
  const [cycleForm, setCycleForm] = useState({ startDate: "", endDate: "" })
  const [isSavingCycle, setIsSavingCycle] = useState(false)
  const [lastCycleId, setLastCycleId] = useState<string | null>(null)
  const [baseTaxForm, setBaseTaxForm] = useState({
    federal_rate: "",
    state_rate: "",
    social_security_rate: "",
    medicare_rate: "",
    effective_from: "",
  })
  const [isSavingBaseTax, setIsSavingBaseTax] = useState(false)
  const [baseTaxes, setBaseTaxes] = useState<any[]>([])
  const [loadingBaseTaxes, setLoadingBaseTaxes] = useState(false)
  const [editBaseTax, setEditBaseTax] = useState<any | null>(null)
  const [isUpdatingBaseTax, setIsUpdatingBaseTax] = useState(false)
  const [showCustomTaxDialog, setShowCustomTaxDialog] = useState(false)
  const [customTaxForm, setCustomTaxForm] = useState({ tax_name: "", tax_rate: "", effective_from: "" })
  const [isSavingCustomTax, setIsSavingCustomTax] = useState(false)
  const [customTaxes, setCustomTaxes] = useState<any[]>([])
  const [loadingTaxes, setLoadingTaxes] = useState(false)
  const [editCustomTax, setEditCustomTax] = useState<any | null>(null)
  const [isUpdatingCustomTax, setIsUpdatingCustomTax] = useState(false)
  const [cycles, setCycles] = useState<any[]>([])
  const [loadingCycles, setLoadingCycles] = useState(false)
  const [payroll, setPayroll] = useState<PayrollRow[]>([])
  const [payrollLoading, setPayrollLoading] = useState(false)
  const [payrollError, setPayrollError] = useState<string>("")
  const [payrollFetchAttempted, setPayrollFetchAttempted] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Derived state
  const derivedCycleStatus = useMemo(() => {
    if (!cycleForm.startDate || !cycleForm.endDate) return "pending"
    const start = new Date(cycleForm.startDate)
    const end = new Date(cycleForm.endDate)
    const today = new Date()
    start.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    if (today > end) return "processed"
    return "pending"
  }, [cycleForm.startDate, cycleForm.endDate])

  // Sample employee salary data
  const employees = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@company.com",
      department: "Engineering",
      position: "Senior Developer",
      employeeId: "EMP001",
      salaryType: "monthly",
      baseSalary: 8000,
      hourlyRate: 50,
      hoursWorked: 160,
      overtime: 8,
      bonus: 500,
      deductions: 200,
      tax: 1200,
      netSalary: 7108,
      bankAccount: "****1234",
      avatar: "/placeholder.svg?height=40&width=40",
      individualOvertimeRate: 1.6,
      individualOvertimeThreshold: 45,
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael@company.com",
      department: "Marketing",
      position: "Marketing Manager",
      employeeId: "EMP002",
      salaryType: "monthly",
      baseSalary: 6500,
      hourlyRate: 40,
      hoursWorked: 152,
      overtime: 0,
      bonus: 300,
      deductions: 150,
      tax: 980,
      netSalary: 5670,
      bankAccount: "****5678",
      avatar: "/placeholder.svg?height=40&width=40",
      individualOvertimeRate: 1.5,
      individualOvertimeThreshold: 40,
    },
    {
      id: 3,
      name: "Emily Davis",
      email: "emily@company.com",
      department: "Design",
      position: "UX Designer",
      employeeId: "EMP003",
      salaryType: "hourly",
      baseSalary: 0,
      hourlyRate: 45,
      hoursWorked: 144,
      overtime: 4,
      bonus: 200,
      deductions: 100,
      tax: 950,
      netSalary: 5630,
      bankAccount: "****9012",
      avatar: "/placeholder.svg?height=40&width=40",
      individualOvertimeRate: 1.75,
      individualOvertimeThreshold: 38,
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david@company.com",
      department: "Sales",
      position: "Sales Representative",
      employeeId: "EMP004",
      salaryType: "monthly",
      baseSalary: 5500,
      hourlyRate: 35,
      hoursWorked: 168,
      overtime: 12,
      bonus: 800,
      deductions: 120,
      tax: 920,
      netSalary: 5260,
      bankAccount: "****3456",
      avatar: "/placeholder.svg?height=40&width=40",
      individualOvertimeRate: 1.5,
      individualOvertimeThreshold: 40,
    },
  ]

  // Sample payroll history
  const [payrollHistory] = useState([
    {
      id: 1,
      month: "2024-01",
      totalEmployees: 24,
      totalGrossPay: 156000,
      totalDeductions: 18500,
      totalTax: 23400,
      totalNetPay: 114100,
      status: "processed",
      processedDate: "2024-01-31",
    },
    {
      id: 2,
      month: "2023-12",
      totalEmployees: 23,
      totalGrossPay: 148000,
      totalDeductions: 17200,
      totalTax: 22200,
      totalNetPay: 108600,
      status: "processed",
      processedDate: "2023-12-31",
    },
    {
      id: 3,
      month: "2023-11",
      totalEmployees: 22,
      totalGrossPay: 142000,
      totalDeductions: 16800,
      totalTax: 21300,
      totalNetPay: 103900,
      status: "processed",
      processedDate: "2023-11-30",
    },
  ])

  // Pagination logic
  const currentEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return employees.slice(startIndex, endIndex)
  }, [currentPage, itemsPerPage, employees])

  const currentPayroll = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return payroll.slice(startIndex, endIndex)
  }, [currentPage, itemsPerPage, payroll])

  const totalPages = useMemo(() => {
    const dataLength = payroll.length > 0 ? payroll.length : employees.length
    return Math.ceil(dataLength / itemsPerPage)
  }, [payroll.length, employees.length, itemsPerPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Calculation functions
  const calculateGrossSalary = (employee: any) => {
    if (employee.salaryType === "monthly") {
      return employee.baseSalary + employee.overtime * employee.hourlyRate * 1.5 + employee.bonus
    } else {
      return employee.hoursWorked * employee.hourlyRate + employee.overtime * employee.hourlyRate * 1.5 + employee.bonus
    }
  }

  const generatePayslip = (employee: any) => {
    const grossSalary = calculateGrossSalary(employee)
    const payslipData = {
      ...employee,
      grossSalary,
      payPeriod: selectedMonth,
      generatedDate: new Date().toISOString().split("T")[0],
      companyName: "CareerAdvance Inc.",
      companyAddress: "123 Business St, City, State 12345",
    }
    setSelectedPayslip(payslipData)
    setShowPayslipDialog(true)
  }

  const initiateBankTransfer = (employee: any) => {
    alert(`Bank transfer initiated for ${employee.name} - $${employee.netSalary}`)
  }

  // Lightweight inline user info popover
  const UserInfoPopover = ({ employee, children }: { employee: any; children: React.ReactNode }) => {
    const [showPopover, setShowPopover] = useState(false)

    return (
      <div className="relative inline-block">
        <div
          onMouseEnter={() => setShowPopover(true)}
          onMouseLeave={() => setShowPopover(false)}
          className="cursor-pointer"
        >
          {children}
        </div>
        {showPopover && (
          <div className="absolute left-0 top-full mt-2 w-56 sm:w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-[9999]">
            <div className="flex items-center space-x-2 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {employee.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 text-sm truncate">{employee.name}</h3>
                <p className="text-xs text-gray-600 truncate">
                  {employee.designation || employee.position || "Employee"}
                </p>
                <Badge
                  className={`text-xs ${employee.work_status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {employee.work_status || "active"}
                </Badge>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="grid grid-cols-1 gap-1">
                <div className="flex items-center space-x-1">
                  <Mail className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 truncate break-all">{employee.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">{employee.mobile || "N/A"}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1">
                <div className="flex items-center space-x-1">
                  <Badge className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">{employee.emp_type || "Full-time"}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">{employee.joining_date || "N/A"}</span>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <DollarSign className="h-3 w-3 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">Salary: ${employee.salary || employee.baseSalary || "N/A"}</span>
              </div>
            </div>

            <div className="border-t pt-1 mt-1">
              <h4 className="text-xs font-semibold text-gray-700 mb-1">Emergency Contact</h4>
              <div className="text-xs text-gray-600">
                <p className="truncate">{employee.emergency_contact_name || "N/A"}</p>
                <p>{employee.emergency_contact || "N/A"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // API functions
  const handleSavePayrollCycle = async () => {
    if (!cycleForm.startDate || !cycleForm.endDate) {
      alert("Please select start and end dates.")
      return
    }
    setIsSavingCycle(true)
    try {
      const companyId = getEmployerId()
      const url = `${API_BASE_URL}/payroll-cycles/create${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          start_date: cycleForm.startDate,
          end_date: cycleForm.endDate,
          status: derivedCycleStatus,
        }),
      })
      alert("Payroll cycle saved.")
      setCycleForm({ startDate: "", endDate: "" })
      await fetchPayrollCycles()
    } catch (error) {
      alert("Failed to save payroll cycle.")
    } finally {
      setIsSavingCycle(false)
    }
  }

  const handleSaveBaseTax = async () => {
    if (
      !baseTaxForm.federal_rate ||
      !baseTaxForm.state_rate ||
      !baseTaxForm.social_security_rate ||
      !baseTaxForm.medicare_rate
    ) {
      alert("Please fill in all tax rates.")
      return
    }
    setIsSavingBaseTax(true)
    try {
      const companyId = getEmployerId()
      const url = `${API_BASE_URL}/tax-settings/save-base${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          federal_rate: parseFloat(baseTaxForm.federal_rate),
          state_rate: parseFloat(baseTaxForm.state_rate),
          social_security_rate: parseFloat(baseTaxForm.social_security_rate),
          medicare_rate: parseFloat(baseTaxForm.medicare_rate),
          effective_from: baseTaxForm.effective_from || new Date().toISOString().split("T")[0],
        }),
      })
      alert("Base tax settings saved.")
      await fetchBaseTaxes()
    } catch (e) {
      alert("Failed to save base tax settings.")
    } finally {
      setIsSavingBaseTax(false)
    }
  }

  const handleAddCustomTax = async () => {
    if (!customTaxForm.tax_name || !customTaxForm.tax_rate) {
      alert("Please provide tax name and rate.")
      return
    }
    setIsSavingCustomTax(true)
    try {
      const companyId = getEmployerId()
      const url = `${API_BASE_URL}/tax-settings/add-custom${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          tax_name: customTaxForm.tax_name,
          tax_rate: parseFloat(customTaxForm.tax_rate),
          effective_from: customTaxForm.effective_from || new Date().toISOString().split("T")[0],
        }),
      })
      alert("Custom tax added.")
      setShowCustomTaxDialog(false)
      setCustomTaxForm({ tax_name: "", tax_rate: "", effective_from: "" })
      await fetchCurrentTaxes()
    } catch (e) {
      alert("Failed to add custom tax.")
    } finally {
      setIsSavingCustomTax(false)
    }
  }

  function getEmployerId() {
    if (typeof document === "undefined") return ""
    const match = document.cookie.match(/(?:^|;\s*)employer_id=([^;]+)/)
    return match ? decodeURIComponent(match[1]) : ""
  }

  async function fetchCurrentTaxes() {
    try {
      setLoadingTaxes(true)
      const companyId = getEmployerId()
      const url = `${API_BASE_URL}/tax-settings/current${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
      const res = await fetch(url, { credentials: "include" })
      const json = await res.json()
      if (json && json.success && json.data) {
        setCustomTaxes(Array.isArray(json.data.custom) ? json.data.custom : [])
      }
    } catch (e) {
      // ignore
    } finally {
      setLoadingTaxes(false)
    }
  }

  async function fetchBaseTaxes() {
    try {
      setLoadingBaseTaxes(true)
      const companyId = getEmployerId()
      const url = `${API_BASE_URL}/tax-settings/base-list${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
      const res = await fetch(url, { credentials: "include" })
      const json = await res.json()
      if (json && json.success) {
        setBaseTaxes(Array.isArray(json.data) ? json.data : [])
      }
    } catch (e) {
      // ignore
    } finally {
      setLoadingBaseTaxes(false)
    }
  }

  async function fetchPayrollCycles() {
    try {
      setLoadingCycles(true)
      const companyId = getEmployerId()
      const url = `${API_BASE_URL}/payroll-cycles${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
      const res = await fetch(url, { credentials: "include" })
      const json = await res.json()
      if (json && json.success) {
        setCycles(Array.isArray(json.data) ? json.data : [])
      }
    } catch (e) {
      // ignore
    } finally {
      setLoadingCycles(false)
    }
  }

  async function handleUpdateCustomTax() {
    if (!editCustomTax) return
    if (!editCustomTax.tax_name || editCustomTax.tax_rate === "") {
      alert("Please provide tax name and rate.")
      return
    }
    setIsUpdatingCustomTax(true)
    try {
      const companyId = getEmployerId()
      const url = `${API_BASE_URL}/tax-settings/custom/${encodeURIComponent(editCustomTax.id)}/update${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          tax_name: editCustomTax.tax_name,
          tax_rate: parseFloat(editCustomTax.tax_rate),
          effective_from: editCustomTax.effective_from,
        }),
      })
      alert("Custom tax updated.")
      setEditCustomTax(null)
      await fetchCurrentTaxes()
    } catch (e) {
      alert("Failed to update custom tax.")
    } finally {
      setIsUpdatingCustomTax(false)
    }
  }

  async function handleDeleteCustomTax(tax: any) {
    if (!confirm(`Delete custom tax "${tax.tax_name}"?`)) return
    try {
      const companyId = getEmployerId()
      const url = `${API_BASE_URL}/tax-settings/custom/${encodeURIComponent(tax.id)}/delete${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
      await fetch(url, { method: "POST", credentials: "include" })
      await fetchCurrentTaxes()
    } catch (e) {
      alert("Failed to delete custom tax.")
    }
  }

  useEffect(() => {
    fetchCurrentTaxes()
    fetchBaseTaxes()
    fetchPayrollCycles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleUpdateBaseTax() {
    if (!editBaseTax) return
    setIsUpdatingBaseTax(true)
    try {
      const companyId = getEmployerId()
      const url = `${API_BASE_URL}/tax-settings/base/${encodeURIComponent(editBaseTax.id)}/update${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          federal_rate: parseFloat(editBaseTax.federal_rate),
          state_rate: parseFloat(editBaseTax.state_rate),
          social_security_rate: parseFloat(editBaseTax.social_security_rate),
          medicare_rate: parseFloat(editBaseTax.medicare_rate),
          effective_from: editBaseTax.effective_from,
        }),
      })
      alert("Base tax updated.")
      setEditBaseTax(null)
      await fetchBaseTaxes()
    } catch (e) {
      alert("Failed to update base tax.")
    } finally {
      setIsUpdatingBaseTax(false)
    }
  }

  async function handleDeleteBaseTax(tax: any) {
    if (!confirm("Delete this base tax setting?")) return
    try {
      const companyId = getEmployerId()
      const url = `${API_BASE_URL}/tax-settings/base/${encodeURIComponent(tax.id)}/delete${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
      await fetch(url, { method: "POST", credentials: "include" })
      await fetchBaseTaxes()
    } catch (e) {
      alert("Failed to delete base tax.")
    }
  }

  const totalGrossPay = employees.reduce((sum, emp) => sum + calculateGrossSalary(emp), 0)
  const totalDeductions = employees.reduce((sum, emp) => sum + emp.deductions, 0)
  const totalTax = employees.reduce((sum, emp) => sum + emp.tax, 0)
  const totalNetPay = employees.reduce((sum, emp) => sum + emp.netSalary, 0)

  async function fetchEmployeePayroll() {
    try {
      setPayrollLoading(true)
      setPayrollError("")
      setPayrollFetchAttempted(true)
      const companyId = getEmployerId()
      const params = new URLSearchParams()
      params.set('page', '1')
      params.set('per_page', '50')
      if (companyId) params.set('company_id', companyId)
      const candidatePaths = [
        '/employee-payroll',
        '/employers/Payroll/employee-payroll',
        '/api/employee-payroll'
      ]
      let succeeded = false
      for (const path of candidatePaths) {
        const url = `${API_BASE_URL}${path}?${params.toString()}`
        try {
          const res = await fetch(url, { credentials: 'include' })
          const contentType = res.headers.get('content-type') || ''
          if (!res.ok) {
            continue
          }
          if (!contentType.includes('application/json')) {
            continue
          }
          const json = await res.json()
          if (json && json.success) {
            setPayroll(Array.isArray(json.data?.rows) ? json.data.rows : [])
            succeeded = true
            break
          }
        } catch (innerErr) {
          continue
        }
      }
      if (!succeeded) {
        setPayroll([])
        setPayrollError('Payroll endpoint not found (404). Please confirm API path.')
      }
    } catch (e) {
      setPayroll([])
      setPayrollError('Network error')
    } finally {
      setPayrollLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployeePayroll()
  }, [])

  function generatePayslipFromRow(row: PayrollRow) {
    const payslipData = {
      id: row.employee_id,
      payrollId: row.id,
      name: row.employee_name || `Employee ${row.employee_id}`,
      email: row.employee_email || '',
      department: row.department_name || '',
      position: row.designation_name || '',
      employeeId: String(row.employee_id),
      salaryType: Number(row.base_salary) > 0 ? 'monthly' : 'hourly',
      baseSalary: Number(row.base_salary),
      hourlyRate: Number(row.hourly_rate || 0),
      hoursWorked: Number(row.total_work_hours),
      overtime: Number(row.overtime_hours),
      bonus: 0,
      deductions: Number(row.deductions),
      tax: Number(row.tax),
      netSalary: Number(row.net_salary),
      bankAccount: '',
      avatar: '/placeholder.svg?height=40&width=40',
      individualOvertimeRate: 1.5,
      individualOvertimeThreshold: 40,
      grossSalary: Number(row.gross_salary),
      payPeriod: row.pay_period || (row.created_at ? row.created_at.slice(0,7) : ''),
      generatedDate: new Date().toISOString().split('T')[0],
      companyName: 'CareerAdvance Inc.',
      companyAddress: '—',
      hoursAmount: Number(row.hours_amount || 0),
      overtimeAmount: Number(row.overtime_amount || 0),
    }
    setSelectedPayslip(payslipData as any)
    setShowPayslipDialog(true)
  }

  // Pagination Component
  const Pagination = () => {
    const pageNumbers = []
    const maxPageNumbers = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2))
    let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1)
    
    if (endPage - startPage + 1 < maxPageNumbers) {
      startPage = Math.max(1, endPage - maxPageNumbers + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 px-2 py-4">
        <div className="text-sm text-gray-600">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, payroll.length > 0 ? payroll.length : employees.length)} of {payroll.length > 0 ? payroll.length : employees.length} entries
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {startPage > 1 && (
            <>
              <Button
                variant={currentPage === 1 ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(1)}
                className="h-8 w-8 p-0 hidden sm:inline-flex"
              >
                1
              </Button>
              {startPage > 2 && <span className="px-2 hidden sm:inline">...</span>}
            </>
          )}
          
          {pageNumbers.map(page => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
              className="h-8 w-8 p-0 hidden sm:inline-flex"
            >
              {page}
            </Button>
          ))}
          
          {/* Mobile page indicator */}
          <div className="sm:hidden text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2 hidden sm:inline">...</span>}
              <Button
                variant={currentPage === totalPages ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                className="h-8 w-8 p-0 hidden sm:inline-flex"
              >
                {totalPages}
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-3 sm:px-4 lg:px-6">
      {/* Header - Responsive */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link href="/employers/dashboard/employee-managment">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 w-full sm:w-auto mb-2 sm:mb-0"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Employment</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Payroll Management</h1>
              <p className="text-emerald-100 text-sm sm:text-base">Calculate salaries, generate payslips, and manage tax deductions</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm"
              onClick={() => setShowCycleDialog(true)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Payroll Cycle</span>
              <span className="sm:hidden">Cycle</span>
            </Button>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm">
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export Report</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-100">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">${totalGrossPay.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-gray-600">Gross Pay</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">${totalDeductions.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-gray-600">Deductions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-red-100">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">${totalTax.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-gray-600">Tax</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">${totalNetPay.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-gray-600">Net Pay</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current" className="text-xs sm:text-sm">Current Payroll</TabsTrigger>
          <TabsTrigger value="history" className="text-xs sm:text-sm">Payroll History</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm">Salary Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4 sm:space-y-6">
          {/* Current Month Payroll - Responsive Table */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 p-4 sm:p-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                <span>Employee Payroll - January 2024</span>
              </CardTitle>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-01">January 2024</SelectItem>
                    <SelectItem value="2023-12">December 2023</SelectItem>
                    <SelectItem value="2023-11">November 2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px]">Employee</TableHead>
                        <TableHead className="hidden sm:table-cell">Type</TableHead>
                        <TableHead className="hidden lg:table-cell">Base Salary</TableHead>
                        <TableHead className="hidden md:table-cell">Hours</TableHead>
                        <TableHead className="hidden lg:table-cell">Overtime</TableHead>
                        <TableHead className="hidden xl:table-cell">Bonus</TableHead>
                        <TableHead>Gross Pay</TableHead>
                        <TableHead className="hidden md:table-cell">Deductions</TableHead>
                        <TableHead className="hidden lg:table-cell">Tax</TableHead>
                        <TableHead>Net Pay</TableHead>
                        <TableHead className="min-w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payrollLoading ? (
                        <TableRow>
                          <TableCell colSpan={11} className="text-center text-sm text-gray-600 py-8">Loading payroll data...</TableCell>
                        </TableRow>
                      ) : payroll.length > 0 ? (
                        <>
                          {currentPayroll.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={"/placeholder.svg"} alt={row.employee_name || `Employee ${row.employee_id}`} />
                                    <AvatarFallback className="bg-emerald-100 text-emerald-600 text-xs">
                                      {(row.employee_name || 'Employee')
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="min-w-0 flex-1">
                                    <UserInfoPopover employee={{
                                      name: row.employee_name,
                                      email: row.employee_email,
                                      position: row.designation_name,
                                      avatar: '/placeholder.svg',
                                      work_status: 'active',
                                      emp_type: 'Full-time',
                                      joining_date: '',
                                      salary: row.base_salary,
                                    }}>
                                      <p className="font-medium hover:text-blue-600 transition-colors cursor-pointer truncate text-sm">
                                        {row.employee_name || `Employee ${row.employee_id}`}
                                      </p>
                                    </UserInfoPopover>
                                    <p className="text-xs text-gray-600 truncate">#{row.employee_id}</p>
                                    <div className="sm:hidden mt-1">
                                      <Badge
                                        variant="outline"
                                        className={`text-xs ${(Number(row.base_salary) > 0) ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"}`}
                                      >
                                        {Number(row.base_salary) > 0 ? 'monthly' : 'hourly'}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <Badge
                                  variant="outline"
                                  className={(Number(row.base_salary) > 0) ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"}
                                >
                                  {Number(row.base_salary) > 0 ? 'monthly' : 'hourly'}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">${Number(row.base_salary).toLocaleString()}</TableCell>
                              <TableCell className="hidden md:table-cell">{Number(row.total_work_hours)}h</TableCell>
                              <TableCell className="hidden lg:table-cell">{Number(row.overtime_hours)}h</TableCell>
                              <TableCell className="hidden xl:table-cell">$0</TableCell>
                              <TableCell className="font-medium">
                                ${Number(row.gross_salary).toLocaleString()}
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-red-600">${Number(row.deductions).toLocaleString()}</TableCell>
                              <TableCell className="hidden lg:table-cell text-red-600">${Number(row.tax).toLocaleString()}</TableCell>
                              <TableCell className="font-bold text-emerald-600">
                                ${Number(row.net_salary).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 bg-transparent"
                                    onClick={() => generatePayslipFromRow(row)}
                                    title="View Payslip"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 bg-transparent hidden sm:inline-flex"
                                    title="Edit Employee"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 bg-transparent"
                                    onClick={() => {
                                      if (!row.id) return
                                      const url = `${API_BASE_URL}/employee-payroll/download?payroll_id=${row.id}`
                                      window.open(url, '_blank')
                                    }}
                                    title="Download Payslip"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 bg-transparent text-green-600 hover:text-green-700"
                                    onClick={() => alert(`Bank transfer initiated for employee ${row.employee_id} - $${Number(row.net_salary).toLocaleString()}`)}
                                    title="Bank Transfer"
                                  >
                                    <CreditCard className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      ) : (
                        <>
                          {currentEmployees.map((employee) => (
                            <TableRow key={employee.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                                    <AvatarFallback className="bg-emerald-100 text-emerald-600 text-xs">
                                      {employee.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="min-w-0 flex-1">
                                    <UserInfoPopover employee={employee}>
                                      <p className="font-medium hover:text-blue-600 transition-colors cursor-pointer truncate text-sm">
                                        {employee.name}
                                      </p>
                                    </UserInfoPopover>
                                    <p className="text-xs text-gray-600 truncate">{employee.employeeId}</p>
                                    <div className="sm:hidden mt-1">
                                      <Badge
                                        variant="outline"
                                        className={`text-xs ${employee.salaryType === "monthly" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"}`}
                                      >
                                        {employee.salaryType}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <Badge
                                  variant="outline"
                                  className={employee.salaryType === "monthly" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"}
                                >
                                  {employee.salaryType}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">${employee.baseSalary.toLocaleString()}</TableCell>
                              <TableCell className="hidden md:table-cell">{employee.hoursWorked}h</TableCell>
                              <TableCell className="hidden lg:table-cell">{employee.overtime}h</TableCell>
                              <TableCell className="hidden xl:table-cell">${employee.bonus}</TableCell>
                              <TableCell className="font-medium">
                                ${calculateGrossSalary(employee).toLocaleString()}
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-red-600">${employee.deductions}</TableCell>
                              <TableCell className="hidden lg:table-cell text-red-600">${employee.tax}</TableCell>
                              <TableCell className="font-bold text-emerald-600">
                                ${employee.netSalary.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 bg-transparent"
                                    onClick={() => generatePayslip(employee)}
                                    title="View Payslip"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 bg-transparent hidden sm:inline-flex"
                                    title="Edit Employee"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 bg-transparent"
                                    onClick={() => generatePayslip(employee)}
                                    title="Download Payslip"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 bg-transparent text-green-600 hover:text-green-700"
                                    onClick={() => initiateBankTransfer(employee)}
                                    title="Bank Transfer"
                                  >
                                    <CreditCard className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <Pagination />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 sm:space-y-6">
          {/* Payroll History - Responsive Cards */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                <span>Payroll History</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {payrollHistory.map((record) => (
                  <div key={record.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                      <div className="p-2 sm:p-3 bg-emerald-100 rounded-lg">
                        <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm sm:text-base">
                          {new Date(record.month + "-01").toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">{record.totalEmployees} employees</p>
                        <p className="text-xs text-gray-500 sm:hidden">
                          Processed: {new Date(record.processedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm space-y-2 sm:space-y-0">
                          <div className="grid grid-cols-2 gap-2 sm:block">
                            <p className="text-gray-600">Gross: ${record.totalGrossPay.toLocaleString()}</p>
                            <p className="text-gray-600">Deductions: ${record.totalDeductions.toLocaleString()}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 sm:block">
                            <p className="text-gray-600">Tax: ${record.totalTax.toLocaleString()}</p>
                            <p className="font-medium text-emerald-600">Net: ${record.totalNetPay.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end space-x-2 mt-2 sm:mt-1">
                          <Badge
                            variant="outline"
                            className={record.status === "processed" ? "bg-green-50 text-green-700 text-xs" : "bg-yellow-50 text-yellow-700 text-xs"}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {record.status}
                          </Badge>
                          <Button size="sm" variant="outline" className="text-xs h-7">
                            <Download className="h-3 w-3 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 sm:space-y-6">
          {/* Salary Settings - Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                  <span>Tax Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                {baseTaxes.length === 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="federal-tax" className="text-sm">Federal Tax Rate (%)</Label>
                        <Input
                          id="federal-tax"
                          type="number"
                          step="0.01"
                          placeholder="15"
                          value={baseTaxForm.federal_rate}
                          onChange={(e) => setBaseTaxForm((p) => ({ ...p, federal_rate: e.target.value }))}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state-tax" className="text-sm">State Tax Rate (%)</Label>
                        <Input
                          id="state-tax"
                          type="number"
                          step="0.01"
                          placeholder="5"
                          value={baseTaxForm.state_rate}
                          onChange={(e) => setBaseTaxForm((p) => ({ ...p, state_rate: e.target.value }))}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="social-security" className="text-sm">Social Security (%)</Label>
                        <Input
                          id="social-security"
                          type="number"
                          step="0.01"
                          placeholder="6.2"
                          value={baseTaxForm.social_security_rate}
                          onChange={(e) => setBaseTaxForm((p) => ({ ...p, social_security_rate: e.target.value }))}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="medicare" className="text-sm">Medicare (%)</Label>
                        <Input
                          id="medicare"
                          type="number"
                          step="0.01"
                          placeholder="1.45"
                          value={baseTaxForm.medicare_rate}
                          onChange={(e) => setBaseTaxForm((p) => ({ ...p, medicare_rate: e.target.value }))}
                          className="text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="effective-from" className="text-sm">Effective From</Label>
                        <Input
                          id="effective-from"
                          type="date"
                          value={baseTaxForm.effective_from}
                          onChange={(e) => setBaseTaxForm((p) => ({ ...p, effective_from: e.target.value }))}
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Button className="w-full text-sm" onClick={handleSaveBaseTax} disabled={isSavingBaseTax}>
                        {isSavingBaseTax ? "Saving..." : "Save Base Tax Settings"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-transparent text-sm"
                        onClick={() => setShowCustomTaxDialog(true)}
                      >
                        Add Custom Tax
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600 text-xs">Federal</span>
                          <div className="font-medium">{Number(baseTaxes[0].federal_rate).toFixed(2)}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">State</span>
                          <div className="font-medium">{Number(baseTaxes[0].state_rate).toFixed(2)}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">Social Sec.</span>
                          <div className="font-medium">{Number(baseTaxes[0].social_security_rate).toFixed(2)}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">Medicare</span>
                          <div className="font-medium">{Number(baseTaxes[0].medicare_rate).toFixed(2)}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">Effective</span>
                          <div className="font-medium">{baseTaxes[0].effective_from}</div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Button size="sm" variant="outline" className="bg-transparent text-xs" onClick={() => setEditBaseTax(baseTaxes[0])}>
                          <Edit className="h-3 w-3 mr-1" /> Edit Base Tax
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <span />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-transparent text-sm"
                        onClick={() => setShowCustomTaxDialog(true)}
                      >
                        Add Custom Tax
                      </Button>
                    </div>
                  </>
                )}

                {/* Custom Taxes List */}
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">Custom Taxes</h4>
                    <Button variant="outline" size="sm" className="bg-transparent text-xs" onClick={fetchCurrentTaxes}>
                      Refresh
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {loadingTaxes ? (
                      <p className="text-sm text-gray-600">Loading...</p>
                    ) : customTaxes.length === 0 ? (
                      <p className="text-sm text-gray-600">No custom taxes added yet.</p>
                    ) : (
                      customTaxes.map((t) => (
                        <div key={t.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">{t.tax_name} <span className="text-gray-600">({Number(t.tax_rate).toFixed(2)}%)</span></p>
                            <p className="text-xs text-gray-500">Effective from {t.effective_from}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" className="bg-transparent text-xs h-7" onClick={() => setEditCustomTax(t)}>
                              <Edit className="h-3 w-3 mr-1" /> Edit
                            </Button>
                            <Button size="sm" variant="outline" className="bg-transparent text-red-600 hover:text-red-700 text-xs h-7" onClick={() => handleDeleteCustomTax(t)}>
                              <Trash2 className="h-3 w-3 mr-1" /> Delete
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                  <span>Overtime Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
                  <div className="min-w-0">
                    <Label htmlFor="overtime-mode" className="text-sm font-medium">
                      Overtime Configuration Mode
                    </Label>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Global settings or individual settings per employee
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm ${overtimeSettings === "global" ? "font-medium" : "text-gray-500"}`}>
                      Global
                    </span>
                    <Switch
                      checked={overtimeSettings === "individual"}
                      onCheckedChange={(checked) => setOvertimeSettings(checked ? "individual" : "global")}
                    />
                    <span className={`text-sm ${overtimeSettings === "individual" ? "font-medium" : "text-gray-500"}`}>
                      Individual
                    </span>
                  </div>
                </div>

                {overtimeSettings === "global" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="overtime-threshold" className="text-sm">Overtime Threshold (hours/week)</Label>
                      <Input id="overtime-threshold" type="number" placeholder="40" className="text-sm" />
                    </div>
                    <div>
                      <Label htmlFor="overtime-rate" className="text-sm">Overtime Rate Multiplier</Label>
                      <Input id="overtime-rate" type="number" step="0.1" placeholder="1.5" className="text-sm" />
                    </div>
                    <div>
                      <Label htmlFor="weekend-rate" className="text-sm">Weekend Rate Multiplier</Label>
                      <Input id="weekend-rate" type="number" step="0.1" placeholder="2.0" className="text-sm" />
                    </div>
                    <div>
                      <Label htmlFor="holiday-rate" className="text-sm">Holiday Rate Multiplier</Label>
                      <Input id="holiday-rate" type="number" step="0.1" placeholder="2.5" className="text-sm" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">Individual Employee Overtime Settings</h4>
                    <div className="space-y-3">
                      {employees.map((employee) => (
                        <div key={employee.id} className="p-3 border rounded-lg">
                          <div className="flex items-center space-x-3 mb-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                              <AvatarFallback className="bg-emerald-100 text-emerald-600 text-xs">
                                {employee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">{employee.name}</p>
                              <p className="text-xs text-gray-600 truncate">{employee.position}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor={`threshold-${employee.id}`} className="text-xs">Overtime Threshold (hrs/week)</Label>
                              <Input
                                id={`threshold-${employee.id}`}
                                type="number"
                                defaultValue={employee.individualOvertimeThreshold}
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`rate-${employee.id}`} className="text-xs">Overtime Rate Multiplier</Label>
                              <Input
                                id={`rate-${employee.id}`}
                                type="number"
                                step="0.1"
                                defaultValue={employee.individualOvertimeRate}
                                className="text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button className="w-full text-sm">Update Overtime Settings</Button>
              </CardContent>
            </Card>

            {/* Bank Transfer Settings */}
            <Card className="lg:col-span-2">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                  <span>Bank Transfer Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="bank-name" className="text-sm">Bank Name</Label>
                    <Input id="bank-name" placeholder="Enter bank name" className="text-sm" />
                  </div>
                  <div>
                    <Label htmlFor="routing-number" className="text-sm">Routing Number</Label>
                    <Input id="routing-number" placeholder="Enter routing number" className="text-sm" />
                  </div>
                  <div>
                    <Label htmlFor="account-number" className="text-sm">Company Account Number</Label>
                    <Input id="account-number" placeholder="Enter account number" className="text-sm" />
                  </div>
                  <div>
                    <Label htmlFor="transfer-day" className="text-sm">Transfer Day</Label>
                    <Select>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-day">Last Day of Month</SelectItem>
                        <SelectItem value="15th">15th of Month</SelectItem>
                        <SelectItem value="1st">1st of Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-blue-800">
                    Bank transfer integration requires additional verification and setup with your financial institution.
                  </p>
                </div>
                <Button className="w-full text-sm">Save Bank Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* All dialogs */}
      <Dialog open={showCustomTaxDialog} onOpenChange={setShowCustomTaxDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
              <span>Add Custom Tax</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="custom-tax-name" className="text-sm">Tax Name</Label>
              <Input
                id="custom-tax-name"
                placeholder="e.g., City Tax"
                value={customTaxForm.tax_name}
                onChange={(e) => setCustomTaxForm((p) => ({ ...p, tax_name: e.target.value }))}
                className="text-sm"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="custom-tax-rate" className="text-sm">Tax Rate (%)</Label>
                <Input
                  id="custom-tax-rate"
                  type="number"
                  step="0.01"
                  placeholder="1.00"
                  value={customTaxForm.tax_rate}
                  onChange={(e) => setCustomTaxForm((p) => ({ ...p, tax_rate: e.target.value }))}
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="custom-effective-from" className="text-sm">Effective From</Label>
                <Input
                  id="custom-effective-from"
                  type="date"
                  value={customTaxForm.effective_from}
                  onChange={(e) => setCustomTaxForm((p) => ({ ...p, effective_from: e.target.value }))}
                  className="text-sm"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
              <Button className="flex-1 text-sm" onClick={handleAddCustomTax} disabled={isSavingCustomTax}>
                {isSavingCustomTax ? "Saving..." : "Save Custom Tax"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent text-sm"
                onClick={() => setShowCustomTaxDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Base Tax Dialog */}
      <Dialog open={!!editBaseTax} onOpenChange={(open) => !open && setEditBaseTax(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
              <span>Edit Base Tax</span>
            </DialogTitle>
          </DialogHeader>
          {editBaseTax && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="edit-base-federal" className="text-sm">Federal Tax Rate (%)</Label>
                  <Input
                    id="edit-base-federal"
                    type="number"
                    step="0.01"
                    value={editBaseTax.federal_rate}
                    onChange={(e) => setEditBaseTax((p: any) => ({ ...p, federal_rate: e.target.value }))}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-base-state" className="text-sm">State Tax Rate (%)</Label>
                  <Input
                    id="edit-base-state"
                    type="number"
                    step="0.01"
                    value={editBaseTax.state_rate}
                    onChange={(e) => setEditBaseTax((p: any) => ({ ...p, state_rate: e.target.value }))}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-base-ss" className="text-sm">Social Security (%)</Label>
                  <Input
                    id="edit-base-ss"
                    type="number"
                    step="0.01"
                    value={editBaseTax.social_security_rate}
                    onChange={(e) => setEditBaseTax((p: any) => ({ ...p, social_security_rate: e.target.value }))}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-base-medicare" className="text-sm">Medicare (%)</Label>
                  <Input
                    id="edit-base-medicare"
                    type="number"
                    step="0.01"
                    value={editBaseTax.medicare_rate}
                    onChange={(e) => setEditBaseTax((p: any) => ({ ...p, medicare_rate: e.target.value }))}
                    className="text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit-base-effective" className="text-sm">Effective From</Label>
                  <Input
                    id="edit-base-effective"
                    type="date"
                    value={editBaseTax.effective_from || ""}
                    onChange={(e) => setEditBaseTax((p: any) => ({ ...p, effective_from: e.target.value }))}
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
                <Button className="flex-1 text-sm" onClick={handleUpdateBaseTax} disabled={isUpdatingBaseTax}>
                  {isUpdatingBaseTax ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent text-sm" onClick={() => setEditBaseTax(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Custom Tax Dialog */}
      <Dialog open={!!editCustomTax} onOpenChange={(open) => !open && setEditCustomTax(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
              <span>Edit Custom Tax</span>
            </DialogTitle>
          </DialogHeader>
          {editCustomTax && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-tax-name" className="text-sm">Tax Name</Label>
                <Input
                  id="edit-tax-name"
                  value={editCustomTax.tax_name}
                  onChange={(e) => setEditCustomTax((p: any) => ({ ...p, tax_name: e.target.value }))}
                  className="text-sm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="edit-tax-rate" className="text-sm">Tax Rate (%)</Label>
                  <Input
                    id="edit-tax-rate"
                    type="number"
                    step="0.01"
                    value={editCustomTax.tax_rate}
                    onChange={(e) => setEditCustomTax((p: any) => ({ ...p, tax_rate: e.target.value }))}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-effective-from" className="text-sm">Effective From</Label>
                  <Input
                    id="edit-effective-from"
                    type="date"
                    value={editCustomTax.effective_from || ""}
                    onChange={(e) => setEditCustomTax((p: any) => ({ ...p, effective_from: e.target.value }))}
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
                <Button className="flex-1 text-sm" onClick={handleUpdateCustomTax} disabled={isUpdatingCustomTax}>
                  {isUpdatingCustomTax ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent text-sm" onClick={() => setEditCustomTax(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payroll Cycle Settings Dialog */}
      <Dialog open={showCycleDialog} onOpenChange={setShowCycleDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
              <span>Payroll Cycle Settings</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="cycle-start-date" className="text-sm">Start Date</Label>
                <Input
                  id="cycle-start-date"
                  type="date"
                  value={cycleForm.startDate}
                  onChange={(e) => setCycleForm((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="cycle-end-date" className="text-sm">End Date</Label>
                <Input
                  id="cycle-end-date"
                  type="date"
                  value={cycleForm.endDate}
                  onChange={(e) => setCycleForm((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <p className="text-xs text-gray-600">Derived from the selected dates</p>
              </div>
              <Badge
                variant="outline"
                className={derivedCycleStatus === "processed" ? "bg-green-50 text-green-700 text-xs" : "bg-yellow-50 text-yellow-700 text-xs"}
              >
                {derivedCycleStatus}
              </Badge>
            </div>

            {/* Preview existing cycles */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 text-sm sm:text-base">Recent Cycles</h4>
                <Button variant="outline" size="sm" className="bg-transparent text-xs" onClick={fetchPayrollCycles}>
                  Refresh
                </Button>
              </div>
              {loadingCycles ? (
                <p className="text-sm text-gray-600">Loading...</p>
              ) : cycles.length === 0 ? (
                <p className="text-sm text-gray-600">No cycles found.</p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {cycles.slice(0, 10).map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="text-xs sm:text-sm min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {new Date(c.start_date).toLocaleDateString()} - {new Date(c.end_date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-600">Status: {c.status}</p>
                        {c.processed_on && (
                          <p className="text-xs text-gray-500">Processed on {new Date(c.processed_on).toLocaleString()}</p>
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${c.status === "paid" ? "bg-green-50 text-green-700" : c.status === "processed" || c.status === "approved" ? "bg-blue-50 text-blue-700" : "bg-yellow-50 text-yellow-700"}`}
                      >
                        {c.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
              <Button
                className="flex-1 text-sm"
                onClick={handleSavePayrollCycle}
                disabled={isSavingCycle || !cycleForm.startDate || !cycleForm.endDate}
              >
                {isSavingCycle ? "Saving..." : "Save Cycle"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent text-sm"
                onClick={() => setShowCycleDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payslip Generation Dialog */}
      <Dialog open={showPayslipDialog} onOpenChange={setShowPayslipDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
              <span>Payslip - {selectedPayslip?.name}</span>
            </DialogTitle>
          </DialogHeader>

          {selectedPayslip && (
            <div className="space-y-4 sm:space-y-6">
              {/* Company Header */}
              <div className="text-center border-b pb-3 sm:pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">{selectedPayslip.companyName}</h2>
                <p className="text-xs sm:text-sm text-gray-600">{selectedPayslip.companyAddress}</p>
                <p className="text-base sm:text-lg font-semibold text-emerald-600 mt-1 sm:mt-2">PAYSLIP</p>
              </div>

              {/* Employee & Pay Period Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Employee Information</h3>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <p>
                      <span className="font-medium">Name:</span> {selectedPayslip.name}
                    </p>
                    <p>
                      <span className="font-medium">Employee ID:</span> {selectedPayslip.employeeId}
                    </p>
                    <p>
                      <span className="font-medium">Department:</span> {selectedPayslip.department}
                    </p>
                    <p>
                      <span className="font-medium">Position:</span> {selectedPayslip.position}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {selectedPayslip.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Pay Period Information</h3>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <p>
                      <span>Pay Period:</span>{" "}
                      {new Date(selectedPayslip.payPeriod + "-01").toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p>
                      <span>Generated Date:</span> {new Date(selectedPayslip.generatedDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span>Salary Type:</span> {selectedPayslip.salaryType}
                    </p>
                    <p>
                      <span>Bank Account:</span> {selectedPayslip.bankAccount}
                    </p>
                  </div>
                </div>
              </div>

              {/* Earnings & Deductions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="font-semibold text-gray-900 border-b pb-1 text-sm sm:text-base">Earnings</h3>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span>Base Salary:</span>
                      <span>${selectedPayslip.baseSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hours Worked ({selectedPayslip.hoursWorked}h):</span>
                      <span>${(selectedPayslip.hoursWorked * selectedPayslip.hourlyRate).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overtime ({selectedPayslip.overtime}h):</span>
                      <span>${(selectedPayslip.overtime * selectedPayslip.hourlyRate * 1.5).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bonus:</span>
                      <span>${selectedPayslip.bonus.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Gross Pay:</span>
                      <span>${selectedPayslip.grossSalary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="font-semibold text-gray-900 border-b pb-1 text-sm sm:text-base">Deductions</h3>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span>Tax Deductions:</span>
                      <span className="text-red-600">-${selectedPayslip.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Deductions:</span>
                      <span className="text-red-600">-${selectedPayslip.deductions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total Deductions:</span>
                      <span className="text-red-600">
                        -${(selectedPayslip.tax + selectedPayslip.deductions).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Pay */}
              <div className="bg-emerald-50 p-3 sm:p-4 rounded-lg border border-emerald-200">
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-semibold text-emerald-800">Net Pay:</span>
                  <span className="text-xl sm:text-2xl font-bold text-emerald-600">
                    ${selectedPayslip.netSalary.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-3 sm:pt-4 border-t">
                <Button className="flex-1 text-sm" onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Payslip
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent text-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent text-sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Email to Employee
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}