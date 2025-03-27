import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const BlogSection = ({ limit = 3 }) => {
  const { t } = useTranslation();
  
  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ['/api/posts'],
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(t('locale'), { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };

  const shareToLinkedIn = (post: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/blog/' + post.id)}`, '_blank');
  };

  const shareToTwitter = (post: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.origin + '/blog/' + post.id)}`, '_blank');
  };

  // Display a limited number of posts
  const displayedPosts = blogPosts.slice(0, limit);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-inter mb-4">{t('blog.title')}</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            {t('blog.subtitle')}
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="bg-gray-200 h-4 w-32 mb-3 animate-pulse"></div>
                  <div className="bg-gray-200 h-6 w-full mb-3 animate-pulse"></div>
                  <div className="bg-gray-200 h-4 w-full mb-2 animate-pulse"></div>
                  <div className="bg-gray-200 h-4 w-3/4 mb-4 animate-pulse"></div>
                  <div className="flex justify-between">
                    <div className="bg-gray-200 h-4 w-24 animate-pulse"></div>
                    <div className="flex space-x-2">
                      <div className="bg-gray-200 h-6 w-6 rounded-full animate-pulse"></div>
                      <div className="bg-gray-200 h-6 w-6 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : displayedPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedPosts.map((post: any) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <article className="bg-white rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md cursor-pointer h-full">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span>{formatDate(post.date)}</span>
                      <span className="mx-2">•</span>
                      <span>{post.category}</span>
                    </div>
                    <h3 className="text-xl font-bold font-inter mb-3">{post.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-medium hover:underline">{t('blog.readMore')}</span>
                      <div className="flex space-x-2">
                        <button className="text-gray-500 hover:text-primary" onClick={(e) => shareToLinkedIn(post, e)} aria-label="Share on LinkedIn">
                          <i className="fab fa-linkedin"></i>
                        </button>
                        <button className="text-gray-500 hover:text-primary" onClick={(e) => shareToTwitter(post, e)} aria-label="Share on Twitter">
                          <i className="fab fa-twitter"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-white rounded-xl shadow-sm">
            <p>{t('blog.noPosts')}</p>
          </div>
        )}

        {limit < blogPosts.length && (
          <div className="text-center mt-12">
            <Link href="/blog">
              <Button variant="outline" className="border-primary text-primary font-medium py-3 px-6 rounded-lg transition-all hover:bg-primary hover:text-white">
                {t('blog.viewAll')}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
