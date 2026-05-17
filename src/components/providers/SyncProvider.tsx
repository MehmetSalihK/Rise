"use client"

import { useEffect } from 'react'
import { useSync } from '@/hooks/useSync'
import { useRealtimeLoop } from '@/hooks/useRealtimeLoop'
import { requestNotificationPermission } from '@/lib/notifications'

export function SyncProvider() {
  useSync()
  useRealtimeLoop()

  useEffect(() => {
    // Gracefully ask for Web Notification permissions on app startup
    requestNotificationPermission()
  }, [])

  return null
}
