"use client"

import { Button } from "./button"
import { ButtonProps } from "./button"

interface ClientButtonProps extends ButtonProps {
  onClick?: () => void
}

export function ClientButton({ onClick, ...props }: ClientButtonProps) {
  return <Button onClick={onClick} {...props} />
} 