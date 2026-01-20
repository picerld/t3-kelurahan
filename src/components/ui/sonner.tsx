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
        success: <CircleCheckIcon className="size-5" />,
        info: <InfoIcon className="size-5" />,
        warning: <TriangleAlertIcon className="size-5" />,
        error: <OctagonXIcon className="size-5" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      toastOptions={{
        // style: {
        //   background: '#110E24',
        //   border: '1px solid #23203A',
        //   borderRadius: '16px',
        //   color: '#FFFFFF',
        //   padding: '16px',
        //   fontSize: '14px',
        //   fontWeight: '600',
        //   boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
        // },
        classNames: {
          toast: 'group toast group-[.toaster]:bg-[#110E24] group-[.toaster]:text-white group-[.toaster]:border-[#23203A] group-[.toaster]:shadow-2xl',
          description: 'group-[.toast]:text-[#89869A]',
          actionButton: 'group-[.toast]:bg-[#312ECB] group-[.toast]:text-white group-[.toast]:rounded-xl group-[.toast]:font-semibold group-[.toast]:hover:bg-[#732ECB]',
          cancelButton: 'group-[.toast]:bg-[#23203A] group-[.toast]:text-white group-[.toast]:rounded-xl group-[.toast]:hover:bg-[#312ECB]',
          closeButton: 'group-[.toast]:bg-[#23203A] group-[.toast]:text-white group-[.toast]:border-[#23203A] group-[.toast]:hover:bg-[#312ECB]',
          success: 'group-[.toast]:!bg-[#110E24] group-[.toast]:!border-[#2ECB89] group-[.toast]:!text-white',
          error: 'group-[.toast]:!bg-[#110E24] group-[.toast]:!border-[#FF001F] group-[.toast]:!text-white',
          warning: 'group-[.toast]:!bg-[#110E24] group-[.toast]:!border-[#CB372E] group-[.toast]:!text-white',
          info: 'group-[.toast]:!bg-[#110E24] group-[.toast]:!border-[#312ECB] group-[.toast]:!text-white',
        },
      }}
      style={
        {
          "--normal-bg": "#110E24",
          "--normal-text": "#FFFFFF",
          "--normal-border": "#23203A",
          "--border-radius": "16px",
          "--success-bg": "#110E24",
          "--success-border": "#2ECB89",
          "--success-text": "#FFFFFF",
          "--error-bg": "#110E24",
          "--error-border": "#FF001F",
          "--error-text": "#FFFFFF",
          "--warning-bg": "#110E24",
          "--warning-border": "#CB372E",
          "--warning-text": "#FFFFFF",
          "--info-bg": "#110E24",
          "--info-border": "#312ECB",
          "--info-text": "#FFFFFF",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }