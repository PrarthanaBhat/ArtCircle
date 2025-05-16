import { Link } from 'wouter';
import { useTranslation } from '@/lib/i18n';

interface CategoryCardProps {
  id: number;
  name: string;
  slug: string;
  photoCount: number;
  imageUrl: string;
}

export default function CategoryCard({ id, name, slug, photoCount, imageUrl }: CategoryCardProps) {
  const { t } = useTranslation();
  
  return (
    <Link href={`/categories/${slug}`} className="relative rounded-lg overflow-hidden h-64 shadow-md hover:shadow-xl transition-all duration-300 block">
      <img 
        src={imageUrl} 
        alt={name} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black opacity-60"></div>
      <div className="absolute bottom-0 left-0 p-6">
        <h3 className="text-xl font-semibold text-white">{name}</h3>
        <p className="text-sm text-gray-200">{photoCount} {t('photos')}</p>
      </div>
    </Link>
  );
}
