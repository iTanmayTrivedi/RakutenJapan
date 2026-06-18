import { useState } from "react";
import { MOCK_REVIEWS, type MockReview } from "@/data/mockData";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";

export const ProductReviews = ({ productId }: { productId: string }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<MockReview[]>(() =>
    MOCK_REVIEWS.filter((r) => r.product_id === productId)
  );
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const hasReviewed = reviews.some((r) => r.user_id === user?.id);

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: t("reviews.login"), description: t("reviews.login.desc"), variant: "destructive" });
      return;
    }
    if (rating === 0) {
      toast({ title: t("reviews.select"), variant: "destructive" });
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));

    const newReview: MockReview = {
      id: `rev-${Date.now()}`,
      product_id: productId,
      user_id: user.id,
      rating,
      comment: comment.trim() || null,
      created_at: new Date().toISOString(),
      profile_name: user.display_name,
    };

    setReviews((prev) => [newReview, ...prev]);
    setRating(0);
    setComment("");
    setSubmitting(false);
    toast({ title: t("reviews.submitted") });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">{t("reviews.title")} ({reviews.length})</h2>

      {user && !hasReviewed && (
        <div className="bg-card rounded-lg p-5 shadow-card space-y-4 animate-fade-in">
          <h3 className="font-semibold text-sm">{t("reviews.write")}</h3>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} type="button" onMouseEnter={() => setHoverRating(i + 1)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(i + 1)}>
                <Star className={`h-6 w-6 cursor-pointer transition-colors ${i < (hoverRating || rating) ? "fill-points text-points" : "text-border"}`} />
              </button>
            ))}
            {rating > 0 && <span className="text-sm text-muted-foreground ml-2">{rating}/5</span>}
          </div>
          <Textarea placeholder={t("reviews.placeholder")} value={comment} onChange={(e) => setComment(e.target.value)} className="resize-none" rows={3} />
          <Button onClick={handleSubmit} disabled={submitting} className="font-bold gap-2">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("reviews.submit")}
          </Button>
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("reviews.none")}</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-card rounded-lg p-4 shadow-card animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-points text-points" : "text-border"}`} />)}</div>
                  <span className="text-sm font-medium">{review.profile_name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {review.created_at ? new Date(review.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                </span>
              </div>
              {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
