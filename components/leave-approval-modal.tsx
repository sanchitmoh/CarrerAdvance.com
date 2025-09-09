"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock, FileText, CheckCircle, XCircle } from "lucide-react"
import { LeaveRequest, approveLeaveRequest, updateLeaveRequest, rejectLeaveRequest } from "@/lib/leave-api"

interface LeaveApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  leaveRequest: LeaveRequest | null
  onApprove: (approvedRequest: LeaveRequest) => void
  onReject: (rejectedRequest: LeaveRequest) => void
}

export default function LeaveApprovalModal({
  isOpen,
  onClose,
  leaveRequest,
  onApprove,
  onReject,
}: LeaveApprovalModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [approvedStartDate, setApprovedStartDate] = useState("")
  const [approvedEndDate, setApprovedEndDate] = useState("")
  const [numApprovedDays, setNumApprovedDays] = useState(0)

  // Initialize form data when leave request changes
  useEffect(() => {
    if (leaveRequest) {
      setApprovedStartDate(leaveRequest.approvedStartDate || leaveRequest.applyStartDate)
      setApprovedEndDate(leaveRequest.approvedEndDate || leaveRequest.applyEndDate)
      
      // Calculate days between dates
      const start = new Date(leaveRequest.applyStartDate)
      const end = new Date(leaveRequest.applyEndDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      setNumApprovedDays(leaveRequest.numApprovedDays || diffDays)
    }
  }, [leaveRequest])

  const handleApprove = async () => {
    if (!leaveRequest) return

    setLoading(true)
    try {
      const approvedRequest = await approveLeaveRequest({
        id: leaveRequest.id,
        approvedStartDate,
        approvedEndDate,
        numApprovedDays,
        status: 'approved'
      })
      onApprove(approvedRequest)
      onClose()
    } catch (error) {
      console.error('Failed to approve leave request:', error)
      // Handle error (show toast, etc.)
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!leaveRequest) return

    setLoading(true)
    try {
      const rejected = await rejectLeaveRequest({
        id: leaveRequest.id,
        approvedStartDate,
        approvedEndDate,
        numApprovedDays
      })
      onReject(rejected)
      onClose()
    } catch (error) {
      console.error('Failed to reject leave request:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateDays = () => {
    if (approvedStartDate && approvedEndDate) {
      const start = new Date(approvedStartDate)
      const end = new Date(approvedEndDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      setNumApprovedDays(diffDays)
    }
  }

  if (!leaveRequest) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <span>Leave Request Approval</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Employee Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Employee Information</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Employee Name</Label>
                <p className="text-sm font-semibold">{leaveRequest.employeeName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Employee ID</Label>
                <p className="text-sm font-semibold">{leaveRequest.employeeCode}</p>
              </div>
            </div>
          </div>

          {/* Leave Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Leave Details</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Leave Type</Label>
                <Badge variant="outline" className="mt-1">
                  {leaveRequest.leaveType}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Status</Label>
                <Badge 
                  variant="outline" 
                  className={`mt-1 ${
                    leaveRequest.status === 'pending' 
                      ? 'bg-yellow-50 text-yellow-700' 
                      : leaveRequest.status === 'approved'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {leaveRequest.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Original Request */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Original Request</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Requested Start Date</Label>
                <p className="text-sm font-semibold">{new Date(leaveRequest.applyStartDate).toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Requested End Date</Label>
                <p className="text-sm font-semibold">{new Date(leaveRequest.applyEndDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mt-3">
              <Label className="text-sm font-medium text-gray-600">Reason</Label>
              <p className="text-sm mt-1 bg-white p-2 rounded border">{leaveRequest.reason}</p>
            </div>
            {leaveRequest.applyHardCopy && (
              <div className="mt-3">
                <Label className="text-sm font-medium text-gray-600">Supporting Document</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <a 
                    href={leaveRequest.applyHardCopy} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Document
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Approval Section */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Approval Details</span>
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel Edit' : 'Edit'}
              </Button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="approvedStartDate">Approved Start Date</Label>
                    <Input
                      id="approvedStartDate"
                      type="date"
                      value={approvedStartDate}
                      onChange={(e) => {
                        setApprovedStartDate(e.target.value)
                        calculateDays()
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="approvedEndDate">Approved End Date</Label>
                    <Input
                      id="approvedEndDate"
                      type="date"
                      value={approvedEndDate}
                      onChange={(e) => {
                        setApprovedEndDate(e.target.value)
                        calculateDays()
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="numApprovedDays">Number of Approved Days</Label>
                  <Input
                    id="numApprovedDays"
                    type="number"
                    min="1"
                    value={numApprovedDays}
                    onChange={(e) => setNumApprovedDays(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Approved Start Date</Label>
                  <p className="text-sm font-semibold">
                    {approvedStartDate ? new Date(approvedStartDate).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Approved End Date</Label>
                  <p className="text-sm font-semibold">
                    {approvedEndDate ? new Date(approvedEndDate).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium text-gray-600">Number of Approved Days</Label>
                  <p className="text-sm font-semibold">{numApprovedDays} days</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleReject}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <XCircle className="h-4 w-4" />
            <span>Reject</span>
          </Button>
          <Button 
            onClick={handleApprove}
            disabled={loading}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4" />
            <span>{loading ? 'Approving...' : 'Approve'}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}




