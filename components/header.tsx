import { QuestionMarkCircledIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Header() {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-end gap-4">
      <Button variant="ghost" size="icon">
        <QuestionMarkCircledIcon className="h-5 w-5" />
      </Button>
      <Avatar>
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </header>
  )
}

