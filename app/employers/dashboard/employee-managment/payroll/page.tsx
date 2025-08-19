"use client"

import { useState } from "react"
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
  ArrowLeft,
} from "lucide-react"
import Link from "next/link" // Added Link import for navigation

export default function PayrollManagementPage() {
  const [selectedMonth, setSelectedMonth] = useState("2024-01")
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [showPayslipDialog, setShowPayslipDialog] = useState(false)
  const [selectedPayslip, setSelectedPayslip] = useState<any>(null)
  const [overtimeSettings, setOvertimeSettings] = useState("global") // "global" or "individual"

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
    // Simulate bank transfer initiation
    alert(`Bank transfer initiated for ${employee.name} - $${employee.netSalary}`)
  }

  const totalGrossPay = employees.reduce((sum, emp) => sum + calculateGrossSalary(emp), 0)
  const totalDeductions = employees.reduce((sum, emp) => sum + emp.deductions, 0)
  const totalTax = employees.reduce((sum, emp) => sum + emp.tax, 0)
  const totalNetPay = employees.reduce((sum, emp) => sum + emp.netSalary, 0)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            {" "}
            {/* Added flex container for back button */}
            <Link href="/employers/dashboard/employee-managment">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Employment
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold mb-2">Payroll Management</h1>
              <p className="text-emerald-100">Calculate salaries, generate payslips, and manage tax deductions</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Send className="h-4 w-4 mr-2" />
              Process Payroll
            </Button>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">${totalGrossPay.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Gross Pay</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">${totalDeductions.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Deductions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-red-100">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">${totalTax.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Tax</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <CreditCard className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">${totalNetPay.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Net Pay</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Payroll</TabsTrigger>
          <TabsTrigger value="history">Payroll History</TabsTrigger>
          <TabsTrigger value="settings">Salary Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          {/* Current Month Payroll */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-emerald-600" />
                <span>Employee Payroll - January 2024</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-40">
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
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Base Salary</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Overtime</TableHead>
                      <TableHead>Bonus</TableHead>
                      <TableHead>Gross Pay</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Tax</TableHead>
                      <TableHead>Net Pay</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                              <AvatarFallback className="bg-emerald-100 text-emerald-600">
                                {employee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{employee.name}</p>
                              <p className="text-sm text-gray-600">{employee.employeeId}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              employee.salaryType === "monthly"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-green-50 text-green-700"
                            }
                          >
                            {employee.salaryType}
                          </Badge>
                        </TableCell>
                        <TableCell>${employee.baseSalary.toLocaleString()}</TableCell>
                        <TableCell>{employee.hoursWorked}h</TableCell>
                        <TableCell>{employee.overtime}h</TableCell>
                        <TableCell>${employee.bonus}</TableCell>
                        <TableCell className="font-medium">
                          ${calculateGrossSalary(employee).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-red-600">${employee.deductions}</TableCell>
                        <TableCell className="text-red-600">${employee.tax}</TableCell>
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
                              className="h-8 w-8 p-0 bg-transparent"
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
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Payroll History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                <span>Payroll History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payrollHistory.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-emerald-100 rounded-lg">
                        <Calendar className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(record.month + "-01").toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-gray-600">{record.totalEmployees} employees</p>
                        <p className="text-xs text-gray-500">
                          Processed on {new Date(record.processedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-4 text-sm">
                        <div>
                          <p className="text-gray-600">Gross: ${record.totalGrossPay.toLocaleString()}</p>
                          <p className="text-gray-600">Deductions: ${record.totalDeductions.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Tax: ${record.totalTax.toLocaleString()}</p>
                          <p className="font-medium text-emerald-600">Net: ${record.totalNetPay.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className={
                            record.status === "processed"
                              ? "bg-green-50 text-green-700"
                              : "bg-yellow-50 text-yellow-700"
                          }
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {record.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
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

        <TabsContent value="settings" className="space-y-6">
          {/* Salary Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-emerald-600" />
                  <span>Tax Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="federal-tax">Federal Tax Rate (%)</Label>
                  <Input id="federal-tax" type="number" placeholder="15" />
                </div>
                <div>
                  <Label htmlFor="state-tax">State Tax Rate (%)</Label>
                  <Input id="state-tax" type="number" placeholder="5" />
                </div>
                <div>
                  <Label htmlFor="social-security">Social Security (%)</Label>
                  <Input id="social-security" type="number" placeholder="6.2" />
                </div>
                <div>
                  <Label htmlFor="medicare">Medicare (%)</Label>
                  <Input id="medicare" type="number" placeholder="1.45" />
                </div>
                <Button className="w-full">Update Tax Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  <span>Overtime Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="overtime-mode" className="text-base font-medium">
                      Overtime Configuration Mode
                    </Label>
                    <p className="text-sm text-gray-600">
                      Choose between global settings for all employees or individual settings per employee
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="overtime-threshold">Overtime Threshold (hours/week)</Label>
                      <Input id="overtime-threshold" type="number" placeholder="40" />
                    </div>
                    <div>
                      <Label htmlFor="overtime-rate">Overtime Rate Multiplier</Label>
                      <Input id="overtime-rate" type="number" step="0.1" placeholder="1.5" />
                    </div>
                    <div>
                      <Label htmlFor="weekend-rate">Weekend Rate Multiplier</Label>
                      <Input id="weekend-rate" type="number" step="0.1" placeholder="2.0" />
                    </div>
                    <div>
                      <Label htmlFor="holiday-rate">Holiday Rate Multiplier</Label>
                      <Input id="holiday-rate" type="number" step="0.1" placeholder="2.5" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Individual Employee Overtime Settings</h4>
                    <div className="space-y-4">
                      {employees.map((employee) => (
                        <div key={employee.id} className="p-4 border rounded-lg">
                          <div className="flex items-center space-x-3 mb-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                              <AvatarFallback className="bg-emerald-100 text-emerald-600">
                                {employee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{employee.name}</p>
                              <p className="text-sm text-gray-600">{employee.position}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor={`threshold-${employee.id}`}>Overtime Threshold (hrs/week)</Label>
                              <Input
                                id={`threshold-${employee.id}`}
                                type="number"
                                defaultValue={employee.individualOvertimeThreshold}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`rate-${employee.id}`}>Overtime Rate Multiplier</Label>
                              <Input
                                id={`rate-${employee.id}`}
                                type="number"
                                step="0.1"
                                defaultValue={employee.individualOvertimeRate}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button className="w-full">Update Overtime Settings</Button>
              </CardContent>
            </Card>

            {/* Bank Transfer Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  <span>Bank Transfer Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bank-name">Bank Name</Label>
                    <Input id="bank-name" placeholder="Enter bank name" />
                  </div>
                  <div>
                    <Label htmlFor="routing-number">Routing Number</Label>
                    <Input id="routing-number" placeholder="Enter routing number" />
                  </div>
                  <div>
                    <Label htmlFor="account-number">Company Account Number</Label>
                    <Input id="account-number" placeholder="Enter account number" />
                  </div>
                  <div>
                    <Label htmlFor="transfer-day">Transfer Day</Label>
                    <Select>
                      <SelectTrigger>
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
                <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <p className="text-sm text-blue-800">
                    Bank transfer integration requires additional verification and setup with your financial
                    institution.
                  </p>
                </div>
                <Button className="w-full">Save Bank Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Payslip Generation Dialog */}
      <Dialog open={showPayslipDialog} onOpenChange={setShowPayslipDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              <span>Payslip - {selectedPayslip?.name}</span>
            </DialogTitle>
          </DialogHeader>

          {selectedPayslip && (
            <div className="space-y-6">
              {/* Company Header */}
              <div className="text-center border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900">{selectedPayslip.companyName}</h2>
                <p className="text-sm text-gray-600">{selectedPayslip.companyAddress}</p>
                <p className="text-lg font-semibold text-emerald-600 mt-2">PAYSLIP</p>
              </div>

              {/* Employee & Pay Period Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Employee Information</h3>
                  <div className="space-y-1 text-sm">
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
                  <h3 className="font-semibold text-gray-900">Pay Period Information</h3>
                  <div className="space-y-1 text-sm">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 border-b pb-1">Earnings</h3>
                  <div className="space-y-2 text-sm">
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
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 border-b pb-1">Deductions</h3>
                  <div className="space-y-2 text-sm">
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
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-emerald-800">Net Pay:</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    ${selectedPayslip.netSalary.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button className="flex-1" onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Payslip
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
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
