'use client'

import { useTransition } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { refreshDashboard } from '@/app/actions'

export function RefreshButton() {
  const [isPending, startTransition] = useTransition()

  const handleRefresh = () => {
    startTransition(async () => {
      await refreshDashboard()
    })
  }

  return (
    <Button
      onClick={handleRefresh}
      disabled={isPending}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
      {isPending ? 'Refreshing...' : 'Refresh'}
    </Button>
  )
}