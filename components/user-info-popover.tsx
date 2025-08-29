"use client"

import type React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { User, Mail, Phone, Calendar, DollarSign, AlertCircle, CheckCircle } from "lucide-react"

interface UserInfo {
  emp_id: string
  emp_name: string
  email: string
  mobile: string
  designation: string
  work_status: "active" | "left"
  emergency_contact: string
  emergency_contact_name: string
  salary: string
  joining_date: string
  emp_type: string
  image?: string
}

interface UserInfoPopoverProps {
  user: UserInfo
  children: React.ReactNode
}

export function UserInfoPopover({ user, children }: UserInfoPopoverProps) {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div className="inline-block">{children}</div>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 p-0 shadow-2xl border-2 border-gray-200 bg-white relative"
        side="right"
        align="start"
        sideOffset={10}
        style={{
          zIndex: 9999,
          position: "relative",
        }}
        avoidCollisions={true}
        collisionPadding={20}
      >
        <Card className="border-0 shadow-none bg-white relative">
          <CardContent className="p-4 bg-white">
            {/* Header with avatar and basic info */}
            <div className="flex items-start space-x-3 mb-4">
              <Avatar className="h-12 w-12 border-2 border-gray-200">
                <AvatarImage src={user.image || "/placeholder.svg"} alt={user.emp_name} />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                  {user.emp_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate text-lg">{user.emp_name}</h3>
                <p className="text-sm text-blue-600 font-medium">{user.designation}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge
                    variant={user.work_status === "active" ? "default" : "secondary"}
                    className={
                      user.work_status === "active"
                        ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-300"
                        : "bg-red-100 text-red-700 hover:bg-red-100 border-red-300"
                    }
                  >
                    {user.work_status === "active" ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    {user.work_status === "active" ? "Active" : "Left"}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-gray-300">
                    {user.emp_type}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="my-4 bg-gray-200" />

            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-gray-600 font-medium">Email:</span>
                <span className="text-gray-900 font-medium truncate">{user.email}</span>
              </div>

              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 font-medium">Mobile:</span>
                <span className="text-gray-900 font-medium">{user.mobile}</span>
              </div>

              <div className="flex items-center space-x-3 text-sm">
                <User className="h-4 w-4 text-purple-500 flex-shrink-0" />
                <span className="text-gray-600 font-medium">ID:</span>
                <span className="text-gray-900 font-medium">{user.emp_id}</span>
              </div>

              <div className="flex items-center space-x-3 text-sm">
                <Calendar className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <span className="text-gray-600 font-medium">Joined:</span>
                <span className="text-gray-900 font-medium">
                  {new Date(user.joining_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center space-x-3 text-sm">
                <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-600 font-medium">Salary:</span>
                <span className="text-gray-900 font-bold">{user.salary}</span>
              </div>
            </div>

            <Separator className="my-4 bg-gray-200" />

            {/* Emergency Contact */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-gray-900 flex items-center">
                <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                Emergency Contact
              </h4>
              <div className="pl-6 space-y-1 bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-900 font-semibold">{user.emergency_contact_name}</p>
                <p className="text-sm text-gray-600 font-medium">{user.emergency_contact}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </HoverCardContent>
    </HoverCard>
  )
}
