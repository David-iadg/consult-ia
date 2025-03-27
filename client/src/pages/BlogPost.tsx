import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

const BlogPost = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: post, isLoading, isError } = useQuery({
    queryKey: [`/api/posts/${id}`],
  });

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | ConsultIA`;
    }
    window.scrollTo(0, 0);
  }, [post]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(t('locale'), { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post?.title || '')}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="h-7 bg-gray-200 w-3/4 mb-4 animate-pulse rounded"></div>
          <div className="h-4 bg-gray-200 w-1/2 mb-8 animate-pulse rounded"></div>
          <div className="h-72 bg-gray-200 w-full mb-8 animate-pulse rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 w-full mb-2 animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">{t('blog.post.notFound')}</h1>
          <p className="mb-8">{t('blog.post.unavailable')}</p>
          <Button onClick={() => setLocation("/blog")}>
            {t('blog.post.backToBlog')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="inline-flex items-center text-primary mb-6 hover:underline">
            <i className="fas fa-arrow-left mr-2"></i>
            {t('blog.post.backToBlog')}
          </Link>

          <article>
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center text-gray-600 mb-8">
              <span>{formatDate(post.date)}</span>
              <span className="mx-2">•</span>
              <span>{post.category}</span>
            </div>
            
            {post.imageUrl && (
              <div className="mb-8">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}
            
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
            
            <div className="mt-12 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium mb-2">{t('blog.post.share')}</h3>
                  <div className="flex space-x-3">
                    <button onClick={shareToLinkedIn} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all">
                      <i className="fab fa-linkedin-in"></i>
                    </button>
                    <button onClick={shareToTwitter} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all">
                      <i className="fab fa-twitter"></i>
                    </button>
                  </div>
                </div>
                
                <Link href="/blog">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    {t('blog.post.moreArticles')}
                  </Button>
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
