import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="top-right"
      richColors
      visibleToasts={1}
      icons={{
        success: <CircleCheckIcon className="size-6" />,
        info: <InfoIcon className="size-6" />,
        warning: <TriangleAlertIcon className="size-6" />,
        error: <OctagonXIcon className="size-6" />,
        loading: <Loader2Icon className="size-6 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:bg-[#23203A] group-[.toaster]:text-white group-[.toaster]:border-[#23203A] group-[.toaster]:shadow-2xl',
          title: 'group-[.toast]:text-[#E5E3F0] text-sm font-semibold',
          description: 'group-[.toast]:text-[#E5E3F0] text-sm font-semibold',
          actionButton: 'group-[.toast]:bg-[#312ECB] group-[.toast]:text-white group-[.toast]:rounded-xl group-[.toast]:font-semibold group-[.toast]:hover:bg-[#732ECB]',
          cancelButton: 'group-[.toast]:bg-[#23203A] group-[.toast]:text-white group-[.toast]:rounded-xl group-[.toast]:hover:bg-[#312ECB]',
          closeButton: 'group-[.toast]:bg-[#23203A] group-[.toast]:text-white group-[.toast]:border-[#23203A] group-[.toast]:hover:bg-[#312ECB]',
          success: 'group-[.toast]:!bg-[#2ECB89] group-[.toast]:!border-[#2ECB89] group-[.toast]:!text-white',
          error: 'group-[.toast]:!bg-[#FF001F] group-[.toast]:!border-[#FF001F] group-[.toast]:!text-white',
          warning: 'group-[.toast]:!bg-[#CB372E] group-[.toast]:!border-[#CB372E] group-[.toast]:!text-white',
          info: 'group-[.toast]:!bg-[#312ECB] group-[.toast]:!border-[#312ECB] group-[.toast]:!text-white',
        },
      }}
      style={
        {
          "--normal-bg": "#23203A",
          "--normal-text": "#FFFFFF",
          "--normal-border": "#23203A",
          "--border-radius": "16px",
          "--success-bg": "#2ECB89",
          "--success-border": "#2ECB89",
          "--success-text": "#FFFFFF",
          "--error-bg": "#FF001F",
          "--error-border": "#FF001F",
          "--error-text": "#FFFFFF",
          "--warning-bg": "#CB372E",
          "--warning-border": "#CB372E",
          "--warning-text": "#FFFFFF",
          "--info-bg": "#312ECB",
          "--info-border": "#312ECB",
          "--info-text": "#FFFFFF",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }