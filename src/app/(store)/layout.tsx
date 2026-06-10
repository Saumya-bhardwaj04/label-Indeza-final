import Navbar from '@/components/Navbar'
import SiteFooter from '@/components/SiteFooter'
import SubscribeModal from '@/components/SubscribeModal'
import RevealInit from '@/components/RevealInit'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <RevealInit />
      {children}
      <SiteFooter />
      <SubscribeModal />
    </>
  )
}
