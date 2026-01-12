interface PhoneNumberProps {
  number: string
  location: string
}

export function PhoneNumber({ number, location }: PhoneNumberProps) {
  return (
    <div className="flex flex-col gap-1 px-3 py-2 border rounded-lg bg-white">
      <span className="text-sm font-medium">{number}</span>
      <span className="text-xs text-gray-500">{location}</span>
    </div>
  )
}

