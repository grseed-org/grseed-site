import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {LazyLoadImage} from '@/components/LazyLoadImage';
import {Link} from '@/i18n/navigation';
import {PlaceholderImage} from '@/components/About/AboutShared';

export interface HomeAchievementProps {
  title: string;
  description: string;
  image?: string;
  urlCategorySlug: string;
}

export function HomeAchievement({
  title,
  description,
  image,
  urlCategorySlug,
}: HomeAchievementProps) {
  return (
    <Link href={`/pages/research?category=${urlCategorySlug}`}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {image ? (
            <LazyLoadImage
              src={image}
              alt={title}
              className="w-full object-cover"
            />
          ) : (
            <PlaceholderImage />
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
