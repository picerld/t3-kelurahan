import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { CitizenFormSchema } from '../../create/forms/citizen'

type AccessoriesDialogType = 'add' | 'edit' | 'delete' | 'detail'

type AccessoriesContextType = {
  open: AccessoriesDialogType | null
  setOpen: (str: AccessoriesDialogType | null) => void
  currentRow: CitizenFormSchema | null
  setCurrentRow: React.Dispatch<React.SetStateAction<CitizenFormSchema | null>>
}

const AccessoriessContext = React.createContext<AccessoriesContextType | null>(null)

export function AccessoriessProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<AccessoriesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<CitizenFormSchema | null>(null)

  return (
    <AccessoriessContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </AccessoriessContext>
  )
}

export const useAccessoriess = () => {
  const accessoriesContext = React.useContext(AccessoriessContext)

  if (!accessoriesContext) {
    throw new Error('useUsers has to be used within <accessoriesContext>')
  }

  return accessoriesContext
}