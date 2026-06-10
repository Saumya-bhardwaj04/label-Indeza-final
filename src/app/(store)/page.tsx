import AnnouncementMarquee from '@/components/AnnouncementMarquee'
import HeroSection from '@/components/HeroSection'
import ProductSection from '@/components/ProductSection'
import CollectionHero from '@/components/home/CollectionHero'
import BrandStatement from '@/components/home/BrandStatement'
import ShopCategories from '@/components/home/ShopCategories'
import OfflineStore from '@/components/home/OfflineStore'
import UGCStrip from '@/components/home/UGCStrip'
import { getSiteContent, getCollections } from '@/lib/data'

// Always re-render on every request — never serve stale cached HTML on back-navigation
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [content, collections] = await Promise.all([
    getSiteContent([
      'pastel_title',
      'summer_title',
      'pastel_banner_image',
      'summer_banner_image',
      'brand_story_image',
      'instafeed_shortcodes',
    ]),
    getCollections(),
  ])

  const pastel = collections.find((c) => c.slug === 'pastel-dreams')
  const summer = collections.find((c) => c.slug === 'summer-2026')

  const pastelTitle = content.pastel_title || 'Pastel Dreams'
  const summerTitle = content.summer_title || 'Summer 2026'
  const brandImg = content.brand_story_image || '/images/brand-model.jpg'
  const instafeedShortcodes = content.instafeed_shortcodes || ''

  return (
    <main>
      <HeroSection />
      <AnnouncementMarquee />

      <ProductSection
        title={pastelTitle}
        subtitle="Soft hues, bold styles — embrace the pastel aesthetic."
        collection="pastel-dreams"
        viewAllHref="/shop/women?collection=pastel-dreams"
        showProductDescription
      />

      <CollectionHero
        collection={pastel}
        title={pastelTitle}
        bannerImage={content.pastel_banner_image || '/images/pastel-banner.jpg'}
      />

      <BrandStatement imageSrc={brandImg} />

      <ProductSection
        title={summerTitle}
        subtitle="Fresh silhouettes for sun-kissed days and breezy evenings."
        collection="summer-2026"
        viewAllHref="/shop/women?collection=summer-2026"
        bordered
        showProductDescription
      />

      <CollectionHero
        collection={summer}
        title={summerTitle}
        mirrored
        bannerImage={content.summer_banner_image || '/images/serene-flow-dress.png'}
      />

      <ShopCategories />

      <OfflineStore />
      <UGCStrip shortcodes={instafeedShortcodes} />
    </main>
  )
}
