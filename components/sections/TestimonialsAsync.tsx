import { getPublishedReviews } from "@/lib/db/queries/reviews";
import { Testimonials } from "@/components/sections/Testimonials";

export async function TestimonialsAsync() {
  const reviews = await getPublishedReviews();
  return <Testimonials reviews={reviews} />;
}
