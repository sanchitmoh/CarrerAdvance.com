"use client"

import { useEffect, useMemo, useState } from "react"
import { getBaseUrl } from "@/lib/api-config"
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
  MoreHorizontal,
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
  const [showCycleSelectionDialog, setShowCycleSelectionDialog] = useState(false)
  const [cycleForm, setCycleForm] = useState({ startDate: "", endDate: "" })
  const [isSavingCycle, setIsSavingCycle] = useState(false)
  const [lastCycleId, setLastCycleId] = useState<string | null>(null)
  const [selectedCycleForCalculation, setSelectedCycleForCalculation] = useState<any | null>(null)
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

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState<number | null>(null)

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

  // Removed static sample employee data

  // Removed static payroll history

  // Pagination logic
  // Removed currentEmployees derived from static data

  const currentPayroll = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return payroll.slice(startIndex, endIndex)
  }, [currentPage, itemsPerPage, payroll])

  const totalPages = useMemo(() => {
    const dataLength = payroll.length
    return Math.max(1, Math.ceil((dataLength || 0) / itemsPerPage))
  }, [payroll.length, itemsPerPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setMobileMenuOpen(null)
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
    setMobileMenuOpen(null)
  }

  const initiateBankTransfer = (employee: any) => {
    alert(`Bank transfer initiated for ${employee.name} - $${employee.netSalary}`)
    setMobileMenuOpen(null)
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

  // API functions (keep existing functions, they remain unchanged)
  const handleSavePayrollCycle = async () => {
    if (!cycleForm.startDate || !cycleForm.endDate) {
      alert("Please select start and end dates.")
      return
    }
    setIsSavingCycle(true)
    try {
      const companyId = getEmployerId()
      const url = `${getBaseUrl('/payroll-cycles/create')}${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
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
      const url = `${getBaseUrl('/tax-settings/save-base')}${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
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
      const url = `${getBaseUrl('/tax-settings/add-custom')}${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
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

  async function fetchCyclesOnce(): Promise<any[]> {
    try {
      const companyId = getEmployerId()
      const url = `${getBaseUrl('/api/payroll-cycles')}${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
      const res = await fetch(url, { credentials: 'include' })
      const contentType = res.headers.get('content-type') || ''
      if (!res.ok || !contentType.includes('application/json')) return []
      const json = await res.json()
      return Array.isArray(json?.data) ? json.data : []
    } catch {
      return []
    }
  }

  async function fetchCurrentTaxes() {
    try {
      setLoadingTaxes(true)
      const companyId = getEmployerId()
      const url = `${getBaseUrl('/tax-settings/current')}${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
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
      const url = `${getBaseUrl('/tax-settings/base-list')}${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
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
      const url = `${getBaseUrl('payroll-cycles')}${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
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
      const url = `${getBaseUrl(`/tax-settings/custom/${encodeURIComponent(editCustomTax.id)}/update`)}${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
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
      const url = `${getBaseUrl(`/tax-settings/custom/${encodeURIComponent(tax.id)}/delete`)}${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
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
      const url = `${getBaseUrl(`/tax-settings/base/${encodeURIComponent(editBaseTax.id)}/update`)}${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
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
      const url = `${getBaseUrl(`/tax-settings/base/${encodeURIComponent(tax.id)}/delete`)}${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
      await fetch(url, { method: "POST", credentials: "include" })
      await fetchBaseTaxes()
    } catch (e) {
      alert("Failed to delete base tax.")
    }
  }

  const totalGrossPay = payroll.reduce((sum, row) => sum + Number(row.gross_salary || 0), 0)
  const totalDeductions = payroll.reduce((sum, row) => sum + Number(row.deductions || 0), 0)
  const totalTax = payroll.reduce((sum, row) => sum + Number(row.tax || 0), 0)
  const totalNetPay = payroll.reduce((sum, row) => sum + Number(row.net_salary || 0), 0)

  const [isCalculating, setIsCalculating] = useState(false)
  function getLatestCycleId() {
    if (!cycles || cycles.length === 0) return null
    const latest = cycles.reduce((acc: any, cur: any) => {
      const accEnd = new Date(acc?.end_date || acc?.endDate || 0).getTime()
      const curEnd = new Date(cur?.end_date || cur?.endDate || 0).getTime()
      return curEnd > accEnd ? cur : acc
    }, cycles[0])
    return latest?.id ?? latest?.cycle_id ?? null
  }

  async function handleCalculatePayroll() {
    try {
      let sourceCycles = cycles
      if (!sourceCycles || sourceCycles.length === 0) {
        sourceCycles = await fetchCyclesOnce()
        if (sourceCycles.length > 0) setCycles(sourceCycles)
      }
      
      if (!sourceCycles || sourceCycles.length === 0) {
        alert("No payroll cycles found. Please create a cycle first.")
        return
      }
      
      // Show cycle selection dialog
      setShowCycleSelectionDialog(true)
    } catch (e) {
      alert('Error loading cycles')
    }
  }

  async function handleCalculatePayrollWithCycle(cycle: any) {
    try {
      setIsCalculating(true)
      setShowCycleSelectionDialog(false)
      
      const cycleId = cycle?.id ?? cycle?.cycle_id ?? null
      if (!cycleId) {
        alert("Invalid cycle selected.")
        return
      }
      
      const url = `/api/employer/payroll/calculate_payroll`
      const body = new URLSearchParams()
      body.set('cycle_id', String(cycleId))
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        credentials: 'include',
        body: body.toString()
      })
      const contentType = res.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const json = await res.json()
        if (res.ok && json && json.success) {
          alert(`Payroll calculated for cycle ${cycle.start_date} - ${cycle.end_date}. Finalized: ${json.finalized_employees || 0}, Deductions: ${json.itemized_deductions || 0}`)
          await fetchEmployeePayroll()
        } else {
          alert(json?.message || 'Failed to calculate payroll')
        }
      } else {
        const text = await res.text()
        alert(`Unexpected response. Status ${res.status}. ${text.slice(0, 180)}`)
      }
    } catch (e) {
      alert('Network error while calculating payroll')
    } finally {
      setIsCalculating(false)
    }
  }

  async function fetchEmployeePayroll() {
    try {
      setPayrollLoading(true)
      setPayrollError("")
      setPayrollFetchAttempted(true)
      const companyId = getEmployerId()
      const searchParams = new URLSearchParams()
      searchParams.set('page', '1')
      searchParams.set('per_page', '50')
      if (companyId) searchParams.set('company_id', companyId)
      const candidatePaths = [
        '/employee-payroll',
        '/employers/Payroll/employee-payroll',
        '/api/employee-payroll'
      ]
      let succeeded = false
      for (const path of candidatePaths) {
        const url = `${getBaseUrl(path)}?${searchParams.toString()}`
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
    setMobileMenuOpen(null)
  }

  // Mobile Actions Menu Component
  const MobileActionsMenu = ({ employee, row, index }: { employee?: any, row?: PayrollRow, index: number }) => {
    const isOpen = mobileMenuOpen === index
    
    return (
      <div className="relative sm:hidden">
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => setMobileMenuOpen(isOpen ? null : index)}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
        
        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
            <button
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
              onClick={() => row ? generatePayslipFromRow(row) : employee ? generatePayslip(employee) : null}
            >
              <Eye className="h-4 w-4" />
              <span>View Payslip</span>
            </button>
            <button
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
              onClick={() => row ? generatePayslipFromRow(row) : employee ? generatePayslip(employee) : null}
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
            <button
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
              onClick={() => row ? alert(`Bank transfer for employee ${row.employee_id}`) : employee ? initiateBankTransfer(employee) : null}
            >
              <CreditCard className="h-4 w-4" />
              <span>Bank Transfer</span>
            </button>
          </div>
        )}
      </div>
    )
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
        <div className="text-sm text-gray-600 text-center sm:text-left">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, payroll.length)} of {payroll.length} entries
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
          <div className="sm:hidden text-sm font-medium px-3">
            {currentPage} / {totalPages}
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
    <div className="max-w-7xl mx-auto space-y-6 px-3 sm:px-4 lg:px-6 py-4">
      {/* Header - Mobile Responsive */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full">
            <Link href="/employers/dashboard/employee-managment" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 w-full sm:w-auto justify-center sm:justify-start"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Employment</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Payroll Management</h1>
              <p className="text-emerald-100 text-sm sm:text-base">Calculate salaries, generate payslips, and manage tax deductions</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm w-full sm:w-auto justify-center"
              onClick={() => setShowCycleDialog(true)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Payroll Cycle</span>
              <span className="sm:hidden">Cycle</span>
            </Button>
            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm w-full sm:w-auto justify-center"
              onClick={handleCalculatePayroll}
              disabled={isCalculating}
            >
              <Calculator className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{isCalculating ? 'Calculating…' : 'Calculate Payroll'}</span>
              <span className="sm:hidden">{isCalculating ? '…' : 'Calculate'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-green-100">
                <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">${(totalGrossPay / 1000).toFixed(0)}k</p>
                <p className="text-xs sm:text-sm text-gray-600">Gross Pay</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-blue-100">
                <Calculator className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">${(totalDeductions / 1000).toFixed(0)}k</p>
                <p className="text-xs sm:text-sm text-gray-600">Deductions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-red-100">
                <FileText className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">${(totalTax / 1000).toFixed(0)}k</p>
                <p className="text-xs sm:text-sm text-gray-600">Tax</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-100">
                <CreditCard className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">${(totalNetPay / 1000).toFixed(0)}k</p>
                <p className="text-xs sm:text-sm text-gray-600">Net Pay</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current" className="text-xs sm:text-sm">Current</TabsTrigger>
          <TabsTrigger value="history" className="text-xs sm:text-sm">History</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4 sm:space-y-6">
          {/* Current Month Payroll - Responsive Table */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 p-4 sm:p-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                <span>Employee Payroll</span>
              </CardTitle>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-full sm:w-40 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-01">Jan 2024</SelectItem>
                    <SelectItem value="2023-12">Dec 2023</SelectItem>
                    <SelectItem value="2023-11">Nov 2023</SelectItem>
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
                        <TableHead className="min-w-[140px] text-xs sm:text-sm">Employee</TableHead>
                        <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Type</TableHead>
                        <TableHead className="hidden lg:table-cell text-xs sm:text-sm">Base</TableHead>
                        <TableHead className="hidden md:table-cell text-xs sm:text-sm">Hours</TableHead>
                        <TableHead className="hidden lg:table-cell text-xs sm:text-sm">OT</TableHead>
                        <TableHead className="text-xs sm:text-sm">Gross</TableHead>
                        <TableHead className="hidden md:table-cell text-xs sm:text-sm">Deductions</TableHead>
                        <TableHead className="text-xs sm:text-sm">Net</TableHead>
                        <TableHead className="min-w-[80px] text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payrollLoading ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center text-sm text-gray-600 py-8">
                            <div className="flex flex-col items-center space-y-2">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                              <span>Loading payroll data...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : payroll.length > 0 ? (
                        <>
                          {currentPayroll.map((row, index) => (
                            <TableRow key={row.id} className="text-xs sm:text-sm">
                              <TableCell>
                                <div className="flex items-center space-x-2 min-w-0">
                                  <Avatar className="h-8 w-8 flex-shrink-0">
                                    <AvatarImage src={"/placeholder.svg"} alt={row.employee_name || `Employee ${row.employee_id}`} />
                                    <AvatarFallback className="bg-emerald-100 text-emerald-600 text-xs">
                                      {(row.employee_name || 'EE')
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .slice(0, 2)}
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
                                      <p className="font-medium hover:text-blue-600 transition-colors cursor-pointer truncate">
                                        {row.employee_name || `Emp ${row.employee_id}`}
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
                                  className={`text-xs ${(Number(row.base_salary) > 0) ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"}`}
                                >
                                  {Number(row.base_salary) > 0 ? 'monthly' : 'hourly'}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">${Number(row.base_salary).toLocaleString()}</TableCell>
                              <TableCell className="hidden md:table-cell">{Number(row.total_work_hours)}h</TableCell>
                              <TableCell className="hidden lg:table-cell">{Number(row.overtime_hours)}h</TableCell>
                              <TableCell className="font-medium">
                                ${Number(row.gross_salary).toLocaleString()}
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-red-600">${Number(row.deductions).toLocaleString()}</TableCell>
                              <TableCell className="font-bold text-emerald-600">
                                ${Number(row.net_salary).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-1">
                                  <div className="hidden sm:flex space-x-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 w-7 p-0 bg-transparent"
                                      onClick={() => generatePayslipFromRow(row)}
                                      title="View Payslip"
                                    >
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 w-7 p-0 bg-transparent"
                                      onClick={() => {
                                        if (!row.id) return
                                        const url = `${getBaseUrl('/employee-payroll/download')}?payroll_id=${row.id}`
                                        window.open(url, '_blank')
                                      }}
                                      title="Download Payslip"
                                    >
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <MobileActionsMenu row={row} index={index} />
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-10">
                            <div className="space-y-3">
                              <p className="text-sm text-gray-600">No payroll found for the selected period.</p>
                              <Button variant="outline" onClick={() => setShowCycleDialog(true)}>
                                <Calendar className="h-4 w-4 mr-2" /> Add Payroll Cycle
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
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
          {/* Payroll History - Mobile Responsive Cards */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                <span>Payroll History</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {cycles.length === 0 ? (
                  <p className="text-sm text-gray-600">No history available.</p>
                ) : (
                  cycles.map((c) => (
                    <div key={c.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                        <div className="p-2 sm:p-3 bg-emerald-100 rounded-lg flex-shrink-0">
                          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm sm:text-base">
                            {new Date(c.start_date).toLocaleDateString()} - {new Date(c.end_date).toLocaleDateString()}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">Status: {c.status}</p>
                        </div>
                      </div>
                      <div className="w-full sm:w-auto">
                        <div className="flex items-center justify-between sm:justify-end space-x-2 mt-2 sm:mt-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${c.status === 'processed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {c.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 sm:space-y-6">
          {/* Salary Settings - Mobile Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="p-4 sm:p-6 pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                  <span>Tax Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                {baseTaxes.length === 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="federal-tax" className="text-xs sm:text-sm">Federal Tax (%)</Label>
                        <Input
                          id="federal-tax"
                          type="number"
                          step="0.01"
                          placeholder="15"
                          value={baseTaxForm.federal_rate}
                          onChange={(e) => setBaseTaxForm((p) => ({ ...p, federal_rate: e.target.value }))}
                          className="text-sm h-9"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state-tax" className="text-xs sm:text-sm">State Tax (%)</Label>
                        <Input
                          id="state-tax"
                          type="number"
                          step="0.01"
                          placeholder="5"
                          value={baseTaxForm.state_rate}
                          onChange={(e) => setBaseTaxForm((p) => ({ ...p, state_rate: e.target.value }))}
                          className="text-sm h-9"
                        />
                      </div>
                      <div>
                        <Label htmlFor="social-security" className="text-xs sm:text-sm">Social Security (%)</Label>
                        <Input
                          id="social-security"
                          type="number"
                          step="0.01"
                          placeholder="6.2"
                          value={baseTaxForm.social_security_rate}
                          onChange={(e) => setBaseTaxForm((p) => ({ ...p, social_security_rate: e.target.value }))}
                          className="text-sm h-9"
                        />
                      </div>
                      <div>
                        <Label htmlFor="medicare" className="text-xs sm:text-sm">Medicare (%)</Label>
                        <Input
                          id="medicare"
                          type="number"
                          step="0.01"
                          placeholder="1.45"
                          value={baseTaxForm.medicare_rate}
                          onChange={(e) => setBaseTaxForm((p) => ({ ...p, medicare_rate: e.target.value }))}
                          className="text-sm h-9"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="effective-from" className="text-xs sm:text-sm">Effective From</Label>
                        <Input
                          id="effective-from"
                          type="date"
                          value={baseTaxForm.effective_from}
                          onChange={(e) => setBaseTaxForm((p) => ({ ...p, effective_from: e.target.value }))}
                          className="text-sm h-9"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button className="w-full text-sm h-9" onClick={handleSaveBaseTax} disabled={isSavingBaseTax}>
                        {isSavingBaseTax ? "Saving..." : "Save Base Tax"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-transparent text-sm h-9"
                        onClick={() => setShowCustomTaxDialog(true)}
                      >
                        Add Custom Tax
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600 text-xs">Federal</span>
                          <div className="font-medium text-sm">{Number(baseTaxes[0].federal_rate).toFixed(1)}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">State</span>
                          <div className="font-medium text-sm">{Number(baseTaxes[0].state_rate).toFixed(1)}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">Social Sec.</span>
                          <div className="font-medium text-sm">{Number(baseTaxes[0].social_security_rate).toFixed(1)}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">Medicare</span>
                          <div className="font-medium text-sm">{Number(baseTaxes[0].medicare_rate).toFixed(1)}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">Effective</span>
                          <div className="font-medium text-sm">{baseTaxes[0].effective_from}</div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Button size="sm" variant="outline" className="bg-transparent text-xs h-8" onClick={() => setEditBaseTax(baseTaxes[0])}>
                          <Edit className="h-3 w-3 mr-1" /> Edit
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <span />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-transparent text-sm h-9"
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
                    <Button variant="outline" size="sm" className="bg-transparent text-xs h-8" onClick={fetchCurrentTaxes}>
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
                            <p className="font-medium text-gray-900 text-sm truncate">{t.tax_name}</p>
                            <p className="text-xs text-gray-500">{Number(t.tax_rate).toFixed(2)}% • Effective {t.effective_from}</p>
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
              <CardHeader className="p-4 sm:p-6 pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                  <span>Overtime Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
                  <div className="min-w-0">
                    <Label htmlFor="overtime-mode" className="text-xs sm:text-sm font-medium">
                      Overtime Mode
                    </Label>
                    <p className="text-xs text-gray-600">
                      Global or individual settings
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs sm:text-sm ${overtimeSettings === "global" ? "font-medium" : "text-gray-500"}`}>
                      Global
                    </span>
                    <Switch
                      checked={overtimeSettings === "individual"}
                      onCheckedChange={(checked) => setOvertimeSettings(checked ? "individual" : "global")}
                    />
                    <span className={`text-xs sm:text-sm ${overtimeSettings === "individual" ? "font-medium" : "text-gray-500"}`}>
                      Individual
                    </span>
                  </div>
                </div>

                {overtimeSettings === "global" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="overtime-threshold" className="text-xs sm:text-sm">OT Threshold (hrs/wk)</Label>
                      <Input id="overtime-threshold" type="number" placeholder="40" className="text-sm h-9" />
                    </div>
                    <div>
                      <Label htmlFor="overtime-rate" className="text-xs sm:text-sm">OT Rate Multiplier</Label>
                      <Input id="overtime-rate" type="number" step="0.1" placeholder="1.5" className="text-sm h-9" />
                    </div>
                    <div>
                      <Label htmlFor="weekend-rate" className="text-xs sm:text-sm">Weekend Multiplier</Label>
                      <Input id="weekend-rate" type="number" step="0.1" placeholder="2.0" className="text-sm h-9" />
                    </div>
                    <div>
                      <Label htmlFor="holiday-rate" className="text-xs sm:text-sm">Holiday Multiplier</Label>
                      <Input id="holiday-rate" type="number" step="0.1" placeholder="2.5" className="text-sm h-9" />
                    </div>
                  </div>
                ) : (
                  <div className="p-3 border rounded-lg text-xs text-gray-600">No employees loaded.</div>
                )}

                <Button className="w-full text-sm h-9">Update Settings</Button>
              </CardContent>
            </Card>

            {/* Bank Transfer Settings */}
            <Card className="lg:col-span-2">
              <CardHeader className="p-4 sm:p-6 pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                  <span>Bank Transfer Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="bank-name" className="text-xs sm:text-sm">Bank Name</Label>
                    <Input id="bank-name" placeholder="Bank name" className="text-sm h-9" />
                  </div>
                  <div>
                    <Label htmlFor="routing-number" className="text-xs sm:text-sm">Routing Number</Label>
                    <Input id="routing-number" placeholder="Routing number" className="text-sm h-9" />
                  </div>
                  <div>
                    <Label htmlFor="account-number" className="text-xs sm:text-sm">Account Number</Label>
                    <Input id="account-number" placeholder="Account number" className="text-sm h-9" />
                  </div>
                  <div>
                    <Label htmlFor="transfer-day" className="text-xs sm:text-sm">Transfer Day</Label>
                    <Select>
                      <SelectTrigger className="text-sm h-9">
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
                  <p className="text-xs text-blue-800">
                    Bank transfer integration requires additional verification with your financial institution.
                  </p>
                </div>
                <Button className="w-full text-sm h-9">Save Bank Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* All dialogs remain the same but with responsive classes */}
      <Dialog open={showCustomTaxDialog} onOpenChange={setShowCustomTaxDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg">
              <Calculator className="h-4 w-4 text-emerald-600" />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                {isSavingCustomTax ? "Saving..." : "Save Tax"}
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
        <DialogContent className="max-w-[95vw] sm:max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg">
              <Calculator className="h-4 w-4 text-emerald-600" />
              <span>Edit Base Tax</span>
            </DialogTitle>
          </DialogHeader>
          {editBaseTax && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="edit-base-federal" className="text-sm">Federal (%)</Label>
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
                  <Label htmlFor="edit-base-state" className="text-sm">State (%)</Label>
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
                <div className="sm:col-span-2">
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
        <DialogContent className="max-w-[95vw] sm:max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg">
              <Calculator className="h-4 w-4 text-emerald-600" />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        <DialogContent className="max-w-[95vw] sm:max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg">
              <Calendar className="h-4 w-4 text-emerald-600" />
              <span>Payroll Cycle</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <p className="text-xs text-gray-600">Based on dates</p>
              </div>
              <Badge
                variant="outline"
                className={derivedCycleStatus === "processed" ? "bg-green-50 text-green-700 text-xs" : "bg-yellow-50 text-yellow-700 text-xs"}
              >
                {derivedCycleStatus}
              </Badge>
            </div>

            {/* Recent cycles */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 text-sm">Recent Cycles</h4>
                <Button variant="outline" size="sm" className="bg-transparent text-xs h-7" onClick={fetchPayrollCycles}>
                  Refresh
                </Button>
              </div>
              {loadingCycles ? (
                <p className="text-sm text-gray-600">Loading...</p>
              ) : cycles.length === 0 ? (
                <p className="text-sm text-gray-600">No cycles found.</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {cycles.slice(0, 5).map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate text-xs">
                          {new Date(c.start_date).toLocaleDateString()} - {new Date(c.end_date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-600">Status: {c.status}</p>
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
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[85vh] overflow-y-auto rounded-lg">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Employee Information</h3>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <p><span className="font-medium">Name:</span> {selectedPayslip.name}</p>
                    <p><span className="font-medium">Employee ID:</span> {selectedPayslip.employeeId}</p>
                    <p><span className="font-medium">Department:</span> {selectedPayslip.department}</p>
                    <p><span className="font-medium">Position:</span> {selectedPayslip.position}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Pay Period</h3>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <p><span>Period:</span> {new Date(selectedPayslip.payPeriod + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
                    <p><span>Generated:</span> {new Date(selectedPayslip.generatedDate).toLocaleDateString()}</p>
                    <p><span>Salary Type:</span> {selectedPayslip.salaryType}</p>
                  </div>
                </div>
              </div>

              {/* Earnings & Deductions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="font-semibold text-gray-900 border-b pb-1 text-sm sm:text-base">Earnings</h3>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <div className="flex justify-between"><span>Base Salary:</span><span>${selectedPayslip.baseSalary.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Hours Worked:</span><span>${(selectedPayslip.hoursWorked * selectedPayslip.hourlyRate).toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Overtime:</span><span>${(selectedPayslip.overtime * selectedPayslip.hourlyRate * 1.5).toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Bonus:</span><span>${selectedPayslip.bonus.toLocaleString()}</span></div>
                    <div className="flex justify-between font-semibold border-t pt-2"><span>Gross Pay:</span><span>${selectedPayslip.grossSalary.toLocaleString()}</span></div>
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="font-semibold text-gray-900 border-b pb-1 text-sm sm:text-base">Deductions</h3>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <div className="flex justify-between"><span>Tax Deductions:</span><span className="text-red-600">-${selectedPayslip.tax.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Other Deductions:</span><span className="text-red-600">-${selectedPayslip.deductions.toLocaleString()}</span></div>
                    <div className="flex justify-between font-semibold border-t pt-2"><span>Total Deductions:</span><span className="text-red-600">-${(selectedPayslip.tax + selectedPayslip.deductions).toLocaleString()}</span></div>
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
                <Button className="flex-1 text-sm h-9" onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent text-sm h-9">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent text-sm h-9">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cycle Selection Dialog for Payroll Calculation */}
      <Dialog open={showCycleSelectionDialog} onOpenChange={setShowCycleSelectionDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg rounded-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg">
              <Calculator className="h-4 w-4 text-emerald-600" />
              <span>Select Payroll Cycle</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Choose which payroll cycle you want to calculate payroll for:
            </div>

            {loadingCycles ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                <span className="ml-2 text-sm text-gray-600">Loading cycles...</span>
              </div>
            ) : cycles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600 mb-4">No payroll cycles found.</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowCycleSelectionDialog(false)
                    setShowCycleDialog(true)
                  }}
                  className="text-sm"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Create New Cycle
                </Button>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cycles.map((cycle) => (
                  <div 
                    key={cycle.id} 
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedCycleForCalculation?.id === cycle.id 
                        ? 'border-emerald-500 bg-emerald-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedCycleForCalculation(cycle)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {new Date(cycle.start_date).toLocaleDateString()} - {new Date(cycle.end_date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-600">Status: {cycle.status}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            cycle.status === "paid" 
                              ? "bg-green-50 text-green-700" 
                              : cycle.status === "processed" || cycle.status === "approved" 
                                ? "bg-blue-50 text-blue-700" 
                                : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {cycle.status}
                        </Badge>
                        {selectedCycleForCalculation?.id === cycle.id && (
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
              <Button 
                className="flex-1 text-sm" 
                onClick={() => selectedCycleForCalculation && handleCalculatePayrollWithCycle(selectedCycleForCalculation)}
                disabled={!selectedCycleForCalculation || isCalculating}
              >
                {isCalculating ? "Calculating..." : "Calculate Payroll"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent text-sm"
                onClick={() => {
                  setShowCycleSelectionDialog(false)
                  setSelectedCycleForCalculation(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 