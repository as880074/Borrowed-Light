import { useState } from 'react'
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Chip {
  label: string
  value: number
}

interface MoneyInputProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  id?: string
  chips?: Chip[]
  placeholder?: string
  className?: string
}

export function MoneyInput<T extends FieldValues>({ control, name, id, chips, placeholder, className }: MoneyInputProps<T>) {
  const [focused, setFocused] = useState(false)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const numeric = typeof field.value === 'number' && !Number.isNaN(field.value) ? field.value : 0
        const display = focused
          ? numeric === 0
            ? ''
            : String(numeric)
          : numeric.toLocaleString('zh-TW')

        return (
          <div className="space-y-1.5">
            <Input
              id={id}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder={placeholder}
              value={display}
              onFocus={() => setFocused(true)}
              onBlur={() => {
                setFocused(false)
                field.onBlur()
              }}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^\d]/g, '')
                const num = cleaned === '' ? 0 : Number(cleaned)
                field.onChange(num)
              }}
              className={cn('mono-tabular', className)}
            />
            {chips && chips.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {chips.map((chip) => {
                  const active = numeric === chip.value
                  return (
                    <button
                      key={chip.value}
                      type="button"
                      onClick={() => field.onChange(chip.value)}
                      className={cn(
                        'mono-tabular rounded-md border px-2.5 py-1 text-[11px] font-medium tracking-wide transition-all',
                        active
                          ? 'border-gold/60 bg-neon-purple/15 text-gold-bright shadow-[0_0_0_1px_rgba(201,164,92,0.3)]'
                          : 'border-cyber-border bg-cyber-panel-2/40 text-cyber-text-2 hover:border-gold/40 hover:text-gold-bright',
                      )}
                    >
                      {chip.label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      }}
    />
  )
}
