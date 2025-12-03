import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BlogCard({ title, author, category, slug, status }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold line-clamp-2">
          {title}
        </CardTitle>
        <div className="flex gap-2 items-center text-sm text-gray-500">
          <span>By {author?.name || author}</span> •
          <Badge variant="outline" className="rounded-full px-2 text-xs capitalize">
            {category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex justify-between items-center pt-3">
        <Link to={`/blog/${slug}`}>
          <Button variant="default" size="sm">
            Read
          </Button>
        </Link>

        <Badge
          className={`capitalize px-2 text-xs ${
            status === "published" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
          }`}
        >
          {status}
        </Badge>
      </CardContent>
    </Card>
  );
}
